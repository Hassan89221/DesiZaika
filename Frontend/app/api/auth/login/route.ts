import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const cookieStore = cookies()

        // Build the response first, then attach cookies to it
        let supabaseResponse = NextResponse.json({ message: 'placeholder' })

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        // Write cookies onto the actual response object
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: authError?.message || 'Invalid login credentials' },
                { status: 401 }
            )
        }

        // Fetch user record from public.users using admin client to bypass RLS
        // (identity is verified above via signInWithPassword)
        const adminSupabase = createAdminClient()
        const { data: dbUser } = await adminSupabase
            .from('users')
            .select('id, name, email, phone, role')
            .eq('id', authData.user.id)
            .single()

        const userPayload = {
            id: authData.user.id,
            email: authData.user.email,
            name: dbUser?.name || authData.user.user_metadata?.name || '',
            phone: dbUser?.phone || authData.user.user_metadata?.phone || '',
            role: dbUser?.role || 'customer',
        }

        // Build the final response (cookies already attached by setAll above)
        supabaseResponse = NextResponse.json({
            user: userPayload,
            message: 'Login successful',
        })

        // Re-apply cookies to this new response object
        const tempCookies = cookieStore.getAll()
        // Also write session tokens explicitly
        if (authData.session) {
            supabaseResponse.cookies.set('sb-access-token', authData.session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: authData.session.expires_in,
                path: '/',
            })
            supabaseResponse.cookies.set('sb-refresh-token', authData.session.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
            })
        }

        return supabaseResponse
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
