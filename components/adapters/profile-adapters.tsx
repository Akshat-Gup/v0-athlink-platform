import { EventHeader as OriginalEventHeader } from "@/components/organisms/profile/header"
import { EventSidebar as OriginalEventSidebar } from "@/components/organisms/profile/sidebar"
import { DefaultSidebar as DefaultSidebar } from "@/components/organisms/profile/sidebar"   
import { TalentHeader as OriginalTalentHeader } from "@/components/organisms/profile/header"
import { TeamHeader as OriginalTeamsHeader } from "@/components/organisms/profile/header"
import { Session } from "next-auth"

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
  return <DefaultSidebar 
    item={profile} 
    title="Campaign Progress" 
    subtitle="Sponsorship Checkpoints" 
    submitButtonText="Support Campaign"
    profileId={profile.id}
    profileType="talent"
    session={session}
    profileOwnerId={profile.email}
  />
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

