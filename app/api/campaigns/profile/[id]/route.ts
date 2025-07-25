import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const profileId = parseInt(id)
    
    if (isNaN(profileId)) {
      return NextResponse.json(
        { error: 'Invalid profile ID' },
        { status: 400 }
      )
    }

    // Find the user's active campaign
    const campaign = await prisma.campaign.findFirst({
      where: {
        athlete_id: profileId,
        status: 'ACTIVE'
      },
      include: {
        perk_tiers: {
          orderBy: {
            amount: 'asc'
          }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'No active campaign found for this profile' },
        { status: 404 }
      )
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error fetching campaign data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign data' },
      { status: 500 }
    )
  }
}
