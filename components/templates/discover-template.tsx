import React from "react"
import Link from "next/link"
import { Button } from "@/components/atoms/button"
import { DiscoverHeader } from "@/components/organisms/discover/discover-header"
import { DiscoverSearchBar } from "@/components/organisms/discover/discover-search-bar"
import { TalentGrid } from "@/components/organisms/discover/talent-grid"
import { TalentItem } from "@/hooks/use-discover-data"
import { Session } from "next-auth"

interface DiscoverTemplateProps {
  // Auth
  session: Session | null
  
  // State props
  activeTab: string
  setActiveTab: (tab: string) => void
  searchMode: "filter" | "search" | "ai"
  setSearchMode: (mode: "filter" | "search" | "ai") => void
  showFavorites: boolean
  setShowFavorites: (show: boolean) => void
  showJoinModal: boolean
  setShowJoinModal: (show: boolean) => void
  showSearchOverlay: boolean
  setShowSearchOverlay: (show: boolean) => void
  favorites: number[]
  setFavorites: (favorites: number[]) => void
  isScrolled: boolean
  
  // Search/Filter props
  searchQuery: string
  setSearchQuery: (query: string) => void
  aiQuery: string
  setAiQuery: (query: string) => void
  selectedTalentType: string
  setSelectedTalentType: (type: string) => void
  selectedFit: string
  setSelectedFit: (fit: string) => void
  selectedSport: string
  setSelectedSport: (sport: string) => void
  selectedLeague: string
  setSelectedLeague: (league: string) => void
  selectedExperience: string
  setSelectedExperience: (experience: string) => void
  selectedRating: string
  setSelectedRating: (rating: string) => void
  selectedBudget: [number, number] | undefined
  setSelectedBudget: (budget: [number, number] | undefined) => void
  selectedLocation: string
  setSelectedLocation: (location: string) => void
  startDate?: Date
  setStartDate: (date: Date | undefined) => void
  endDate?: Date
  setEndDate: (date: Date | undefined) => void
  
  // Data props
  allItems: TalentItem[]
  upAndComingItems: TalentItem[]
  brandAmbassadorItems: TalentItem[]
  
  // Functions
  toggleFavorite: (id: number, e?: React.MouseEvent) => Promise<void>
  getLeaguesForSport: (sport: string) => string[]
  getItemsByFit: (fit: string) => TalentItem[]
  getFilteredItems: () => TalentItem[]
  shouldShowSection: (fit: string) => boolean
}

