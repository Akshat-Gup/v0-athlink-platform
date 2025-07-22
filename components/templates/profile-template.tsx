"use client"

import { Card } from "@/components/molecules/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/organisms/dialog"
import { QrCode } from "lucide-react"
import { useState, ReactNode } from "react"
import { Tooltip, TooltipProvider } from "@/components/molecules/tooltip"

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
}

export function ProfileTemplate({
  profile,
  profileType,
  HeaderComponent,
  SidebarComponent,
  tabs,
  defaultTab = "overview"
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
              <Card className="p-4 sm:p-6">
                <div className="flex space-x-1 border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                        activeTab === tab.id
                          ? "text-green-600 border-green-600"
                          : "text-gray-600 border-transparent hover:text-green-600 hover:border-green-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tab Content */}
              <div className="space-y-4 sm:space-y-6">
                {activeTabContent}
              </div>
            </div>

            <SidebarComponent profile={profile} event={profile} />
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
