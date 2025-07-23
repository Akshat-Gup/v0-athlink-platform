# Backend Setup for Athlink Platform

## Prerequisites

- Node.js 18+
- PostgreSQL database (or MySQL/SQLite)
- Prisma CLI

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install prisma @prisma/client
pnpm install -D prisma
```

### 2. Environment Variables

Create `.env` file:

```
DATABASE_URL="postgresql://username:password@localhost:5432/athlink"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Initialize Prisma (already done - schema exists)
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 4. API Endpoints Structure

```
/api
├── auth/               # Authentication endpoints
├── talents/
│   ├── route.ts       # GET /api/talents (list/search)
│   ├── [id]/
│   │   └── route.ts   # GET/PUT/DELETE /api/talents/[id]
│   └── [id]/
│       ├── sponsors/  # POST /api/talents/[id]/sponsors
│       └── stats/     # POST /api/talents/[id]/stats
├── teams/
│   ├── route.ts       # GET /api/teams
│   ├── [id]/
│   │   └── route.ts   # GET/PUT/DELETE /api/teams/[id]
│   └── [id]/
│       ├── players/   # POST /api/teams/[id]/players
│       ├── games/     # POST /api/teams/[id]/games
│       └── sponsors/  # POST /api/teams/[id]/sponsors
├── events/
│   ├── route.ts       # GET /api/events
│   └── [id]/
│       └── route.ts   # GET/PUT/DELETE /api/events/[id]
└── search/
    └── route.ts       # GET /api/search?q=query&type=talent|team|event
```

## Alternative Backend Options

### 1. Separate Backend (Express.js)

If you prefer a separate backend service:

- Express.js + TypeScript
- Prisma ORM
- JWT authentication
- Redis for caching

### 2. Serverless Functions

- Vercel Functions
- AWS Lambda
- Netlify Functions

### 3. Backend-as-a-Service

- Supabase (PostgreSQL + Auth + Storage)
- Firebase (Firestore + Auth + Storage)
- PlanetScale (MySQL)

## Recommended Tech Stack

**For MVP:**

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js for authentication
- Vercel for deployment

**For Scale:**

- Express.js backend
- PostgreSQL with read replicas
- Redis for caching
- AWS S3 for media storage
- Docker for containerization

## Authentication Setup

```bash
pnpm install next-auth @auth/prisma-adapter
```

Add to your schema:

```prisma
// Add to schema.prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Add to User model:
model User {
  // ... existing fields
  accounts Account[]
  sessions Session[]
}
```
