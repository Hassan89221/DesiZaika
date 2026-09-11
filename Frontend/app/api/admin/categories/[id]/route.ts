import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const categoryId = params.id
        if (!categoryId) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
        }

        const body = await request.json()
        const updates: { name?: string; sort_order?: number } = {}

        if (body.name !== undefined) updates.name = body.name
        if (body.sort_order !== undefined) updates.sort_order = body.sort_order

        const adminSupabase = createAdminClient()
        const { data: category, error } = await adminSupabase
            .from('menu_categories')
            .update(updates)
            .eq('id', categoryId)
            .select('*')
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ category, message: 'Category updated successfully' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const categoryId = params.id
        if (!categoryId) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
        }

        const adminSupabase = createAdminClient()
        const { error } = await adminSupabase
            .from('menu_categories')
            .delete()
            .eq('id', categoryId)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Category deleted successfully' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
