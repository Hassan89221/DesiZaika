import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const adminSupabase = createAdminClient()
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const todayIso = todayStart.toISOString()

        // Fetch today's orders
        const { data: todayOrders, error: todayError } = await adminSupabase
            .from('orders')
            .select('id, total_price, status')
            .gte('created_at', todayIso)

        if (todayError) {
            return NextResponse.json({ error: todayError.message }, { status: 500 })
        }

        // Fetch pending orders
        const { data: pendingOrders, error: pendingError } = await adminSupabase
            .from('orders')
            .select('id')
            .in('status', ['received', 'confirmed', 'preparing'])

        if (pendingError) {
            return NextResponse.json({ error: pendingError.message }, { status: 500 })
        }

        const todayOrderCount = todayOrders.length
        const todayRevenue = todayOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + Number(o.total_price || 0), 0)
        const pendingOrderCount = pendingOrders.length

        return NextResponse.json({
            todayOrderCount,
            todayRevenue: Math.round(todayRevenue * 100) / 100,
            pendingOrderCount,
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
