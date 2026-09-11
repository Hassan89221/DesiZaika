import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Owner role required exclusively
    const authResult = await verifyAdminRole('owner')
    if (authResult.error) return authResult.error

    try {
        const managerId = params.id
        if (!managerId) {
            return NextResponse.json({ error: 'Manager user ID is required' }, { status: 400 })
        }

        const adminSupabase = createAdminClient()

        // 1. Verify target user is a manager (cannot delete owner)
        const { data: targetUser, error: fetchError } = await adminSupabase
            .from('users')
            .select('role')
            .eq('id', managerId)
            .single()

        if (fetchError || !targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (targetUser.role !== 'manager') {
            return NextResponse.json(
                { error: 'Only manager accounts can be deleted via this endpoint.' },
                { status: 400 }
            )
        }

        // 2. Delete user from auth (cascades or delete explicitly from public.users)
        const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(managerId)
        if (authDeleteError) {
            return NextResponse.json({ error: authDeleteError.message }, { status: 500 })
        }

        // Clean up from public.users table if cascade is not active
        await adminSupabase.from('users').delete().eq('id', managerId)

        return NextResponse.json({ message: 'Manager account deleted successfully' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
