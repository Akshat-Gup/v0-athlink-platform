import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerComponentClient()

    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.email) {
      return NextResponse.json({ is_favorited: false })
    }

    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ is_favorited: false })
    }

    // Check if favorite exists
    const { data: favorite, error: favoriteError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('favorited_profile_id', params.id)
      .single()

    return NextResponse.json({
      is_favorited: !!favorite && !favoriteError
    })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json({ is_favorited: false })
  }
}
