import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/sponsorships - List sponsorship requests with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role') // 'sponsor' or 'athlete'
    const campaignId = searchParams.get('campaign_id')

    let where: any = {}

    // Filter by role
    if (role === 'sponsor') {
      where.sponsor_id = user.id
    } else if (role === 'athlete') {
      where.athlete_id = user.id
    } else {
      // Return both - requests I made and requests I received
      where.OR = [
        { sponsor_id: user.id },
        { athlete_id: user.id }
      ]
    }

    // Apply additional filters
    if (status) where.status = status
    if (campaignId) where.campaign_id = parseInt(campaignId)

    const requests = await prisma.sponsorshipRequest.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            funding_goal: true,
            status: true
          }
        },
        sponsor: {
          select: {
            id: true,
            name: true,
            profile_image: true,
            primary_sport: true
          }
        },
        athlete: {
          select: {
            id: true,
            name: true,
            profile_image: true,
            primary_sport: true
          }
        },
        perk_tier: {
          select: {
            id: true,
            tier_name: true,
            amount: true,
            description: true,
            deliverables: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    // Add role information for each request
    const requestsWithRole = requests.map((request: any) => ({
      ...request,
      user_role: request.sponsor_id === user.id ? 'sponsor' : 'athlete',
      is_custom_offer: request.is_custom
    }))

    return NextResponse.json({ requests: requestsWithRole })

  } catch (error) {
    console.error('Error fetching sponsorship requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsorship requests' },
      { status: 500 }
    )
  }
}

// POST /api/sponsorships - Create new sponsorship request
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      campaign_id,
      perk_tier_id,
      amount,
      custom_perks,
      message,
      is_custom = false
    } = body

    // Validate required fields
    if (!campaign_id || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Campaign ID and valid amount are required' },
        { status: 400 }
      )
    }

    // Fetch campaign to get athlete_id and validate
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaign_id },
      include: {
        perk_tiers: true,
        athlete: { select: { id: true, name: true } }
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (campaign.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Campaign is not accepting sponsorships' },
        { status: 400 }
      )
    }

    // Prevent self-sponsorship
    if (campaign.athlete_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot sponsor your own campaign' },
        { status: 400 }
      )
    }

    // Validate perk tier for non-custom offers
    if (!is_custom && perk_tier_id) {
      const perkTier = campaign.perk_tiers.find((tier: any) => tier.id === perk_tier_id)
      if (!perkTier || !perkTier.is_active) {
        return NextResponse.json(
          { error: 'Invalid or inactive perk tier' },
          { status: 400 }
        )
      }

      // Check if perk tier has reached max sponsors
      if (perkTier.max_sponsors) {
        const currentSponsors = await prisma.sponsorshipRequest.count({
          where: {
            perk_tier_id: perk_tier_id,
            status: 'ACCEPTED'
          }
        })

        if (currentSponsors >= perkTier.max_sponsors) {
          return NextResponse.json(
            { error: 'This perk tier is fully subscribed' },
            { status: 400 }
          )
        }
      }
    }

    // Create sponsorship request
    const sponsorshipRequest = await prisma.sponsorshipRequest.create({
      data: {
        campaign_id,
        sponsor_id: user.id,
        athlete_id: campaign.athlete_id,
        perk_tier_id: is_custom ? null : perk_tier_id,
        amount: parseFloat(amount),
        custom_perks: is_custom ? JSON.stringify(custom_perks) : null,
        message,
        is_custom,
        status: is_custom ? 'PENDING' : 'ACCEPTED', // Auto-accept default perks
        escrow_status: 'HELD'
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            athlete: {
              select: { name: true }
            }
          }
        },
        perk_tier: true,
        sponsor: {
          select: {
            id: true,
            name: true,
            profile_image: true
          }
        }
      }
    })

    // If it's an auto-accepted request, update campaign funding and perk tier
    if (!is_custom) {
      await prisma.$transaction(async (tx) => {
        // Update campaign current funding
        await tx.campaign.update({
          where: { id: campaign_id },
          data: {
            current_funding: {
              increment: parseFloat(amount)
            }
          }
        })

        // Update perk tier current sponsors count
        if (perk_tier_id) {
          await tx.perkTier.update({
            where: { id: perk_tier_id },
            data: {
              current_sponsors: {
                increment: 1
              }
            }
          })
        }
      })
    }

    return NextResponse.json({
      success: true,
      request: sponsorshipRequest,
      auto_accepted: !is_custom
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating sponsorship request:', error)
    return NextResponse.json(
      { error: 'Failed to create sponsorship request' },
      { status: 500 }
    )
  }
}
