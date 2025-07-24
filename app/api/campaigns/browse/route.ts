import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    // Fetch active campaigns from all athletes (for sponsor browsing)
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'OPEN'
      },
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            email: true,
            primary_sport: true
          }
        },
        perk_tiers: {
          orderBy: {
            amount: 'asc'
          }
        },
        _count: {
          select: {
            sponsorship_requests: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({ campaigns })

  } catch (error) {
    console.error('Error fetching campaigns for browsing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
