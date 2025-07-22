"use client"

import { Card } from "@/components/molecules/card"
import { getTeamMockData } from "@/lib/mock-profile-data"
import { ProfileTemplate } from "@/components/templates/profile-template"
import { TeamsHeaderAdapter, TeamsSidebarAdapter } from "@/components/adapters/profile-adapters"
import { MediaGallery } from "@/components/organisms"
import { 
    StatsList,
    StatsGrid,
    StatsGraph,
    StatsProfile,
    StatsLineGraph,
    TeamRoster,
    UpcomingGames,
    RecentResults
} from "@/components/molecules"

interface PageProps {
  params: {
    id: string
  }
}

export default function TeamProfilePage({ params }: PageProps) {
  const { id } = params
  // Get team data from mock data
  const team = getTeamMockData(id)

  const renderOverviewTab = () => (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">About the Team</h3>
        <p className="text-gray-600 text-sm sm:text-base">{team.bio}</p>
      </Card>

      <StatsGrid stats={team.teamStats} title="Team Information" />
      <StatsGrid stats={team.performanceStats} title="Performance Stats" />
      <StatsLineGraph title="Season Performance" data={team.performanceData} />
      <UpcomingGames games={team.upcomingGames} title="Upcoming Games" />
      
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Current Sponsors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {team.sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex flex-col items-center gap-2 p-4 border rounded-xl text-center"
            >
              <img
                src={sponsor.logo || "/placeholder.svg"}
                alt={sponsor.name}
                className="w-20 h-10 object-contain"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{sponsor.name}</h4>
                <p className="text-xs text-gray-600">{sponsor.tier}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )

  const renderRosterTab = () => (
    <TeamRoster roster={team.roster} title="Team Roster" />
  )

  const renderResultsTab = () => (
    <RecentResults results={team.recentResults} title="Recent Results" />
  )

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: renderOverviewTab()
    },
    {
      id: "roster", 
      label: "Roster",
      content: renderRosterTab()
    },
    {
      id: "results",
      label: "Results", 
      content: renderResultsTab()
    },
    {
      id: "media",
      label: "Media",
      content: <MediaGallery mediaGallery={team.mediaGallery} />
    }
  ]

  return (
    <ProfileTemplate
      profile={team}
      profileType="team"
      HeaderComponent={TeamsHeaderAdapter}
      SidebarComponent={TeamsSidebarAdapter}
      tabs={tabs}
      defaultTab="overview"
    />
  )
}
