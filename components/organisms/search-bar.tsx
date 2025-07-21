import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/select"
import { BudgetSlider } from "@/components/molecules/button-slider"
import { LocationFilter } from "@/components/molecules/location-filter"
import { Filter, Search, Sparkles, Target, Award, Star } from "lucide-react"

interface SearchBarProps {
  searchMode: "filter" | "search" | "ai"
  onSearchModeChange: (mode: "filter" | "search" | "ai") => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  aiQuery: string
  onAiQueryChange: (query: string) => void
  
  // Filter props
  selectedTalentType: string
  selectedSport: string
  selectedLeague: string
  selectedExperience: string
  selectedRating: string
  selectedBudget: [number, number] | undefined
  selectedLocation: string
  
  // Filter handlers
  onTalentTypeChange: (type: string) => void
  onSportChange: (sport: string) => void
  onLeagueChange: (league: string) => void
  onExperienceChange: (experience: string) => void
  onRatingChange: (rating: string) => void
  onBudgetChange: (budget: [number, number] | undefined) => void
  onLocationChange: (location: string) => void
  
  activeTab: string
  getLeaguesForSport: (sport: string) => string[]
  isOverlay?: boolean
  onClose?: () => void
}

export function SearchBar({
  searchMode,
  onSearchModeChange,
  searchQuery,
  onSearchQueryChange,
  aiQuery,
  onAiQueryChange,
  selectedTalentType,
  selectedSport,
  selectedLeague,
  selectedExperience,
  selectedRating,
  selectedBudget,
  selectedLocation,
  onTalentTypeChange,
  onSportChange,
  onLeagueChange,
  onExperienceChange,
  onRatingChange,
  onBudgetChange,
  onLocationChange,
  activeTab,
  getLeaguesForSport,
  isOverlay = false,
  onClose
}: SearchBarProps) {
  return (
    <div className="flex-1 max-w-4xl relative">
      <div className="flex bg-white border-2 border-gray-300 rounded-full shadow-lg h-16 md:h-16 sm:h-12 items-center">
        {searchMode === "ai" ? (
          <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
            <Input
              placeholder="Find with AI"
              value={aiQuery}
              onChange={(e) => onAiQueryChange(e.target.value)}
              className="border-0 p-0 text-sm placeholder-gray-500 focus-visible:ring-0 h-auto"
            />
          </div>
        ) : searchMode === "search" ? (
          <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
            <Input
              placeholder="Search by keyword"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="border-0 p-0 text-sm placeholder-gray-500 focus-visible:ring-0 h-auto"
            />
          </div>
        ) : (
          <>
            <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
              <Select value={selectedTalentType} onValueChange={onTalentTypeChange}>
                <SelectTrigger className="border-0 p-0 h-auto text-sm w-auto min-w-0 focus:ring-0">
                  <SelectValue placeholder="What are you looking for?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="athlete">Athletes</SelectItem>
                  <SelectItem value="content-creator">Content Creators</SelectItem>
                  <SelectItem value="influencer">Influencers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            {activeTab !== "events" && (
              <>
                <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
                  <Select value={selectedSport} onValueChange={onSportChange}>
                    <SelectTrigger className="border-0 p-0 h-auto text-sm w-auto min-w-0 focus:ring-0">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
              </>
            )}
            <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
              <LocationFilter value={selectedLocation} onChange={onLocationChange} />
            </div>
          </>
        )}
        
        <div className="px-2 py-2 flex items-center h-16 md:h-16 sm:h-12">
          <div className="hidden md:block bg-gray-100 rounded-full p-1 flex relative">
            <div
              className={`absolute top-1 bottom-1 bg-green-500 rounded-full transition-all duration-300 ease-in-out shadow-lg shadow-green-500/25 animate-shimmer ${
                searchMode === "filter"
                  ? "left-1 w-[calc(33.333%-0.125rem)]"
                  : searchMode === "search"
                    ? "left-[calc(33.333%+0.125rem)] w-[calc(33.333%-0.25rem)]"
                    : "left-[calc(66.666%+0.125rem)] w-[calc(33.333%-0.125rem)]"
              }`}
            />
            <Button
              size="sm"
              onClick={() => onSearchModeChange("filter")}
              className={`relative z-10 rounded-full px-3 h-10 transition-all duration-300 bg-transparent hover:bg-transparent ${
                searchMode === "filter" ? "text-white" : "text-gray-600"
              }`}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onSearchModeChange("search")}
              className={`relative z-10 rounded-full px-3 h-10 transition-all duration-300 bg-transparent hover:bg-transparent ${
                searchMode === "search" ? "text-white" : "text-gray-600"
              }`}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onSearchModeChange("ai")}
              className={`relative z-10 rounded-full px-3 h-10 transition-all duration-300 bg-transparent hover:bg-transparent ${
                searchMode === "ai" ? "text-white" : "text-gray-600"
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          {isOverlay && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="rounded-full h-10 w-10 ml-2 bg-gray-100 hover:bg-gray-200"
            >
              ×
            </Button>
          )}
        </div>
      </div>

      {/* Filter Buttons Below Search Bar */}
      <div className="flex items-center justify-center space-x-3 mt-4 flex-wrap gap-y-2 max-w-5xl mx-auto">
        {selectedTalentType === "athlete" && (
          <Select value={selectedSport} onValueChange={onSportChange}>
            <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 gap-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-600" />
                <SelectValue placeholder="Sport" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="soccer">Soccer</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Select value={selectedExperience} onValueChange={onExperienceChange}>
          <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 gap-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-600" />
              <SelectValue placeholder="Experience Level" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="semi-professional">Semi-Professional</SelectItem>
            <SelectItem value="amateur">Amateur</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRating} onValueChange={onRatingChange}>
          <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 gap-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-600" />
              <SelectValue placeholder="Rating" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
          </SelectContent>
        </Select>

        <BudgetSlider min={0} max={100000} step={1000} onChange={onBudgetChange} />
        <LocationFilter value={selectedLocation} onChange={onLocationChange} />
      </div>
    </div>
  )
}
