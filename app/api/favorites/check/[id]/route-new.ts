import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Get auth header
        const authHeader = request.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ is_favorited: false })
        }

        const token = authHeader.split(' ')[1]
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError || !user?.email) {
            return NextResponse.json({ is_favorited: false })
        }

        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ is_favorited: false })
        }

        // Get user from database
        const { data: dbUser, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single()

        if (userError || !dbUser) {
            return NextResponse.json({ is_favorited: false })
        }

        // Check if favorite exists
        const { data: favorite, error: favoriteError } = await supabaseAdmin
            .from('favorites')
            .select('id')
            .eq('user_id', dbUser.id)
            .eq('profile_id', id)
            .single()

        if (favoriteError && favoriteError.code !== 'PGRST116') {
            console.error('Error checking favorite status:', favoriteError)
            return NextResponse.json({ is_favorited: false })
        }

        return NextResponse.json({
            is_favorited: !!favorite,
            favorite_id: favorite?.id || null
        })

    } catch (error) {
        console.error('Error checking favorite status:', error)
        return NextResponse.json({ is_favorited: false })
    }
}
