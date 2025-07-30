"use client"

import { Card } from "@/components/molecules/card"
import { ProfileTemplate } from "@/components/templates/profile-template"
import { EventHeaderAdapter, EventSidebarAdapter } from "@/components/adapters/profile-adapters"
import MediaGallery from "@/components/organisms/profile/media-gallery"
import { CampaignList } from "@/components/organisms/campaigns/campaign-list"
import {
  StatsList,
  StatsGraph,
  StatsProfile,
  StatsSponsors,
  StatsSchedule
} from "@/components/molecules"
import { use } from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

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
  const { session } = useAuth()

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        const response = await fetch(`/api/profile/events/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setEvent(data)
      } catch (err) {
        console.error('Error fetching event profile:', err)
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

      {event.eventStats && <StatsList stats={event.eventStats} title="Event Details" />}
      {event.sponsorshipStats && <StatsList stats={event.sponsorshipStats} title="Sponsorship Impact" />}
      {event.featuredParticipants && <StatsProfile title="Featured Participants" participants={event.featuredParticipants} />}
      {event.ticketSales && <StatsGraph title="Ticket Sales Progress" data={event.ticketSales} dataKey="sold" color="#22c55e" />}
      {event.sponsors && <StatsSponsors title="Current Sponsors" sponsors={event.sponsors} />}
    </>
  )

  const renderScheduleTab = () => (
    event.schedule ? <StatsSchedule title="Event Schedule" schedule={event.schedule} /> : <div>No schedule available</div>
  )

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <CampaignList
        profileId={id}
        profileType="event"
        status="active"
        onCampaignSelect={(campaign) => {
          console.log('Selected campaign:', campaign)
        }}
      />
    </div>
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
      id: "campaigns",
      label: "Campaigns",
      content: renderCampaignsTab()
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
      session={session}
    />
  )
}
