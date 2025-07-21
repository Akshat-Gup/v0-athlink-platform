"use client"

import { useMemo } from "react"

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
  startDate?: Date
  endDate?: Date
}

export function useDiscoverData(filters: UseDiscoverDataProps) {
  // Sample data (this would normally come from an API)
  const allItems: TalentItem[] = useMemo(() => [
    // Talents
    {
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
    },
    {
      id: 2,
      name: "Marcus Johnson",
      sport: "Basketball",
      location: "Chicago, IL",
      rating: 4.87,
      currentFunding: 3200,
      goalFunding: 8000,
      image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=300&fit=crop",
      achievements: "NCAA Champion",
      category: "talent",
      talentType: "Athlete",
      fit: "top-talent",
      tags: ["College", "NCAA", "Basketball"],
      keywords: ["basketball", "ncaa", "champion", "chicago"],
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      sport: "Soccer",
      location: "Austin, TX",
      rating: 4.94,
      currentFunding: 2800,
      goalFunding: 6000,
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
      achievements: "MLS Rising Star",
      category: "talent",
      talentType: "Athlete",
      fit: "up-and-coming",
      tags: ["Semi-Professional", "Rising Star", "Soccer"],
      keywords: ["soccer", "mls", "rising star", "austin"],
    },
    {
      id: 9,
      name: "Emma Wilson",
      sport: "Swimming",
      location: "Miami, FL",
      rating: 4.91,
      currentFunding: 1800,
      goalFunding: 4500,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      achievements: "State Champion",
      category: "talent",
      talentType: "Athlete",
      fit: "up-and-coming",
      tags: ["Amateur", "State Level", "Swimming"],
      keywords: ["swimming", "state", "champion", "miami"],
    },
    {
      id: 10,
      name: "Jake Thompson",
      sport: "Track & Field",
      location: "Portland, OR",
      rating: 4.88,
      currentFunding: 3500,
      goalFunding: 7000,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      achievements: "National Qualifier",
      category: "talent",
      talentType: "Athlete",
      fit: "top-talent",
      tags: ["Professional", "National Level", "Track & Field"],
      keywords: ["track", "field", "national", "portland"],
    },
    {
      id: 11,
      name: "Sofia Martinez",
      sport: "Gymnastics",
      location: "Denver, CO",
      rating: 4.96,
      currentFunding: 4200,
      goalFunding: 8500,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      achievements: "World Championship Qualifier",
      category: "talent",
      talentType: "Athlete",
      fit: "top-talent",
      tags: ["Elite", "World Level", "Gymnastics"],
      keywords: ["gymnastics", "world", "championship", "denver"],
    },
    {
      id: 16,
      name: "Maya Patel",
      sport: "Content Creation",
      location: "San Francisco, CA",
      rating: 4.89,
      currentFunding: 1500,
      goalFunding: 3000,
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c1c2?w=400&h=300&fit=crop",
      achievements: "100K Followers",
      category: "talent",
      talentType: "Content Creator",
      fit: "brand-ambassador",
      tags: ["Influencer", "Social Media", "Content"],
      keywords: ["content", "creator", "social media", "san francisco"],
    },
    {
      id: 17,
      name: "David Kim",
      sport: "Photography",
      location: "New York, NY",
      rating: 4.92,
      currentFunding: 2200,
      goalFunding: 4000,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      achievements: "Award-Winning Photographer",
      category: "talent",
      talentType: "Creative Professional",
      fit: "brand-ambassador",
      tags: ["Creative", "Award Winner", "Photography"],
      keywords: ["photography", "art", "visual", "new york"],
    },
    // Teams
    {
      id: 3,
      name: "Elite Runners Club",
      sport: "Track & Field",
      location: "New York, NY",
      rating: 4.92,
      price: "$5,000",
      period: "per event",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      achievements: "Team of 12 Athletes",
      category: "team",
      talentType: "Athletic Team",
      fit: "top-talent",
      tags: ["Team", "Professional", "Track & Field"],
      keywords: ["running", "track", "team", "new york"],
    },
    {
      id: 6,
      name: "Cycling Team Pro",
      sport: "Cycling",
      location: "Denver, CO",
      rating: 4.91,
      currentFunding: 4200,
      goalFunding: 10000,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      achievements: "Tour de France Qualifiers",
      category: "team",
      talentType: "Professional Team",
      fit: "top-talent",
      tags: ["Team", "Elite", "Cycling"],
      keywords: ["cycling", "tour de france", "team", "denver"],
    },
    // Events
    {
      id: 4,
      name: "Swimming Championships",
      sport: "Swimming",
      location: "Miami, FL",
      rating: 4.88,
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop",
      achievements: "National Event",
      category: "event",
      talentType: "Championship Event",
      fit: "top-talent",
      tags: ["Event", "National", "Swimming"],
      keywords: ["swimming", "championships", "national", "miami"],
      price: "$8,500",
      period: "per event",
    },
  ], [])

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
      // Filter by category (talents, teams, events)
      const categoryMatch = filters.activeTab === "talents" 
        ? item.category === "talent"
        : filters.activeTab === "teams"
        ? item.category === "team" 
        : item.category === "event"

      if (!categoryMatch) return false

      // Filter by fit
      if (item.fit !== fit) return false

      // Apply other filters
      if (filters.selectedTalentType && 
          item.talentType.toLowerCase().replace(/\s+/g, "-") !== filters.selectedTalentType) {
        return false
      }

      if (filters.selectedSport && 
          item.sport.toLowerCase().replace(/\s+/g, "-") !== filters.selectedSport) {
        return false
      }

      if (filters.selectedRating) {
        const minRating = parseFloat(filters.selectedRating.replace("+", ""))
        if (item.rating < minRating) return false
      }

      // Search query filter
      if (filters.searchQuery && filters.searchMode === "search") {
        const query = filters.searchQuery.toLowerCase()
        const searchFields = [
          item.name.toLowerCase(),
          item.sport.toLowerCase(),
          item.location.toLowerCase(),
          item.achievements.toLowerCase(),
          ...item.keywords,
          ...item.tags.map(tag => tag.toLowerCase())
        ]
        
        if (!searchFields.some(field => field.includes(query))) {
          return false
        }
      }

      return true
    })
  }

  const shouldShowSection = (fit: string): boolean => {
    return getItemsByFit(fit).length > 0
  }

  return {
    allItems,
    upAndComingItems,
    brandAmbassadorItems,
    getLeaguesForSport,
    getItemsByFit,
    shouldShowSection,
  }
}
