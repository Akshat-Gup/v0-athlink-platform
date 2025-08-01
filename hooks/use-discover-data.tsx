"use client"

import { useMemo, useEffect, useState } from "react"
import { useAuth } from "./use-auth"

// Type matching the TalentItem from talent-grid
export interface TalentItem {
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

interface UseDiscoverDataProps {
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
}

export function useDiscoverData(filters: UseDiscoverDataProps) {
  const { session } = useAuth()
  console.log('🔐 useAuth result in useDiscoverData:', {
    hasSession: !!session,
    sessionLoading: session === undefined,
    sessionNull: session === null,
    userEmail: session?.user?.email,
    hasAccessToken: !!session?.access_token
  })

  const [data, setData] = useState<{
    topTalentItems: TalentItem[]
    upAndComingItems: TalentItem[]
    brandAmbassadorItems: TalentItem[]
    teamItems: TalentItem[]
    eventItems: TalentItem[]
  }>({
    topTalentItems: [],
    upAndComingItems: [],
    brandAmbassadorItems: [],
    teamItems: [],
    eventItems: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  // Function to load favorites status for all items
  const loadFavoritesStatus = async (data: any) => {
    try {
      const allItems = [
        ...data.topTalentItems,
        ...data.upAndComingItems,
        ...data.brandAmbassadorItems,
        ...data.teamItems,
        ...data.eventItems,
      ]

      const favoriteChecks = await Promise.all(
        allItems.map(async (item: TalentItem) => {
          try {
            const response = await fetch(`/api/favorites/check/${item.id}`)
            if (response.ok) {
              const result = await response.json()
              return { id: item.id, isFavorited: result.is_favorited }
            }
          } catch (error) {
            console.error(`Error checking favorite status for item ${item.id}:`, error)
          }
          return { id: item.id, isFavorited: false }
        })
      )

      const favoritesSet = new Set<number>()
      favoriteChecks.forEach(({ id, isFavorited }) => {
        if (isFavorited) {
          favoritesSet.add(id)
        }
      })

      setFavorites(favoritesSet)
    } catch (error) {
      console.error('Error loading favorites status:', error)
    }
  }

  useEffect(() => {
    console.log('🎬 useEffect triggered - about to call fetchData')
    async function fetchData() {
      console.log('🚀 fetchData function called!')
      try {
        setLoading(true)
        setError(null)

        console.log('🔍 Starting data fetch...')
        console.log('Session state:', {
          hasSession: !!session,
          hasAccessToken: !!session?.access_token,
          userEmail: session?.user?.email
        })

        // Check if user is authenticated (temporarily bypassed for development)
        if (!session?.access_token) {
          console.error('❌ No access token found')
          console.log('🚫 Session details:', {
            session: session,
            type: typeof session,
            keys: session ? Object.keys(session) : 'no session'
          })
          console.log('🔧 DEVELOPMENT MODE: Bypassing authentication to test data fetching...')

          // For development, let's try to fetch data without authentication
          // Remove this bypass once authentication is working
        }

        console.log('✅ User is authenticated, building query...')

        // Build query parameters
        const params = new URLSearchParams({
          activeTab: filters.activeTab,
          searchMode: filters.searchMode,
          searchQuery: filters.searchQuery,
          aiQuery: filters.aiQuery,
          selectedTalentType: filters.selectedTalentType,
          selectedFit: filters.selectedFit,
          selectedSport: filters.selectedSport,
          selectedLeague: filters.selectedLeague,
          selectedExperience: filters.selectedExperience,
          selectedRating: filters.selectedRating,
          selectedLocation: filters.selectedLocation,
        })

        console.log('📊 Query parameters:', Object.fromEntries(params.entries()))

        if (filters.selectedBudget) {
          params.append('selectedBudget', JSON.stringify(filters.selectedBudget))
        }
        if (filters.startDate) {
          params.append('startDate', filters.startDate.toISOString())
        }
        if (filters.endDate) {
          params.append('endDate', filters.endDate.toISOString())
        }

        console.log('🌐 Making API request to:', `/api/discover?${params.toString()}`)

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }

        // Add authorization header if we have a session
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        const response = await fetch(`/api/discover?${params.toString()}`, {
          method: 'GET',
          headers,
        })

        console.log('📡 API Response status:', response.status, response.statusText)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('❌ API Error:', errorData)
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('✅ API response received:', {
          topTalentItems: result.topTalentItems?.length || 0,
          upAndComingItems: result.upAndComingItems?.length || 0,
          brandAmbassadorItems: result.brandAmbassadorItems?.length || 0,
          teamItems: result.teamItems?.length || 0,
          eventItems: result.eventItems?.length || 0,
          totalItems: (result.topTalentItems?.length || 0) +
            (result.upAndComingItems?.length || 0) +
            (result.brandAmbassadorItems?.length || 0) +
            (result.teamItems?.length || 0) +
            (result.eventItems?.length || 0)
        })

        // Log first few items from each category for debugging
        if (result.topTalentItems?.length > 0) {
          console.log('📋 Sample topTalentItems:', result.topTalentItems.slice(0, 2))
        }
        if (result.upAndComingItems?.length > 0) {
          console.log('📋 Sample upAndComingItems:', result.upAndComingItems.slice(0, 2))
        }

        setData(result)

        // Load favorites status for all items
        await loadFavoritesStatus(result)
      } catch (err) {
        console.error('Error fetching discover data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        setData({
          topTalentItems: [],
          upAndComingItems: [],
          brandAmbassadorItems: [],
          teamItems: [],
          eventItems: [],
        })
      } finally {
        setLoading(false)
      }
    }

    // For development: fetch data regardless of session status
    // TODO: Re-enable authentication check in production
    fetchData()
  }, [
    filters.activeTab,
    filters.searchMode,
    filters.searchQuery,
    filters.aiQuery,
    filters.selectedTalentType,
    filters.selectedFit,
    filters.selectedSport,
    filters.selectedLeague,
    filters.selectedExperience,
    filters.selectedRating,
    filters.selectedLocation,
    filters.selectedBudget?.[0],
    filters.selectedBudget?.[1],
    filters.startDate,
    filters.endDate,
    session, // Add session dependency
  ])

  const { topTalentItems, upAndComingItems, brandAmbassadorItems, teamItems, eventItems } = data

  // Combine all items for filtering functions
  const allItems = useMemo(() => [
    ...topTalentItems,
    ...upAndComingItems,
    ...brandAmbassadorItems,
    ...teamItems,
    ...eventItems,
  ], [topTalentItems, upAndComingItems, brandAmbassadorItems, teamItems, eventItems])

  // Helper functions
  const getItemsByFit = (fit: string): TalentItem[] => {
    switch (fit) {
      case 'top-talent':
        return topTalentItems
      case 'up-and-coming':
        return upAndComingItems
      case 'brand-ambassador':
        return brandAmbassadorItems
      default:
        return []
    }
  }

  const shouldShowSection = (fit: string): boolean => getItemsByFit(fit).length > 0

  const getFilteredItems = (): TalentItem[] => {
    // Basic search filtering
    if (filters.searchQuery.trim()) {
      return allItems.filter(item =>
        item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.sport.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      )
    }
    return allItems
  }

  const getLeaguesForSport = (sport: string): string[] => {
    // Mock implementation - could be enhanced with real data
    const leagues: Record<string, string[]> = {
      tennis: ["ATP", "WTA", "ITF"],
      basketball: ["NBA", "WNBA", "NCAA"],
      football: ["NFL", "NCAA"],
      soccer: ["MLS", "NWSL", "USL"],
    }
    return leagues[sport.toLowerCase()] || []
  }

  const toggleFavorite = async (id: number): Promise<void> => {
    try {
      // Find the item to determine its type
      const item = allItems.find(item => item.id === id)
      if (!item) {
        console.error('Item not found for id:', id)
        return
      }

      // Determine profile type based on category
      let profileType: 'talent' | 'team' | 'event' = 'talent'

      // More flexible type detection
      if (item.category?.toLowerCase().includes('team') ||
        teamItems.some(teamItem => teamItem.id === id)) {
        profileType = 'team'
      } else if (item.category?.toLowerCase().includes('event') ||
        eventItems.some(eventItem => eventItem.id === id)) {
        profileType = 'event'
      }

      console.log('Toggle favorite for item:', {
        id,
        category: item.category,
        profileType,
        item
      })

      const isFavorited = favorites.has(id)

      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?profile_id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          console.log('Removed from favorites:', id)
          setFavorites(prev => {
            const newFavorites = new Set(prev)
            newFavorites.delete(id)
            return newFavorites
          })
        } else if (response.status === 401) {
          console.log('User not authenticated')
        } else {
          const errorData = await response.text()
          console.error('Failed to remove from favorites:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          })
        }
      } else {
        // Add to favorites
        const requestBody = {
          profile_id: id,
          profile_type: profileType
        }

        console.log('Adding to favorites with data:', requestBody)

        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        if (response.ok) {
          console.log('Added to favorites:', id)
          setFavorites(prev => new Set([...prev, id]))
        } else if (response.status === 401) {
          console.log('User not authenticated')
        } else {
          const errorData = await response.text()
          console.error('Failed to add to favorites:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          })
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  // Function to check if an item is favorited
  const isFavorited = (id: number): boolean => {
    return favorites.has(id)
  }

  const getSportLeagues = (sport: string): string[] => getLeaguesForSport(sport)

  return {
    allItems,
    topTalentItems,
    upAndComingItems,
    brandAmbassadorItems,
    teamItems,
    eventItems,
    getItemsByFit,
    shouldShowSection,
    getFilteredItems,
    getLeaguesForSport,
    toggleFavorite,
    isFavorited,
    getSportLeagues,
    loading,
    error,
  }
}
