"use client"

import { useState, useEffect, useMemo } from "react"

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
  const [allItems, setAllItems] = useState<TalentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build query parameters
        const params = new URLSearchParams()
        
        if (filters.activeTab !== 'all') {
          params.append('category', filters.activeTab)
        }
        
        if (filters.searchQuery) {
          params.append('search', filters.searchQuery)
        }
        
        if (filters.selectedSport) {
          params.append('sport', filters.selectedSport)
        }
        
        if (filters.selectedLocation) {
          params.append('location', filters.selectedLocation)
        }
        
        // Add pagination
        params.append('page', '1')
        params.append('limit', '100') // Get all items for now
        
        const response = await fetch(`/api/discover?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        setAllItems(data.results || [])
      } catch (err) {
        console.error('Error fetching discover data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        // Provide fallback mock data in case of error
        setAllItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [
    filters.activeTab,
    filters.searchQuery,
    filters.selectedSport,
    filters.selectedLocation
  ])

  const upAndComingItems = useMemo(() => 
    allItems.filter(item => item.fit === "up-and-coming"), [allItems]
  )

  const brandAmbassadorItems = useMemo(() => 
    allItems.filter(item => item.fit === "brand-ambassador"), [allItems]
  )

  // Utility functions
  const getLeaguesForSport = (sport: string): string[] => {
    const leagues: Record<string, string[]> = {
      tennis: ["ATP", "WTA", "ITF", "NCAA"],
      basketball: ["NBA", "WNBA", "NCAA", "G League"],
      soccer: ["MLS", "NWSL", "Premier League", "La Liga", "Serie A"],
      swimming: ["USA Swimming", "NCAA", "FINA World Aquatics"],
      "track-field": ["USA Track & Field", "NCAA", "World Athletics"],
      gymnastics: ["USA Gymnastics", "NCAA", "FIG"],
      boxing: ["WBC", "WBA", "IBF", "WBO", "Amateur"],
      cycling: ["UCI", "USA Cycling", "Tour de France"],
    }
    return leagues[sport] || []
  }

  const getItemsByFit = (fit: string): TalentItem[] => {
    return allItems.filter(item => {
      if (fit === "all") return true
      return item.fit === fit
    })
  }

  const getFilteredItems = (): TalentItem[] => {
    return allItems.filter(item => {
      // Category filter
      if (filters.activeTab !== "all" && item.category !== filters.activeTab) {
        return false
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const searchFields = [
          item.name,
          item.sport,
          item.location,
          item.achievements,
          item.talentType,
          ...item.tags,
          ...item.keywords
        ].map(field => field.toLowerCase())
        
        if (!searchFields.some(field => field.includes(query))) {
          return false
        }
      }

      // Talent type filter
      if (filters.selectedTalentType !== "all" && item.talentType !== filters.selectedTalentType) {
        return false
      }

      // Fit filter
      if (filters.selectedFit !== "all" && item.fit !== filters.selectedFit) {
        return false
      }

      // Sport filter
      if (filters.selectedSport && item.sport.toLowerCase() !== filters.selectedSport.toLowerCase()) {
        return false
      }

      // Location filter
      if (filters.selectedLocation && !item.location.toLowerCase().includes(filters.selectedLocation.toLowerCase())) {
        return false
      }

      // Rating filter
      if (filters.selectedRating !== "all") {
        const minRating = parseFloat(filters.selectedRating)
        if (item.rating < minRating) {
          return false
        }
      }

      // Budget filter (for items with pricing)
      if (filters.selectedBudget && item.price) {
        const price = parseFloat(item.price.replace(/[$,]/g, ''))
        const [minBudget, maxBudget] = filters.selectedBudget
        if (price < minBudget || price > maxBudget) {
          return false
        }
      }

      return true
    })
  }

  const shouldShowSection = (sectionItems: TalentItem[]): boolean => {
    if (filters.searchMode === "search" && filters.searchQuery) {
      return sectionItems.length > 0
    }
    
    if (filters.activeTab !== "all") {
      return true
    }

    return true
  }

  return {
    allItems,
    upAndComingItems,
    brandAmbassadorItems,
    getLeaguesForSport,
    getItemsByFit,
    getFilteredItems,
    shouldShowSection,
    loading,
    error,
  }
}
