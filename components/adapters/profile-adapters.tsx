import { EventHeader as OriginalEventHeader } from "@/components/organisms/profile/header"
import { EventSidebar as OriginalEventSidebar } from "@/components/organisms/profile/sidebar"
import { DefaultSidebar as DefaultSidebar } from "@/components/organisms/profile/sidebar"   
import { SidebarSponsorship, SidebarSocials } from "@/components/molecules/profile/sidebar"
import { TalentHeader as OriginalTalentHeader } from "@/components/organisms/profile/header"
import { TeamHeader as OriginalTeamsHeader } from "@/components/organisms/profile/header"
import type { Session } from "@supabase/supabase-js"

// Adapter components to make existing components work with the generic template
export function EventHeaderAdapter({ profile, onShareClick }: { profile: any; onShareClick: () => void }) {
  return <OriginalEventHeader event={profile} onShareClick={onShareClick} />
}

export function EventSidebarAdapter({ profile, session }: { profile: any; session?: Session | null }) {
  return <OriginalEventSidebar event={profile} />
}

export function TalentHeaderAdapter({ profile, onShareClick }: { profile: any; onShareClick: () => void }) {
  return <OriginalTalentHeader talent={profile} onShareClick={onShareClick} />
}

export function TalentSidebarAdapter({ profile, session }: { profile: any; session?: Session | null }) {
  const renderProgressBar = (current: number, goal: number) => {
    const percentage = (current / goal) * 100
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-gray-900">${current.toLocaleString()}</span>
          <span className="text-gray-600">of ${goal.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SidebarSponsorship 
        currentFunding={profile.currentFunding}
        goalFunding={profile.goalFunding}
        checkpoints={profile.checkpoints}
        renderProgressBar={renderProgressBar}
        title="Campaign Progress" 
        subtitle="Sponsorship Checkpoints" 
        submitButtonText="Support Campaign"
        profileId={profile.id}
        profileType="talent"
        session={session}
        profileOwnerId={profile.email}
        campaignData={profile.campaignData}
      />
      
      <SidebarSocials 
        socials={profile.socials}
        title="Social Media"
      />
    </div>
  )
}

export function TeamsHeaderAdapter({ profile, onShareClick }: { profile: any; onShareClick: () => void }) {
  return <OriginalTeamsHeader team={profile} onShareClick={onShareClick} />
}

export function TeamsSidebarAdapter({ profile, session }: { profile: any; session?: Session | null }) {
  return <DefaultSidebar 
    item={profile} 
    title="Sponsorship Campaign" 
    subtitle="Sponsorship Packages" 
    submitButtonText="Sponsor Team"
    profileId={profile.id}
    profileType="team"
    session={session}
    profileOwnerId={profile.email}
  />
}

