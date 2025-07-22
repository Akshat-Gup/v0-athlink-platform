"use client"

import { Card } from "@/components/molecules/card"
import { getEventMockData } from "@/lib/mock-profile-data"
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

interface PageProps {
  params: {
    id: string
  }
}

export default function EventProfilePage({ params }: PageProps) {
  const { id } = params
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
      <StatsProfile title="Featured Participants" participants={event.featuredParticipants} />
      <StatsGraph title="Ticket Sales Progress" data={event.ticketSales} />
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
