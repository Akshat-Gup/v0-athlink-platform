"use client"

import { Card } from "@/components/molecules/card"
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
import { use } from "react"
import { useEffect, useState } from "react"

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
    async function fetchTeam() {
      try {
        setLoading(true)
        const response = await fetch(`/api/profile/teams/${id}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setTeam(data)
      } catch (err) {
        console.error('Error fetching team profile:', err)
        setError('Failed to load team profile')
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading team profile...</p>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">{error || 'This team profile could not be found.'}</p>
        </div>
      </div>
    )
  }

  // Get team data from database
  // const team = getTeamMockData(id) // Old mock data approach

  const renderOverviewTab = () => (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">About the Team</h3>
        <p className="text-gray-600 text-sm sm:text-base">{team.bio}</p>
      </Card>

      {team.teamStats && <StatsGrid stats={team.teamStats} title="Team Information" />}
      {team.performanceStats && <StatsGrid stats={team.performanceStats} title="Performance Stats" />}
      {team.performanceData && <StatsLineGraph title="Season Performance" data={team.performanceData} />}
      {team.upcomingGames && <UpcomingGames games={team.upcomingGames} title="Upcoming Games" />}
      {team.sponsors && <StatsSponsors title="Current Sponsors" sponsors={team.sponsors} />}
    </>
  )

  const renderRosterTab = () => (
    team.roster ? <TeamRoster roster={team.roster} title="Team Roster" /> : <div>No roster available</div>
  )

  const renderResultsTab = () => (
    team.recentResults ? <RecentResults results={team.recentResults} title="Recent Results" /> : <div>No results available</div>
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
