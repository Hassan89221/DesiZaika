import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const cookieStore = cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll() {
                        // read-only in GET, no-op
                    },
                },
            }
        )

        // Try explicit sb-access-token cookie (set by our login route)
        const accessToken = cookieStore.get('sb-access-token')?.value
        const refreshToken = cookieStore.get('sb-refresh-token')?.value

        let userId: string | null = null
        let userEmail: string | null = null
        let userMeta: any = {}

        if (accessToken && refreshToken) {
            const { data: sessionData, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            })
            if (!error && sessionData?.user) {
                userId = sessionData.user.id
                userEmail = sessionData.user.email || null
                userMeta = sessionData.user.user_metadata || {}
            }
        }

        // Fallback: try native getUser
        if (!userId) {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
                userId = authUser.id
                userEmail = authUser.email || null
                userMeta = authUser.user_metadata || {}
            }
        }

        if (!userId) {
            return NextResponse.json({ user: null })
        }

        // Use admin client to bypass RLS when fetching the user's own profile
        // (safe here because we've already verified identity via session token above)
        const adminSupabase = createAdminClient()
        const { data: dbUser, error: dbError } = await adminSupabase
            .from('users')
            .select('id, name, email, phone, role')
            .eq('id', userId)
            .single()

        if (dbError || !dbUser) {
            console.error('/api/auth/me — users table query failed:', dbError?.message)
            return NextResponse.json({
                user: {
                    id: userId,
                    email: userEmail || '',
                    name: userMeta?.name || '',
                    phone: userMeta?.phone || '',
                    role: 'customer',
                }
            })
        }

        return NextResponse.json({
            user: {
                id: dbUser.id,
                email: dbUser.email || userEmail || '',
                name: dbUser.name || '',
                phone: dbUser.phone || '',
                role: dbUser.role,
            }
        })
    } catch (err: any) {
        console.error('/api/auth/me error:', err)
        return NextResponse.json({ user: null }, { status: 200 })
    }
}
