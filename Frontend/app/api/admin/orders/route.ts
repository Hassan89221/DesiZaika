import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const { searchParams } = new URL(request.url)
        const statusFilter = searchParams.get('status')

        const adminSupabase = createAdminClient()
        let query = adminSupabase
            .from('orders')
            .select(`
                *,
                order_items (*)
            `)
            .order('created_at', { ascending: false })

        if (statusFilter) {
            query = query.eq('status', statusFilter)
        }

        const { data: orders, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ orders })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
