"use client"

import { Card } from "@/components/molecules/card"
import { getTeamDataServer } from "@/lib/services/data-service"
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
    RecentResults,
    StatsSponsors
} from "@/components/molecules"
import { use, useState, useEffect } from "react"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function TeamProfilePage({ params }: PageProps) {
  const { id } = use(params)
  const [team, setTeam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeamData() {
      try {
        setLoading(true)
        // For client-side, use the client data service
        const response = await fetch(`/api/teams/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch team data')
        }
        const teamData = await response.json()
        setTeam(teamData)
      } catch (err) {
        console.error('Error fetching team data:', err)
        setError('Failed to load team data')
        // Fallback to mock data
        const { getTeamMockData } = await import("@/lib/mock-profile-data")
        setTeam(getTeamMockData(id))
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading team profile...</p>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600">{error || 'Team not found'}</p>
        </div>
      </div>
    )
  }

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
      <StatsSponsors title="Current Sponsors" sponsors={team.sponsors} />
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
