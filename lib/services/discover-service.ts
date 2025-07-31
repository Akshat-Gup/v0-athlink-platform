import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

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
    // Validate filters
    if (!filters.activeTab) {
      throw new Error('activeTab is required')
    }

    if (!['filter', 'search', 'ai'].includes(filters.searchMode)) {
      throw new Error('Invalid search mode')
    }

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
      // Sanitize search query to prevent injection
      const sanitizedQuery = filters.searchQuery.replace(/[%_]/g, '\\$&')
      query = query.or(`name.ilike.%${sanitizedQuery}%,bio.ilike.%${sanitizedQuery}%,primary_sport.ilike.%${sanitizedQuery}%`)
    }

    if (filters.selectedSport) {
      query = query.eq('primary_sport', filters.selectedSport)
    }

    if (filters.selectedRating) {
      const ratingThreshold = parseFloat(filters.selectedRating)
      if (isNaN(ratingThreshold) || ratingThreshold < 0 || ratingThreshold > 5) {
        throw new Error('Invalid rating threshold')
      }
      query = query.gte('rating', ratingThreshold)
    }

    if (filters.selectedExperience) {
      const experienceThreshold = parseInt(filters.selectedExperience)
      if (isNaN(experienceThreshold) || experienceThreshold < 0) {
        throw new Error('Invalid experience threshold')
      }
      query = query.gte('years_experience', experienceThreshold)
    }

    if (filters.selectedLocation) {
      query = query.eq('base_location.city', filters.selectedLocation)
    }

    // Apply date filters if provided
    if (filters.startDate) {
      if (isNaN(filters.startDate.getTime())) {
        throw new Error('Invalid start date')
      }
      // Add date filtering logic based on your schema
    }

    if (filters.endDate) {
      if (isNaN(filters.endDate.getTime())) {
        throw new Error('Invalid end date')
      }
      // Add date filtering logic based on your schema
    }

    const { data: users, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Database query failed: ${error.message}`)
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
      try {
        const tags = user.user_tags?.map((ut: any) => ut.tag?.name).filter(Boolean) || []
        const location = user.base_location ?
          `${user.base_location.city}, ${user.base_location.country}` :
          'Location not specified'

        return {
          id: user.id || '',
          name: user.name || 'Unknown',
          sport: user.primary_sport || 'Not specified',
          location,
          rating: Number(user.rating) || 0,
          currentFunding: Number(user.talent_profile?.current_funding || user.team_profile?.current_funding) || 0,
          goalFunding: Number(user.talent_profile?.goal_funding || user.team_profile?.goal_funding) || 0,
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
      } catch (transformError) {
        console.error('Error transforming user:', transformError, user)
        // Return a default item to prevent complete failure
        return {
          id: user.id || '',
          name: user.name || 'Unknown',
          sport: 'Not specified',
          location: 'Location not specified',
          rating: 0,
          currentFunding: 0,
          goalFunding: 0,
          price: 'Not specified',
          period: 'Not specified',
          image: '/placeholder-user.jpg',
          achievements: 'No achievements listed',
          category: 'ATHLETE',
          talentType: 'Not specified',
          fit: 'Not specified',
          tags: [],
          keywords: []
        }
      }
    }

    // Categorize users based on their profiles and criteria
    const athletes = users.filter((u: any) => u.category === 'ATHLETE' && u.talent_profile)
    const teams = users.filter((u: any) => u.category === 'TEAM' && u.team_profile)
    const events = users.filter((u: any) => u.category === 'EVENT' && u.event_profile)

    // For talents, create different categories based on rating and experience
    const topTalentItems = athletes
      .filter((u: any) => (u.rating || 0) >= 4.0)
      .map(transformUser)
      .slice(0, 20)

    const upAndComingItems = athletes
      .filter((u: any) => (u.years_experience || 0) <= 3 && (u.rating || 0) >= 3.0)
      .map(transformUser)
      .slice(0, 20)

    const brandAmbassadorItems = athletes
      .filter((u: any) => {
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
        .filter((u: any) => (u.rating || 0) >= 3.5)
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

    // Handle specific Supabase errors
    if (error && typeof error === 'object' && 'code' in error) {
      const supabaseError = error as any
      switch (supabaseError.code) {
        case 'PGRST116':
          throw new Error('Invalid query parameters')
        case 'PGRST301':
          throw new Error('Database connection error')
        case '42501':
          throw new Error('Insufficient permissions')
        default:
          throw new Error(`Database error: ${supabaseError.message || 'Unknown error'}`)
      }
    }

    // Re-throw known errors
    if (error instanceof Error) {
      throw error
    }

    // Handle unknown errors
    throw new Error('An unexpected error occurred while fetching discover data')
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
    const { data: sportsData, error: sportsError } = await supabaseAdmin
      .from('users')
      .select('primary_sport')
      .not('primary_sport', 'is', null)

    if (sportsError) {
      console.error('Error fetching sports:', sportsError)
      throw sportsError
    }

    const sports = [...new Set(sportsData?.map((u: any) => u.primary_sport).filter(Boolean))]

    // Get unique locations
    const { data: locationsData, error: locationsError } = await supabaseAdmin
      .from('locations')
      .select('city, country')

    if (locationsError) {
      console.error('Error fetching locations:', locationsError)
      throw locationsError
    }

    const locations = locationsData?.map((l: any) => `${l.city}, ${l.country}`) || []

    // Get talent types
    const { data: talentTypesData, error: talentTypesError } = await supabaseAdmin
      .from('talent_types')
      .select('*')
      .eq('is_active', true)

    if (talentTypesError) {
      console.error('Error fetching talent types:', talentTypesError)
      throw talentTypesError
    }

    const talentTypes = talentTypesData || []

    // Get tags
    const { data: tagsData, error: tagsError } = await supabaseAdmin
      .from('tags')
      .select('*')

    if (tagsError) {
      console.error('Error fetching tags:', tagsError)
      throw tagsError
    }

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

// Client-side fetch function with comprehensive error handling
export async function fetchDiscoverData(params: Record<string, any>) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // First verify session
    const { data: { session }, error: sessionError } =
      await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      throw new Error('Session verification failed')
    }

    if (!session) {
      throw new Error('Not authenticated')
    }

    // Build query parameters
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    // Make API request with authorization header
    const response = await fetch(`/api/discover?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))

      // Handle specific error codes
      if (response.status === 401) {
        console.log('Token expired, attempting to refresh session...')
        const { error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError) {
          console.error('Session refresh failed:', refreshError)
          throw new Error('Authentication failed')
        }

        // Retry once with refreshed session
        return fetchDiscoverData(params)
      }

      if (response.status === 400) {
        throw new Error(`Bad request: ${errorData.error || 'Invalid parameters'}`)
      }

      if (response.status >= 500) {
        throw new Error(`Server error: ${errorData.error || 'Internal server error'}`)
      }

      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data

  } catch (error) {
    console.error('Discover fetch error:', error)

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your internet connection')
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new Error('Invalid response format from server')
    }

    // Re-throw known errors
    if (error instanceof Error) {
      throw error
    }

    // Handle unknown errors
    throw new Error('An unexpected error occurred while fetching discover data')
  }
}
