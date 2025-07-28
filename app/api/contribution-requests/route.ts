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
      profile_id, 
      profile_type, // "talent", "team", "event"
      amount, 
      custom_conditions, 
      message
    } = body

    if (!profile_id || !profile_type || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Profile ID, profile type, and valid amount are required' }, { status: 400 })
    }

    // Get sponsor user from database
    const sponsor = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    // Get the profile owner (athlete/campaign owner)
    const profileOwner = await prisma.user.findUnique({
      where: { id: profile_id }
    })

    if (!profileOwner) {
      return NextResponse.json({ error: 'Profile owner not found' }, { status: 404 })
    }

    // For now, we'll create a contribution request directly in the SponsorContribution table
    // In a real system, you might want to create a separate RequestContribution table
    const contributionRequest = await prisma.sponsorContribution.create({
      data: {
        sponsor_id: sponsor.id,
        recipient_id: profileOwner.id,
        amount,
        currency: 'USD',
        message: message || custom_conditions || null,
        status: 'PENDING' // Pending approval from profile owner
      },
      include: {
        sponsor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      contribution_request: contributionRequest
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating contribution request:', error)
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

    // Get contribution requests sent by this user (as sponsor)
    const sentRequests = await prisma.sponsorContribution.findMany({
      where: {
        sponsor_id: user.id
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Get contribution requests received by this user (as profile owner)
    const receivedRequests = await prisma.sponsorContribution.findMany({
      where: {
        recipient_id: user.id
      },
      include: {
        sponsor: {
          select: {
            id: true,
            name: true,
            email: true
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
    console.error('Error fetching contribution requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
