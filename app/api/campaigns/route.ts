import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const athleteId = searchParams.get('athlete_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const ownOnly = searchParams.get('own_only') === 'true'

    const session = await auth()
    let where: any = {}

    // If requesting own campaigns only, require authentication
    if (ownOnly) {
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      where.athlete_id = user.id
    } else {
      // Public campaigns - apply filters
      if (status) where.status = status
      if (athleteId) where.athlete_id = parseInt(athleteId)
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            primary_sport: true,
            profile_image: true,
            country_flag: true,
          }
        },
        perk_tiers: {
          where: { is_active: true },
          orderBy: { amount: 'asc' }
        },
        sponsorship_requests: {
          where: { status: 'ACCEPTED' },
          select: {
            amount: true,
            sponsor: {
              select: { name: true, profile_image: true }
            }
          }
        },
        _count: {
          select: {
            sponsorship_requests: {
              where: { status: 'PENDING' }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    })

    // Calculate remaining goal and additional metrics for each campaign
    const campaignsWithMetrics = campaigns.map((campaign: any) => {
      const acceptedAmount = campaign.sponsorship_requests.reduce(
        (sum: number, req: any) => sum + req.amount, 0
      )
      const remaining_goal = Math.max(0, campaign.funding_goal - acceptedAmount)
      const progress_percentage = (acceptedAmount / campaign.funding_goal) * 100

      return {
        ...campaign,
        current_funding: acceptedAmount,
        remaining_goal,
        progress_percentage: Math.round(progress_percentage * 100) / 100,
        accepted_sponsorships: campaign.sponsorship_requests,
        pending_requests_count: campaign._count.sponsorship_requests,
        is_fully_funded: remaining_goal <= 0,
        sponsors_count: campaign.sponsorship_requests.length
      }
    })

    return NextResponse.json({
      campaigns: campaignsWithMetrics,
      total: campaigns.length
    })

  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, funding_goal, deadline, perk_tiers } = body

    if (!title || !funding_goal || funding_goal <= 0) {
      return NextResponse.json({ error: 'Title and valid funding goal are required' }, { status: 400 })
    }

    if (!perk_tiers || !Array.isArray(perk_tiers) || perk_tiers.length === 0) {
      return NextResponse.json({ error: 'At least one perk tier is required' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create campaign with perk tiers
    const campaign = await prisma.campaign.create({
      data: {
        athlete_id: user.id,
        title,
        description,
        funding_goal: parseFloat(funding_goal),
        deadline: deadline ? new Date(deadline) : null,
        perk_tiers: {
          create: perk_tiers.map((tier: any) => ({
            tier_name: tier.tier_name,
            amount: parseFloat(tier.amount),
            description: tier.description,
            deliverables: JSON.stringify(tier.deliverables || {}),
            max_sponsors: tier.max_sponsors || null
          }))
        }
      },
      include: {
        perk_tiers: {
          orderBy: { amount: 'asc' }
        },
        athlete: {
          select: {
            id: true,
            name: true,
            primary_sport: true,
            profile_image: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      campaign 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
