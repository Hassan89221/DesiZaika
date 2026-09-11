import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const VALID_STATUSES = ['received', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const orderId = params.id
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

        const body = await request.json()
        const { status } = body

        if (!status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
                { status: 400 }
            )
        }

        const adminSupabase = createAdminClient()
        const { data: order, error } = await adminSupabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select('*')
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ order, message: `Order status updated to '${status}'` })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
