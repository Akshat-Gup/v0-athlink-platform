"use client"

import { Globe, Clock, CalendarIcon } from "lucide-react"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "media", label: "Media", icon: CalendarIcon },
  ]

  return (
    <div className="sticky top-0 z-40 bg-white pt-4 pb-4 border-b border-gray-100 left-0 right-0 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-gray-50 rounded-full p-1 flex w-full">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${
                  activeTab === tab.id 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline ml-2">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
