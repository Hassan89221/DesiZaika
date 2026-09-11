import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // 1. Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone: phone || '' },
            },
        })

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: authError?.message || 'Failed to sign up user' },
                { status: 400 }
            )
        }

        // 2. Insert user into public.users table using service role client (bypasses RLS before session is established)
        const adminSupabase = createAdminClient()
        const { error: dbError } = await adminSupabase.from('users').upsert({
            id: authData.user.id,
            name,
            email,
            phone: phone || '',
            role: 'customer',
        })

        if (dbError) {
            return NextResponse.json(
                { error: `User registered in Auth but profile creation failed: ${dbError.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    name,
                    phone,
                    role: 'customer',
                },
                message: 'Signup successful',
            },
            { status: 201 }
        )
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
