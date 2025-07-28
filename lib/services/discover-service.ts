import { prisma } from '@/lib/prisma'
import { UserCategory } from '@prisma/client'

export interface DiscoverItem {
  id: number
  name: string
  sport: string
  location: string
  rating: number
  currentFunding?: number
  goalFunding?: number
  price?: string
  period?: string
  image: string
  achievements: string
  category: string
  talentType: string
  fit: string
  tags: string[]
  keywords: string[]
}

export async function getDiscoverData(filters: {
  activeTab: string
  searchMode: "filter" | "search" | "ai"
  searchQuery: string
  aiQuery: string
  selectedTalentType: string
  selectedFit: string
  selectedSport: string
  selectedLeague: string
  selectedExperience: string
  selectedRating: string
  selectedBudget?: [number, number]
  selectedLocation: string
  startDate?: Date
  endDate?: Date
}): Promise<{
  topTalentItems: DiscoverItem[]
  upAndComingItems: DiscoverItem[]
  brandAmbassadorItems: DiscoverItem[]
  teamItems: DiscoverItem[]
  eventItems: DiscoverItem[]
}> {
  try {
    // Get all users with their profiles and locations (excluding sponsors)
    const users = await prisma.user.findMany({
      include: {
        base_location: true,
        talent_type: true,
        talent_profile: true,
        team_profile: true,
        event_profile: {
          include: {
            location: true,
          },
        },
        media_items: {
          where: {
            media_type: 'PHOTO',
          },
          take: 1,
        },
        user_tags: {
          include: {
            tag: true,
          },
        },
      },
      where: {
        is_active: true,
        verification_status: 'VERIFIED',
        category: 'TALENT', // Only include talent users, exclude sponsors
      },
    })

    // Transform database data to DiscoverItem format
    const allItems: DiscoverItem[] = users.map(user => {
      const location = user.event_profile?.location || user.base_location
      const profileImage = user.media_items[0]?.url || `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop`
      
      // Determine category based on user data
      let category = 'talent'
      let talentType = user.talent_type?.type_name || 'Athlete'
      
      if (user.team_profile) {
        category = 'team'
        talentType = 'Athletic Team'
      } else if (user.event_profile) {
        category = 'event'
        talentType = 'Championship Event'
      }

      // Get achievements
      let achievements = ''
      if (user.talent_profile) {
        achievements = user.talent_profile.achievements
      } else if (user.team_profile) {
        achievements = `${user.team_profile.wins} Wins, Ranking #${user.team_profile.ranking}`
      } else if (user.event_profile) {
        achievements = `${user.event_profile.event_type} - ${user.event_profile.status}`
      }

      // Determine fit type
      let fit = 'top-talent'
      if (user.talent_profile?.fit_type) {
        fit = user.talent_profile.fit_type
      } else if (user.rating < 4.5) {
        fit = 'up-and-coming'
      } else if (user.talent_type?.type_key === 'content-creator') {
        fit = 'brand-ambassador'
      }

      // Get tags
      const tags = user.user_tags.map(ut => ut.tag.name)
      
      // Generate keywords from various fields
      const keywords = [
        user.primary_sport.toLowerCase(),
        user.base_location.city.toLowerCase(),
        user.base_location.state?.toLowerCase() || '',
        ...achievements.toLowerCase().split(' '),
        ...tags.map(tag => tag.toLowerCase()),
      ].filter(Boolean)

      return {
        id: user.id,
        name: user.name,
        sport: user.primary_sport,
        location: `${location.city}, ${location.state || location.country}`,
        rating: user.rating,
        currentFunding: user.talent_profile?.current_funding || user.team_profile?.current_funding || user.event_profile?.current_funding,
        goalFunding: user.talent_profile?.goal_funding || user.team_profile?.goal_funding || user.event_profile?.goal_funding,
        price: user.talent_profile?.price,
        period: user.talent_profile?.period,
        image: profileImage,
        achievements,
        category,
        talentType,
        fit,
        tags,
        keywords,
      }
    })

    // Apply filters
    let filteredItems = allItems

    // Filter by tab (category)
    if (filters.activeTab === 'talents') {
      filteredItems = filteredItems.filter(item => item.category === 'talent')
    } else if (filters.activeTab === 'teams') {
      filteredItems = filteredItems.filter(item => item.category === 'team')
    } else if (filters.activeTab === 'events') {
      filteredItems = filteredItems.filter(item => item.category === 'event')
    }

    // Apply search filters
    if (filters.searchQuery && filters.searchMode === 'search') {
      const query = filters.searchQuery.toLowerCase()
      filteredItems = filteredItems.filter(item =>
        item.keywords.some(keyword => keyword.includes(query)) ||
        item.name.toLowerCase().includes(query) ||
        item.sport.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      )
    }

    // Apply other filters
    if (filters.selectedSport) {
      filteredItems = filteredItems.filter(item => 
        item.sport.toLowerCase() === filters.selectedSport.toLowerCase()
      )
    }

    if (filters.selectedTalentType) {
      filteredItems = filteredItems.filter(item =>
        item.talentType.toLowerCase().replace(/\s+/g, '-') === filters.selectedTalentType
      )
    }

    if (filters.selectedRating) {
      const minRating = parseFloat(filters.selectedRating)
      filteredItems = filteredItems.filter(item => item.rating >= minRating)
    }

    if (filters.selectedLocation) {
      filteredItems = filteredItems.filter(item =>
        item.location.toLowerCase().includes(filters.selectedLocation.toLowerCase())
      )
    }

    // Group by fit type
    const topTalentItems = filteredItems.filter(item => item.fit === 'top-talent')
    const upAndComingItems = filteredItems.filter(item => item.fit === 'up-and-coming')
    const brandAmbassadorItems = filteredItems.filter(item => item.fit === 'brand-ambassador')
    const teamItems = filteredItems.filter(item => item.category === 'team')
    const eventItems = filteredItems.filter(item => item.category === 'event')

    return {
      topTalentItems,
      upAndComingItems,
      brandAmbassadorItems,
      teamItems,
      eventItems,
    }
  } catch (error) {
    console.error('Error fetching discover data:', error)
    // Return empty arrays on error
    return {
      topTalentItems: [],
      upAndComingItems: [],
      brandAmbassadorItems: [],
      teamItems: [],
      eventItems: [],
    }
  }
}
