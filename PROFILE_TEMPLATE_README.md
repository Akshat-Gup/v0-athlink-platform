# Profile Template System

## Overview

A generic template system for profile pages (events, talents, teams) to reduce code duplication and improve maintainability.

## Structure

### ProfileTemplate Component

- **Location**: `components/templates/profile-template.tsx`
- **Purpose**: Generic template that handles layout, tab navigation, and modal functionality
- **Props**:
  - `profile`: Profile data object
  - `profileType`: "event" | "talent" | "team"
  - `HeaderComponent`: Component for profile header
  - `SidebarComponent`: Component for profile sidebar
  - `tabs`: Array of tab configurations
  - `defaultTab`: Initial tab to show

### Adapter Components

- **Location**: `components/adapters/profile-adapters.tsx`
- **Purpose**: Wrap existing components to work with the generic template interface
- **Available**:
  - `EventHeaderAdapter` & `EventSidebarAdapter` (implemented)
  - `TalentHeaderAdapter` & `TalentSidebarAdapter` (placeholder)
  - `TeamHeaderAdapter` & `TeamSidebarAdapter` (TODO)

## Usage Example (Events)

```tsx
import { ProfileTemplate } from "@/components/templates/profile-template";
import {
  EventHeaderAdapter,
  EventSidebarAdapter,
} from "@/components/adapters/profile-adapters";
import { MediaGallery } from "@/components/organisms";

export default function EventProfilePage({ params }: PageProps) {
  const event = getEventMockData(params.id);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: <YourOverviewContent />,
    },
    {
      id: "schedule",
      label: "Schedule",
      content: <YourScheduleContent />,
    },
    {
      id: "media",
      label: "Media",
      content: <MediaGallery mediaGallery={event.mediaGallery} />,
    },
  ];

  return (
    <ProfileTemplate
      profile={event}
      profileType="event"
      HeaderComponent={EventHeaderAdapter}
      SidebarComponent={EventSidebarAdapter}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
```

## Benefits

1. **DRY Principle**: Eliminates duplicate layout and modal code
2. **Consistency**: Ensures all profile pages have consistent structure
3. **Maintainability**: Changes to layout only need to be made in one place
4. **Flexibility**: Easy to add new tabs or customize content per profile type
5. **Type Safety**: TypeScript interfaces ensure proper usage

## Migration Status

- ✅ **Events**: Fully migrated to template system
- ⏳ **Talents**: Adapters created, migration pending
- ⏳ **Teams**: Migration pending

## Next Steps

1. Create specific header/sidebar components for talents and teams
2. Migrate talents and teams pages to use the template
3. Add more shared components (stats, media galleries, etc.)
4. Consider creating profile-specific templates if needed
