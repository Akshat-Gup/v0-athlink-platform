import { NextRequest, NextResponse } from 'next/server'
import { getTalentProfile, getTeamProfile, getEventProfile } from '@/lib/services/profile-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { category, id } = params

    let profile = null

    switch (category) {
      case 'talents':
        profile = await getTalentProfile(id)
        break
      case 'teams':
        profile = await getTeamProfile(id)
        break
      case 'events':
        profile = await getEventProfile(id)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid category. Must be talents, teams, or events.' },
          { status: 400 }
        )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
