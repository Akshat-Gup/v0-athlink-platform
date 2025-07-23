import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Los Angeles, CA, USA',
        formatted_address: 'Los Angeles, CA, USA',
        city: 'Los Angeles',
        state_province: 'CA',
        country: 'United States',
        country_code: 'US',
        latitude: 34.0522,
        longitude: -118.2437,
        location_type: 'city',
        is_verified: true,
        last_verified: new Date()
      }
    }),
    prisma.location.create({
      data: {
        name: 'New York, NY, USA',
        formatted_address: 'New York, NY, USA',
        city: 'New York',
        state_province: 'NY',
        country: 'United States',
        country_code: 'US',
        latitude: 40.7128,
        longitude: -74.0060,
        location_type: 'city',
        is_verified: true,
        last_verified: new Date()
      }
    })
  ])

  // Create sports
  const sports = await Promise.all([
    prisma.sport.create({
      data: {
        sport_key: 'tennis',
        sport_name: 'Tennis',
        description: 'Professional tennis',
        icon: '🎾',
        is_team_sport: false,
        is_individual_sport: true,
        is_active: true
      }
    }),
    prisma.sport.create({
      data: {
        sport_key: 'basketball',
        sport_name: 'Basketball',
        description: 'Professional basketball',
        icon: '🏀',
        is_team_sport: true,
        is_individual_sport: false,
        is_active: true
      }
    })
  ])

  // Create leagues
  const leagues = await Promise.all([
    prisma.league.create({
      data: {
        league_key: 'atp',
        league_name: 'ATP',
        sport_id: sports.find(s => s.sport_key === 'tennis')!.id,
        description: 'Association of Tennis Professionals',
        level: 'professional',
        is_active: true
      }
    }),
    prisma.league.create({
      data: {
        league_key: 'nba',
        league_name: 'NBA',
        sport_id: sports.find(s => s.sport_key === 'basketball')!.id,
        description: 'National Basketball Association',
        level: 'professional',
        is_active: true
      }
    })
  ])

  // Create talent types
  const talentTypes = await Promise.all([
    prisma.talentType.create({
      data: {
        type_key: 'athlete',
        type_name: 'Athlete',
        description: 'Professional athlete',
        icon: '🏃',
        is_active: true
      }
    }),
    prisma.talentType.create({
      data: {
        type_key: 'coach',
        type_name: 'Coach',
        description: 'Professional coach',
        icon: '👨‍🏫',
        is_active: true
      }
    })
  ])

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alex Thompson',
        email: 'alex@example.com',
        primary_sport: 'Tennis',
        base_location_id: locations[0].id,
        country_code: 'US',
        country_flag: '🇺🇸',
        team_emoji: '🎾',
        rating: 4.9,
        rating_source: 'ATP',
        bio: 'Professional tennis player with 10 years of experience. Multiple tournament winner.',
        category: 'talent',
        talent_type_id: talentTypes.find(t => t.type_key === 'athlete')!.id,
        verification_status: 'verified',
        years_experience: 10,
        is_active: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        primary_sport: 'Basketball',
        base_location_id: locations[1].id,
        country_code: 'US',
        country_flag: '🇺🇸',
        team_emoji: '🏀',
        rating: 4.8,
        rating_source: 'Custom',
        bio: 'Professional basketball coach with championship experience.',
        category: 'coach',
        talent_type_id: talentTypes.find(t => t.type_key === 'coach')!.id,
        verification_status: 'verified',
        years_experience: 15,
        is_active: true
      }
    })
  ])

  // Create teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Los Angeles Thunder',
        description: 'Professional basketball team based in Los Angeles',
        team_type: 'professional',
        sport_id: sports.find(s => s.sport_key === 'basketball')!.id,
        league_id: leagues.find(l => l.league_key === 'nba')!.id,
        location_id: locations[0].id,
        owner_user_id: users[1].id,
        is_recruiting: true,
        venue_name: 'Thunder Arena',
        venue_address: '123 Sports Ave, Los Angeles, CA',
        founded_date: new Date('2010-01-01'),
        is_active: true
      }
    })
  ])

  // Create team memberships
  await prisma.teamMembership.create({
    data: {
      team_id: teams[0].id,
      user_id: users[0].id,
      role: 'player',
      membership_status: 'active',
      start_date: new Date('2023-01-01'),
      jersey_number: '23',
      position: 'Forward',
      is_starter: true
    }
  })

  // Create user sports
  await Promise.all([
    prisma.userSport.create({
      data: {
        user_id: users[0].id,
        sport_id: sports.find(s => s.sport_key === 'tennis')!.id,
        skill_level: 'professional',
        years_experience: 10,
        is_primary: true,
        current_rating: 4.9
      }
    }),
    prisma.userSport.create({
      data: {
        user_id: users[1].id,
        sport_id: sports.find(s => s.sport_key === 'basketball')!.id,
        skill_level: 'professional',
        years_experience: 15,
        is_primary: true,
        current_rating: 4.8
      }
    })
  ])

  // Create achievements
  await Promise.all([
    prisma.achievement.create({
      data: {
        user_id: users[0].id,
        title: 'Tournament Champion',
        description: 'Won the California Open Tennis Tournament',
        achievement_date: new Date('2023-06-15'),
        achievement_type: 'competition',
        is_verified: true
      }
    }),
    prisma.achievement.create({
      data: {
        team_id: teams[0].id,
        title: 'League Champions',
        description: 'Won the regional basketball championship',
        achievement_date: new Date('2023-12-01'),
        achievement_type: 'competition',
        is_verified: true
      }
    })
  ])

  // Create campaigns
  await prisma.campaign.create({
    data: {
      user_id: users[0].id,
      title: 'Training Equipment Fund',
      description: 'Help me get professional training equipment for the upcoming season',
      goal_amount: 5000,
      current_amount: 2800,
      currency: 'USD',
      campaign_type: 'equipment',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-06-01'),
      duration_days: 151,
      status: 'active',
      location_id: locations[0].id
    }
  })

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
