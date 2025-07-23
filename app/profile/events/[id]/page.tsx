"use client"

import { Card } from "@/components/molecules/card"
import { getEventProfile } from "@/lib/services/profile-service"
import { ProfileTemplate } from "@/components/templates/profile-template"
import { EventHeaderAdapter, EventSidebarAdapter } from "@/components/adapters/profile-adapters"
import { MediaGallery } from "@/components/organisms"
import { 
    StatsList,
    StatsGraph,
    StatsProfile,
    StatsSponsors,
    StatsSchedule
} from "@/components/molecules"
import { use } from "react"
import { useEffect, useState } from "react"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventProfilePage({ params }: PageProps) {
  const { id } = use(params)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        const data = await getEventProfile(id)
        if (data) {
          setEvent(data)
        } else {
          setError('Event not found')
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event profile')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading event profile...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">{error || 'This event profile could not be found.'}</p>
        </div>
      </div>
    )
  }

  // Get event data from database
  // const event = getEventMockData(id) // Old mock data approach

  const renderOverviewTab = () => (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">About the Event</h3>
        <p className="text-gray-600 text-sm sm:text-base">{event.bio}</p>
      </Card>
      
      <StatsList stats={event.eventDetailsData} title="Event Details" />
      <StatsList stats={event.sponsorshipImpactData} title="Sponsorship Impact" />
      <StatsProfile title="Featured Participants" participants={event.featuredParticipants} />
      <StatsGraph title="Ticket Sales Progress" data={event.ticketSales} dataKey="sold" color="#22c55e" />
      <StatsSponsors title="Current Sponsors" sponsors={event.sponsors} />
    </>
  )

  const renderScheduleTab = () => (
    <StatsSchedule title="Event Schedule" schedule={event.schedule} />
  )

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: renderOverviewTab()
    },
    {
      id: "schedule", 
      label: "Schedule",
      content: renderScheduleTab()
    },
    {
      id: "media",
      label: "Media",
      content: <MediaGallery mediaGallery={event.mediaGallery} />
    }
  ]

  return (
    <ProfileTemplate
      profile={event}
      profileType="event"
      HeaderComponent={EventHeaderAdapter}
      SidebarComponent={EventSidebarAdapter}
      tabs={tabs}
      defaultTab="overview"
    />
  )
}
