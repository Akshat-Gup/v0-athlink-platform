"use client"

import { Card } from "@/components/molecules/card"
import { ProfileTemplate } from "@/components/templates/profile-template"
import { TalentHeaderAdapter, TalentSidebarAdapter } from "@/components/adapters/profile-adapters"
import MediaGallery from "@/components/organisms/profile/media-gallery"
import { CampaignList } from "@/components/organisms/campaigns/campaign-list"
import { CampaignCreator } from "@/components/organisms/campaigns/campaign-creator"
import {
  StatsList,
  StatsGrid,
  StatsGraph,
  StatsProfile,
  StatsSponsors,
  StatsSchedule,
  StatsLineGraph,
  AchievementsSection,
  UpcomingCompetitions,
  PastResults
} from "@/components/molecules"
import { use } from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function TalentProfilePage({ params }: PageProps) {
  const { id } = use(params)
  const [talent, setTalent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    async function fetchTalent() {
      try {
        setLoading(true)
        console.log('Fetching talent profile for ID:', id)
        const response = await fetch(`/api/profile/talents/${id}`)

        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Fetched talent data:', data)
        setTalent(data)
      } catch (err) {
        console.error('Error fetching talent profile:', err)
        setError('Failed to load talent profile')
      } finally {
        setLoading(false)
      }
    }

    fetchTalent()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading talent profile...</p>
        </div>
      </div>
    )
  }

  if (error || !talent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">{error || 'This talent profile could not be found.'}</p>
        </div>
      </div>
    )
  }

  // Get talent data from database
  // const talent = getTalentMockData(id) // Old mock data approach

  const renderOverviewTab = () => (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">About the Talent</h3>
        <p className="text-gray-600 text-sm sm:text-base">{talent.bio}</p>
      </Card>

      {talent.demographics && <StatsGrid stats={talent.demographics} title="Demographics" />}
      {talent.performanceStats && <StatsGrid stats={talent.performanceStats} title="Performance Stats" />}
      {talent.performanceData && <StatsLineGraph title="Ranking Progress" data={talent.performanceData} />}
      {talent.performanceData && <StatsGraph title="Monthly Wins" data={talent.performanceData} dataKey="wins" color="#10b981" />}
      {talent.teamList && <StatsProfile title="Team" participants={talent.teamList} emptyText="No team members found" />}
    </>
  )

  const renderResultsTab = () => (
    <>
      {talent.achievementsList && (
        <AchievementsSection
          achievements={talent.achievementsList}
          title="Achievements"
        />
      )}
      {talent.upcomingCompetitions && <UpcomingCompetitions competitions={talent.upcomingCompetitions} title="Upcoming Competitions" />}
      {talent.pastResults && <PastResults results={talent.pastResults} title="Past Results" />}
    </>
  )

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <CampaignList
        profileId={id}
        profileType="talent"
        status="active"
        onCampaignSelect={(campaign) => {
          // Handle campaign selection - could navigate or show modal
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
      id: "results",
      label: "Results",
      content: renderResultsTab()
    },
    {
      id: "campaigns",
      label: "Campaigns",
      content: renderCampaignsTab()
    },
    {
      id: "media",
      label: "Media",
      content: <MediaGallery mediaGallery={talent.mediaGallery} />
    }
  ]

  return (
    <ProfileTemplate
      profile={talent}
      profileType="talent"
      HeaderComponent={TalentHeaderAdapter}
      SidebarComponent={TalentSidebarAdapter}
      tabs={tabs}
      defaultTab="overview"
      session={session}
    />
  )
}
