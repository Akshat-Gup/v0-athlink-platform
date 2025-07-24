import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { prisma } from '../../../lib/prisma'

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

    const favorites = await prisma.favorite.findMany({
      where: { user_id: user.id },
      include: {
        favorited_user: {
          select: {
            id: true,
            name: true,
            primary_sport: true,
            profile_image_id: true,
            country_flag: true,
            rating: true,
            bio: true,
            talent_profile: {
              select: {
                id: true,
                current_funding: true,
                goal_funding: true,
                achievements: true
              }
            },
            team_profile: {
              select: {
                id: true,
                current_funding: true,
                goal_funding: true,
                league: true,
                wins: true,
                losses: true,
                ranking: true
              }
            },
            event_profile: {
              select: {
                id: true,
                current_funding: true,
                goal_funding: true,
                start_date: true,
                end_date: true,
                venue: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({
      favorites: favorites.map((fav: any) => ({
        id: fav.id,
        profile_type: fav.profile_type,
        created_at: fav.created_at,
        profile: fav.favorited_user
      }))
    })

  } catch (error) {
    console.error('Error fetching favorites:', error)
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
    console.log('POST /api/favorites - Request body:', body)
    
    const { profile_id, profile_type } = body

    if (!profile_id || !profile_type) {
      console.log('Missing profile_id or profile_type:', { profile_id, profile_type })
      return NextResponse.json(
        { error: 'Profile ID and type are required' },
        { status: 400 }
      )
    }

    if (!['talent', 'team', 'event'].includes(profile_type)) {
      console.log('Invalid profile_type:', profile_type)
      return NextResponse.json(
        { error: 'Invalid profile type' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log('User not found for email:', session.user.email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('User found:', { id: user.id, email: user.email })

    // Check if the profile exists
    const profileId = parseInt(profile_id)
    console.log('Checking if profile exists:', { profile_id, profileId })
    
    if (isNaN(profileId)) {
      console.log('Invalid profile_id - not a number:', profile_id)
      return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 })
    }
    
    const profileExists = await prisma.user.findUnique({
      where: { id: profileId }
    })

    console.log('Profile exists check:', { profileId, exists: !!profileExists })

    if (!profileExists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Prevent users from favoriting themselves
    if (user.id === profileId) {
      console.log('User trying to favorite themselves:', { userId: user.id, profileId })
      return NextResponse.json(
        { error: 'Cannot favorite your own profile' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        user_id_profile_id: {
          user_id: user.id,
          profile_id: profileId
        }
      }
    })

    console.log('Existing favorite check:', { exists: !!existingFavorite })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Profile already favorited' },
        { status: 409 }
      )
    }

    // Create favorite
    console.log('Creating favorite:', { user_id: user.id, profile_id: profileId, profile_type })
    
    const favorite = await prisma.favorite.create({
      data: {
        user_id: user.id,
        profile_id: profileId,
        profile_type
      },
      include: {
        favorited_user: {
          select: {
            id: true,
            name: true,
            primary_sport: true,
            profile_image_id: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      favorite
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const profile_id = searchParams.get('profile_id')

    if (!profile_id) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find and delete the favorite
    const deletedFavorite = await prisma.favorite.deleteMany({
      where: {
        user_id: user.id,
        profile_id: parseInt(profile_id)
      }
    })

    if (deletedFavorite.count === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Favorite removed'
    })

  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
