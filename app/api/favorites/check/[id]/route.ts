import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { prisma } from '../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ is_favorited: false })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ is_favorited: false })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        user_id_profile_id: {
          user_id: user.id,
          profile_id: parseInt(params.id)
        }
      }
    })

    return NextResponse.json({
      is_favorited: !!favorite,
      favorite_id: favorite?.id || null
    })

  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json({ is_favorited: false })
  }
}
