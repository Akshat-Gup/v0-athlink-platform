import { EventHeader as OriginalEventHeader } from "@/components/organisms/profile/header"
import { EventSidebar as OriginalEventSidebar } from "@/components/organisms/profile/sidebar"
import { DefaultSidebar as DefaultSidebar } from "@/components/organisms/profile/sidebar"   
import { TalentHeader as OriginalTalentHeader } from "@/components/organisms/profile/header"
// Adapter components to make existing components work with the generic template
export function EventHeaderAdapter({ profile, onShareClick }: { profile: any; onShareClick: () => void }) {
  return <OriginalEventHeader event={profile} onShareClick={onShareClick} />
}

export function EventSidebarAdapter({ profile }: { profile: any }) {
  return <OriginalEventSidebar event={profile} />
}

// Talent adapters would go here when we refactor the talent page
export function TalentHeaderAdapter({ profile, onShareClick }: { profile: any; onShareClick: () => void }) {
  // This would wrap the existing talent header component
  // For now, we can reuse the event header or create a specific talent header
  return <OriginalTalentHeader talent={profile} onShareClick={onShareClick} />
}

export function TalentSidebarAdapter({ profile }: { profile: any }) {
  // This would wrap the existing talent sidebar component  
  // For now, we can reuse the event sidebar or create a specific talent sidebar
  return <DefaultSidebar item={profile} title="Campaign Progress" subtitle="Sponsorship Checkpoints" submitButtonText="Support Campaign" />
}
