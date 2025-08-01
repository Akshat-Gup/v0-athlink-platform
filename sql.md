-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables in dependency order

-- talent_types table
CREATE TABLE talent_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_key TEXT UNIQUE NOT NULL,
  type_name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  requires_sports BOOLEAN DEFAULT TRUE,
  requires_leagues BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT locations_city_state_country_key UNIQUE (city, state, country)
);

-- files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- sponsors table
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  company_name TEXT,
  company_description TEXT,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  budget_range TEXT,
  preferred_sports TEXT,
  location TEXT,
  verification_status TEXT DEFAULT 'UNVERIFIED',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- users table (main entity)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  user_role TEXT,
  primary_sport TEXT NOT NULL,
  base_location_id UUID NOT NULL REFERENCES locations(id),
  country_code TEXT NOT NULL,
  country_flag TEXT NOT NULL,
  team_emoji TEXT NOT NULL,
  rating FLOAT NOT NULL,
  rating_source TEXT,
  rating_last_updated TIMESTAMP,
  bio TEXT NOT NULL,
  profile_image_id UUID REFERENCES files(id),
  cover_image_id UUID REFERENCES files(id),
  category TEXT NOT NULL,
  talent_type_id UUID REFERENCES talent_types(id),
  verification_status TEXT DEFAULT 'UNVERIFIED',
  years_experience INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- talent_profiles table
CREATE TABLE talent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_funding INTEGER,
  goal_funding INTEGER,
  price TEXT,
  period TEXT,
  achievements TEXT NOT NULL,
  fit_type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- talent_stats table
CREATE TABLE talent_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_profile_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'GENERAL',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- talent_achievements table
CREATE TABLE talent_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_profile_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- talent_competitions table
CREATE TABLE talent_competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_profile_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  tournament TEXT NOT NULL,
  date TEXT NOT NULL,
  result TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  year INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- talent_performance table
CREATE TABLE talent_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_profile_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  ranking INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- talent_checkpoints table
CREATE TABLE talent_checkpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_profile_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reward TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- team_profiles table
CREATE TABLE team_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_funding INTEGER,
  goal_funding INTEGER,
  league TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ranking INTEGER,
  members INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- team_stats table
CREATE TABLE team_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_profile_id UUID NOT NULL REFERENCES team_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'GENERAL',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_profile_id UUID NOT NULL REFERENCES team_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  number INTEGER NOT NULL,
  image_url TEXT,
  stats JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- team_games table
CREATE TABLE team_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_profile_id UUID NOT NULL REFERENCES team_profiles(id) ON DELETE CASCADE,
  opponent TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  time TEXT,
  result TEXT,
  image_url TEXT,
  is_upcoming BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- team_checkpoints table
CREATE TABLE team_checkpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_profile_id UUID NOT NULL REFERENCES team_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reward TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- team_performance table
CREATE TABLE team_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_profile_id UUID NOT NULL REFERENCES team_profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  ranking INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- event_profiles table
CREATE TABLE event_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  current_funding INTEGER,
  goal_funding INTEGER,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  duration TEXT NOT NULL,
  venue TEXT NOT NULL,
  capacity TEXT NOT NULL,
  ticket_price TEXT,
  organizer TEXT,
  event_type TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- event_stats table
CREATE TABLE event_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_profile_id UUID NOT NULL REFERENCES event_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'GENERAL',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- event_participants table
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_profile_id UUID NOT NULL REFERENCES event_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- event_schedule table
CREATE TABLE event_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_profile_id UUID NOT NULL REFERENCES event_profiles(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  date TEXT NOT NULL,
  events JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- event_checkpoints table
CREATE TABLE event_checkpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_profile_id UUID NOT NULL REFERENCES event_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reward TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- event_ticket_sales table
CREATE TABLE event_ticket_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_profile_id UUID NOT NULL REFERENCES event_profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  sold INTEGER NOT NULL,
  revenue INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- media_items table
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  media_type TEXT NOT NULL,
  platform TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- social_links table
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT social_links_user_id_platform_key UNIQUE (user_id, platform)
);

-- sponsor_relations table
CREATE TABLE sponsor_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sponsored_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  tier TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- sponsor_contributions table
CREATE TABLE sponsor_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount FLOAT NOT NULL,
  currency TEXT DEFAULT 'USD',
  message TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- user_tags table
CREATE TABLE user_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  CONSTRAINT user_tags_user_id_tag_id_key UNIQUE (user_id, tag_id)
);

-- campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  funding_goal FLOAT NOT NULL,
  current_funding FLOAT DEFAULT 0,
  status TEXT DEFAULT 'OPEN',
  deadline TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- perk_tiers table
CREATE TABLE perk_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL,
  amount FLOAT NOT NULL,
  description TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  max_sponsors INTEGER,
  current_sponsors INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- sponsorship_requests table
CREATE TABLE sponsorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sponsor_entity_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  perk_tier_id UUID REFERENCES perk_tiers(id) ON DELETE SET NULL,
  amount FLOAT NOT NULL,
  custom_perks TEXT,
  message TEXT,
  status TEXT DEFAULT 'PENDING',
  is_custom BOOLEAN DEFAULT FALSE,
  escrow_status TEXT DEFAULT 'HELD',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT favorites_user_id_profile_id_key UNIQUE (user_id, profile_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_talent_type ON users(talent_type_id);
CREATE INDEX idx_users_base_location ON users(base_location_id);
CREATE INDEX idx_media_items_user ON media_items(user_id);
CREATE INDEX idx_social_links_user ON social_links(user_id);
CREATE INDEX idx_sponsor_relations_sponsor ON sponsor_relations(sponsor_id);
CREATE INDEX idx_sponsor_relations_sponsored ON sponsor_relations(sponsored_id);
CREATE INDEX idx_sponsor_contributions_sponsor ON sponsor_contributions(sponsor_id);
CREATE INDEX idx_sponsor_contributions_recipient ON sponsor_contributions(recipient_id);
CREATE INDEX idx_user_tags_user ON user_tags(user_id);
CREATE INDEX idx_user_tags_tag ON user_tags(tag_id);
CREATE INDEX idx_campaigns_athlete ON campaigns(athlete_id);
CREATE INDEX idx_perk_tiers_campaign ON perk_tiers(campaign_id);
CREATE INDEX idx_sponsorship_requests_campaign ON sponsorship_requests(campaign_id);
CREATE INDEX idx_sponsorship_requests_sponsor ON sponsorship_requests(sponsor_id);
CREATE INDEX idx_sponsorship_requests_athlete ON sponsorship_requests(athlete_id);
CREATE INDEX idx_sponsorship_requests_perk_tier ON sponsorship_requests(perk_tier_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_profile ON favorites(profile_id);