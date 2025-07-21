"use client"

import React from "react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/popover"
import { SimpleCalendar } from "@/components/organisms/simple-calendar"
import { BudgetSlider } from "@/components/molecules/button-slider"
import { LocationFilter } from "@/components/molecules/location-filter"
import { Filter, Search, Sparkles, Target, Trophy, Award, Star, X } from "lucide-react"
import { format } from "date-fns"
import { se } from "date-fns/locale"

interface DiscoverSearchBarProps {
  searchMode: "filter" | "search" | "ai"
  setSearchMode: (mode: "filter" | "search" | "ai") => void
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
  activeTab: string
  getLeaguesForSport: (sport: string) => string[]
}

export function DiscoverSearchBar({
  searchMode,
  setSearchMode,
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
  activeTab,
  getLeaguesForSport,
}: DiscoverSearchBarProps) {
  return (
    <div className="pt-0 pb-0 bg-white" data-search-bar>
        <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center">
          {/* Main Search Bar */}
          <div className="flex-1 max-w-4xl relative">
            <div className="flex bg-white border-2 border-gray-300 rounded-full shadow-lg h-16 md:h-16 sm:h-12 items-center">
              {searchMode === "ai" ? (
                <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
                  <Input
                    placeholder="Find with AI"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="border-0 p-0 text-sm placeholder-gray-500 focus-visible:ring-0 h-auto"
                  />
                </div>
              ) : searchMode === "search" ? (
                <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
                  <Input
                    placeholder="Search by keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 p-0 text-sm placeholder-gray-500 focus-visible:ring-0 h-auto"
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
                    <div className="w-full">
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        <span className="hidden md:inline">
                          {activeTab === "events"
                            ? "Type of Event"
                            : activeTab === "teams"
                              ? "Type of Team"
                              : "Type of Talent"}
                        </span>
                        <span className="md:hidden">Type</span>
                      </div>
                      <Select
                        value={selectedTalentType}
                        onValueChange={(value) =>
                          value === "__clear__" ? setSelectedTalentType("") : setSelectedTalentType(value)
                        }
                      >
                        <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-left gap-2">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedTalentType && (
                            <SelectItem
                              value="__clear__"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Clear selection
                            </SelectItem>
                          )}
                          {activeTab === "events" ? (
                            <>
                              <SelectItem value="athlete">Athlete-focused</SelectItem>
                              <SelectItem value="content-creator">Content Creator-focused</SelectItem>
                              <SelectItem value="creative-professional">Creative Professional-focused</SelectItem>
                            </>
                          ) : activeTab === "teams" ? (
                            <>
                              <SelectItem value="athlete">Athletes</SelectItem>
                              <SelectItem value="content-creator">Content Creators</SelectItem>
                              <SelectItem value="creative-professional">Creative Professionals</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="athlete">Athlete</SelectItem>
                              <SelectItem value="content-creator">Content Creator</SelectItem>
                              <SelectItem value="creative-professional">Creative Professional</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  {activeTab !== "events" && (
                    <>
                      <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
                        <div className="w-full">
                          <div className="text-xs font-semibold text-gray-500 mb-1">Fit</div>
                          <Select
                            value={selectedFit}
                            onValueChange={(value) =>
                              value === "__clear__" ? setSelectedFit("") : setSelectedFit(value)
                            }
                          >
                            <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-left gap-2">
                              <SelectValue placeholder="Select fit" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedFit && (
                                <SelectItem
                                  value="__clear__"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  Clear selection
                                </SelectItem>
                              )}
                              <SelectItem value="top-talent">Top Talent</SelectItem>
                              <SelectItem value="up-and-coming">Up and Coming</SelectItem>
                              <SelectItem value="brand-ambassador">Brand Ambassador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                    </>
                  )}
                  <div className="flex-1 px-6 py-4 h-16 md:h-16 sm:h-12 sm:px-4 sm:py-2 flex items-center">
                    <div className="w-full">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Duration</div>
                      <div className="flex items-center space-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-0 h-auto text-sm text-gray-500 hover:bg-transparent text-left"
                            >
                              {startDate ? format(startDate, "MMM dd") : "Start"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <SimpleCalendar selected={startDate} onSelect={setStartDate} />
                          </PopoverContent>
                        </Popover>
                        <span className="text-gray-400">-</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-0 h-auto text-sm text-gray-500 hover:bg-transparent text-left"
                            >
                              {endDate ? format(endDate, "MMM dd") : "End"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <SimpleCalendar selected={endDate} onSelect={setEndDate} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="px-2 py-2 flex items-center h-16 md:h-16 sm:h-12">
                {/* Desktop: Full toggle buttons */}
                <div className="hidden md:block bg-gray-100 rounded-full p-1 flex relative">
                  {/* Sliding shimmering background */}
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
                    onClick={() => setSearchMode("filter")}
                    className={`relative z-10 rounded-full px-3 h-10 transition-all duration-300 bg-transparent hover:bg-transparent ${
                      searchMode === "filter" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSearchMode("search")}
                    className={`relative z-10 rounded-full px-3 h-10 transition-all duration-300 bg-transparent hover:bg-transparent ${
                      searchMode === "search" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSearchMode("ai")}
                    className={`relative z-10 rounded-full px-3 h-10 transition-all duration-300 bg-transparent hover:bg-transparent ${
                      searchMode === "ai" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile: Single toggle button */}
                <div className="md:hidden">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (searchMode === "filter") {
                        setSearchMode("search")
                      } else if (searchMode === "search") {
                        setSearchMode("ai")
                      } else {
                        setSearchMode("filter")
                      }
                    }}
                    className="relative rounded-full px-3 h-10 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 animate-shimmer"
                  >
                    {searchMode === "filter" && <Filter className="h-4 w-4" />}
                    {searchMode === "search" && <Search className="h-4 w-4" />}
                    {searchMode === "ai" && <Sparkles className="h-4 w-4" />}
                  </Button>
                </div>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      // Reset all filters
                      setSearchQuery("")
                      setAiQuery("")
                      setSelectedTalentType("")
                      setSelectedFit("")
                      setSelectedSport("")
                      setSelectedLeague("")
                      setSelectedExperience("")
                      setSelectedRating("")
                      setSelectedBudget(undefined)
                      setSelectedLocation("")
                      setStartDate(undefined)
                      setEndDate(undefined)
                    }}
                    className="rounded-full h-10 w-10 ml-2 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center"
                >
                    <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Buttons Below Search Bar */}
            <div className="flex items-center justify-center space-x-3 mt-4 flex-wrap gap-y-2 max-w-5xl mx-auto">
              {selectedTalentType === "athlete" && (
                <Select
                  value={selectedSport}
                  onValueChange={(value) => {
                    if (value === "__clear__") {
                      setSelectedSport("")
                      setSelectedLeague("")
                    } else {
                      setSelectedSport(value)
                      setSelectedLeague("") // Reset league when sport changes
                    }
                  }}
                >
                  <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 gap-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-600" />
                      <SelectValue placeholder="Sport" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSport && (
                      <SelectItem value="__clear__" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Clear selection
                      </SelectItem>
                    )}
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="track-field">Track & Field</SelectItem>
                    <SelectItem value="gymnastics">Gymnastics</SelectItem>
                    <SelectItem value="boxing">Boxing</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {selectedTalentType === "athlete" &&
                selectedSport &&
                getLeaguesForSport(selectedSport).length > 0 && (
                  <Select
                    value={selectedLeague}
                    onValueChange={(value) =>
                      value === "__clear__" ? setSelectedLeague("") : setSelectedLeague(value)
                    }
                  >
                    <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 gap-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-600" />
                        <SelectValue placeholder="League" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {selectedLeague && (
                        <SelectItem value="__clear__" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Clear selection
                        </SelectItem>
                      )}
                      {getLeaguesForSport(selectedSport).map((league) => (
                        <SelectItem key={league} value={league.toLowerCase().replace(/\s+/g, "-")}>
                          {league}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              <Select
                value={selectedExperience}
                onValueChange={(value) =>
                  value === "__clear__" ? setSelectedExperience("") : setSelectedExperience(value)
                }
              >
                <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-600" />
                    <SelectValue placeholder="Experience Level" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {selectedExperience && (
                    <SelectItem value="__clear__" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Clear selection
                    </SelectItem>
                  )}
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="semi-professional">Semi-Professional</SelectItem>
                  <SelectItem value="amateur">Amateur</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedRating}
                onValueChange={(value) =>
                  value === "__clear__" ? setSelectedRating("") : setSelectedRating(value)
                }
              >
                <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 gap-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-600" />
                    <SelectValue placeholder="Rating" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {selectedRating && (
                    <SelectItem value="__clear__" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Clear selection
                    </SelectItem>
                  )}
                  <SelectItem value="5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-black mr-0.5" />
                      ))}
                      <span className="ml-2">5.0+ Stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4.5">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-black mr-0.5" />
                      ))}
                      <Star
                        className="h-3 w-3 fill-current text-black mr-0.5"
                        style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
                      />
                      <span className="ml-2">4.5+ Stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-black mr-0.5" />
                      ))}
                      <Star className="h-3 w-3 text-gray-300 mr-0.5" />
                      <span className="ml-2">4.0+ Stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3.5">
                    <div className="flex items-center">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-black mr-0.5" />
                      ))}
                      <Star
                        className="h-3 w-3 fill-current text-black mr-0.5"
                        style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
                      />
                      <Star className="h-3 w-3 text-gray-300 mr-0.5" />
                      <span className="ml-2">3.5+ Stars</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-black mr-0.5" />
                      ))}
                      {[...Array(2)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-gray-300 mr-0.5" />
                      ))}
                      <span className="ml-2">3.0+ Stars</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <BudgetSlider min={0} max={100000} step={1000} onChange={setSelectedBudget} value={selectedBudget} />
              <LocationFilter value={selectedLocation} onChange={setSelectedLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
