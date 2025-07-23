import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    const sport = searchParams.get('sport') || ''
    const location = searchParams.get('location') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    let results: any[] = []

    // Fetch users (talents and coaches)
    if (category === 'all' || category === 'talents' || category === 'coaches') {
      const whereConditions: any = {
        AND: []
      }

      // Category filter
      if (category === 'talents') {
        whereConditions.AND.push({ category: 'talent' })
      } else if (category === 'coaches') {
        whereConditions.AND.push({ category: 'coach' })
      }

      // Search filter
      if (search) {
        whereConditions.AND.push({
          OR: [
            { name: { contains: search } },
            { bio: { contains: search } },
            { primary_sport: { contains: search } }
          ]
        })
      }

      // Sport filter
      if (sport) {
        whereConditions.AND.push({ primary_sport: { contains: sport } })
      }

      // Location filter
      if (location) {
        whereConditions.AND.push({
          base_location: {
            OR: [
              { name: { contains: location } },
              { city: { contains: location } }
            ]
          }
        })
      }

      const users = await prisma.user.findMany({
        where: whereConditions.AND.length > 0 ? whereConditions : undefined,
        include: {
          base_location: true,
          talent_type: true,
          profile_image: true,
          campaigns: {
            where: { status: 'active' },
            take: 1
          }
        },
        skip,
        take: limit
      })

      const userResults = users.map(user => ({
        id: user.id,
        name: user.name,
        sport: user.primary_sport,
        location: user.base_location?.name || 'Unknown',
        rating: user.rating,
        currentFunding: user.campaigns[0]?.current_amount || 0,
        goalFunding: user.campaigns[0]?.goal_amount || 0,
        image: user.profile_image?.file_path || '/placeholder-user.jpg',
        achievements: `${user.years_experience} years experience`,
        category: user.category === 'talent' ? 'talent' : 'coach',
        talentType: user.talent_type?.type_name || 'Professional',
        fit: user.rating >= 4.8 ? 'elite' : user.rating >= 4.5 ? 'professional' : 'up-and-coming',
        tags: [user.talent_type?.type_name || 'Professional', user.primary_sport],
        keywords: [user.primary_sport.toLowerCase(), user.base_location?.city.toLowerCase() || '', user.name.toLowerCase()],
        countryFlag: user.country_flag,
        verificationStatus: user.verification_status
      }))

      results = [...results, ...userResults]
    }

    // Fetch teams
    if (category === 'all' || category === 'teams') {
      const whereConditions: any = {
        AND: []
      }

      // Search filter
      if (search) {
        whereConditions.AND.push({
          OR: [
            { name: { contains: search } },
            { description: { contains: search } }
          ]
        })
      }

      // Sport filter
      if (sport) {
        whereConditions.AND.push({
          sport: {
            sport_name: { contains: sport }
          }
        })
      }

      // Location filter
      if (location) {
        whereConditions.AND.push({
          location: {
            OR: [
              { name: { contains: location } },
              { city: { contains: location } }
            ]
          }
        })
      }

      const teams = await prisma.team.findMany({
        where: whereConditions.AND.length > 0 ? whereConditions : undefined,
        include: {
          sport: true,
          location: true,
          league: true,
          logo_file: true,
          memberships: true,
          campaigns: {
            where: { status: 'active' },
            take: 1
          }
        },
        skip,
        take: limit
      })

      const teamResults = teams.map(team => ({
        id: team.id,
        name: team.name,
        sport: team.sport?.sport_name || 'Unknown',
        location: team.location?.name || 'Unknown',
        rating: 4.8, // You can calculate this based on achievements
        currentFunding: team.campaigns[0]?.current_amount || 0,
        goalFunding: team.campaigns[0]?.goal_amount || 0,
        image: team.logo_file?.file_path || '/placeholder-logo.png',
        achievements: team.league?.league_name || team.team_type,
        category: 'team',
        teamType: team.team_type,
        fit: team.team_type === 'professional' ? 'elite' : 'professional',
        tags: [team.team_type, team.sport?.sport_name || 'Unknown', team.location?.city || 'Unknown'],
        keywords: [team.sport?.sport_name.toLowerCase() || '', team.location?.city.toLowerCase() || '', team.name.toLowerCase()],
        isRecruiting: team.is_recruiting,
        memberCount: team.memberships?.length || 0
      }))

      results = [...results, ...teamResults]
    }

    // For events and facilities, you can add similar queries here
    // For now, we'll return empty arrays for those categories

    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        total: results.length,
        hasMore: results.length === limit
      }
    })
  } catch (error) {
    console.error('Error fetching discover data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
