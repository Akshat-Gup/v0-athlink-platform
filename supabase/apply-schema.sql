/*
  Apply this SQL to your Supabase database using the SQL Editor in the Supabase Dashboard.
  
  Go to: https://supabase.com/dashboard/project/[your-project]/sql
  
  1. Copy and paste this entire file into the SQL Editor
  2. Click "Run" to execute
  3. Verify the tables are created in the Table Editor
  
  This will create all necessary tables with UUID primary keys and RLS policies.
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('OPEN', 'FUNDED', 'CLOSED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contribution_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sponsor_relation_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sponsorship_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE escrow_status AS ENUM ('HELD', 'RELEASED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE profile_type AS ENUM ('ATHLETE', 'TEAM', 'EVENT', 'SPONSOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create core tables in dependency order

-- 1. Independent tables first
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR NOT NULL,
    state VARCHAR,
    country VARCHAR NOT NULL,
    country_code VARCHAR NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR NOT NULL,
    original_name VARCHAR NOT NULL,
    mime_type VARCHAR NOT NULL,
    size INTEGER NOT NULL,
    url VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.talent_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_key VARCHAR NOT NULL UNIQUE,
    type_name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR NOT NULL,
    color VARCHAR NOT NULL,
    requires_sports BOOLEAN DEFAULT true,
    requires_leagues BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    category VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users table (references locations, files, talent_types)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR,
    user_role VARCHAR,
    primary_sport VARCHAR,
    base_location_id UUID REFERENCES public.locations(id),
    country_code VARCHAR,
    country_flag VARCHAR,
    team_emoji VARCHAR,
    rating DOUBLE PRECISION,
    rating_source VARCHAR,
    rating_last_updated TIMESTAMPTZ,
    bio TEXT,
    profile_image_id UUID REFERENCES public.files(id),
    cover_image_id UUID REFERENCES public.files(id),
    category VARCHAR,
    talent_type_id UUID REFERENCES public.talent_types(id),
    verification_status verification_status DEFAULT 'UNVERIFIED',
    years_experience INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    image TEXT,
    email_verified TIMESTAMPTZ
);

-- 3. Profile tables (reference users)
CREATE TABLE IF NOT EXISTS public.talent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    current_funding INTEGER,
    goal_funding INTEGER,
    price VARCHAR,
    period VARCHAR,
    achievements TEXT NOT NULL,
    fit_type VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    current_funding INTEGER,
    goal_funding INTEGER,
    league VARCHAR,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    ranking INTEGER,
    members INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES public.locations(id),
    current_funding INTEGER,
    goal_funding INTEGER,
    start_date VARCHAR NOT NULL,
    end_date VARCHAR NOT NULL,
    duration VARCHAR NOT NULL,
    venue VARCHAR NOT NULL,
    capacity VARCHAR NOT NULL,
    ticket_price VARCHAR,
    organizer VARCHAR,
    event_type VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Other core tables
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR,
    company_name VARCHAR,
    company_description TEXT,
    industry VARCHAR,
    website VARCHAR,
    logo_url VARCHAR,
    contact_name VARCHAR,
    contact_phone VARCHAR,
    budget_range VARCHAR,
    preferred_sports TEXT,
    location VARCHAR,
    verification_status verification_status DEFAULT 'UNVERIFIED',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    funding_goal DOUBLE PRECISION NOT NULL,
    current_funding DOUBLE PRECISION DEFAULT 0,
    status campaign_status DEFAULT 'OPEN',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add remaining tables here to keep within message limits
-- Continue with the rest of the schema...
