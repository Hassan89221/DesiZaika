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
        const itemId = params.id
        if (!itemId) {
            return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
        }

        const body = await request.json()
        const updates: Record<string, any> = {}

        const allowedFields = [
            'category_id',
            'name',
            'description',
            'price',
            'image_url',
            'is_veg',
            'spice_level',
            'is_available',
            'allergens',
            'allergen_notes',
            'allergen_high_risk',
        ]

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field]
            }
        }

        if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price < 0)) {
            return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
        }

        const adminSupabase = createAdminClient()
        const { data: item, error } = await adminSupabase
            .from('menu_items')
            .update(updates)
            .eq('id', itemId)
            .select('*')
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ item, message: 'Menu item updated successfully' })
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
        const itemId = params.id
        if (!itemId) {
            return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
        }

        const adminSupabase = createAdminClient()
        const { error } = await adminSupabase
            .from('menu_items')
            .delete()
            .eq('id', itemId)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Menu item deleted successfully' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
