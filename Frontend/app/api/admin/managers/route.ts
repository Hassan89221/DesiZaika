import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    // Owner role required exclusively
    const authResult = await verifyAdminRole('owner')
    if (authResult.error) return authResult.error

    try {
        const body = await request.json()
        const { name, email, phone, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        const adminSupabase = createAdminClient()

        // 1. Create auth user with service role admin API
        const { data: authUser, error: createAuthError } = await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, phone: phone || '' },
        })

        if (createAuthError || !authUser.user) {
            return NextResponse.json(
                { error: createAuthError?.message || 'Failed to create manager user' },
                { status: 400 }
            )
        }

        // 2. Insert manager row into public.users with role = 'manager'
        const { data: dbUser, error: dbError } = await adminSupabase
            .from('users')
            .upsert({
                id: authUser.user.id,
                name,
                email,
                phone: phone || '',
                role: 'manager',
            })
            .select('*')
            .single()

        if (dbError) {
            return NextResponse.json(
                { error: `Manager created in auth but DB insertion failed: ${dbError.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { manager: dbUser, message: 'Manager account created successfully' },
            { status: 201 }
        )
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
