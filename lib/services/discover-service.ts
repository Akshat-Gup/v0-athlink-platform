import { supabaseAdmin } from '@/lib/supabase-client'

export interface DiscoverItem {
  id: string // Changed from number to string for Supabase UUIDs
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
    console.log('=== DISCOVER SERVICE ===')

    if (!supabaseAdmin) {
      console.error('Supabase admin client not available')
      return getMockDiscoverData(filters)
    }

    const supabase = supabaseAdmin
    console.log('Using Supabase Client:', !!supabase)
    console.log('Filters received:', filters)

    // Get all users with their related data (excluding sponsors)
    // First try a simpler query to test permissions
    let { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        primary_sport,
        rating,
        bio,
        user_role,
        talent_type_id,
        base_location_id,
        years_experience
      `)
      .not('user_role', 'eq', 'sponsor')
      .limit(10)

    if (usersError) {
      console.error('Error fetching users:', usersError)

      // If it's a permission error, return mock data for testing
      if (usersError.code === '42501') {
        console.log('Permission denied - returning mock data for testing')
        const mockUsers = [
          {
            id: 'mock-1',
            name: 'Alex Johnson',
            email: 'alex@example.com',
            primary_sport: 'Football',
            rating: 4.5,
            bio: 'Professional football player with 8 years experience',
            user_role: 'athlete',
            talent_type_id: 'talent-1',
            base_location_id: 'loc-1',
            years_experience: 8
          },
          {
            id: 'mock-2',
            name: 'Maria Garcia',
            email: 'maria@example.com',
            primary_sport: 'Basketball',
            rating: 4.8,
            bio: 'Basketball team manager and former player',
            user_role: 'team',
            talent_type_id: 'talent-2',
            base_location_id: 'loc-2',
            years_experience: 5
          },
          {
            id: 'mock-3',
            name: 'Sarah Chen',
            email: 'sarah@example.com',
            primary_sport: 'Tennis',
            rating: 4.7,
            bio: 'Professional tennis coach and former tournament player',
            user_role: 'coach',
            talent_type_id: 'talent-3',
            base_location_id: 'loc-3',
            years_experience: 12
          }
        ]

        console.log('Using mock data, users count:', mockUsers.length)
        users = mockUsers
      } else {
        throw usersError
      }
    }

    console.log('Fetched users count:', users?.length || 0)

    if (!users || users.length === 0) {
      console.log('No users found, returning empty arrays')
      return {
        topTalentItems: [],
        upAndComingItems: [],
        brandAmbassadorItems: [],
        teamItems: [],
        eventItems: [],
      }
    }

    // Transform database data to DiscoverItem format
    const allItems: DiscoverItem[] = users.map((user: any) => {
      // For now, use placeholder location since we can't fetch relationships yet
      let location = 'Location TBD'

      // Get profile image - use placeholder for now
      const profileImage = `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop`

      // Determine category based on user_role
      let category = 'talent'
      let talentType = 'Athlete'

      if (user.user_role === 'team') {
        category = 'team'
        talentType = 'Athletic Team'
      } else if (user.user_role === 'event') {
        category = 'event'
        talentType = 'Event Organizer'
      } else if (user.user_role === 'coach') {
        category = 'talent'
        talentType = 'Coach'
      }

      // Basic achievements based on user role
      let achievements = 'Professional athlete with extensive experience'
      if (user.user_role === 'team') {
        achievements = 'Competitive team with strong track record'
      } else if (user.user_role === 'coach') {
        achievements = 'Experienced coach and trainer'
      }

      // Determine fit type based on rating
      let fit = 'top-talent'
      if (user.rating < 4.5) {
        fit = 'up-and-coming'
      } else if (user.rating >= 4.8) {
        fit = 'brand-ambassador'
      }

      // Basic tags and keywords
      const tags = [user.primary_sport || '', user.user_role || ''].filter(Boolean)
      const keywords = [
        user.primary_sport?.toLowerCase() || '',
        user.user_role?.toLowerCase() || '',
        user.name?.toLowerCase() || ''
      ].filter(Boolean)

      return {
        id: user.id,
        name: user.name || 'Unknown User',
        sport: user.primary_sport || 'General',
        location,
        rating: user.rating || 0,
        currentFunding: undefined, // Will fetch from profiles later
        goalFunding: undefined,
        price: undefined,
        period: undefined,
        image: profileImage,
        achievements,
        category,
        talentType,
        fit,
        tags,
        keywords,
      }
    })

    console.log('Transformed items count:', allItems.length)

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

    console.log('Filtered items count:', filteredItems.length)

    // Group by fit type
    const topTalentItems = filteredItems.filter(item => item.fit === 'top-talent')
    const upAndComingItems = filteredItems.filter(item => item.fit === 'up-and-coming')
    const brandAmbassadorItems = filteredItems.filter(item => item.fit === 'brand-ambassador')
    const teamItems = filteredItems.filter(item => item.category === 'team')
    const eventItems = filteredItems.filter(item => item.category === 'event')

    const result = {
      topTalentItems,
      upAndComingItems,
      brandAmbassadorItems,
      teamItems,
      eventItems,
    }

    console.log('Final result counts:', {
      topTalent: topTalentItems.length,
      upAndComing: upAndComingItems.length,
      brandAmbassador: brandAmbassadorItems.length,
      teams: teamItems.length,
      events: eventItems.length,
    })

    return result
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

// Mock data function for fallback
function getMockDiscoverData(filters: any) {
  console.log('Using mock data for discover')

  const mockItems: DiscoverItem[] = [
    {
      id: "mock-1",
      name: "Alex Thompson",
      sport: "Tennis",
      location: "California, USA",
      rating: 4.8,
      currentFunding: 25000,
      goalFunding: 50000,
      price: "$2,500",
      period: "per month",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop",
      achievements: "3x State Champion, ATP Ranking #120",
      category: "talent",
      talentType: "individual",
      fit: "top-talent",
      tags: ["tennis", "professional", "state-champion"],
      keywords: ["tennis", "champion", "california"]
    },
    {
      id: "mock-2",
      name: "Maria Garcia",
      sport: "Soccer",
      location: "Texas, USA",
      rating: 4.5,
      currentFunding: 15000,
      goalFunding: 40000,
      price: "$1,800",
      period: "per month",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop",
      achievements: "NCAA Division I, National Team",
      category: "talent",
      talentType: "individual",
      fit: "top-talent",
      tags: ["soccer", "ncaa", "national-team"],
      keywords: ["soccer", "football", "texas"]
    }
  ]

  return {
    topTalentItems: mockItems,
    upAndComingItems: [],
    brandAmbassadorItems: [],
    teamItems: [],
    eventItems: [],
  }
}
