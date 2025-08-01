"use client"

import { useMemo, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"

// Type matching the DiscoverItem from discover-service  
export interface TalentItem {
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

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

      const favoritesSet = new Set<string>()
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
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

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

        if (filters.selectedBudget) {
          params.append('selectedBudget', JSON.stringify(filters.selectedBudget))
        }
        if (filters.startDate) {
          params.append('startDate', filters.startDate.toISOString())
        }
        if (filters.endDate) {
          params.append('endDate', filters.endDate.toISOString())
        }

        const response = await fetch(`/api/discover?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('API response:', result)
        setData(result)

        // Load favorites status for all items
        await loadFavoritesStatus(result)
      } catch (err) {
        console.error('Error fetching discover data:', err)
        setError('Failed to fetch data')
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

  const toggleFavorite = async (id: string): Promise<void> => {
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
  const isFavorited = (id: string): boolean => {
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
