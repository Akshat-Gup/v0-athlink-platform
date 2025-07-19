// ============================================================================
// CORE USER PROFILE SCHEMAS
// ============================================================================

export interface User {
  id: number
  name: string
  email: string
  primary_sport: string
  base_location_id: number // References Location table
  country_code: string // e.g., "US"
  country_flag: string // e.g., "🇺🇸"
  team_emoji: string // e.g., "🎾"
  rating: number
  rating_source?: string // e.g., "ATP", "WTA", "custom", "api_provider"
  rating_last_updated?: Date
  bio: string
  profile_image_id?: number // References uploaded file
  cover_image_id?: number // References uploaded file
  category: "talent" | "coach" | "facility" | "organization"
  talent_type_id?: number // Only for talents - references TalentType
  verification_status: "verified" | "pending" | "unverified"
  years_experience: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// ============================================================================
// TALENT TYPE SYSTEM
// ============================================================================

export interface TalentType {
  id: number
  type_key: string // e.g., "athlete", "content_creator", "influencer", "coach_talent"
  type_name: string // e.g., "Athlete", "Content Creator", "Influencer"
  description: string
  icon: string
  color: string
  requires_sports: boolean // Whether this talent type requires sport associations
  requires_leagues: boolean // Whether this talent type requires league associations
  is_active: boolean
  created_at: Date
}

// ============================================================================
// FIT TYPE SYSTEM (for matching/recommendations)
// ============================================================================

export interface FitType {
  id: number
  fit_key: string // e.g., "perfect_fit", "good_fit", "potential_fit"
  fit_name: string // e.g., "Perfect Fit", "Good Fit", "Potential Fit"
  description: string
  color: string // For UI display
  score_range_min: number // e.g., 90 for perfect fit
  score_range_max: number // e.g., 100 for perfect fit
  display_order: number
  is_active: boolean
  created_at: Date
}

// ============================================================================
// LOCATION SYSTEM (with external service integration)
// ============================================================================

export interface Location {
  id: number
  place_id?: string // Google Places ID or similar external service ID
  name: string // e.g., "New York, NY, USA"
  formatted_address: string
  city: string
  state_province?: string
  country: string
  country_code: string
  postal_code?: string
  latitude: number
  longitude: number
  timezone?: string
  location_type: "city" | "venue" | "facility" | "region" | "custom"
  external_data?: Record<string, any> // Store additional data from location service
  is_verified: boolean // Whether location data has been verified with external service
  last_verified: Date
  created_at: Date
  updated_at: Date
}

// ============================================================================
// SPORTS AND LEAGUES SYSTEM (many-to-many with users)
// ============================================================================

export interface Sport {
  id: number
  sport_key: string // e.g., "tennis", "basketball", "soccer"
  sport_name: string // e.g., "Tennis", "Basketball", "Soccer"
  description?: string
  icon: string
  is_team_sport: boolean
  is_individual_sport: boolean
  is_active: boolean
  created_at: Date
}

export interface League {
  id: number
  league_key: string // e.g., "atp", "wta", "nba", "nfl"
  league_name: string // e.g., "ATP", "WTA", "NBA", "NFL"
  sport_id: number
  description?: string
  logo_file_id?: number
  website_url?: string
  country_code?: string // Primary country for the league
  level: "professional" | "amateur" | "youth" | "college" | "international"
  is_active: boolean
  created_at: Date
}

// Junction table for user-sport relationships
export interface UserSport {
  id: number
  user_id: number
  sport_id: number
  skill_level: "beginner" | "intermediate" | "advanced" | "professional" | "elite"
  years_experience: number
  is_primary: boolean // One sport should be marked as primary
  current_rating?: number
  rating_source?: string
  created_at: Date
  updated_at: Date
}

// Junction table for user-league relationships
export interface UserLeague {
  id: number
  user_id: number
  league_id: number
  participation_status: "active" | "former" | "aspiring" | "qualified"
  start_date?: Date
  end_date?: Date
  current_ranking?: number
  best_ranking?: number
  total_earnings?: number
  notes?: string
  created_at: Date
  updated_at: Date
}

// ============================================================================
// RATINGS SYSTEM (with external API integration)
// ============================================================================

export interface RatingProvider {
  id: number
  provider_key: string // e.g., "atp", "wta", "custom", "elo_rating"
  provider_name: string // e.g., "ATP Rankings", "WTA Rankings"
  sport_id?: number // If provider is sport-specific
  api_endpoint?: string
  api_key_required: boolean
  update_frequency: "real_time" | "daily" | "weekly" | "monthly"
  is_active: boolean
  created_at: Date
}

export interface UserRating {
  id: number
  user_id: number
  rating_provider_id: number
  current_rating: number
  previous_rating?: number
  best_rating?: number
  rating_date: Date
  external_player_id?: string // ID in the external rating system
  additional_data?: Record<string, any> // Store provider-specific data
  created_at: Date
  updated_at: Date
}

// ============================================================================
// FILE UPLOAD SYSTEM (for all media)
// ============================================================================

export interface UploadedFile {
  id: number
  original_filename: string
  stored_filename: string
  file_path: string
  file_size: number
  mime_type: string
  file_type: "image" | "video" | "document" | "audio"
  uploaded_by_user_id: number
  upload_date: Date
  is_processed: boolean // For video processing, image optimization, etc.
  metadata?: Record<string, any> // Width, height, duration, etc.
}

// ============================================================================
// EXTENSIBLE USER FIELDS SYSTEM (demographics, quick facts, performance stats)
// ============================================================================

export interface UserFieldDefinition {
  id: number
  field_key: string // e.g., "gender", "age", "height", "ranking", "win_rate"
  field_label: string // e.g., "GENDER", "AGE", "HEIGHT", "RANKING"
  field_type: "text" | "number" | "date" | "select" | "boolean" | "measurement" | "percentage" | "currency" | "ratio"
  field_icon: string // e.g., "👤", "📅", "📏", "🏆"
  field_unit?: string // e.g., "cm", "kg", "years", "$", "%"
  field_options?: string[] // For select fields
  field_section: "demographics" | "quick_facts" | "physical_stats" | "performance_stats" | "career_stats"
  applicable_categories: ("talent" | "coach" | "facility" | "organization")[] // Which user types this field applies to
  applicable_talent_types?: number[] // Which talent types this field applies to
  is_searchable: boolean // Can be used in discover filters
  is_required: boolean
  is_active: boolean
  display_order: number
  created_at: Date
}

export interface UserFieldValue {
  id: number
  user_id: number
  field_definition_id: number
  value: string // Store all values as strings, convert as needed
  created_at: Date
  updated_at: Date
}

// ============================================================================
// UNIFIED EVENT SYSTEM (competitions, showcases, exhibitions, etc.)
// ============================================================================

export interface EventType {
  id: number
  type_key: string // e.g., "tournament", "showcase", "exhibition", "training_camp"
  type_name: string // e.g., "Tournament", "Showcase", "Exhibition"
  description: string
  icon: string
  color: string
  is_competitive: boolean // Whether this event type involves competition/results
  supports_teams: boolean // Whether teams can participate
  supports_individuals: boolean // Whether individual talents can participate
  is_active: boolean
  created_at: Date
}

export interface Event {
  id: number
  name: string
  description?: string
  event_type_id: number
  location_id: number // References Location table
  start_date: Date
  end_date?: Date // For multi-day events
  registration_deadline?: Date
  sport_id: number // References Sport table
  league_id?: number // Optional league association
  level: "professional" | "amateur" | "youth" | "college" | "international" | "recreational"
  organizer_user_id?: number // User who created/organizes the event
  organizer_name?: string // External organizer
  max_participants?: number
  registration_fee?: number
  prize_pool?: number
  website_url?: string
  featured_image_id?: number
  venue_name?: string // Specific venue within the location
  venue_address?: string
  status:
    | "draft"
    | "published"
    | "registration_open"
    | "registration_closed"
    | "in_progress"
    | "completed"
    | "cancelled"
  is_featured: boolean
  created_at: Date
  updated_at: Date
}

// ============================================================================
// EVENT PARTICIPATION SYSTEM (users participating in events)
// ============================================================================

export interface EventParticipant {
  id: number
  event_id: number
  user_id: number
  participation_type: "individual" | "team_member" | "team_representative" | "organizer" | "sponsor"
  team_id?: number // If participating as part of a team
  registration_date: Date
  registration_status: "registered" | "pending" | "approved" | "declined" | "waitlisted"
  payment_status?: "pending" | "paid" | "refunded" | "waived"
  notes?: string
  created_at: Date
  updated_at: Date
}

// ============================================================================
// EVENT RESULTS SYSTEM (for competitive events)
// ============================================================================

export interface EventResult {
  id: number
  event_id: number
  participant_id: number // References EventParticipant
  result: string // e.g., "1st Place", "Semifinalist", "Win", "Loss"
  placement?: number // Numeric placement (1, 2, 3, etc.)
  score?: string // e.g., "6-4, 6-2", "21-18"
  opponent_participant_id?: number // For head-to-head events
  opponent_name?: string // For external opponents
  prize_money?: number
  notes?: string
  created_at: Date
  updated_at: Date
}

// ============================================================================
// INDIVIDUAL PERFORMANCE STATS PER EVENT RESULT
// ============================================================================

export interface EventStatField {
  id: number
  sport_id: number
  event_type_id: number
  field_key: string // e.g., "points", "rebounds", "assists", "aces", "double_faults"
  field_label: string // e.g., "Points", "Rebounds", "Assists"
  field_type: "number" | "percentage" | "time" | "text"
  field_unit?: string // e.g., "pts", "min", "%"
  is_active: boolean
  display_order: number
  created_at: Date
}

export interface EventResultStat {
  id: number
  event_result_id: number
  stat_field_id: number
  value: string
  created_at: Date
}

// ============================================================================
// TEAM SYSTEM WITH TALENT RELATIONSHIPS
// ============================================================================

export interface Team {
  id: number
  name: string
  description?: string
  team_type: "professional" | "club" | "academy" | "national" | "college" | "recreational"
  sport_id: number // References Sport table
  league_id?: number // Optional league association
  location_id: number // References Location table
  logo_file_id?: number // References uploaded file
  cover_image_id?: number
  website_url?: string
  founded_date?: Date
  owner_user_id?: number // User who owns/manages the team
  is_recruiting: boolean
  max_members?: number
  venue_name?: string // Home venue name
  venue_address?: string // Home venue address
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// Junction table for team-talent relationships
export interface TeamMembership {
  id: number
  team_id: number
  user_id: number
  role: "player" | "captain" | "coach" | "manager" | "staff" | "scout"
  membership_status: "active" | "inactive" | "pending" | "invited" | "declined" | "alumni"
  start_date: Date
  end_date?: Date
  jersey_number?: string
  position?: string
  is_starter: boolean
  invited_by_user_id?: number // Who invited this person
  notes?: string
  created_at: Date
  updated_at: Date
}

// Teams can tag talents for recruitment
export interface TeamTalentTag {
  id: number
  team_id: number
  talent_user_id: number
  tagged_by_user_id: number // Team member who tagged this talent
  tag_type: "scouted" | "interested" | "contacted" | "offered" | "recruited"
  fit_type_id?: number // References FitType for matching score
  fit_score?: number // Calculated fit score (0-100)
  priority: "low" | "medium" | "high"
  notes?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// ============================================================================
// TEAM-EVENT RELATIONSHIPS
// ============================================================================

export interface TeamEventParticipation {
  id: number
  team_id: number
  event_id: number
  participation_status: "registered" | "confirmed" | "declined" | "waitlisted"
  registered_by_user_id: number
  team_members_count?: number
  notes?: string
  created_at: Date
  updated_at: Date
}

// ============================================================================
// ACHIEVEMENTS SYSTEM (can be linked to events or standalone)
// ============================================================================

export interface Achievement {
  id: number
  user_id: number
  title: string
  description: string
  achievement_date: Date
  achievement_type: "major" | "championship" | "recognition" | "tournament" | "personal" | "milestone" | "team"
  icon_type: "trophy" | "medal" | "award" | "star" | "target" | "team"
  is_featured: boolean
  // Link to specific event result if achievement came from an event
  linked_event_result_id?: number
  // Link to team if it's a team achievement
  linked_team_id?: number
  created_at: Date
  updated_at: Date
}

// ============================================================================
// MEDIA ATTACHMENT SYSTEM (files can be attached to multiple entities)
// ============================================================================

export interface MediaCategory {
  id: number
  category_name: string // e.g., "training", "showcase", "events", "achievements", "team"
  category_display_name: string // e.g., "Training", "Showcase", "Events"
  applicable_entities: ("user" | "event" | "achievement" | "team" | "campaign")[]
  is_active: boolean
}

export interface MediaItem {
  id: number
  uploaded_file_id: number
  title: string
  description?: string
  category_id: number
  uploaded_by_user_id: number
  view_count?: number
  like_count?: number
  is_featured: boolean
  display_order?: number
  created_at: Date
  updated_at: Date
}

// Junction table for attaching media to different entities
export interface MediaAttachment {
  id: number
  media_item_id: number
  entity_type: "user" | "event" | "event_result" | "achievement" | "team" | "campaign"
  entity_id: number
  attachment_type: "gallery" | "featured" | "proof" | "highlight" | "cover"
  created_at: Date
}

// ============================================================================
// SOCIAL MEDIA SYSTEM
// ============================================================================

export interface SocialMediaPlatform {
  id: number
  platform_name: string // e.g., "instagram", "twitter", "youtube"
  platform_display_name: string // e.g., "Instagram", "Twitter", "YouTube"
  platform_icon: string
  platform_color: string
  base_url: string // e.g., "https://instagram.com/"
  is_active: boolean
}

export interface UserSocialMedia {
  id: number
  user_id: number
  platform_id: number
  username: string
  follower_count?: number
  is_verified: boolean
  created_at: Date
  updated_at: Date
}

// ============================================================================
// PERFORMANCE HISTORY SYSTEM (for charts over time)
// ============================================================================

export interface UserPerformanceHistory {
  id: number
  user_id: number
  record_date: Date
  metric_type: string // e.g., "ranking", "wins", "tournaments_played", "rating"
  metric_value: number
  event_id?: number // If this metric came from a specific event
  rating_provider_id?: number // If this is a rating metric
  notes?: string
  created_at: Date
}

// ============================================================================
// CAMPAIGN SYSTEM WITH DURATION MATCHING
// ============================================================================

export interface Campaign {
  id: number
  user_id: number
  title: string
  description: string
  goal_amount: number
  current_amount: number
  currency: string
  campaign_type: "sponsorship" | "equipment" | "training" | "event_participation" | "team_funding" | "general"
  start_date: Date
  end_date?: Date
  duration_days?: number // Calculated field for discover matching
  status: "active" | "completed" | "paused" | "cancelled"
  featured_image_id?: number
  linked_event_id?: number // If campaign is for a specific event
  linked_team_id?: number // If campaign is for a team
  location_id?: number // Campaign location (for local campaigns)
  created_at: Date
  updated_at: Date
}

export interface CampaignCheckpoint {
  id: number
  campaign_id: number
  amount: number
  reward_description: string
  is_unlocked: boolean
  unlocked_at?: Date
  display_order: number
  created_at: Date
}

export interface CampaignContribution {
  id: number
  campaign_id: number
  contributor_name?: string
  contributor_email?: string
  contributor_user_id?: number
  amount: number
  message?: string
  is_anonymous: boolean
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_method: string
  created_at: Date
}

// ============================================================================
// DISCOVER PAGE FILTER SYSTEM
// ============================================================================

export interface DiscoverFilter {
  id: number
  filter_key: string // e.g., "sport", "location", "rating", "age", "talent_type", "fit_type", "duration"
  filter_label: string // e.g., "Sport", "Location", "Rating", "Talent Type"
  filter_type: "select" | "multiselect" | "range" | "boolean" | "text" | "date_range" | "location_radius"
  filter_options?: string[] // For select/multiselect
  applicable_categories: ("talent" | "coach" | "facility" | "organization" | "team" | "event" | "campaign")[]
  data_source: "user_table" | "user_field" | "calculated" | "related_table" | "location_service"
  source_field?: string // Which field/table this filter queries
  is_active: boolean
  display_order: number
  created_at: Date
}

// ============================================================================
// EXTENSIBLE CUSTOM FIELDS SYSTEM
// ============================================================================

export interface CustomFieldDefinition {
  id: number
  entity_type: "user" | "team" | "event" | "campaign"
  field_key: string
  field_label: string
  field_type: "text" | "number" | "date" | "boolean" | "select" | "multiselect" | "url" | "email" | "file" | "location"
  field_options?: string[]
  applicable_categories?: string[] // For user entity, which user categories
  is_required: boolean
  is_searchable: boolean
  display_order: number
  is_active: boolean
  created_at: Date
}

export interface CustomFieldValue {
  id: number
  entity_type: "user" | "team" | "event" | "campaign"
  entity_id: number
  field_definition_id: number
  value: string
  file_id?: number
  location_id?: number // For location type fields
  created_at: Date
  updated_at: Date
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  notification_type:
    | "team_invitation"
    | "event_registration"
    | "achievement"
    | "campaign_update"
    | "talent_tag"
    | "rating_update"
    | "location_update"
    | "system"
  related_entity_type?: string
  related_entity_id?: number
  is_read: boolean
  action_url?: string
  created_at: Date
}

// ============================================================================
// OPTIMIZED DISCOVER VIEWS
// ============================================================================

// Unified discover view for all entity types with location and duration data
export interface DiscoverView {
  entity_id: number
  entity_type: "user" | "team" | "event" | "campaign"
  name: string
  description?: string
  sport: string
  sport_id: number
  location_name: string
  location_id: number
  latitude: number
  longitude: number
  country_code: string
  country_flag: string
  profile_image_path?: string
  cover_image_path?: string
  category?: string // For users
  talent_type?: string // For talents
  verification_status?: string // For users
  rating?: number // For users
  rating_source?: string // For users
  team_type?: string // For teams
  event_type?: string // For events
  start_date?: Date // For events
  end_date?: Date // For events/campaigns
  duration_days?: number // For events/campaigns
  is_recruiting?: boolean // For teams
  registration_status?: string // For events
  campaign_status?: string // For campaigns
  goal_amount?: number // For campaigns
  current_amount?: number // For campaigns
  // Aggregated metrics
  total_achievements: number
  total_events: number
  total_media_items: number
  total_followers: number
  total_members?: number // For teams
  total_participants?: number // For events
  total_sports: number // For users
  total_leagues: number // For users
  fit_score?: number // For talent matching
  fit_type?: string // For talent matching
  last_activity_date: Date
  created_at: Date
}

// ============================================================================
// EXTERNAL SERVICE INTEGRATION TYPES
// ============================================================================

export interface LocationServiceConfig {
  provider: "google_places" | "mapbox" | "here" | "custom"
  api_key: string
  api_endpoint?: string
  rate_limit?: number
  cache_duration_hours?: number
}

export interface RatingServiceConfig {
  provider: "atp" | "wta" | "fifa" | "custom_api"
  api_key?: string
  api_endpoint?: string
  update_frequency: "real_time" | "daily" | "weekly"
  sport_specific: boolean
}

export interface MapsEmbedConfig {
  provider: "google_maps" | "mapbox" | "openstreetmap"
  api_key?: string
  default_zoom: number
  map_style?: string
  show_markers: boolean
  show_radius: boolean
  cluster_markers: boolean
}

// ============================================================================
// TYPE HELPERS FOR FRONTEND
// ============================================================================

export interface FullUserProfile {
  user: User & {
    profile_image?: UploadedFile
    cover_image?: UploadedFile
    base_location: Location
    talent_type?: TalentType
  }
  sports: Array<
    UserSport & {
      sport: Sport
    }
  >
  leagues: Array<
    UserLeague & {
      league: League & { sport: Sport }
    }
  >
  ratings: Array<
    UserRating & {
      provider: RatingProvider
    }
  >
  fields: Array<UserFieldValue & { definition: UserFieldDefinition }>
  socialMedia: Array<UserSocialMedia & { platform: SocialMediaPlatform }>
  achievements: Array<
    Achievement & {
      linkedEventResult?: EventResult & { event: Event }
      linkedTeam?: Team
      media: Array<MediaItem & { file: UploadedFile }>
    }
  >
  eventParticipations: Array<
    EventParticipant & {
      event: Event & {
        type: EventType
        location: Location
        sport: Sport
        league?: League
      }
      result?: EventResult & {
        stats: Array<EventResultStat & { field: EventStatField }>
      }
      team?: Team
    }
  >
  teamMemberships: Array<
    TeamMembership & {
      team: Team & {
        logo?: UploadedFile
        location: Location
        sport: Sport
      }
    }
  >
  teamTags: Array<
    TeamTalentTag & {
      team: Team & { location: Location }
      taggedBy: User
      fitType?: FitType
    }
  >
  mediaGallery: Array<
    MediaItem & {
      file: UploadedFile
      category: MediaCategory
    }
  >
  performanceHistory: UserPerformanceHistory[]
  activeCampaigns: Array<
    Campaign & {
      checkpoints: CampaignCheckpoint[]
      featured_image?: UploadedFile
      linkedEvent?: Event & { location: Location }
      linkedTeam?: Team & { location: Location }
      location?: Location
    }
  >
  customFields: Array<
    CustomFieldValue & {
      definition: CustomFieldDefinition
      file?: UploadedFile
      location?: Location
    }
  >
}

export interface FullTeamProfile {
  team: Team & {
    logo?: UploadedFile
    cover_image?: UploadedFile
    location: Location
    sport: Sport
    league?: League
    owner?: User
  }
  members: Array<
    TeamMembership & {
      user: User & {
        profile_image?: UploadedFile
        base_location: Location
        talent_type?: TalentType
      }
    }
  >
  taggedTalents: Array<
    TeamTalentTag & {
      talent: User & {
        profile_image?: UploadedFile
        base_location: Location
        talent_type?: TalentType
      }
      taggedBy: User
      fitType?: FitType
    }
  >
  events: Array<
    TeamEventParticipation & {
      event: Event & {
        type: EventType
        location: Location
        sport: Sport
      }
    }
  >
  achievements: Array<
    Achievement & {
      user?: User
      media: Array<MediaItem & { file: UploadedFile }>
    }
  >
  campaigns: Array<
    Campaign & {
      checkpoints: CampaignCheckpoint[]
      featured_image?: UploadedFile
      location?: Location
    }
  >
  mediaGallery: Array<
    MediaItem & {
      file: UploadedFile
      category: MediaCategory
    }
  >
}

export interface FullEventProfile {
  event: Event & {
    type: EventType
    location: Location
    sport: Sport
    league?: League
    organizer?: User
    featured_image?: UploadedFile
  }
  participants: Array<
    EventParticipant & {
      user: User & {
        profile_image?: UploadedFile
        base_location: Location
        talent_type?: TalentType
      }
      team?: Team & { location: Location }
      result?: EventResult & {
        stats: Array<EventResultStat & { field: EventStatField }>
      }
    }
  >
  teams: Array<
    TeamEventParticipation & {
      team: Team & {
        logo?: UploadedFile
        location: Location
      }
      registeredBy: User
    }
  >
  mediaGallery: Array<
    MediaItem & {
      file: UploadedFile
      category: MediaCategory
    }
  >
  campaigns: Array<
    Campaign & {
      user: User
      featured_image?: UploadedFile
      location?: Location
    }
  >
}

// ============================================================================
// DATABASE QUERY HELPERS
// ============================================================================

export interface DiscoverQuery {
  entityTypes?: ("user" | "team" | "event" | "campaign")[]
  sport?: string
  sportIds?: number[]
  location?: string
  locationId?: number
  locationRadius?: number // In kilometers
  category?: string // For users
  talentType?: string // For talents
  teamType?: string // For teams
  eventType?: string // For events
  fitType?: string // For talent matching
  dateRange?: { start: Date; end: Date } // For events/campaigns
  durationRange?: { min: number; max: number } // For campaigns/events in days
  ratingRange?: { min: number; max: number }
  customFilters?: Record<string, any>
  sortBy?: "name" | "rating" | "created_at" | "activity" | "start_date" | "distance" | "fit_score"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface LocationQuery {
  query?: string // Search query for location
  latitude?: number
  longitude?: number
  radius?: number // In kilometers
  locationType?: string
  countryCode?: string
  includeCoordinates?: boolean
}

export interface RatingQuery {
  userId?: number
  sportId?: number
  providerId?: number
  dateFrom?: Date
  dateTo?: Date
  includeHistory?: boolean
}

export interface EventQuery {
  eventId?: number
  sportId?: number
  eventTypeId?: number
  locationId?: number
  dateFrom?: Date
  dateTo?: Date
  status?: string
  organizerId?: number
  includeParticipants?: boolean
  includeResults?: boolean
  includeLocation?: boolean
}

export interface TeamQuery {
  teamId?: number
  sportId?: number
  teamType?: string
  locationId?: number
  isRecruiting?: boolean
  ownerId?: number
  includeMembers?: boolean
  includeTags?: boolean
  includeLocation?: boolean
}

export interface CampaignQuery {
  campaignId?: number
  userId?: number
  status?: string
  campaignType?: string
  locationId?: number
  durationRange?: { min: number; max: number }
  amountRange?: { min: number; max: number }
  linkedEventId?: number
  linkedTeamId?: number
  includeLocation?: boolean
}
