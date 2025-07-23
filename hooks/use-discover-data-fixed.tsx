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
  console.log('Hook: useDiscoverData called with filters:', filters)
  
  // Return mock data temporarily to test if the component can display data
  const mockData = {
    topTalentItems: [{
      id: 1,
      name: "Sarah Chen",
      sport: "Tennis",
      location: "Los Angeles, CA",
      rating: 4.95,
      currentFunding: 2500,
      goalFunding: 5000,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      achievements: "Olympic Qualifier",
      category: "talent",
      talentType: "Athlete",
      fit: "top-talent",
      tags: ["Professional", "Olympic Level", "Tennis"],
      keywords: ["tennis", "olympic", "professional", "los angeles"],
    }] as TalentItem[],
    upAndComingItems: [] as TalentItem[],
    brandAmbassadorItems: [] as TalentItem[],
    teamItems: [] as TalentItem[],
    eventItems: [] as TalentItem[],
  }

  console.log('Hook: Returning mock data:', mockData)

  // Mock functions for testing
  const getItemsByFit = (fit: string) => {
    if (fit === 'top-talent') return mockData.topTalentItems
    return []
  }
  
  const shouldShowSection = (fit: string) => getItemsByFit(fit).length > 0
  const getFilteredItems = () => mockData.topTalentItems
  const getLeaguesForSport = (sport: string) => ["ATP", "WTA", "ITF"]
  const toggleFavorite = (id: number) => console.log('Toggle favorite:', id)
  const getSportLeagues = (sport: string) => ["ATP", "WTA", "ITF"]

  return {
    allItems: mockData.topTalentItems,
    topTalentItems: mockData.topTalentItems,
    upAndComingItems: mockData.upAndComingItems,
    brandAmbassadorItems: mockData.brandAmbassadorItems,
    teamItems: mockData.teamItems,
    eventItems: mockData.eventItems,
    getItemsByFit,
    shouldShowSection,
    getFilteredItems,
    getLeaguesForSport,
    toggleFavorite,
    getSportLeagues,
    loading: false,
    error: null,
  }
}
