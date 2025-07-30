-- Supabase Migration: Convert Prisma schema to Supabase
-- This migration converts integer IDs to UUIDs and sets up RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
CREATE TYPE campaign_status AS ENUM ('OPEN', 'FUNDED', 'CLOSED', 'CANCELLED');
CREATE TYPE contribution_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE sponsor_relation_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE sponsorship_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE escrow_status AS ENUM ('HELD', 'RELEASED', 'REFUNDED');
CREATE TYPE profile_type AS ENUM ('ATHLETE', 'TEAM', 'EVENT', 'SPONSOR');

-- Create users table (main table - needs to be first)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR,
    user_role VARCHAR,
    primary_sport VARCHAR,
    base_location_id UUID,
    country_code VARCHAR,
    country_flag VARCHAR,
    team_emoji VARCHAR,
    rating DOUBLE PRECISION,
    rating_source VARCHAR,
    rating_last_updated TIMESTAMPTZ,
    bio TEXT,
    profile_image_id UUID,
    cover_image_id UUID,
    category VARCHAR,
    talent_type_id UUID,
    verification_status verification_status DEFAULT 'UNVERIFIED',
    years_experience INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    image TEXT,
    email_verified TIMESTAMPTZ
);

-- Create locations table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR NOT NULL,
    state VARCHAR,
    country VARCHAR NOT NULL,
    country_code VARCHAR NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create files table
CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR NOT NULL,
    original_name VARCHAR NOT NULL,
    mime_type VARCHAR NOT NULL,
    size INTEGER NOT NULL,
    url VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create talent_types table
CREATE TABLE public.talent_types (
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

-- Create tags table
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    category VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    funding_goal DOUBLE PRECISION NOT NULL,
    current_funding DOUBLE PRECISION DEFAULT 0,
    status campaign_status DEFAULT 'OPEN',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (athlete_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create talent_profiles table
CREATE TABLE public.talent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    current_funding INTEGER,
    goal_funding INTEGER,
    price VARCHAR,
    period VARCHAR,
    achievements TEXT NOT NULL,
    fit_type VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create team_profiles table
CREATE TABLE public.team_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    current_funding INTEGER,
    goal_funding INTEGER,
    league VARCHAR,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    ranking INTEGER,
    members INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create event_profiles table
CREATE TABLE public.event_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    location_id UUID NOT NULL,
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
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES public.locations(id)
);

-- Create sponsors table
CREATE TABLE public.sponsors (
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

-- Add foreign key constraints to users table
ALTER TABLE public.users 
    ADD FOREIGN KEY (base_location_id) REFERENCES public.locations(id),
    ADD FOREIGN KEY (profile_image_id) REFERENCES public.files(id),
    ADD FOREIGN KEY (cover_image_id) REFERENCES public.files(id),
    ADD FOREIGN KEY (talent_type_id) REFERENCES public.talent_types(id);

-- Create remaining tables with foreign key references
CREATE TABLE public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    platform VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    url VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.media_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    file_id UUID,
    url VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    media_type VARCHAR NOT NULL,
    platform VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES public.files(id)
);

CREATE TABLE public.user_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE
);

CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    profile_id UUID NOT NULL,
    profile_type profile_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.sponsor_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    message TEXT,
    status contribution_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (sponsor_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.sponsor_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID NOT NULL,
    sponsored_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    tier VARCHAR NOT NULL,
    status sponsor_relation_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (sponsor_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (sponsored_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.perk_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL,
    tier_name VARCHAR NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT NOT NULL,
    max_sponsors INTEGER,
    current_sponsors INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE
);

CREATE TABLE public.sponsorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL,
    sponsor_id UUID,
    sponsor_entity_id UUID,
    athlete_id UUID NOT NULL,
    perk_tier_id UUID,
    amount DOUBLE PRECISION NOT NULL,
    custom_perks TEXT,
    message TEXT,
    status sponsorship_status DEFAULT 'PENDING',
    is_custom BOOLEAN DEFAULT false,
    escrow_status escrow_status DEFAULT 'HELD',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (sponsor_id) REFERENCES public.users(id),
    FOREIGN KEY (sponsor_entity_id) REFERENCES public.sponsors(id),
    FOREIGN KEY (athlete_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (perk_tier_id) REFERENCES public.perk_tiers(id)
);

-- Create stats and detail tables
CREATE TABLE public.talent_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    talent_profile_id UUID NOT NULL,
    label VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    icon VARCHAR NOT NULL,
    category VARCHAR DEFAULT 'GENERAL',
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (talent_profile_id) REFERENCES public.talent_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.talent_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    talent_profile_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    date VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (talent_profile_id) REFERENCES public.talent_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.talent_competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    talent_profile_id UUID NOT NULL,
    tournament VARCHAR NOT NULL,
    date VARCHAR NOT NULL,
    result VARCHAR NOT NULL,
    location VARCHAR,
    image_url VARCHAR,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (talent_profile_id) REFERENCES public.talent_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.talent_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    talent_profile_id UUID NOT NULL,
    month VARCHAR NOT NULL,
    ranking INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (talent_profile_id) REFERENCES public.talent_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.talent_checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    talent_profile_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    reward VARCHAR NOT NULL,
    unlocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (talent_profile_id) REFERENCES public.talent_profiles(id) ON DELETE CASCADE
);

-- Team related tables
CREATE TABLE public.team_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_profile_id UUID NOT NULL,
    label VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    icon VARCHAR NOT NULL,
    category VARCHAR DEFAULT 'GENERAL',
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (team_profile_id) REFERENCES public.team_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_profile_id UUID NOT NULL,
    name VARCHAR NOT NULL,
    position VARCHAR NOT NULL,
    number INTEGER NOT NULL,
    image_url VARCHAR,
    stats JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (team_profile_id) REFERENCES public.team_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.team_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_profile_id UUID NOT NULL,
    opponent VARCHAR NOT NULL,
    date VARCHAR NOT NULL,
    location VARCHAR,
    time VARCHAR,
    result VARCHAR,
    image_url VARCHAR,
    is_upcoming BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (team_profile_id) REFERENCES public.team_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.team_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_profile_id UUID NOT NULL,
    month VARCHAR NOT NULL,
    ranking INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (team_profile_id) REFERENCES public.team_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.team_checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_profile_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    reward VARCHAR NOT NULL,
    unlocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (team_profile_id) REFERENCES public.team_profiles(id) ON DELETE CASCADE
);

