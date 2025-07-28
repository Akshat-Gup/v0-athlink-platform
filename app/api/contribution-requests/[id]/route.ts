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

    if (!status || !['COMPLETED', 'FAILED'].includes(status)) {
      return NextResponse.json({ error: 'Valid status is required (COMPLETED or FAILED)' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the contribution request and verify the user is the recipient
    const contributionRequest = await prisma.sponsorContribution.findFirst({
      where: {
        id: requestId,
        recipient_id: user.id,
        status: 'PENDING'
      }
    })

    if (!contributionRequest) {
      return NextResponse.json({ error: 'Contribution request not found or already processed' }, { status: 404 })
    }

    // Update the request status
    const updatedRequest = await prisma.sponsorContribution.update({
      where: { id: requestId },
      data: {
        status: status, // COMPLETED = accepted, FAILED = rejected
        updated_at: new Date()
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
      contribution_request: updatedRequest 
    })

  } catch (error) {
    console.error('Error updating contribution request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
