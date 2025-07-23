"use client"

import { DiscoverTemplate } from "@/components/templates/discover-template"
import { useDiscoverState } from "@/hooks/use-discover-state"
import { useDiscoverData } from "@/hooks/use-discover-data"

export default function DiscoverPage() {
  const state = useDiscoverState()
  const data = useDiscoverData({
    activeTab: state.activeTab,
    searchMode: state.searchMode,
    searchQuery: state.searchQuery,
    aiQuery: state.aiQuery,
    selectedTalentType: state.selectedTalentType,
    selectedFit: state.selectedFit,
    selectedSport: state.selectedSport,
    selectedLeague: state.selectedLeague,
    selectedExperience: state.selectedExperience,
    selectedRating: state.selectedRating,
    selectedBudget: state.selectedBudget,
    selectedLocation: state.selectedLocation,
    startDate: state.startDate,
    endDate: state.endDate,
  })

  // Show loading state
  if (data.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading discover data...</div>
      </div>
    )
  }

  // Show error state
  if (data.error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">Error: {data.error}</div>
      </div>
    )
  }
  
  return (
    <DiscoverTemplate
      {...state}
      {...data}
    />
  )
}
