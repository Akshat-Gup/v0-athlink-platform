"use client"

import { Card } from "@/components/molecules/card"
import { getTalentMockData } from "@/lib/mock-profile-data"
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

interface PageProps {
  params: {
    id: string
  }
}

export default function TalentProfilePage({ params }: PageProps) {
  const { id } = params
  // Get event data from mock data
  const talent = getTalentMockData(id)

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
