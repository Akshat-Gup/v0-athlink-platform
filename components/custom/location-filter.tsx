"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Search } from "lucide-react"

interface LocationFilterProps {
  value: string
  onChange: (value: string) => void
}

// Comprehensive list of countries and major US cities
const locations = [
  // Countries
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Brazil",
  "Bulgaria",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Ecuador",
  "Egypt",
  "Estonia",
  "Ethiopia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Uruguay",
  "Venezuela",
  "Vietnam",

  // Major US Cities
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "El Paso, TX",
  "Nashville, TN",
  "Detroit, MI",
  "Oklahoma City, OK",
  "Portland, OR",
  "Las Vegas, NV",
  "Memphis, TN",
  "Louisville, KY",
  "Baltimore, MD",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Sacramento, CA",
  "Mesa, AZ",
  "Kansas City, MO",
  "Atlanta, GA",
  "Long Beach, CA",
  "Colorado Springs, CO",
  "Raleigh, NC",
  "Miami, FL",
  "Virginia Beach, VA",
  "Omaha, NE",
  "Oakland, CA",
  "Minneapolis, MN",
  "Tulsa, OK",
  "Arlington, TX",
  "Tampa, FL",
  "New Orleans, LA",
  "Wichita, KS",
  "Cleveland, OH",
  "Bakersfield, CA",
  "Aurora, CO",
  "Anaheim, CA",
  "Honolulu, HI",
  "Santa Ana, CA",
  "Riverside, CA",
  "Corpus Christi, TX",
  "Lexington, KY",
  "Stockton, CA",
  "Henderson, NV",
  "Saint Paul, MN",
  "St. Louis, MO",
  "Cincinnati, OH",
  "Pittsburgh, PA",
]

export const LocationFilter: React.FC<LocationFilterProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations
    return locations.filter((location) => location.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const handleLocationSelect = (location: string) => {
    onChange(location)
    setOpen(false)
    setSearchQuery("")
  }

  const handleClear = () => {
    onChange("")
    setOpen(false)
    setSearchQuery("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm font-normal w-auto min-w-0 focus:outline-none flex items-center justify-center shadow-none transition-colors"
        >
          <MapPin className="h-4 w-4 mr-1 text-gray-600" />
          {value || "Location"}
          <svg
            className={`ml-2 h-4 w-4 transition-transform text-gray-600 ${open ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8L10 12L14 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2">
            {value && (
              <Button
                variant="ghost"
                onClick={handleClear}
                className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50 mb-1"
              >
                Clear selection
              </Button>
            )}
            {filteredLocations.map((location) => (
              <Button
                key={location}
                variant="ghost"
                onClick={() => handleLocationSelect(location)}
                className={`w-full justify-start text-left hover:bg-gray-100 ${
                  value === location ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {location}
              </Button>
            ))}
            {filteredLocations.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">No locations found</div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
