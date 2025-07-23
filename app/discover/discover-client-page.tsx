"use client"

import { DiscoverTemplate } from "@/components/templates/discover-template"
import { useDiscoverState } from "@/hooks/use-discover-state"
import { useDiscoverData } from "@/hooks/use-discover-data"
import { Session } from "next-auth"

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
  
  return (
    <DiscoverTemplate
      session={session}
      {...state}
      {...data}
    />
  )
}
