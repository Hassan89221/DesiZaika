import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const adminSupabase = createAdminClient()
        const { data: categories, error } = await adminSupabase
            .from('menu_categories')
            .select('*')
            .order('sort_order', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ categories })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const body = await request.json()
        const { name, sort_order } = body

        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
        }

        const adminSupabase = createAdminClient()
        const { data: category, error } = await adminSupabase
            .from('menu_categories')
            .insert({
                name,
                sort_order: typeof sort_order === 'number' ? sort_order : 0,
            })
            .select('*')
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ category, message: 'Category created successfully' }, { status: 201 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
