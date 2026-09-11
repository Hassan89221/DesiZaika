import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const adminSupabase = createAdminClient()
        const { data: items, error } = await adminSupabase
            .from('menu_items')
            .select(`
                *,
                category:menu_categories (id, name)
            `)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ items })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const body = await request.json()
        const {
            category_id,
            name,
            description,
            price,
            image_url,
            is_veg,
            spice_level,
            is_available,
            allergens,
            allergen_notes,
            allergen_high_risk,
        } = body

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
        }

        if (typeof price !== 'number' || price < 0) {
            return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
        }

        const adminSupabase = createAdminClient()
        const { data: item, error } = await adminSupabase
            .from('menu_items')
            .insert({
                category_id: category_id || null,
                name,
                description: description || '',
                price,
                image_url: image_url || null,
                is_veg: typeof is_veg === 'boolean' ? is_veg : false,
                spice_level: typeof spice_level === 'number' ? spice_level : 0,
                is_available: typeof is_available === 'boolean' ? is_available : true,
                allergens: Array.isArray(allergens) ? allergens : [],
                allergen_notes: allergen_notes || null,
                allergen_high_risk: typeof allergen_high_risk === 'boolean' ? allergen_high_risk : false,
            })
            .select('*')
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ item, message: 'Menu item created successfully' }, { status: 201 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
