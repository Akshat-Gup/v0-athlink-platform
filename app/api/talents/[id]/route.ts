import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get user with all related data
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        base_location: true,
        talent_type: true,
        profile_image: true,
        cover_image: true,
        sports: {
          include: {
            sport: true
          }
        },
        leagues: {
          include: {
            league: {
              include: {
                sport: true
              }
            }
          }
        },
        ratings: {
          include: {
            provider: true
          }
        },
        fields: {
          include: {
            definition: true
          }
        },
        social_media: {
          include: {
            platform: true
          }
        },
        achievements: true,
        event_participations: {
          include: {
            event: {
              include: {
                event_type: true,
                location: true,
                sport: true,
                league: true
              }
            },
            result: {
              include: {
                stats: {
                  include: {
                    field: true
                  }
                }
              }
            }
          }
        },
        team_memberships: {
          include: {
            team: {
              include: {
                logo_file: true,
                location: true,
                sport: true
              }
            }
          }
        },
        campaigns: {
          include: {
            featured_image: true,
            location: true,
            checkpoints: true
          }
        },
        performance_history: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Transform the data to match the expected format
    const transformedUser = {
      id: user.id,
      name: user.name,
      bio: user.bio,
      sport: user.primary_sport,
      location: user.base_location.name,
      rating: user.rating,
      category: user.category,
      profileImage: user.profile_image?.file_path || '/placeholder-user.jpg',
      coverImage: user.cover_image?.file_path || '/placeholder.jpg',
      
      // User-specific data
      talentType: user.talent_type?.type_name || 'Athlete',
      yearsExperience: user.years_experience,
      verificationStatus: user.verification_status,
      countryFlag: user.country_flag,
      teamEmoji: user.team_emoji,
      
      // Stats
      talentStats: [
        { label: 'Rating', value: user.rating.toString(), icon: '⭐' },
        { label: 'Experience', value: `${user.years_experience} years`, icon: '📅' },
        { label: 'Sport', value: user.primary_sport, icon: '🏃' },
        { label: 'Location', value: user.base_location.city, icon: '📍' }
      ],
      
      performanceStats: [
        { label: 'Achievements', value: user.achievements.length.toString(), icon: '🏅' },
        { label: 'Events', value: user.event_participations.length.toString(), icon: '🏆' },
        { label: 'Teams', value: user.team_memberships.length.toString(), icon: '👥' },
        { label: 'Campaigns', value: user.campaigns.length.toString(), icon: '💰' }
      ],
      
      // Performance data for charts
      performanceData: user.performance_history.map(perf => ({
        date: perf.record_date.toISOString().split('T')[0],
        value: perf.metric_value,
        type: perf.metric_type
      })),
      
      // Recent achievements
      recentAchievements: user.achievements.slice(0, 5).map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        date: achievement.achievement_date,
        type: achievement.achievement_type,
        isVerified: achievement.is_verified
      })),
      
      // Event participations
      eventHistory: user.event_participations.map(participation => ({
        id: participation.event.id,
        name: participation.event.name,
        date: participation.event.start_date,
        location: participation.event.location.name,
        sport: participation.event.sport.sport_name,
        result: participation.result ? {
          position: participation.result.position,
          score: participation.result.score,
          points: participation.result.points
        } : null
      })),
      
      // Team memberships
      teamHistory: user.team_memberships.map(membership => ({
        id: membership.team.id,
        name: membership.team.name,
        role: membership.role,
        position: membership.position,
        startDate: membership.start_date,
        endDate: membership.end_date,
        isActive: membership.membership_status === 'active',
        teamLogo: membership.team.logo_file?.file_path || '/placeholder-logo.png'
      })),
      
      // Social media
      socialMedia: user.social_media.map(social => ({
        platform: social.platform.platform_name,
        username: social.username,
        followerCount: social.follower_count,
        isVerified: social.is_verified,
        url: `${social.platform.base_url}${social.username}`
      })),
      
      // Custom fields
      customFields: user.fields.map(field => ({
        key: field.definition.field_key,
        label: field.definition.field_label,
        value: field.field_value,
        type: field.definition.field_type,
        icon: field.definition.field_icon,
        unit: field.definition.field_unit
      })),
      
      // Campaigns
      activeCampaigns: user.campaigns
        .filter(campaign => campaign.status === 'active')
        .map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          goalAmount: campaign.goal_amount,
          currentAmount: campaign.current_amount,
          progress: (campaign.current_amount / campaign.goal_amount) * 100,
          type: campaign.campaign_type,
          endDate: campaign.end_date,
          featuredImage: campaign.featured_image?.file_path
        })),
      
      // Media gallery (mock data for now)
      mediaGallery: {
        photos: [
          {
            id: 1,
            url: user.cover_image?.file_path || '/placeholder.jpg',
            title: 'Profile Photo',
            category: 'Profile'
          }
        ],
        videos: []
      }
    }

    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
