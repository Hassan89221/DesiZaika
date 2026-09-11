import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export type AdminAuthResult =
    | { error: null; user: any; dbUser: { id: string; role: 'owner' | 'manager' | 'customer'; email: string }; supabase: any }
    | { error: NextResponse; user: null; dbUser: null; supabase: null }

export async function verifyAdminRole(requiredRole?: 'owner'): Promise<AdminAuthResult> {
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
                    // no-op for role checks
                },
            },
        }
    )

    // Step 1: Verify session via auth token
    let userId: string | null = null

    // Try our explicit sb-access-token cookie first
    const accessToken = cookieStore.get('sb-access-token')?.value
    const refreshToken = cookieStore.get('sb-refresh-token')?.value

    if (accessToken && refreshToken) {
        const { data: sessionData } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        })
        if (sessionData?.user) {
            userId = sessionData.user.id
        }
    }

    // Fallback: native getUser
    if (!userId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return {
                error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
                user: null,
                dbUser: null,
                supabase: null,
            }
        }
        userId = user.id
    }

    if (!userId) {
        return {
            error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
            user: null,
            dbUser: null,
            supabase: null,
        }
    }

    // Step 2: Use admin client to bypass RLS when reading user's role
    const adminSupabase = createAdminClient()
    const { data: dbUser, error: dbError } = await adminSupabase
        .from('users')
        .select('id, email, role')
        .eq('id', userId)
        .single()

    if (dbError || !dbUser) {
        return {
            error: NextResponse.json({ error: 'User record not found' }, { status: 403 }),
            user: null,
            dbUser: null,
            supabase: null,
        }
    }

    // Step 3: Check role
    const isAllowed = dbUser.role === 'owner' || (dbUser.role === 'manager' && requiredRole !== 'owner')

    if (!isAllowed) {
        return {
            error: NextResponse.json({
                error: requiredRole === 'owner'
                    ? 'Forbidden: Owner access required'
                    : 'Forbidden: Admin access required'
            }, { status: 403 }),
            user: null,
            dbUser: null,
            supabase: null,
        }
    }

    return { error: null, user: { id: userId }, dbUser: dbUser as any, supabase }
}
