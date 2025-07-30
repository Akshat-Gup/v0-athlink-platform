"use client"

import { Card } from "@/components/molecules/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/organisms/dialog"
import { QrCode } from "lucide-react"
import { useState, ReactNode } from "react"
import { Tooltip, TooltipProvider } from "@/components/molecules/tooltip"
import { Session } from "@supabase/supabase-js"

// Generic interfaces for profile data
export interface BaseProfile {
  id: string | number
  name: string
  image: string
  bio: string
  mediaGallery?: any
  [key: string]: any // Allow additional properties specific to each profile type
}

export interface TabConfig {
  id: string
  label: string
  content: ReactNode
}

interface ProfileTemplateProps {
  profile: BaseProfile
  profileType: "event" | "talent" | "team"
  HeaderComponent: React.ComponentType<any>
  SidebarComponent: React.ComponentType<any>
  tabs: TabConfig[]
  defaultTab?: string
  session?: Session | null
}

export function ProfileTemplate({
  profile,
  profileType,
  HeaderComponent,
  SidebarComponent,
  tabs,
  defaultTab = "overview",
  session
}: ProfileTemplateProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [showShareModal, setShowShareModal] = useState(false)

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <HeaderComponent profile={profile} event={profile} onShareClick={() => setShowShareModal(true)} />

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Tab Navigation */}
              <div className="sticky top-0 z-40 bg-white pt-4 pb-4 border-b border-gray-100 left-0 right-0 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
                <div className="w-full max-w-7xl mx-auto">
                  <div className="bg-gray-50 rounded-full p-1 flex w-full">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${activeTab === tab.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        {/* Optionally add tab.icon here if available */}
                        <span className="hidden sm:inline ml-2">{tab.label}</span>
                        <span className="sm:hidden">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-4 sm:space-y-6">
                {activeTabContent}
              </div>
            </div>

            <SidebarComponent profile={profile} event={profile} session={session} />
          </div>

          {/* Share Modal */}
          <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Share {profileType === "event" ? "Event" : profileType === "talent" ? "Profile" : "Team"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Scan to view {profileType === "event" ? "event details" : profileType === "talent" ? "profile" : "team details"}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  )
}
