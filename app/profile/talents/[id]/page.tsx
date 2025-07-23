"use client"

import { Card } from "@/components/molecules/card"
import { getTalentProfile } from "@/lib/services/profile-service"
import { ProfileTemplate } from "@/components/templates/profile-template"
import { TalentHeaderAdapter, TalentSidebarAdapter } from "@/components/adapters/profile-adapters"
import { MediaGallery } from "@/components/organisms"
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

  useEffect(() => {
    async function fetchTalent() {
      try {
        setLoading(true)
        const data = await getTalentProfile(id)
        if (data) {
          setTalent(data)
        } else {
          setError('Talent not found')
        }
      } catch (err) {
        console.error('Error fetching talent:', err)
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

      <StatsList stats={talent.talentDetailsData} title="Quick Facts" />
      <StatsGrid stats={talent.demographics} title="Demographics" />
      <StatsGrid stats={talent.performanceStats} title="Performance Stats" />
      <StatsLineGraph title="Ranking Progress" data={talent.performanceData} />
      <StatsGraph title="Monthly Wins" data={talent.performanceData} dataKey="wins" color="#10b981" />
      <StatsProfile title="Team" participants={talent.teamList} emptyText="No team members found" />
    </>
  )

  const renderResultsTab = () => (
    <>
    <AchievementsSection 
      achievements={talent.achievementsList} 
      title="Achievements" 
    />
    <UpcomingCompetitions competitions={talent.upcomingCompetitions} title="Upcoming Competitions" />
    <PastResults results={talent.pastResults} title="Past Results" />
    </>
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
    />
  )
}
