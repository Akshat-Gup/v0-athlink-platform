"use client"

import { DiscoverTemplate } from "@/components/templates/discover-template"
import { useDiscoverState } from "@/hooks/use-discover-state"
import { useDiscoverData } from "@/hooks/use-discover-data"
import { Session } from "@supabase/supabase-js"

interface DiscoverClientPageProps {
  session: Session | null
}

export function DiscoverClientPage({ session }: DiscoverClientPageProps) {
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

  // Convert the new favorites system to the format expected by the template
  const favoritesArray = data.allItems.filter(item => data.isFavorited(item.id)).map(item => item.id)
  
  const handleToggleFavorite = async (id: number, e?: React.MouseEvent): Promise<void> => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    await data.toggleFavorite(id)
  }
  
  return (
    <DiscoverTemplate
      session={session}
      {...state}
      {...data}
      favorites={favoritesArray}
      toggleFavorite={handleToggleFavorite}
    />
  )
}