-- Event related tables
CREATE TABLE public.event_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_profile_id UUID NOT NULL,
    label VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    icon VARCHAR NOT NULL,
    category VARCHAR DEFAULT 'GENERAL',
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (event_profile_id) REFERENCES public.event_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_profile_id UUID NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (event_profile_id) REFERENCES public.event_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.event_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_profile_id UUID NOT NULL,
    day INTEGER NOT NULL,
    date VARCHAR NOT NULL,
    events JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (event_profile_id) REFERENCES public.event_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.event_ticket_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_profile_id UUID NOT NULL,
    month VARCHAR NOT NULL,
    sold INTEGER NOT NULL,
    revenue INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (event_profile_id) REFERENCES public.event_profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.event_checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_profile_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    reward VARCHAR NOT NULL,
    unlocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (event_profile_id) REFERENCES public.event_profiles(id) ON DELETE CASCADE
);

-- NextAuth compatibility tables (optional - can be removed if not needed)
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR NOT NULL,
    provider VARCHAR NOT NULL,
    provider_account_id VARCHAR NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR,
    scope VARCHAR,
    id_token TEXT,
    session_state VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.verification_tokens (
    identifier VARCHAR NOT NULL,
    token VARCHAR NOT NULL UNIQUE,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (identifier, token)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_campaigns_athlete_id ON public.campaigns(athlete_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_sponsorship_requests_sponsor_id ON public.sponsorship_requests(sponsor_id);
CREATE INDEX idx_sponsorship_requests_athlete_id ON public.sponsorship_requests(athlete_id);
CREATE INDEX idx_sponsor_contributions_sponsor_id ON public.sponsor_contributions(sponsor_id);
CREATE INDEX idx_sponsor_contributions_recipient_id ON public.sponsor_contributions(recipient_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_profile_id ON public.favorites(profile_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view all profiles but only edit their own
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Campaigns are viewable by all, editable by owner
CREATE POLICY "Campaigns are viewable by all" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Users can manage own campaigns" ON public.campaigns FOR ALL USING (auth.uid() = athlete_id);

-- Sponsor contributions - sponsors see their contributions, recipients see received
CREATE POLICY "View own contributions" ON public.sponsor_contributions FOR SELECT USING (
    auth.uid() = sponsor_id OR auth.uid() = recipient_id
);
CREATE POLICY "Insert own contributions" ON public.sponsor_contributions FOR INSERT WITH CHECK (
    auth.uid() = sponsor_id
);

-- Sponsorship requests - related parties can view
CREATE POLICY "View related sponsorship requests" ON public.sponsorship_requests FOR SELECT USING (
    auth.uid() = sponsor_id OR auth.uid() = athlete_id
);
CREATE POLICY "Insert sponsorship requests" ON public.sponsorship_requests FOR INSERT WITH CHECK (
    auth.uid() = sponsor_id OR auth.uid() = athlete_id
);

-- Favorites - users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Profile tables - users can manage their own profiles
CREATE POLICY "Users can manage own talent profile" ON public.talent_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own team profile" ON public.team_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own event profile" ON public.event_profiles FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_talent_profiles_updated_at BEFORE UPDATE ON public.talent_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_team_profiles_updated_at BEFORE UPDATE ON public.team_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_event_profiles_updated_at BEFORE UPDATE ON public.event_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sponsor_contributions_updated_at BEFORE UPDATE ON public.sponsor_contributions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sponsorship_requests_updated_at BEFORE UPDATE ON public.sponsorship_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON public.sponsors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
