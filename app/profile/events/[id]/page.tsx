"use client"

import { Card } from "@/components/molecules/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/organisms/dialog"
import { Badge } from "@/components/atoms/badge"
import { QrCode, Clock } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { XAxis, YAxis, ResponsiveContainer, BarChart as ReBarChart, Bar } from "recharts"
import { Tooltip, TooltipProvider } from "@/components/molecules/tooltip"
import { getEventMockData } from "@/lib/mock-profile-data"

import { 
    EventHeader,
    TabNavigation,
    MediaGallery,
    EventSidebar
} from "@/components/organisms"
import { StatsList } from "@/components/molecules/profile/stats-list"

interface PageProps {
  params: {
    id: string
  }
}

export default function EventProfilePage({ params }: PageProps) {
  const { id } = params
  const [activeTab, setActiveTab] = useState("overview")
  const [showShareModal, setShowShareModal] = useState(false)

  // Get event data from mock data
  const event = getEventMockData(id)

  const renderOverviewTab = () => (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">About the Event</h3>
        <p className="text-gray-600 text-sm sm:text-base">{event.bio}</p>
      </Card>
      
      <StatsList stats={event.eventDetailsData} title="Event Details" />
      <StatsList stats={event.sponsorshipImpactData} title="Sponsorship Impact" />
      
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Featured Participants</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.featuredParticipants.map((participant) => (
            <Card key={participant.id} className="p-4 flex items-center gap-4">
              <Image
                src={participant.image || "/placeholder.svg"}
                alt={participant.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{participant.name}</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{participant.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </>
  )

  const renderScheduleTab = () => (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
      <div className="space-y-6">
        {event.schedule.map((item) => (
          <div key={item.day} className="p-4 border rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-green-500" />
              <h4 className="font-semibold text-md">
                Day {item.day} <span className="text-gray-500 font-normal">({item.date})</span>
              </h4>
            </div>
            <ul className="space-y-2 pl-8 list-disc text-gray-700">
              {item.events.map((eventItem, index) => (
                <li key={index}>{eventItem}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <EventHeader event={event} onShareClick={() => setShowShareModal(true)} />

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === "overview" && renderOverviewTab()}
              {activeTab === "schedule" && renderScheduleTab()}
              {activeTab === "media" && <MediaGallery mediaGallery={event.mediaGallery} />}
            </div>

            <EventSidebar event={event} />
          </div>

          {/* Share Modal */}
          <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Share Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">Scan to view event details</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  )
}
