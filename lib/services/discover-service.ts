import { supabaseAdmin } from '@/lib/supabase'

export interface DiscoverItem {
  id: string
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
    let query = supabaseAdmin
      .from('users')
      .select(`
        *,
        base_location:locations!base_location_id(*),
        talent_type:talent_types!talent_type_id(*),
        talent_profile:talent_profiles(*),
        team_profile:team_profiles(*),
        event_profile:event_profiles(*),
        user_tags:user_tags(tag:tags(*)),
        media_items(*)
      `)
      .neq('category', 'SPONSOR')
      .eq('is_active', true)

    // Apply filters based on search mode and criteria
    if (filters.searchMode === 'search' && filters.searchQuery) {
      // Simple text search across name, bio, primary_sport
      query = query.or(`name.ilike.%${filters.searchQuery}%,bio.ilike.%${filters.searchQuery}%,primary_sport.ilike.%${filters.searchQuery}%`)
    }

    if (filters.selectedSport) {
      query = query.eq('primary_sport', filters.selectedSport)
    }

    if (filters.selectedRating) {
      const ratingThreshold = parseFloat(filters.selectedRating)
      query = query.gte('rating', ratingThreshold)
    }

    if (filters.selectedExperience) {
      const experienceThreshold = parseInt(filters.selectedExperience)
      query = query.gte('years_experience', experienceThreshold)
    }

    if (filters.selectedLocation) {
      query = query.eq('base_location.city', filters.selectedLocation)
    }

    const { data: users, error } = await query

    if (error) {
      console.error('Error fetching users:', error)
      throw error
    }

    if (!users || users.length === 0) {
      return {
        topTalentItems: [],
        upAndComingItems: [],
        brandAmbassadorItems: [],
        teamItems: [],
        eventItems: []
      }
    }

    // Transform users into DiscoverItems
    const transformUser = (user: any): DiscoverItem => {
      const tags = user.user_tags?.map((ut: any) => ut.tag?.name).filter(Boolean) || []
      const location = user.base_location ? 
        `${user.base_location.city}, ${user.base_location.country}` : 
        'Location not specified'

      return {
        id: user.id,
        name: user.name,
        sport: user.primary_sport || 'Not specified',
        location,
        rating: user.rating || 0,
        currentFunding: user.talent_profile?.current_funding || user.team_profile?.current_funding || 0,
        goalFunding: user.talent_profile?.goal_funding || user.team_profile?.goal_funding || 0,
        price: user.talent_profile?.price || 'Not specified',
        period: user.talent_profile?.period || 'Not specified',
        image: user.profile_image_id ? `/api/files/${user.profile_image_id}` : '/placeholder-user.jpg',
        achievements: user.talent_profile?.achievements || user.bio || 'No achievements listed',
        category: user.category || 'ATHLETE',
        talentType: user.talent_type?.type_name || 'Not specified',
        fit: user.talent_profile?.fit_type || 'Not specified',
        tags,
        keywords: [
          user.name,
          user.primary_sport,
          user.category,
          ...tags
        ].filter(Boolean)
      }
    }

    // Categorize users based on their profiles and criteria
    const athletes = users.filter(u => u.category === 'ATHLETE' && u.talent_profile)
    const teams = users.filter(u => u.category === 'TEAM' && u.team_profile)
    const events = users.filter(u => u.category === 'EVENT' && u.event_profile)

    // For talents, create different categories based on rating and experience
    const topTalentItems = athletes
      .filter(u => (u.rating || 0) >= 4.0)
      .map(transformUser)
      .slice(0, 20)

    const upAndComingItems = athletes
      .filter(u => (u.years_experience || 0) <= 3 && (u.rating || 0) >= 3.0)
      .map(transformUser)
      .slice(0, 20)

    const brandAmbassadorItems = athletes
      .filter(u => {
        const tags = u.user_tags?.map((ut: any) => ut.tag?.name).filter(Boolean) || []
        return tags.some((tag: string) => 
          tag.toLowerCase().includes('brand') || 
          tag.toLowerCase().includes('ambassador') ||
          tag.toLowerCase().includes('marketing')
        )
      })
      .map(transformUser)
      .slice(0, 20)

    // If no specific brand ambassadors found, use high-rated athletes
    if (brandAmbassadorItems.length === 0) {
      brandAmbassadorItems.push(...athletes
        .filter(u => (u.rating || 0) >= 3.5)
        .map(transformUser)
        .slice(0, 10))
    }

    const teamItems = teams.map(transformUser).slice(0, 20)
    const eventItems = events.map(transformUser).slice(0, 20)

    return {
      topTalentItems,
      upAndComingItems,
      brandAmbassadorItems,
      teamItems,
      eventItems
    }
  } catch (error) {
    console.error('Error in getDiscoverData:', error)
    throw error
  }
}

// Helper function for AI-powered search (placeholder)
export async function getAISearchResults(query: string): Promise<DiscoverItem[]> {
  // This would integrate with an AI service to provide semantic search
  // For now, fall back to regular search
  return getDiscoverData({
    activeTab: 'talents',
    searchMode: 'search',
    searchQuery: query,
    aiQuery: query,
    selectedTalentType: '',
    selectedFit: '',
    selectedSport: '',
    selectedLeague: '',
    selectedExperience: '',
    selectedRating: '',
    selectedLocation: ''
  }).then(data => data.topTalentItems)
}

// Get filter options for the UI
export async function getFilterOptions() {
  try {
    // Get unique sports
    const { data: sportsData } = await supabaseAdmin
      .from('users')
      .select('primary_sport')
      .not('primary_sport', 'is', null)

    const sports = [...new Set(sportsData?.map(u => u.primary_sport).filter(Boolean))] || []

    // Get unique locations
    const { data: locationsData } = await supabaseAdmin
      .from('locations')
      .select('city, country')

    const locations = locationsData?.map(l => `${l.city}, ${l.country}`) || []

    // Get talent types
    const { data: talentTypesData } = await supabaseAdmin
      .from('talent_types')
      .select('*')
      .eq('is_active', true)

    const talentTypes = talentTypesData || []

    // Get tags
    const { data: tagsData } = await supabaseAdmin
      .from('tags')
      .select('*')

    const tags = tagsData || []

    return {
      sports: sports.sort(),
      locations: locations.sort(),
      talentTypes,
      tags,
      experienceLevels: ['0-1', '2-3', '4-5', '6-10', '10+'],
      ratings: ['3.0+', '3.5+', '4.0+', '4.5+'],
      budgetRanges: [
        [0, 1000],
        [1000, 5000],
        [5000, 10000],
        [10000, 25000],
        [25000, 50000],
        [50000, 100000]
      ]
    }
  } catch (error) {
    console.error('Error getting filter options:', error)
    return {
      sports: [],
      locations: [],
      talentTypes: [],
      tags: [],
      experienceLevels: [],
      ratings: [],
      budgetRanges: []
    }
  }
}