export function DiscoverTemplate(props: DiscoverTemplateProps) {
  const {
    session,
    activeTab,
    setActiveTab,
    searchMode,
    setSearchMode,
    showFavorites,
    setShowFavorites,
    showJoinModal,
    setShowJoinModal,
    showSearchOverlay,
    setShowSearchOverlay,
    favorites,
    setFavorites,
    isScrolled,
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
    selectedRating,
    setSelectedRating,
    selectedBudget,
    setSelectedBudget,
    selectedLocation,
    setSelectedLocation,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    allItems,
    upAndComingItems,
    brandAmbassadorItems,
    toggleFavorite,
    getLeaguesForSport,
    getItemsByFit,
    getFilteredItems,
    shouldShowSection,
  } = props

  const tabs = [
    { id: "talents", label: "Talents" },
    { id: "teams", label: "Teams" },
    { id: "events", label: "Events" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <DiscoverHeader
        session={session}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        showJoinModal={showJoinModal}
        setShowJoinModal={setShowJoinModal}
        showSearchOverlay={showSearchOverlay}
        setShowSearchOverlay={setShowSearchOverlay}
        favorites={favorites}
        setFavorites={setFavorites}
        toggleFavorite={toggleFavorite}
        allItems={allItems}
        isScrolled={isScrolled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Search Bar */}
      <div className="pt-24 pb-6 bg-white border-b border-gray-200" data-search-bar>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center">
            {/* Main Search Bar */}
            <div className="flex-1 max-w-4xl relative">
              <DiscoverSearchBar
                searchMode={searchMode}
                setSearchMode={setSearchMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                aiQuery={aiQuery}
                setAiQuery={setAiQuery}
                selectedTalentType={selectedTalentType}
                setSelectedTalentType={setSelectedTalentType}
                selectedFit={selectedFit}
                setSelectedFit={setSelectedFit}
                selectedSport={selectedSport}
                setSelectedSport={setSelectedSport}
                selectedLeague={selectedLeague}
                setSelectedLeague={setSelectedLeague}
                selectedExperience={selectedExperience}
                setSelectedExperience={setSelectedExperience}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                activeTab={activeTab}
                getLeaguesForSport={getLeaguesForSport}
                selectedBudget={selectedBudget}
                setSelectedBudget={setSelectedBudget}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {showSearchOverlay && isScrolled && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6 pt-24">
            <div className="flex items-center justify-center">
              {/* Main Search Bar */}
              <div className="flex-1 max-w-4xl relative">
                <DiscoverSearchBar
                  searchMode={searchMode}
                  setSearchMode={setSearchMode}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  aiQuery={aiQuery}
                  setAiQuery={setAiQuery}
                  selectedTalentType={selectedTalentType}
                  setSelectedTalentType={setSelectedTalentType}
                  selectedFit={selectedFit}
                  setSelectedFit={setSelectedFit}
                  selectedSport={selectedSport}
                  setSelectedSport={setSelectedSport}
                  selectedLeague={selectedLeague}
                  setSelectedLeague={setSelectedLeague}
                  selectedExperience={selectedExperience}
                  setSelectedExperience={setSelectedExperience}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  activeTab={activeTab}
                  getLeaguesForSport={getLeaguesForSport}
                  selectedBudget={selectedBudget}
                  setSelectedBudget={setSelectedBudget}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Check if any specific filters are applied */}
        {(searchQuery || aiQuery || selectedFit || selectedTalentType || selectedSport || selectedLeague || selectedExperience || selectedRating || selectedBudget || selectedLocation) ? (
          /* Filtered Results Section */
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {searchMode === "search" && searchQuery ? `Search Results for "${searchQuery}"` :
                 searchMode === "ai" && aiQuery ? `AI Search Results` :
                 "Filtered Results"}
              </h2>
            </div>
            <TalentGrid
              items={getFilteredItems()}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              selectedTalentType={selectedTalentType}
              onTalentTypeClick={setSelectedTalentType}
            />
          </section>
        ) : (
          /* Default Browse Sections */
          <>
            {/* Trending Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-semibold text-gray-900">Trending</h2>
                  {/* <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                    HOT
                  </span> */}
                </div>
                <Link href={`/discover/${activeTab}`}>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Show all
                  </Button>
                </Link>
              </div>
              <TalentGrid
                items={(() => {
                  // Get items from all fit categories and respect filters
                  const topTalentItems = getItemsByFit("top-talent");
                  const upAndComingItems = getItemsByFit("up-and-coming");
                  const brandAmbassadorItems = getItemsByFit("brand-ambassador");
                  
                  // Combine and sort by rating for trending
                  const allFitItems = [
                    ...topTalentItems,
                    ...upAndComingItems,
                    ...brandAmbassadorItems
                  ];
                  
                  // Sort by rating and take top 12 for trending
                  return allFitItems
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 12);
                })()}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                selectedTalentType={selectedTalentType}
                onTalentTypeClick={setSelectedTalentType}
              />
            </section>

            {/* Top Talent Section */}
            {shouldShowSection("top-talent") && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Top Talent</h2>
                  <Link href={`/discover/${activeTab}`}>
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Show all
                    </Button>
                  </Link>
                </div>
                <TalentGrid
                  items={(() => {
                    const items = getItemsByFit("top-talent").slice(0, 12)
                    return items
                  })()}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  selectedTalentType={selectedTalentType}
                  onTalentTypeClick={setSelectedTalentType}
                />
              </section>
            )}

            {/* Up and Coming Section */}
            {shouldShowSection("up-and-coming") && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Up and Coming</h2>
                  <Link href={`/discover/${activeTab}`}>
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Show all
                    </Button>
                  </Link>
                </div>
                <TalentGrid
                  items={getItemsByFit("up-and-coming").slice(0, 12)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  selectedTalentType={selectedTalentType}
                  onTalentTypeClick={setSelectedTalentType}
                />
              </section>
            )}

            {/* Brand Ambassador Section */}
            {shouldShowSection("brand-ambassador") && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Brand Ambassadors</h2>
                  <Link href={`/discover/${activeTab}`}>
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Show all
                    </Button>
                  </Link>
                </div>
                <TalentGrid
                  items={getItemsByFit("brand-ambassador").slice(0, 12)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  selectedTalentType={selectedTalentType}
                  onTalentTypeClick={setSelectedTalentType}
                />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
