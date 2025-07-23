import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAndSeedDatabase() {
  console.log('Starting database clearing and seeding...')

  try {
    // Clear existing data in reverse dependency order
    await prisma.teamMembership.deleteMany()
    await prisma.campaign.deleteMany()
    await prisma.achievement.deleteMany()
    await prisma.event.deleteMany()
    await prisma.team.deleteMany()
    await prisma.user.deleteMany()
    await prisma.sport.deleteMany()
    await prisma.location.deleteMany()
    await prisma.talentType.deleteMany()
    await prisma.league.deleteMany()
    await prisma.file.deleteMany()

    console.log('Cleared existing data...')

    // Create sports
    const sports = await Promise.all([
      prisma.sport.create({
        data: {
          sport_name: 'Basketball',
          sport_key: 'basketball'
        }
      }),
      prisma.sport.create({
        data: {
          sport_name: 'Tennis',
          sport_key: 'tennis'
        }
      }),
      prisma.sport.create({
        data: {
          sport_name: 'Soccer',
          sport_key: 'soccer'
        }
      }),
      prisma.sport.create({
        data: {
          sport_name: 'Swimming',
          sport_key: 'swimming'
        }
      })
    ])

    console.log('Created sports...')

    // Create locations
    const locations = await Promise.all([
      prisma.location.create({
        data: {
          name: 'Los Angeles, CA, USA',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA'
        }
      }),
      prisma.location.create({
        data: {
          name: 'New York, NY, USA',
          city: 'New York',
          state: 'NY',
          country: 'USA'
        }
      }),
      prisma.location.create({
        data: {
          name: 'Miami, FL, USA',
          city: 'Miami',
          state: 'FL',
          country: 'USA'
        }
      }),
      prisma.location.create({
        data: {
          name: 'Chicago, IL, USA',
          city: 'Chicago',
          state: 'IL',
          country: 'USA'
        }
      })
    ])

    console.log('Created locations...')

    // Create talent types
    const talentTypes = await Promise.all([
      prisma.talentType.create({
        data: {
          type_name: 'Professional Athlete',
          type_key: 'professional'
        }
      }),
      prisma.talentType.create({
        data: {
          type_name: 'College Athlete',
          type_key: 'college'
        }
      }),
      prisma.talentType.create({
        data: {
          type_name: 'High School Athlete',
          type_key: 'high_school'
        }
      }),
      prisma.talentType.create({
        data: {
          type_name: 'Coach',
          type_key: 'coach'
        }
      })
    ])

    console.log('Created talent types...')

    // Create leagues
    const leagues = await Promise.all([
      prisma.league.create({
        data: {
          league_name: 'NBA',
          league_key: 'nba'
        }
      }),
      prisma.league.create({
        data: {
          league_name: 'ATP',
          league_key: 'atp'
        }
      }),
      prisma.league.create({
        data: {
          league_name: 'MLS',
          league_key: 'mls'
        }
      }),
      prisma.league.create({
        data: {
          league_name: 'NCAA',
          league_key: 'ncaa'
        }
      })
    ])

    console.log('Created leagues...')

    // Create users (talents and coaches)
    const users = await Promise.all([
      // Talents
      prisma.user.create({
        data: {
          auth_id: 'user1',
          name: 'Sarah Chen',
          email: 'sarah.chen@example.com',
          bio: 'Professional tennis player with Olympic aspirations',
          primary_sport: 'Tennis',
          years_experience: 8,
          category: 'talent',
          rating: 4.95,
          base_location_id: locations[0].id,
          talent_type_id: talentTypes[0].id,
          verification_status: 'verified',
          country_flag: '🇺🇸'
        }
      }),
      prisma.user.create({
        data: {
          auth_id: 'user2',
          name: 'Marcus Johnson',
          email: 'marcus.johnson@example.com',
          bio: 'NCAA basketball champion looking to go pro',
          primary_sport: 'Basketball',
          years_experience: 4,
          category: 'talent',
          rating: 4.87,
          base_location_id: locations[1].id,
          talent_type_id: talentTypes[1].id,
          verification_status: 'verified',
          country_flag: '🇺🇸'
        }
      }),
      prisma.user.create({
        data: {
          auth_id: 'user3',
          name: 'Alex Rodriguez',
          email: 'alex.rodriguez@example.com',
          bio: 'Rising soccer star in MLS development program',
          primary_sport: 'Soccer',
          years_experience: 3,
          category: 'talent',
          rating: 4.72,
          base_location_id: locations[2].id,
          talent_type_id: talentTypes[2].id,
          verification_status: 'pending',
          country_flag: '🇺🇸'
        }
      }),
      prisma.user.create({
        data: {
          auth_id: 'user4',
          name: 'Emma Wilson',
          email: 'emma.wilson@example.com',
          bio: 'State champion swimmer with national records',
          primary_sport: 'Swimming',
          years_experience: 6,
          category: 'talent',
          rating: 4.91,
          base_location_id: locations[2].id,
          talent_type_id: talentTypes[2].id,
          verification_status: 'verified',
          country_flag: '🇺🇸'
        }
      }),
      // Coaches
      prisma.user.create({
        data: {
          auth_id: 'coach1',
          name: 'Coach Williams',
          email: 'coach.williams@example.com',
          bio: 'Former NBA player with 15 years coaching experience',
          primary_sport: 'Basketball',
          years_experience: 15,
          category: 'coach',
          rating: 4.89,
          base_location_id: locations[3].id,
          talent_type_id: talentTypes[3].id,
          verification_status: 'verified',
          country_flag: '🇺🇸'
        }
      }),
      prisma.user.create({
        data: {
          auth_id: 'coach2',
          name: 'Maria Santos',
          email: 'maria.santos@example.com',
          bio: 'Olympic tennis coach with proven track record',
          primary_sport: 'Tennis',
          years_experience: 12,
          category: 'coach',
          rating: 4.94,
          base_location_id: locations[0].id,
          talent_type_id: talentTypes[3].id,
          verification_status: 'verified',
          country_flag: '🇺🇸'
        }
      })
    ])

    console.log('Created users...')

    // Create teams
    const teams = await Promise.all([
      prisma.team.create({
        data: {
          name: 'Lakers Youth Academy',
          description: 'Elite basketball development program for young talents',
          team_type: 'academy',
          sport_id: sports[0].id,
          location_id: locations[0].id,
          league_id: leagues[3].id,
          is_recruiting: true
        }
      }),
      prisma.team.create({
        data: {
          name: 'Miami Tennis Club',
          description: 'Professional tennis training facility',
          team_type: 'club',
          sport_id: sports[1].id,
          location_id: locations[2].id,
          league_id: leagues[1].id,
          is_recruiting: true
        }
      }),
      prisma.team.create({
        data: {
          name: 'NYC Soccer United',
          description: 'Competitive soccer team in MLS development league',
          team_type: 'professional',
          sport_id: sports[2].id,
          location_id: locations[1].id,
          league_id: leagues[2].id,
          is_recruiting: false
        }
      })
    ])

    console.log('Created teams...')

    // Create campaigns for users and teams
    const campaigns = await Promise.all([
      prisma.campaign.create({
        data: {
          title: 'Help Sarah reach the Olympics',
          description: 'Supporting training and competition expenses',
          goal_amount: 50000,
          current_amount: 25000,
          status: 'active',
          user_id: users[0].id
        }
      }),
      prisma.campaign.create({
        data: {
          title: 'Marcus Pro Basketball Journey',
          description: 'Training and equipment for professional transition',
          goal_amount: 80000,
          current_amount: 32000,
          status: 'active',
          user_id: users[1].id
        }
      }),
      prisma.campaign.create({
        data: {
          title: 'Lakers Youth Academy Equipment Fund',
          description: 'New training equipment and facility improvements',
          goal_amount: 100000,
          current_amount: 45000,
          status: 'active',
          team_id: teams[0].id
        }
      })
    ])

    console.log('Created campaigns...')

    // Create some achievements
    const achievements = await Promise.all([
      prisma.achievement.create({
        data: {
          title: 'Olympic Qualifier',
          description: 'Qualified for Olympic trials in tennis',
          date_earned: new Date('2024-06-15'),
          user_id: users[0].id
        }
      }),
      prisma.achievement.create({
        data: {
          title: 'NCAA Champion',
          description: 'Won NCAA basketball championship',
          date_earned: new Date('2024-03-20'),
          user_id: users[1].id
        }
      }),
      prisma.achievement.create({
        data: {
          title: 'State Swimming Record',
          description: 'Set new state record in 100m freestyle',
          date_earned: new Date('2024-05-10'),
          user_id: users[3].id
        }
      })
    ])

    console.log('Created achievements...')

    console.log('Database seeding completed successfully!')
    
    // Display summary
    const totalUsers = await prisma.user.count()
    const totalTeams = await prisma.team.count()
    const totalCampaigns = await prisma.campaign.count()
    
    console.log(`\nSeeding Summary:`)
    console.log(`- ${totalUsers} users created`)
    console.log(`- ${totalTeams} teams created`)
    console.log(`- ${totalCampaigns} campaigns created`)
    console.log(`- Database is ready for testing!`)

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearAndSeedDatabase().catch((e) => {
  console.error(e)
  process.exit(1)
})
