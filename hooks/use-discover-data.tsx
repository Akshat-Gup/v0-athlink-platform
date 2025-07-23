"use client"

import { useMemo, useEffect, useState } from "react"

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
  
  const toggleFavorite = (id: number): void => {
    console.log('Toggle favorite:', id)
    // Implementation would update favorites in database
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
    getSportLeagues,
    loading,
    error,
  }
}
