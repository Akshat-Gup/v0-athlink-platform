"use client"

import { useState } from "react"

export function useDiscoverFilters() {
  const [activeTab, setActiveTab] = useState("talents")
  const [searchMode, setSearchMode] = useState<"filter" | "search" | "ai">("filter")
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [selectedTalentType, setSelectedTalentType] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedLeague, setSelectedLeague] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [selectedBudget, setSelectedBudget] = useState<[number, number] | undefined>()
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedFit, setSelectedFit] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])

  const clearFilters = () => {
    setSelectedTalentType("")
    setSelectedSport("")
    setSelectedLeague("")
    setSelectedExperience("")
    setSelectedRating("")
    setSelectedBudget(undefined)
    setSelectedLocation("")
    setSelectedFit("")
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

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

  const hasActiveFilters = Boolean(
    selectedTalentType ||
    selectedSport ||
    selectedLeague ||
    selectedExperience ||
    selectedRating ||
    selectedBudget ||
    selectedLocation ||
    selectedFit ||
    searchQuery ||
    aiQuery
  )

  return {
    // State
    activeTab,
    searchMode,
    searchQuery,
    aiQuery,
    selectedTalentType,
    selectedSport,
    selectedLeague,
    selectedExperience,
    selectedRating,
    selectedBudget,
    selectedLocation,
    selectedFit,
    favorites,
    
    // Setters
    setActiveTab,
    setSearchMode,
    setSearchQuery,
    setAiQuery,
    setSelectedTalentType,
    setSelectedSport,
    setSelectedLeague,
    setSelectedExperience,
    setSelectedRating,
    setSelectedBudget,
    setSelectedLocation,
    setSelectedFit,
    setFavorites,
    
    // Computed
    hasActiveFilters,
    clearFilters,
    toggleFavorite,
    getLeaguesForSport,
  }
}
