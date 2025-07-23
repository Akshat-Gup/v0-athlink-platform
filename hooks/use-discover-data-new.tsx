"use client"

import { useMemo, useEffect, useState } from "react"
import { getDiscoverData, DiscoverItem } from "@/lib/services/discover-service"

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
    topTalentItems: DiscoverItem[]
    upAndComingItems: DiscoverItem[]
    brandAmbassadorItems: DiscoverItem[]
    teamItems: DiscoverItem[]
    eventItems: DiscoverItem[]
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
        const result = await getDiscoverData(filters)
        setData(result)
      } catch (err) {
        console.error('Error fetching discover data:', err)
        setError('Failed to fetch data')
        // Fallback to empty arrays
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

  // Helper function for sport leagues (kept for compatibility)
  const getSportLeagues = (sport: string) => {
    const leagues: { [key: string]: string[] } = {
      basketball: ["NBA", "NCAA", "G League", "WNBA", "International"],
      soccer: ["MLS", "Premier League", "La Liga", "Bundesliga", "Serie A", "College"],
      tennis: ["ATP", "WTA", "ITF", "College", "Junior"],
      swimming: ["USA Swimming", "NCAA", "Olympic Trials", "Masters"],
      "track & field": ["USATF", "NCAA", "Diamond League", "Olympic Trials"],
      gymnastics: ["USA Gymnastics", "NCAA", "Elite", "Junior Olympic"],
      boxing: ["WBC", "WBA", "IBF", "WBO", "Amateur"],
      cycling: ["UCI", "USA Cycling", "Tour de France"],
    }
    return leagues[sport] || []
  }

  return {
    topTalentItems,
    upAndComingItems,
    brandAmbassadorItems,
    teamItems,
    eventItems,
    getSportLeagues,
    loading,
    error,
  }
}
