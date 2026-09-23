import { verifyAdminRole } from '@/lib/auth/admin'
import { NextResponse } from 'next/server'

// Default fallback restaurant configuration
let restaurantInfoStore = {
    name: 'CurryMama',
    address: '30 Crumlin Rd, Crumlin, Dublin, D12 HXW0',
    phone: '(01) 538 1281',
    email: process.env.RESTAURANT_ALERT_EMAIL || 'Unxox11@gmail.com',
    whatsapp_number: process.env.RESTAURANT_WHATSAPP_NUMBER || '+35315381281',
    opening_hours: {
        monday: '12:00 PM - 10:00 PM',
        tuesday: '12:00 PM - 10:00 PM',
        wednesday: '12:00 PM - 10:00 PM',
        thursday: '12:00 PM - 10:00 PM',
        friday: '12:00 PM - 11:00 PM',
        saturday: '12:00 PM - 11:00 PM',
        sunday: '1:00 PM - 10:00 PM',
    },
    hero_tagline: 'Authentic Pakistani & Indian Flavors in Dublin, Ireland',
    about_text: 'Experience rich traditional desi cuisine cooked with fresh local Irish ingredients and authentic spices.',
}

export async function GET() {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    return NextResponse.json({ restaurant_info: restaurantInfoStore })
}

export async function PATCH(request: Request) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const body = await request.json()

        restaurantInfoStore = {
            ...restaurantInfoStore,
            ...body,
            opening_hours: body.opening_hours
                ? { ...restaurantInfoStore.opening_hours, ...body.opening_hours }
                : restaurantInfoStore.opening_hours,
        }

        return NextResponse.json({
            restaurant_info: restaurantInfoStore,
            message: 'Restaurant information updated successfully',
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
