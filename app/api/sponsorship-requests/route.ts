import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { prisma } from '../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      campaign_id, 
      athlete_id, 
      perk_tier_id, 
      amount, 
      custom_perks, 
      message, 
      is_custom 
    } = body

    if (!campaign_id || !athlete_id || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Campaign ID, athlete ID, and valid amount are required' }, { status: 400 })
    }

    if (is_custom && !custom_perks) {
      return NextResponse.json({ error: 'Custom perks are required for custom offers' }, { status: 400 })
    }

    // Get user from database (sponsor)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify campaign exists and is open
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaign_id,
        status: { in: ['OPEN', 'ACTIVE'] }
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found or not open for sponsorship' }, { status: 404 })
    }

    // If not custom, verify perk tier exists and has availability
    if (!is_custom && perk_tier_id) {
      const perkTier = await prisma.perkTier.findFirst({
        where: {
          id: perk_tier_id,
          campaign_id: campaign_id,
          is_active: true
        }
      })

      if (!perkTier) {
        return NextResponse.json({ error: 'Perk tier not found' }, { status: 404 })
      }

      if (perkTier.max_sponsors && perkTier.current_sponsors >= perkTier.max_sponsors) {
        return NextResponse.json({ error: 'This sponsorship tier is full' }, { status: 400 })
      }
    }

    // Create sponsorship request
    const sponsorshipRequest = await prisma.sponsorshipRequest.create({
      data: {
        campaign_id,
        sponsor_id: user.id,
        athlete_id,
        perk_tier_id: is_custom ? null : perk_tier_id,
        amount,
        custom_perks: is_custom ? custom_perks : null,
        message,
        is_custom,
        status: is_custom ? 'PENDING' : 'PENDING', // Custom offers need athlete approval, regular tiers can be auto-accepted
        escrow_status: 'HELD'
      },
      include: {
        campaign: {
          select: {
            title: true
          }
        },
        athlete: {
          select: {
            name: true,
            email: true
          }
        },
        perk_tier: {
          select: {
            tier_name: true,
            description: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      sponsorship_request: sponsorshipRequest 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating sponsorship request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get sponsorship requests for this user (both sent and received)
    const sentRequests = await prisma.sponsorshipRequest.findMany({
      where: {
        sponsor_id: user.id
      },
      include: {
        campaign: {
          select: {
            title: true
          }
        },
        athlete: {
          select: {
            name: true,
            email: true
          }
        },
        perk_tier: {
          select: {
            tier_name: true,
            description: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    const receivedRequests = await prisma.sponsorshipRequest.findMany({
      where: {
        athlete_id: user.id
      },
      include: {
        campaign: {
          select: {
            title: true
          }
        },
        sponsor: {
          select: {
            name: true,
            email: true
          }
        },
        perk_tier: {
          select: {
            tier_name: true,
            description: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({ 
      sent_requests: sentRequests,
      received_requests: receivedRequests 
    })

  } catch (error) {
    console.error('Error fetching sponsorship requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
