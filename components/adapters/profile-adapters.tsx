import { EventHeader as OriginalEventHeader } from "@/components/organisms/profile/event-header"
import { EventSidebar as OriginalEventSidebar } from "@/components/organisms/profile/sidebar"

// Adapter components to make existing components work with the generic template
export function EventHeaderAdapter({ profile, onShareClick }: { profile: any; onShareClick: () => void }) {
  return <OriginalEventHeader event={profile} onShareClick={onShareClick} />
}

export function EventSidebarAdapter({ profile }: { profile: any }) {
  return <OriginalEventSidebar event={profile} />
}
