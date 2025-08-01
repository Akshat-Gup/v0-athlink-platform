import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/auth'
import { createServerComponentClient } from '@/lib/supabase-client'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = await createServerComponentClient()

    // Get user with related data from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        base_location:locations(*),
        talent_profiles(*),
        team_profiles(*),
        event_profiles(*)
      `)
      .eq('email', session.user.email)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user as any

    return NextResponse.json({
      user: userWithoutPassword,
      profile: {
        category: user.category || user.user_role,
        isAthlete: !!user.talent_profiles?.length,
        isTeam: !!user.team_profiles?.length,
        isEvent: !!user.event_profiles?.length,
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
