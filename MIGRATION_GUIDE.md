# Migrating from Mock Data to Django API

## Step-by-Step Migration Guide

### 1. Update Team Page to Use Real API

Replace your current team page with API calls:

```typescript
// app/profile/teams/[id]/page.tsx - Updated version
"use client";

import { Card } from "@/components/molecules/card";
import { ProfileTemplate } from "@/components/templates/profile-template";
import {
  TeamsHeaderAdapter,
  TeamsSidebarAdapter,
} from "@/components/adapters/profile-adapters";
import { MediaGallery } from "@/components/organisms";
import {
  StatsGrid,
  StatsLineGraph,
  TeamRoster,
  UpcomingGames,
  RecentResults,
} from "@/components/molecules";
import { use } from "react";
import { useTeamData } from "@/lib/services/api";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TeamProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { team, loading, error } = useTeamData(id);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error)
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error loading team
      </div>
    );
  if (!team)
    return <div className="flex justify-center p-8">Team not found</div>;

  const renderOverviewTab = () => (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">About the Team</h3>
        <p className="text-gray-600 text-sm sm:text-base">{team.bio}</p>
      </Card>

      {team.team_stats && (
        <StatsGrid stats={team.team_stats} title="Team Information" />
      )}
      {team.performance_stats && (
        <StatsGrid stats={team.performance_stats} title="Performance Stats" />
      )}
      {team.performance_data && (
        <StatsLineGraph
          title="Season Performance"
          data={team.performance_data}
        />
      )}
      <UpcomingGames games={team.upcoming_games} title="Upcoming Games" />

      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Current Sponsors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {team.sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex flex-col items-center gap-2 p-4 border rounded-xl text-center"
            >
              <img
                src={sponsor.logo || "/placeholder.svg"}
                alt={sponsor.name}
                className="w-20 h-10 object-contain"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{sponsor.name}</h4>
                <p className="text-xs text-gray-600">{sponsor.tier}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );

  const renderRosterTab = () => (
    <TeamRoster roster={team.players} title="Team Roster" />
  );

  const renderResultsTab = () => (
    <RecentResults results={team.recent_results} title="Recent Results" />
  );

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: renderOverviewTab(),
    },
    {
      id: "roster",
      label: "Roster",
      content: renderRosterTab(),
    },
    {
      id: "results",
      label: "Results",
      content: renderResultsTab(),
    },
    {
      id: "media",
      label: "Media",
      content: <MediaGallery mediaGallery={team.media_gallery} />,
    },
  ];

  return (
    <ProfileTemplate
      profile={team}
      profileType="team"
      HeaderComponent={TeamsHeaderAdapter}
      SidebarComponent={TeamsSidebarAdapter}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
```

### 2. Environment Variables

Create `.env.local` in your Next.js project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Component Data Mapping

Update your components to handle Django API data structure:

```typescript
// The Django API returns different field names, so update your components:

// Instead of: team.upcomingGames
// Use: team.upcoming_games

// Instead of: team.recentResults
// Use: team.recent_results

// Instead of: team.teamStats
// Use: team.team_stats (if you add this field to Django)
```

### 4. Error Handling

Add proper error handling and loading states:

```typescript
// lib/components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// lib/components/ErrorMessage.tsx
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="text-red-500 text-center">
        <p>{message}</p>
      </div>
    </div>
  );
}
```

### 5. Gradual Migration Plan

1. **Phase 1**: Set up Django backend, keep mock data
2. **Phase 2**: Migrate one page type (teams) to Django API
3. **Phase 3**: Migrate talents and events
4. **Phase 4**: Add authentication and user management
5. **Phase 5**: Add admin interface and real data

### 6. Testing Both Systems

You can run both systems during migration:

```bash
# Terminal 1 - Django Backend
cd athlink_backend
python manage.py runserver

# Terminal 2 - Next.js Frontend
cd v0-athlink-platform
npm run dev
```

### 7. Production Deployment

**Django Backend:**

- Deploy on Railway, Heroku, or DigitalOcean
- Use PostgreSQL database
- Set up AWS S3 for media files

**Next.js Frontend:**

- Deploy on Vercel (no changes needed)
- Update NEXT_PUBLIC_API_URL to production Django URL

### 8. Database Seeding

Create seed data in Django to replace your mock data:

```python
# Create a management command: teams/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from teams.models import Team
from users.models import User

class Command(BaseCommand):
    def handle(self, *args, **options):
        # Create sample teams, talents, events
        pass
```

## Benefits of Django Backend

1. **Admin Interface**: Built-in admin for content management
2. **Authentication**: User registration, login, permissions
3. **ORM**: Type-safe database queries
4. **Scalability**: Handle thousands of users
5. **API Documentation**: Auto-generated with DRF
6. **Background Tasks**: Celery for email, notifications
7. **File Uploads**: Handle images, videos properly
8. **Search**: Full-text search with PostgreSQL
9. **Caching**: Redis for performance
10. **Testing**: Built-in test framework

Your existing Next.js frontend design stays exactly the same - you're just replacing the data source!
