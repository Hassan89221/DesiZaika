import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Menu data is publicly readable (RLS: using (true))
        // Use a plain anon client — no cookie handling needed for public endpoints
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const [categoriesRes, itemsRes] = await Promise.all([
            supabase
                .from('menu_categories')
                .select('*')
                .order('sort_order', { ascending: true }),
            supabase
                .from('menu_items')
                .select('*')
                .eq('is_available', true)
                .order('name', { ascending: true }),
        ])

        if (categoriesRes.error) {
            console.error('menu categories error:', categoriesRes.error)
            return NextResponse.json({ error: categoriesRes.error.message }, { status: 500 })
        }

        if (itemsRes.error) {
            console.error('menu items error:', itemsRes.error)
            return NextResponse.json({ error: itemsRes.error.message }, { status: 500 })
        }

        return NextResponse.json({
            categories: categoriesRes.data,
            items: itemsRes.data,
        })
    } catch (err: any) {
        console.error('GET /api/menu error:', err)
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
