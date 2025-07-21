import { useMemo } from "react"

// Mock data - replace with your actual data
const mockTalents = [
  {
    id: 1,
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop",
    talentType: "Athlete",
    rating: 4.95,
    sport: "Tennis",
    location: "Los Angeles, CA",
    achievements: "Olympic Qualifier, US Open Semifinalist",
    category: "talent",
    currentFunding: 2500,
    goalFunding: 5000,
    experience: "professional",
    fit: ["trending", "top-talent"]
  },
  {
    id: 2,
    name: "Marcus Johnson",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    talentType: "Athlete",
    rating: 4.8,
    sport: "Basketball",
    location: "Chicago, IL",
    achievements: "NCAA Champion, Rising Star Award",
    category: "talent",
    currentFunding: 1800,
    goalFunding: 4000,
    experience: "semi-professional",
    fit: ["up-and-coming", "brand-ambassador"]
  },
  // Add more mock data...
]

const mockEvents = [
  {
    id: 101,
    name: "Summer Tennis Championship",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
    talentType: "Tournament",
    rating: 4.7,
    sport: "Tennis",
    location: "Miami, FL",
    achievements: "Professional Level Tournament",
    category: "event",
    price: "$50",
    period: "/ticket"
  }
]

const mockTeams = [
  {
    id: 201,
    name: "Lightning Bolts FC",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
    talentType: "Team",
    rating: 4.6,
    sport: "Soccer",
    location: "Seattle, WA",
    achievements: "Regional Champions",
    category: "team",
    currentFunding: 3200,
    goalFunding: 8000
  }
]

interface UseDiscoverDataProps {
  activeTab: string
  searchQuery: string
  aiQuery: string
  selectedTalentType: string
  selectedSport: string
  selectedLeague: string
  selectedExperience: string
  selectedRating: string
  selectedLocation: string
  selectedFit: string
}

export function useDiscoverData(filters: UseDiscoverDataProps) {
  const allItems = useMemo(() => {
    switch (filters.activeTab) {
      case "talents":
        return mockTalents
      case "events":
        return mockEvents
      case "teams":
        return mockTeams
      default:
        return mockTalents
    }
  }, [filters.activeTab])

  const filteredItems = useMemo(() => {
    let items = [...allItems]

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.sport.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.achievements.toLowerCase().includes(query)
      )
    }

    // Filter by talent type
    if (filters.selectedTalentType) {
      items = items.filter(item => 
        item.talentType.toLowerCase() === filters.selectedTalentType
      )
    }

    // Filter by sport
    if (filters.selectedSport) {
      items = items.filter(item => 
        item.sport.toLowerCase() === filters.selectedSport
      )
    }

    // Filter by experience
    if (filters.selectedExperience && "experience" in items[0]) {
      items = items.filter(item => 
        "experience" in item && item.experience === filters.selectedExperience
      )
    }

    // Filter by rating
    if (filters.selectedRating) {
      const minRating = parseFloat(filters.selectedRating)
      items = items.filter(item => item.rating >= minRating)
    }

    // Filter by location
    if (filters.selectedLocation) {
      items = items.filter(item => 
        item.location.toLowerCase().includes(filters.selectedLocation.toLowerCase())
      )
    }

    return items
  }, [allItems, filters])

  const getItemsByFit = (fit: string) => {
    return filteredItems.filter(item => 
      "fit" in item && Array.isArray(item.fit) && item.fit.includes(fit)
    )
  }

  const shouldShowSection = (section: string) => {
    if (filters.selectedFit && filters.selectedFit !== section) {
      return false
    }
    return getItemsByFit(section).length > 0
  }

  const getLeaguesForSport = (sport: string): string[] => {
    const leagues: Record<string, string[]> = {
      tennis: ["ATP", "WTA", "ITF"],
      basketball: ["NBA", "WNBA", "NCAA"],
      soccer: ["MLS", "Premier League", "La Liga"],
      swimming: ["USA Swimming", "FINA"],
    }
    return leagues[sport.toLowerCase()] || []
  }

  return {
    allItems,
    filteredItems,
    getItemsByFit,
    shouldShowSection,
    getLeaguesForSport,
  }
}
