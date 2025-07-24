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
        status
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
