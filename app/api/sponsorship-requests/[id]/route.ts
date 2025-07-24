import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestId = parseInt(params.id)
    if (isNaN(requestId)) {
      return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Valid status is required' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the sponsorship request to verify ownership and update campaign funding
    const sponsorshipRequest = await prisma.sponsorshipRequest.findFirst({
      where: {
        id: requestId,
        athlete_id: user.id,
        status: 'PENDING'
      },
      include: {
        campaign: true,
        perk_tier: true
      }
    })

    if (!sponsorshipRequest) {
      return NextResponse.json({ error: 'Sponsorship request not found or already processed' }, { status: 404 })
    }

    // Start transaction to update request and campaign
    const result = await prisma.$transaction(async (tx) => {
      // Update sponsorship request status
      const updatedRequest = await tx.sponsorshipRequest.update({
        where: { id: requestId },
        data: {
          status,
          escrow_status: status === 'ACCEPTED' ? 'RELEASED' : 'RETURNED'
        }
      })

      // If accepted, update campaign funding and perk tier sponsor count
      if (status === 'ACCEPTED') {
        // Update campaign funding
        await tx.campaign.update({
          where: { id: sponsorshipRequest.campaign_id },
          data: {
            current_funding: {
              increment: sponsorshipRequest.amount
            }
          }
        })

        // If it's a perk tier sponsorship, increment sponsor count
        if (sponsorshipRequest.perk_tier_id && sponsorshipRequest.perk_tier) {
          await tx.perkTier.update({
            where: { id: sponsorshipRequest.perk_tier_id },
            data: {
              current_sponsors: {
                increment: 1
              }
            }
          })
        }
      }

      return updatedRequest
    })

    return NextResponse.json({ 
      success: true,
      sponsorship_request: result 
    })

  } catch (error) {
    console.error('Error updating sponsorship request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
