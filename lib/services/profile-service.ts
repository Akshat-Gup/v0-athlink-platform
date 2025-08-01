import { createServerComponentClient } from '@/lib/supabase-client'

// Get talent profile data
export async function getTalentProfile(id: string) {
  try {
    const supabase = await createServerComponentClient()

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        base_location:locations(*),
        talent_types(*),
        talent_profiles(*),
        social_links(*),
        media_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching talent profile:', error)
      return null
    }

    if (!user || !user.talent_profiles?.[0]) {
      return null
    }

    const talentProfile = user.talent_profiles[0]

    // Transform data to match the existing structure
    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      sport: user.primary_sport,
      location: user.base_location ? `${user.base_location.city}, ${user.base_location.state || user.base_location.country}` : 'Location TBD',
      country: user.country_flag || '🌍',
      team: user.team_emoji || '⚽',
      rating: user.rating || 0,
      currentFunding: talentProfile.current_funding,
      goalFunding: talentProfile.goal_funding,
      price: talentProfile.price,
      period: talentProfile.period,
      image: user.media_items?.find(m => m.media_type === 'PHOTO')?.url || 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop',
      coverImage: user.media_items?.find(m => m.category === 'cover')?.url || 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop',
      achievements: talentProfile.achievements || '',
      category: 'talent',
      bio: user.bio || '',

      // Basic stats
      stats: {
        tournaments: 0, // Will need to fetch from competitions table
        wins: 0,
        ranking: '#' + Math.floor((user.rating || 0) * 20),
      },

      // Placeholder data for complex queries
      demographics: [],
      performanceStats: [],
      socials: user.social_links?.reduce((acc, link) => {
        acc[link.platform] = link.username
        return acc
      }, {} as Record<string, string>) || {},
      achievementsList: [],
      pastResults: {},
      media: user.media_items || [],
      fundingProgress: {
        current: talentProfile.current_funding || 0,
        goal: talentProfile.goal_funding || 0,
        percentage: talentProfile.goal_funding ? Math.round((talentProfile.current_funding || 0) / talentProfile.goal_funding * 100) : 0,
      },
    }

    return profile
  } catch (error) {
    console.error('Error in getTalentProfile:', error)
    return null
  }
}

// Get team profile data  
export async function getTeamProfile(id: string) {
  try {
    const supabase = await createServerComponentClient()

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        base_location:locations(*),
        team_profiles(*),
        social_links(*),
        media_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching team profile:', error)
      return null
    }

    if (!user || !user.team_profiles?.[0]) {
      return null
    }

    const teamProfile = user.team_profiles[0]

    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      sport: user.primary_sport,
      location: user.base_location ? `${user.base_location.city}, ${user.base_location.state || user.base_location.country}` : 'Location TBD',
      country: user.country_flag || '🌍',
      team: user.team_emoji || '🏆',
      rating: user.rating || 0,
      currentFunding: teamProfile.current_funding,
      goalFunding: teamProfile.goal_funding,
      image: user.media_items?.find(m => m.media_type === 'PHOTO')?.url || 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop',
      coverImage: user.media_items?.find(m => m.category === 'cover')?.url || 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop',
      bio: user.bio || '',
      category: 'team',
      league: teamProfile.league,
      wins: teamProfile.wins || 0,
      losses: teamProfile.losses || 0,
      ranking: teamProfile.ranking,
      members: teamProfile.members || 0,
      socials: user.social_links?.reduce((acc, link) => {
        acc[link.platform] = link.username
        return acc
      }, {} as Record<string, string>) || {},
      media: user.media_items || [],
    }

    return profile
  } catch (error) {
    console.error('Error in getTeamProfile:', error)
    return null
  }
}

// Get event profile data
export async function getEventProfile(id: string) {
  try {
    const supabase = await createServerComponentClient()

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        base_location:locations(*),
        event_profiles(*),
        social_links(*),
        media_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching event profile:', error)
      return null
    }

    if (!user || !user.event_profiles?.[0]) {
      return null
    }

    const eventProfile = user.event_profiles[0]

    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      sport: user.primary_sport,
      location: user.base_location ? `${user.base_location.city}, ${user.base_location.state || user.base_location.country}` : 'Location TBD',
      country: user.country_flag || '🌍',
      team: user.team_emoji || '📅',
      rating: user.rating || 0,
      currentFunding: eventProfile.current_funding,
      goalFunding: eventProfile.goal_funding,
      image: user.media_items?.find(m => m.media_type === 'PHOTO')?.url || 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop',
      coverImage: user.media_items?.find(m => m.category === 'cover')?.url || 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop',
      bio: user.bio || '',
      category: 'event',
      eventType: eventProfile.event_type,
      startDate: eventProfile.start_date,
      endDate: eventProfile.end_date,
      maxParticipants: eventProfile.max_participants,
      currentParticipants: eventProfile.current_participants || 0,
      status: eventProfile.status,
      socials: user.social_links?.reduce((acc, link) => {
        acc[link.platform] = link.username
        return acc
      }, {} as Record<string, string>) || {},
      media: user.media_items || [],
    }

    return profile
  } catch (error) {
    console.error('Error in getEventProfile:', error)
    return null
  }
}
