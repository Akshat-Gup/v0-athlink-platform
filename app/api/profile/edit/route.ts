import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        talent_profile: true,
        team_profile: true,
        event_profile: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user basic information
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        primary_sport: primary_sport || user.primary_sport,
        bio: bio !== undefined ? bio : user.bio,
        years_experience: years_experience !== undefined ? years_experience : user.years_experience,
        country_code: country_code !== undefined ? country_code : user.country_code,
        team_emoji: team_emoji !== undefined ? team_emoji : user.team_emoji,
      }
    })

    // Update talent profile if user is an athlete
    if (user.category === "Athlete" || user.talent_profile) {
      if (user.talent_profile) {
        await prisma.talentProfile.update({
          where: { user_id: user.id },
          data: {
            current_funding: current_funding !== undefined ? current_funding : user.talent_profile.current_funding,
            goal_funding: goal_funding !== undefined ? goal_funding : user.talent_profile.goal_funding,
            price: price !== undefined ? price : user.talent_profile.price,
            period: period !== undefined ? period : user.talent_profile.period,
            achievements: achievements !== undefined ? achievements : user.talent_profile.achievements,
            fit_type: fit_type !== undefined ? fit_type : user.talent_profile.fit_type,
          }
        })
      } else if (current_funding !== undefined || goal_funding !== undefined || 
                 price !== undefined || period !== undefined || 
                 achievements !== undefined || fit_type !== undefined) {
        // Create talent profile if it doesn't exist and we have talent data
        await prisma.talentProfile.create({
          data: {
            user_id: user.id,
            current_funding: current_funding || 0,
            goal_funding: goal_funding || 0,
            price: price || "",
            period: period || "",
            achievements: achievements || "",
            fit_type: fit_type || "",
          }
        })
      }
    }

    // Update team profile if user is a team
    if (user.category === "Team" || user.team_profile) {
      if (user.team_profile) {
        await prisma.teamProfile.update({
          where: { user_id: user.id },
          data: {
            current_funding: current_funding !== undefined ? current_funding : user.team_profile.current_funding,
            goal_funding: goal_funding !== undefined ? goal_funding : user.team_profile.goal_funding,
            league: league !== undefined ? league : user.team_profile.league,
            wins: wins !== undefined ? wins : user.team_profile.wins,
            losses: losses !== undefined ? losses : user.team_profile.losses,
            ranking: ranking !== undefined ? ranking : user.team_profile.ranking,
            members: members !== undefined ? members : user.team_profile.members,
          }
        })
      } else if (league !== undefined || wins !== undefined || 
                 losses !== undefined || ranking !== undefined || 
                 members !== undefined) {
        // Create team profile if it doesn't exist and we have team data
        await prisma.teamProfile.create({
          data: {
            user_id: user.id,
            current_funding: current_funding || 0,
            goal_funding: goal_funding || 0,
            league: league || "",
            wins: wins || 0,
            losses: losses || 0,
            ranking: ranking,
            members: members || 0,
          }
        })
      }
    }

    // Update event profile if user is an event
    if (user.category === "Event" || user.event_profile) {
      if (user.event_profile) {
        await prisma.eventProfile.update({
          where: { user_id: user.id },
          data: {
            venue: venue !== undefined ? venue : user.event_profile.venue,
            capacity: capacity !== undefined ? capacity.toString() : user.event_profile.capacity,
            ticket_price: ticket_price !== undefined ? ticket_price.toString() : user.event_profile.ticket_price,
            organizer: organizer !== undefined ? organizer : user.event_profile.organizer,
            event_type: event_type !== undefined ? event_type : user.event_profile.event_type,
          }
        })
      } else if (venue !== undefined || capacity !== undefined || 
                 ticket_price !== undefined || organizer !== undefined || 
                 event_type !== undefined) {
        // Create event profile if it doesn't exist and we have event data
        await prisma.eventProfile.create({
          data: {
            user_id: user.id,
            location_id: 1, // Default location ID, should be updated separately
            venue: venue || "",
            capacity: capacity?.toString() || "0",
            ticket_price: ticket_price?.toString() || "0",
            organizer: organizer || "",
            event_type: event_type || "",
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            duration: "1 day", // Default duration
          }
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
  } finally {
    await prisma.$disconnect()
  }
}
