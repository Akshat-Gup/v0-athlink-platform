# Backend Implementation for Athlink Platform

## Overview

This document outlines the backend implementation that has been added to your Next.js Athlink platform. The backend provides a complete data layer with database integration, API routes, and real data management.

## What Was Added

### 1. Database Setup with Prisma ORM

**Technology**: Prisma ORM with SQLite database (easily upgradeable to PostgreSQL/MySQL)

**Location**:

- Database schema: `prisma/schema.prisma`
- Database connection: `lib/db.ts`
- Database file: `prisma/dev.db` (auto-generated)

**Features**:

- Complete user management (talents, coaches, facilities, organizations)
- Team management with membership system
- Event management and participation tracking
- Achievement and rating systems
- Campaign/funding system
- Media management
- Social media integration
- Location-based services

### 2. API Routes

**Implemented Routes**:

#### Teams API

- **Endpoint**: `/api/teams/[id]`
- **Method**: GET
- **Purpose**: Fetch team profile data including roster, stats, achievements
- **File**: `app/api/teams/[id]/route.ts`

#### Talents API

- **Endpoint**: `/api/talents/[id]`
- **Method**: GET
- **Purpose**: Fetch talent/user profile data including achievements, team history, campaigns
- **File**: `app/api/talents/[id]/route.ts`

#### Discover API

- **Endpoint**: `/api/discover`
- **Method**: GET
- **Purpose**: Search and filter talents, teams with pagination
- **Parameters**: `category`, `search`, `sport`, `location`, `page`, `limit`
- **File**: `app/api/discover/route.ts`

### 3. Data Service Layer

**Location**: `lib/services/data-service.ts`

**Purpose**: Abstraction layer between frontend and API routes with fallback to mock data

**Functions**:

- `getTeamData(id)` - Client-side team data fetching
- `getTalentData(id)` - Client-side talent data fetching
- `getTeamDataServer(id)` - Server-side team data fetching
- `getTalentDataServer(id)` - Server-side talent data fetching

### 4. Database Seeding

**Location**: `prisma/seed.ts`

**Purpose**: Populate database with sample data for development/testing

**Command**: `npm run db:seed`

**Sample Data Includes**:

- 2 locations (Los Angeles, New York)
- 2 sports (Tennis, Basketball)
- 2 leagues (ATP, NBA)
- 2 talent types (Athlete, Coach)
- 2 users (Alex Thompson - Tennis Player, Sarah Johnson - Basketball Coach)
- 1 team (Los Angeles Thunder)
- Team memberships, achievements, and campaigns

## Database Schema Highlights

### Core Tables

1. **Users** - Central profile system for all user types
2. **Teams** - Team management with sport/league associations
3. **Locations** - Geographic data with coordinates
4. **Sports/Leagues** - Hierarchical sport organization
5. **Events** - Event management with participation tracking
6. **Achievements** - Accomplishment tracking with verification
7. **Campaigns** - Funding/sponsorship campaigns
8. **Media** - File and media management

### Key Relationships

- Users belong to locations and sports
- Teams have members (users) with roles
- Events have participants and results
- Achievements can be linked to users, teams, or events
- Campaigns can be for users, teams, or events

## Frontend Integration

### Updated Components

**Team Profile Page** (`app/profile/teams/[id]/page.tsx`):

- Now fetches data from `/api/teams/[id]` instead of mock data
- Includes loading states and error handling
- Falls back to mock data if API fails

**Benefits of New Backend**:

1. **Real Data**: Replace static mock data with dynamic database content
2. **Scalability**: Easily add new features and data relationships
3. **Search & Filter**: Powerful discover functionality with database queries
4. **Admin Capabilities**: Full CRUD operations (can be extended)
5. **Production Ready**: Database schema designed for real-world usage

## Getting Started

### Prerequisites

- Node.js installed
- pnpm package manager

### Setup Commands

```bash
# Install dependencies (already done)
pnpm install

# Generate Prisma client (already done)
npx prisma generate

# Create/sync database (already done)
npx prisma db push

# Seed database with sample data (already done)
npm run db:seed

# Start development server
npm run dev
```

### Testing the Backend

1. **Start the server**: `npm run dev`
2. **Test API endpoints**:

   - Visit `http://localhost:3000/api/teams/1`
   - Visit `http://localhost:3000/api/talents/1`
   - Visit `http://localhost:3000/api/discover?category=all`

3. **Test Frontend Integration**:
   - Visit `http://localhost:3000/profile/teams/1`
   - Should load team data from the database

## Next Steps & Extensions

### Recommended Enhancements

1. **Authentication System**

   - Add user authentication with NextAuth.js
   - Protect API routes with middleware

2. **File Upload System**

   - Implement actual file upload for profile images
   - Integrate with cloud storage (AWS S3, Cloudinary)

3. **Real-time Features**

   - Add WebSocket support for live updates
   - Real-time notifications

4. **Advanced Search**

   - Implement full-text search
   - Add geolocation-based search

5. **Analytics & Reporting**

   - Add performance tracking
   - Generate reports and dashboards

6. **Payment Integration**
   - Integrate payment processing for campaigns
   - Subscription management

### Database Migrations

To make schema changes:

```bash
# Make changes to prisma/schema.prisma
# Then run:
npx prisma db push

# For production, use migrations:
npx prisma migrate dev --name your_migration_name
```

### Environment Variables

Add to `.env` file:

```env
DATABASE_URL="file:./dev.db"  # Already set
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # For server-side API calls
```

## API Documentation

### Team Profile API

**GET** `/api/teams/[id]`

**Response Structure**:

```json
{
  "id": 1,
  "name": "Los Angeles Thunder",
  "bio": "Professional basketball team...",
  "sport": "Basketball",
  "location": "Los Angeles, CA, USA",
  "rating": 4.85,
  "teamStats": [...],
  "performanceStats": [...],
  "roster": [...],
  "upcomingGames": [...],
  "recentResults": [...],
  "sponsors": [...],
  "mediaGallery": {...}
}
```

### Discover API

**GET** `/api/discover`

**Query Parameters**:

- `category`: 'all', 'talents', 'coaches', 'teams', 'events', 'facilities'
- `search`: Search query string
- `sport`: Sport filter
- `location`: Location filter
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

**Response Structure**:

```json
{
  "results": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "hasMore": false
  }
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure `.env` file exists with `DATABASE_URL`
   - Run `npx prisma db push` to create/sync database

2. **API Route Not Found**

   - Check file structure in `app/api/`
   - Ensure route files are named `route.ts`

3. **Type Errors**
   - Run `npx prisma generate` after schema changes
   - Check import paths in service files

### Logs & Debugging

- Check terminal output for Prisma queries
- Use browser dev tools for API response inspection
- Add console.log statements in API routes for debugging

## Support

For questions or issues with the backend implementation:

1. Check Prisma documentation: https://www.prisma.io/docs
2. Review Next.js API routes documentation
3. Examine the database schema in `prisma/schema.prisma`

The backend is now fully functional and integrated with your existing frontend components!
