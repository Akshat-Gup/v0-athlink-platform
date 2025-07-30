import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

// GET single campaign by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
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
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Calculate metrics
    const acceptedAmount = campaign.sponsorship_requests.reduce(
      (sum: number, req: any) => sum + req.amount, 0
    )
    const remaining_goal = Math.max(0, campaign.funding_goal - acceptedAmount)
    const progress_percentage = (acceptedAmount / campaign.funding_goal) * 100

    const campaignWithMetrics = {
      ...campaign,
      current_funding: acceptedAmount,
      remaining_goal,
      progress_percentage: Math.round(progress_percentage * 100) / 100,
      accepted_sponsorships: campaign.sponsorship_requests,
      pending_requests_count: campaign._count.sponsorship_requests,
      is_fully_funded: remaining_goal <= 0,
      sponsors_count: campaign.sponsorship_requests.length
    }

    return NextResponse.json({ campaign: campaignWithMetrics })

  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Full campaign update
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const campaignId = parseInt(resolvedParams.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
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

    // Check if user owns the campaign
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        athlete_id: user.id
      },
      include: {
        perk_tiers: true
      }
    })

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found or unauthorized' }, { status: 404 })
    }

    // Update campaign using transaction to ensure data consistency
    const updatedCampaign = await prisma.$transaction(async (tx) => {
      // Update campaign basic info
      const campaign = await tx.campaign.update({
        where: { id: campaignId },
        data: {
          title,
          description,
          funding_goal: parseFloat(funding_goal),
          deadline: deadline ? new Date(deadline) : null,
          updated_at: new Date()
        }
      })

      // Get existing perk tiers
      const existingTiers = existingCampaign.perk_tiers

      // Delete all existing perk tiers to avoid conflicts
      await tx.perkTier.deleteMany({
        where: { campaign_id: campaignId }
      })

      // Create all perk tiers fresh (this ensures clean state)
      const newPerkTiers = await Promise.all(
        perk_tiers.map(async (tier: any) => {
          return await tx.perkTier.create({
            data: {
              campaign_id: campaignId,
              tier_name: tier.tier_name,
              amount: parseFloat(tier.amount),
              description: tier.description,
              deliverables: JSON.stringify(tier.deliverables || {}),
              max_sponsors: tier.max_sponsors || null,
              current_sponsors: 0,
              is_active: true
            }
          })
        })
      )

      // Return updated campaign with new perk tiers
      return await tx.campaign.findUnique({
        where: { id: campaignId },
        include: {
          perk_tiers: {
            where: { is_active: true },
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
    })

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign
    })

  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['OPEN', 'PAUSED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Valid status is required' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update campaign (only if user owns it)
    const campaign = await prisma.campaign.updateMany({
      where: {
        id: campaignId,
        athlete_id: user.id
      },
      data: {
        status,
        updated_at: new Date()
      }
    })

    if (campaign.count === 0) {
      return NextResponse.json({ error: 'Campaign not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if campaign exists and user owns it
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        athlete_id: user.id
      },
      include: {
        sponsorship_requests: true
      }
    })

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found or unauthorized' }, { status: 404 })
    }

    // Check if campaign has any sponsorship requests
    if (existingCampaign.sponsorship_requests.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete campaign with existing sponsorship requests. Set status to CANCELLED instead.'
      }, { status: 400 })
    }

    // Delete campaign (cascade will handle perk tiers)
    await prisma.campaign.delete({
      where: { id: campaignId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
