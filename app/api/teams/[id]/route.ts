import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get team with all related data
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: {
        sport: true,
        league: true,
        location: true,
        logo_file: true,
        cover_image: true,
        owner: {
          include: {
            profile_image: true,
            base_location: true
          }
        },
        memberships: {
          include: {
            user: {
              include: {
                profile_image: true,
                base_location: true,
                talent_type: true
              }
            }
          }
        },
        achievements: true,
        campaigns: {
          include: {
            featured_image: true,
            location: true,
            checkpoints: true
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Transform the data to match the expected format
    const transformedTeam = {
      id: team.id,
      name: team.name,
      bio: team.description || '',
      sport: team.sport.sport_name,
      location: team.location.name,
      rating: 4.85, // You can calculate this based on achievements/performance
      category: 'team',
      profileImage: team.logo_file?.file_path || '/placeholder-logo.png',
      coverImage: team.cover_image?.file_path || '/placeholder.jpg',
      
      // Team-specific data
      teamType: team.team_type,
      founded: team.founded_date,
      venue: team.venue_name,
      website: team.website_url,
      isRecruiting: team.is_recruiting,
      
      // Stats
      teamStats: [
        { label: 'Founded', value: team.founded_date?.getFullYear().toString() || 'N/A', icon: '📅' },
        { label: 'League', value: team.league?.league_name || 'Independent', icon: '🏆' },
        { label: 'Members', value: team.memberships.length.toString(), icon: '👥' },
        { label: 'Location', value: team.location.city, icon: '📍' }
      ],
      
      performanceStats: [
        { label: 'Achievements', value: team.achievements.length.toString(), icon: '🏅' },
        { label: 'Active Campaigns', value: team.campaigns.filter(c => c.status === 'active').length.toString(), icon: '💰' },
        { label: 'Home Venue', value: team.venue_name || 'TBD', icon: '🏟️' },
        { label: 'Team Type', value: team.team_type, icon: '⚡' }
      ],
      
      // Mock data for charts and other features
      performanceData: [
        { month: 'Jan', wins: 8, losses: 2 },
        { month: 'Feb', wins: 9, losses: 1 },
        { month: 'Mar', wins: 7, losses: 3 },
        { month: 'Apr', wins: 10, losses: 0 },
        { month: 'May', wins: 8, losses: 2 },
        { month: 'Jun', wins: 9, losses: 1 }
      ],
      
      // Team roster
      roster: team.memberships.map(member => ({
        id: member.user.id,
        name: member.user.name,
        role: member.role,
        position: member.position || 'Player',
        jerseyNumber: member.jersey_number || 'N/A',
        profileImage: member.user.profile_image?.file_path || '/placeholder-user.jpg',
        isStarter: member.is_starter,
        joinDate: member.start_date
      })),
      
      // Mock upcoming games
      upcomingGames: [
        {
          id: 1,
          opponent: 'City Rivals',
          date: '2024-02-15',
          time: '7:00 PM',
          venue: team.venue_name || 'Home Stadium',
          type: 'League Match'
        }
      ],
      
      // Mock recent results
      recentResults: [
        {
          id: 1,
          opponent: 'Thunder Bolts',
          date: '2024-01-28',
          result: 'W 3-1',
          venue: 'Away',
          type: 'League Match'
        }
      ],
      
      // Sponsors (mock data)
      sponsors: [
        {
          id: 1,
          name: 'SportsBrand',
          logo: '/placeholder-logo.png',
          tier: 'Official Partner'
        }
      ],
      
      // Media gallery (mock data)
      mediaGallery: {
        photos: [
          {
            id: 1,
            url: team.cover_image?.file_path || '/placeholder.jpg',
            title: 'Team Photo',
            category: 'Team'
          }
        ],
        videos: []
      }
    }

    return NextResponse.json(transformedTeam)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
