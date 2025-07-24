import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { prisma } from '../../../lib/prisma'

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

    // Fetch campaigns for this user (athlete's own campaigns)
    const campaigns = await prisma.campaign.findMany({
      where: {
        athlete_id: user.id
      },
      include: {
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
        funding_goal,
        deadline: deadline ? new Date(deadline) : null,
        perk_tiers: {
          create: perk_tiers.map((tier: any) => ({
            tier_name: tier.tier_name,
            amount: tier.amount,
            description: tier.description,
            deliverables: tier.deliverables,
            max_sponsors: tier.max_sponsors
          }))
        }
      },
      include: {
        perk_tiers: true
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
