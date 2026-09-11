import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const orderId = params.id
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

        // Fetch order with items
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (*)
            `)
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Check ownership or admin status
        if (order.user_id !== user.id) {
            // Check if user is manager or owner
            const { data: dbUser } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single()

            const isAdmin = dbUser && ['manager', 'owner'].includes(dbUser.role)
            if (!isAdmin) {
                return NextResponse.json({ error: 'Forbidden: Access denied to this order' }, { status: 403 })
            }
        }

        return NextResponse.json({ order })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
