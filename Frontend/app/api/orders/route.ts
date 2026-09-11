import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendOrderAlertEmail } from '@/lib/email/send-order-email'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const cookieStore = cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll() {
                        // no-op
                    },
                },
            }
        )

        // 1. Verify User Authentication
        let user: any = null

        const accessToken = cookieStore.get('sb-access-token')?.value
        const refreshToken = cookieStore.get('sb-refresh-token')?.value

        if (accessToken && refreshToken) {
            const { data: sessionData } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            })
            if (sessionData?.user) {
                user = sessionData.user
            }
        }

        if (!user) {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
            if (!authError && authUser) {
                user = authUser
            }
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in to place an order.' }, { status: 401 })
        }

        // 2. Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || user.id
        const limitCheck = checkRateLimit(`order_${ip}`, 5, 60000)
        if (!limitCheck.success) {
            return NextResponse.json(
                { error: 'Too many order requests. Please wait a minute before trying again.' },
                { status: 429 }
            )
        }

        // 3. Parse and Validate Payload
        const body = await request.json()
        const {
            order_type,
            customer_name,
            customer_address,
            customer_email,
            customer_phone,
            notes,
            payment_method = 'cod',
            items,
        } = body

        if (!order_type || !['pickup', 'delivery'].includes(order_type)) {
            return NextResponse.json({ error: "Invalid order_type. Must be 'pickup' or 'delivery'." }, { status: 400 })
        }

        if (!customer_name || !customer_email || !customer_phone) {
            return NextResponse.json({ error: 'Customer name, email, and phone are required.' }, { status: 400 })
        }

        if (order_type === 'delivery' && !customer_address) {
            return NextResponse.json({ error: 'Customer address is required for delivery orders.' }, { status: 400 })
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Order must contain at least one item.' }, { status: 400 })
        }

        for (const item of items) {
            if (!item.menu_item_id || !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                return NextResponse.json({ error: 'Each order item must have a valid menu_item_id and positive quantity.' }, { status: 400 })
            }
        }

        // 4. Server-side Price Calculation from DB (Never trust client prices)
        const adminSupabase = createAdminClient()
        const menuItemIds = items.map((i: any) => i.menu_item_id)
        const { data: dbMenuItems, error: menuFetchError } = await adminSupabase
            .from('menu_items')
            .select('id, name, price, is_available')
            .in('id', menuItemIds)

        if (menuFetchError || !dbMenuItems) {
            return NextResponse.json({ error: 'Failed to verify menu items.' }, { status: 500 })
        }

        const menuItemMap = new Map(dbMenuItems.map(item => [item.id, item]))

        let totalPrice = 0
        const orderItemsToInsert: Array<{
            menu_item_id: string
            item_name: string
            quantity: number
            unit_price: number
            line_total: number
        }> = []

        for (const item of items) {
            const dbItem = menuItemMap.get(item.menu_item_id)
            if (!dbItem) {
                return NextResponse.json({ error: `Menu item not found: ${item.menu_item_id}` }, { status: 400 })
            }
            if (dbItem.is_available === false) {
                return NextResponse.json({ error: `Item "${dbItem.name}" is currently unavailable.` }, { status: 400 })
            }

            const unitPrice = Number(dbItem.price)
            const lineTotal = unitPrice * item.quantity
            totalPrice += lineTotal

            orderItemsToInsert.push({
                menu_item_id: dbItem.id,
                item_name: dbItem.name,
                quantity: item.quantity,
                unit_price: unitPrice,
                line_total: lineTotal,
            })
        }

        // Round total price to 2 decimal places
        totalPrice = Math.round(totalPrice * 100) / 100

        // Add delivery fee if delivery order
        if (order_type === 'delivery') {
            totalPrice = Math.round((totalPrice + 3.50) * 100) / 100
        }

        // 5. Insert Order using Admin Supabase Client (bypasses RLS recursion)
        const { data: createdOrder, error: orderInsertError } = await adminSupabase
            .from('orders')
            .insert({
                user_id: user.id,
                order_type,
                customer_name,
                customer_address: order_type === 'delivery' ? customer_address : null,
                customer_email,
                customer_phone,
                notes: notes ? `[Payment: ${payment_method === 'cod' ? 'Cash on Delivery' : payment_method}] ${notes}` : `[Payment: ${payment_method === 'cod' ? 'Cash on Delivery' : payment_method}]`,
                total_price: totalPrice,
                status: 'received',
            })
            .select('*')
            .single()

        if (orderInsertError || !createdOrder) {
            console.error('Order creation failed:', orderInsertError)
            return NextResponse.json({ error: `Failed to create order: ${orderInsertError?.message}` }, { status: 500 })
        }

        // 6. Insert Order Items
        const preparedOrderItems = orderItemsToInsert.map(item => ({
            order_id: createdOrder.id,
            ...item,
        }))

        const { error: itemsInsertError } = await adminSupabase
            .from('order_items')
            .insert(preparedOrderItems)

        if (itemsInsertError) {
            console.error('Order items insertion failed:', itemsInsertError)
            return NextResponse.json({ error: `Order created but failed to save order items: ${itemsInsertError.message}` }, { status: 500 })
        }

        // 7. Send automated Resend Email notification to admin (Unxox11@gmail.com)
        sendOrderAlertEmail({
            order: createdOrder,
            items: preparedOrderItems,
        }).catch((err) => console.error('Background order email failed:', err))

        return NextResponse.json(
            {
                order: createdOrder,
                items: preparedOrderItems,
                message: 'Order placed successfully',
            },
            { status: 201 }
        )
    } catch (err: any) {
        console.error('POST /api/orders error:', err)
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
