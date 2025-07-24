import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        base_location: true,
        talent_profile: true,
        team_profile: true,
        event_profile: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user as any
    
    return NextResponse.json({
      user: userWithoutPassword,
      profile: {
        category: user.category,
        isAthlete: !!user.talent_profile,
        isTeam: !!user.team_profile,
        isEvent: !!user.event_profile,
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
