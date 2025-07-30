import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase"

export async function PATCH(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      primary_sport,
      bio,
      years_experience,
      country_code,
      team_emoji,
      // Talent profile fields
      current_funding,
      goal_funding,
      price,
      period,
      achievements,
      fit_type,
      // Team profile fields
      league,
      wins,
      losses,
      ranking,
      members,
      // Event profile fields
      venue,
      capacity,
      ticket_price,
      organizer,
      event_type
    } = body

    // Get the user from the database
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        talent_profile:talent_profiles(*),
        team_profile:team_profiles(*),
        event_profile:event_profiles(*)
      `)
      .eq('email', user.email)
      .single()

    if (userError || !dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user basic information
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        name: name || dbUser.name,
        primary_sport: primary_sport || dbUser.primary_sport,
        bio: bio !== undefined ? bio : dbUser.bio,
        years_experience: years_experience !== undefined ? years_experience : dbUser.years_experience,
        country_code: country_code !== undefined ? country_code : dbUser.country_code,
        team_emoji: team_emoji !== undefined ? team_emoji : dbUser.team_emoji,
      })
      .eq('id', dbUser.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating user:", updateError)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    // Update talent profile if user is an athlete
    if (dbUser.category === "Athlete" || dbUser.talent_profile) {
      if (dbUser.talent_profile) {
        await supabaseAdmin
          .from('talent_profiles')
          .update({
            current_funding: current_funding !== undefined ? current_funding : dbUser.talent_profile.current_funding,
            goal_funding: goal_funding !== undefined ? goal_funding : dbUser.talent_profile.goal_funding,
            price: price !== undefined ? price : dbUser.talent_profile.price,
            period: period !== undefined ? period : dbUser.talent_profile.period,
            achievements: achievements !== undefined ? achievements : dbUser.talent_profile.achievements,
            fit_type: fit_type !== undefined ? fit_type : dbUser.talent_profile.fit_type,
          })
          .eq('user_id', dbUser.id)
      } else if (current_funding !== undefined || goal_funding !== undefined || 
                 price !== undefined || period !== undefined || 
                 achievements !== undefined || fit_type !== undefined) {
        // Create talent profile if it doesn't exist and we have talent data
        await supabaseAdmin
          .from('talent_profiles')
          .insert({
            user_id: dbUser.id,
            current_funding: current_funding || 0,
            goal_funding: goal_funding || 0,
            price: price || "",
            period: period || "",
            achievements: achievements || "",
            fit_type: fit_type || "",
          })
      }
    }

    // Update team profile if user is a team
    if (dbUser.category === "Team" || dbUser.team_profile) {
      if (dbUser.team_profile) {
        await supabaseAdmin
          .from('team_profiles')
          .update({
            current_funding: current_funding !== undefined ? current_funding : dbUser.team_profile.current_funding,
            goal_funding: goal_funding !== undefined ? goal_funding : dbUser.team_profile.goal_funding,
            league: league !== undefined ? league : dbUser.team_profile.league,
            wins: wins !== undefined ? wins : dbUser.team_profile.wins,
            losses: losses !== undefined ? losses : dbUser.team_profile.losses,
            ranking: ranking !== undefined ? ranking : dbUser.team_profile.ranking,
            members: members !== undefined ? members : dbUser.team_profile.members,
          })
          .eq('user_id', dbUser.id)
      } else if (league !== undefined || wins !== undefined || 
                 losses !== undefined || ranking !== undefined || 
                 members !== undefined) {
        // Create team profile if it doesn't exist and we have team data
        await supabaseAdmin
          .from('team_profiles')
          .insert({
            user_id: dbUser.id,
            current_funding: current_funding || 0,
            goal_funding: goal_funding || 0,
            league: league || "",
            wins: wins || 0,
            losses: losses || 0,
            ranking: ranking,
            members: members || 0,
          })
      }
    }

    // Update event profile if user is an event
    if (dbUser.category === "Event" || dbUser.event_profile) {
      if (dbUser.event_profile) {
        await supabaseAdmin
          .from('event_profiles')
          .update({
            venue: venue !== undefined ? venue : dbUser.event_profile.venue,
            capacity: capacity !== undefined ? capacity.toString() : dbUser.event_profile.capacity,
            ticket_price: ticket_price !== undefined ? ticket_price.toString() : dbUser.event_profile.ticket_price,
            organizer: organizer !== undefined ? organizer : dbUser.event_profile.organizer,
            event_type: event_type !== undefined ? event_type : dbUser.event_profile.event_type,
          })
          .eq('user_id', dbUser.id)
      } else if (venue !== undefined || capacity !== undefined || 
                 ticket_price !== undefined || organizer !== undefined || 
                 event_type !== undefined) {
        // Get a default location ID (you may want to handle this differently)
        const { data: defaultLocation } = await supabaseAdmin
          .from('locations')
          .select('id')
          .limit(1)
          .single()

        // Create event profile if it doesn't exist and we have event data
        await supabaseAdmin
          .from('event_profiles')
          .insert({
            user_id: dbUser.id,
            location_id: defaultLocation?.id || '00000000-0000-0000-0000-000000000000', // Use default or generate UUID
            venue: venue || "",
            capacity: capacity?.toString() || "0",
            ticket_price: ticket_price?.toString() || "0",
            organizer: organizer || "",
            event_type: event_type || "",
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            duration: "1 day",
          })
      }
    }

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    })

  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
