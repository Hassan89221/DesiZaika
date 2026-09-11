import { verifyAdminRole } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const authResult = await verifyAdminRole()
    if (authResult.error) return authResult.error

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const bucket = (formData.get('bucket') as string) || 'menu-images'

        if (!file) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
        }

        if (!['menu-images', 'gallery-images'].includes(bucket)) {
            return NextResponse.json({ error: "Invalid bucket. Must be 'menu-images' or 'gallery-images'." }, { status: 400 })
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const adminSupabase = createAdminClient()
        const { data, error } = await adminSupabase.storage
            .from(bucket)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            })

        if (error) {
            return NextResponse.json({ error: `Storage upload failed: ${error.message}` }, { status: 500 })
        }

        const { data: publicUrlData } = adminSupabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

        return NextResponse.json({
            url: publicUrlData.publicUrl,
            message: 'Image uploaded successfully',
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
