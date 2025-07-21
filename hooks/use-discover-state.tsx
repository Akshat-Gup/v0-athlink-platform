"use client"

import { useState, useEffect } from "react"

export function useDiscoverState() {
  const [activeTab, setActiveTab] = useState("talents")
  const [searchMode, setSearchMode] = useState<"filter" | "search" | "ai">("filter")
  const [showFavorites, setShowFavorites] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showSearchOverlay, setShowSearchOverlay] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Search/Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [selectedTalentType, setSelectedTalentType] = useState("")
  const [selectedFit, setSelectedFit] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedLeague, setSelectedLeague] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")
  const [selectedBudget, setSelectedBudget] = useState<[number, number] | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState("United States")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedRating, setSelectedRating] = useState("")

  // Scroll detection
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const searchBar = document.querySelector("[data-search-bar]")
          if (searchBar) {
            const rect = searchBar.getBoundingClientRect()
            setIsScrolled(rect.bottom <= -10)
          } else {
            const searchBarHeight = 200
            setIsScrolled(window.scrollY > searchBarHeight)
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Reset filters when switching tabs
  useEffect(() => {
    setSearchQuery("")
    setAiQuery("")
    setSelectedTalentType("")
    setSelectedFit("")
    setSelectedSport("")
    setSelectedLeague("")
    setSelectedExperience("")
    setSelectedBudget(undefined)
    setSelectedLocation("United States")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedRating("")
  }, [activeTab])

  // Toggle favorite function
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Search mode state
    searchMode,
    setSearchMode,
    
    // Modal/overlay state
    showFavorites,
    setShowFavorites,
    showJoinModal,
    setShowJoinModal,
    showSearchOverlay,
    setShowSearchOverlay,
    
    // User interaction state
    favorites,
    isScrolled,
    
    // Search/filter state
    searchQuery,
    setSearchQuery,
    aiQuery,
    setAiQuery,
    selectedTalentType,
    setSelectedTalentType,
    selectedFit,
    setSelectedFit,
    selectedSport,
    setSelectedSport,
    selectedLeague,
    setSelectedLeague,
    selectedExperience,
    setSelectedExperience,
    selectedBudget,
    setSelectedBudget,
    selectedLocation,
    setSelectedLocation,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedRating,
    setSelectedRating,
    
    // Functions
    toggleFavorite,
  }
}
