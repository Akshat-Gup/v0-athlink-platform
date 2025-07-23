import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'United States',
        country_code: 'US',
        latitude: 34.0522,
        longitude: -118.2437,
      },
    }),
    prisma.location.create({
      data: {
        city: 'Chicago',
        state: 'IL',
        country: 'United States',
        country_code: 'US',
        latitude: 41.8781,
        longitude: -87.6298,
      },
    }),
    prisma.location.create({
      data: {
        city: 'Miami',
        state: 'FL',
        country: 'United States',
        country_code: 'US',
        latitude: 25.7617,
        longitude: -80.1918,
      },
    }),
    prisma.location.create({
      data: {
        city: 'Austin',
        state: 'TX',
        country: 'United States',
        country_code: 'US',
        latitude: 30.2672,
        longitude: -97.7431,
      },
    }),
    prisma.location.create({
      data: {
        city: 'Denver',
        state: 'CO',
        country: 'United States',
        country_code: 'US',
        latitude: 39.7392,
        longitude: -104.9903,
      },
    }),
    prisma.location.create({
      data: {
        city: 'Portland',
        state: 'OR',
        country: 'United States',
        country_code: 'US',
        latitude: 45.5152,
        longitude: -122.6784,
      },
    }),
    prisma.location.create({
      data: {
        city: 'New York',
        state: 'NY',
        country: 'United States',
        country_code: 'US',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    }),
  ])

  console.log('📍 Created locations')

  // Create talent types
  const talentTypes = await Promise.all([
    prisma.talentType.create({
      data: {
        type_key: 'athlete',
        type_name: 'Athlete',
        description: 'Professional or amateur athletes competing in various sports',
        icon: '🏃',
        color: '#3B82F6',
        requires_sports: true,
        requires_leagues: true,
      },
    }),
    prisma.talentType.create({
      data: {
        type_key: 'content-creator',
        type_name: 'Content Creator',
        description: 'Digital content creators and influencers in sports',
        icon: '📱',
        color: '#8B5CF6',
        requires_sports: false,
        requires_leagues: false,
      },
    }),
    prisma.talentType.create({
      data: {
        type_key: 'creative-professional',
        type_name: 'Creative Professional',
        description: 'Artists, photographers, and creative professionals',
        icon: '🎨',
        color: '#F59E0B',
        requires_sports: false,
        requires_leagues: false,
      },
    }),
    prisma.talentType.create({
      data: {
        type_key: 'athletic-team',
        type_name: 'Athletic Team',
        description: 'Organized sports teams and athletic groups',
        icon: '👥',
        color: '#10B981',
        requires_sports: true,
        requires_leagues: true,
      },
    }),
    prisma.talentType.create({
      data: {
        type_key: 'professional-team',
        type_name: 'Professional Team',
        description: 'Professional sports teams and organizations',
        icon: '🏆',
        color: '#EF4444',
        requires_sports: true,
        requires_leagues: true,
      },
    }),
    prisma.talentType.create({
      data: {
        type_key: 'championship-event',
        type_name: 'Championship Event',
        description: 'Championship and tournament events',
        icon: '🥇',
        color: '#F97316',
        requires_sports: true,
        requires_leagues: false,
      },
    }),
  ])

  console.log('🏷️ Created talent types')

  // Create tags
  const tags = await Promise.all([
    // Sport tags
    prisma.tag.create({ data: { name: 'Tennis', category: 'sport' } }),
    prisma.tag.create({ data: { name: 'Basketball', category: 'sport' } }),
    prisma.tag.create({ data: { name: 'Soccer', category: 'sport' } }),
    prisma.tag.create({ data: { name: 'Swimming', category: 'sport' } }),
    prisma.tag.create({ data: { name: 'Track & Field', category: 'sport' } }),
    prisma.tag.create({ data: { name: 'Gymnastics', category: 'sport' } }),
    prisma.tag.create({ data: { name: 'Cycling', category: 'sport' } }),
    
    // Level tags
    prisma.tag.create({ data: { name: 'Professional', category: 'level' } }),
    prisma.tag.create({ data: { name: 'Olympic Level', category: 'level' } }),
    prisma.tag.create({ data: { name: 'College', category: 'level' } }),
    prisma.tag.create({ data: { name: 'Amateur', category: 'level' } }),
    prisma.tag.create({ data: { name: 'Elite', category: 'level' } }),
    prisma.tag.create({ data: { name: 'National Level', category: 'level' } }),
    prisma.tag.create({ data: { name: 'State Level', category: 'level' } }),
    prisma.tag.create({ data: { name: 'World Level', category: 'level' } }),
    
    // Type tags
    prisma.tag.create({ data: { name: 'Team', category: 'type' } }),
    prisma.tag.create({ data: { name: 'Event', category: 'type' } }),
    prisma.tag.create({ data: { name: 'Creative', category: 'type' } }),
    prisma.tag.create({ data: { name: 'Award Winner', category: 'achievement' } }),
  ])

  console.log('🏷️ Created tags')

  // Create talent users and profiles
  const sarahChen = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      primary_sport: 'Tennis',
      base_location_id: locations[0].id, // Los Angeles
      country_code: 'US',
      country_flag: '🇺🇸',
      team_emoji: '🎾',
      rating: 4.95,
      rating_source: 'WTA',
      bio: 'Professional tennis player with 8 years of competitive experience. Currently training for the upcoming Olympic qualifiers and seeking sponsorship to support my journey to represent my country at the highest level.',
      category: 'TALENT',
      talent_type_id: talentTypes[0].id, // Athlete
      verification_status: 'VERIFIED',
      years_experience: 8,
      talent_profile: {
        create: {
          current_funding: 2500,
          goal_funding: 5000,
          achievements: 'Olympic Qualifier',
          fit_type: 'top-talent',
          stats: {
            create: [
              { label: 'GENDER', value: 'Female', icon: '👤', category: 'DEMOGRAPHICS' },
              { label: 'AGE', value: '24', icon: '📅', category: 'DEMOGRAPHICS' },
              { label: 'HEIGHT', value: '5\'7"', icon: '📏', category: 'DEMOGRAPHICS' },
              { label: 'WEIGHT', value: '130 lbs', icon: '⚖️', category: 'DEMOGRAPHICS' },
              { label: 'REACH', value: '2.1M', icon: '📱', category: 'DEMOGRAPHICS' },
              { label: 'RANKING', value: '#15', icon: '🏆', category: 'PERFORMANCE' },
              { label: 'WIN RATE', value: '71%', icon: '📊', category: 'PERFORMANCE' },
              { label: 'TOURNAMENTS', value: '45', icon: '🎾', category: 'PERFORMANCE' },
              { label: 'PRIZE MONEY', value: '$125K', icon: '💰', category: 'PERFORMANCE' },
              { label: 'FOLLOWERS', value: '125K', icon: '👥', category: 'GENERAL' },
            ],
          },
          achievements_list: {
            create: [
              {
                title: 'US Open Semifinalist',
                description: 'Reached semifinals at the US Open Tennis Championships',
                date: 'March 2024',
                type: 'gold',
              },
              {
                title: 'Miami Open Quarter Finals',
                description: 'Advanced to quarter finals at Miami Open',
                date: 'February 2024',
                type: 'silver',
              },
              {
                title: 'Top 15 World Ranking',
                description: 'Achieved career-high ranking of #15 in WTA rankings',
                date: 'January 2024',
                type: 'ranking',
              },
              {
                title: 'Olympic Qualifier',
                description: 'Qualified for upcoming Olympic Games',
                date: 'December 2023',
                type: 'special',
              },
            ],
          },
          competitions: {
            create: [
              {
                tournament: 'US Open Qualifier',
                date: 'March 2024',
                result: 'Semifinalist',
                year: 2024,
                image_url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop',
              },
              {
                tournament: 'Miami Open',
                date: 'February 2024',
                result: 'Quarter Finals',
                year: 2024,
                image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
              },
            ],
          },
          performance_data: {
            create: [
              { month: 'Jan', ranking: 25, wins: 2 },
              { month: 'Feb', ranking: 22, wins: 3 },
              { month: 'Mar', ranking: 18, wins: 4 },
              { month: 'Apr', ranking: 15, wins: 5 },
              { month: 'May', ranking: 15, wins: 3 },
              { month: 'Jun', ranking: 12, wins: 6 },
            ],
          },
          checkpoints: {
            create: [
              { amount: 1000, reward: 'Social media shoutout + signed photo', unlocked: true },
              { amount: 2500, reward: 'Logo on training gear + monthly updates', unlocked: true },
              { amount: 5000, reward: 'Logo on competition outfit + VIP event access', unlocked: false },
              { amount: 7500, reward: 'Personal training session + exclusive content', unlocked: false },
            ],
          },
        },
      },
      social_links: {
        create: [
          { platform: 'instagram', username: '@sarahchen_tennis' },
          { platform: 'twitter', username: '@sarahchen' },
          { platform: 'youtube', username: 'Sarah Chen Tennis' },
          { platform: 'facebook', username: 'Sarah Chen Official' },
        ],
      },
      media_items: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop',
            title: 'Training Session',
            category: 'Training',
            media_type: 'PHOTO',
          },
          {
            url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop',
            title: 'Match Highlights',
            category: 'Competition',
            media_type: 'VIDEO',
            platform: 'youtube',
          },
        ],
      },
    },
  })

  // Create Marcus Johnson (Basketball talent)
  const marcusJohnson = await prisma.user.create({
    data: {
      name: 'Marcus Johnson',
      email: 'marcus.johnson@example.com',
      primary_sport: 'Basketball',
      base_location_id: locations[1].id, // Chicago
      country_code: 'US',
      country_flag: '🇺🇸',
      team_emoji: '🏀',
      rating: 4.89,
      bio: 'Point guard with exceptional court vision and leadership skills. Currently playing in the regional league while seeking opportunities to advance to professional basketball.',
      category: 'TALENT',
      talent_type_id: talentTypes[0].id, // Athlete
      verification_status: 'VERIFIED',
      years_experience: 6,
      talent_profile: {
        create: {
          current_funding: 3200,
          goal_funding: 8000,
          achievements: 'NCAA Champion',
          fit_type: 'top-talent',
          stats: {
            create: [
              { label: 'POSITION', value: 'Point Guard', icon: '🏀', category: 'GENERAL' },
              { label: 'HEIGHT', value: '6\'2"', icon: '📏', category: 'DEMOGRAPHICS' },
              { label: 'WEIGHT', value: '180 lbs', icon: '⚖️', category: 'DEMOGRAPHICS' },
              { label: 'PPG', value: '18.5', icon: '🎯', category: 'PERFORMANCE' },
              { label: 'APG', value: '7.2', icon: '🤝', category: 'PERFORMANCE' },
              { label: 'RPG', value: '4.1', icon: '🏀', category: 'PERFORMANCE' },
            ],
          },
          checkpoints: {
            create: [
              { amount: 2000, reward: 'Training gear sponsorship', unlocked: true },
              { amount: 4000, reward: 'Equipment package + social media', unlocked: true },
              { amount: 8000, reward: 'Full season sponsorship', unlocked: false },
            ],
          },
        },
      },
      social_links: {
        create: [
          { platform: 'instagram', username: '@marcusj_hoops' },
          { platform: 'twitter', username: '@marcusball' },
        ],
      },
    },
  })

  // Create Thunder Hawks Basketball Team
  const thunderHawks = await prisma.user.create({
    data: {
      name: 'Thunder Hawks Basketball',
      email: 'team@thunderhawks.com',
      primary_sport: 'Basketball',
      base_location_id: locations[1].id, // Chicago
      country_code: 'US',
      country_flag: '🇺🇸',
      team_emoji: '🏀',
      rating: 4.8,
      bio: 'Professional basketball team competing in the regional league. We\'re a diverse group of talented athletes working together to achieve excellence on and off the court.',
      category: 'TALENT',
      talent_type_id: talentTypes[3].id, // Athletic Team
      verification_status: 'VERIFIED',
      years_experience: 6,
      team_profile: {
        create: {
          current_funding: 15000,
          goal_funding: 25000,
          league: 'Regional',
          wins: 28,
          losses: 12,
          ranking: 3,
          members: 15,
          stats: {
            create: [
              { label: 'FOUNDED', value: '2018', icon: '📅', category: 'GENERAL' },
              { label: 'MEMBERS', value: '15', icon: '👥', category: 'GENERAL' },
              { label: 'LEAGUE', value: 'Regional', icon: '🏆', category: 'GENERAL' },
              { label: 'HOME VENUE', value: 'Hawks Arena', icon: '🏟️', category: 'GENERAL' },
              { label: 'RANKING', value: '#3', icon: '🏆', category: 'PERFORMANCE' },
              { label: 'WIN RATE', value: '70%', icon: '📊', category: 'PERFORMANCE' },
              { label: 'GAMES PLAYED', value: '40', icon: '🏀', category: 'PERFORMANCE' },
              { label: 'POINTS AVG', value: '89.5', icon: '🎯', category: 'PERFORMANCE' },
            ],
          },
          roster: {
            create: [
              {
                name: 'Marcus Johnson',
                position: 'Point Guard',
                number: 23,
                image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
                stats: { ppg: 18.5, apg: 7.2, rpg: 4.1 },
              },
              {
                name: 'David Chen',
                position: 'Shooting Guard',
                number: 15,
                image_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop',
                stats: { ppg: 22.1, apg: 3.8, rpg: 5.2 },
              },
              {
                name: 'Alex Rodriguez',
                position: 'Small Forward',
                number: 7,
                image_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=300&fit=crop',
                stats: { ppg: 16.8, apg: 4.5, rpg: 6.9 },
              },
            ],
          },
          games: {
            create: [
              {
                opponent: 'City Wolves',
                date: 'August 15, 2024',
                location: 'Hawks Arena',
                time: '7:00 PM',
                is_upcoming: true,
                image_url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=200&fit=crop',
              },
              {
                opponent: 'Metro Lions',
                date: 'August 22, 2024',
                location: 'Lions Stadium',
                time: '6:30 PM',
                is_upcoming: true,
                image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
              },
              {
                opponent: 'Valley Eagles',
                date: 'July 28, 2024',
                result: 'W 95-87',
                location: 'Hawks Arena',
                is_upcoming: false,
                image_url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=200&fit=crop',
              },
            ],
          },
          performance_data: {
            create: [
              { month: 'Jan', ranking: 8, wins: 3 },
              { month: 'Feb', ranking: 6, wins: 5 },
              { month: 'Mar', ranking: 4, wins: 6 },
              { month: 'Apr', ranking: 3, wins: 7 },
              { month: 'May', ranking: 3, wins: 4 },
              { month: 'Jun', ranking: 2, wins: 3 },
            ],
          },
          checkpoints: {
            create: [
              { amount: 5000, reward: 'Team logo on social media + team photo', unlocked: true },
              { amount: 10000, reward: 'Logo on practice jerseys + facility tour', unlocked: true },
              { amount: 15000, reward: 'Logo on game jerseys + VIP game tickets', unlocked: true },
              { amount: 25000, reward: 'Naming rights to training facility + exclusive events', unlocked: false },
            ],
          },
        },
      },
      social_links: {
        create: [
          { platform: 'instagram', username: '@thunderhawks_bball' },
          { platform: 'twitter', username: '@thunderhawks' },
          { platform: 'youtube', username: 'Thunder Hawks Basketball' },
          { platform: 'facebook', username: 'Thunder Hawks Official' },
        ],
      },
    },
  })

  // Create Swimming Championship Event
  const swimmingChampionship = await prisma.user.create({
    data: {
      name: 'Summer Swimming Championship 2024',
      email: 'info@summerswim2024.com',
      primary_sport: 'Swimming',
      base_location_id: locations[2].id, // Miami
      country_code: 'US',
      country_flag: '🇺🇸',
      team_emoji: '🏊',
      rating: 4.9,
      bio: 'The premier swimming championship bringing together the best swimmers from across the nation. This three-day tournament features intense competition, entertainment, and networking opportunities for players, fans, and sponsors alike.',
      category: 'TALENT',
      talent_type_id: talentTypes[5].id, // Championship Event
      verification_status: 'VERIFIED',
      years_experience: 1,
      event_profile: {
        create: {
          location_id: locations[2].id, // Miami
          current_funding: 75000,
          goal_funding: 100000,
          start_date: 'August 15, 2024',
          end_date: 'August 17, 2024',
          duration: '3 days',
          venue: 'Aquatics Center',
          capacity: '5,000',
          ticket_price: '$20-100',
          organizer: 'USA Swimming Federation',
          event_type: 'tournament',
          status: 'upcoming',
          stats: {
            create: [
              { label: 'START DATE', value: 'Aug 15', icon: '📅', category: 'EVENT' },
              { label: 'DURATION', value: '3 Days', icon: '⏱️', category: 'EVENT' },
              { label: 'CAPACITY', value: '5K', icon: '🎫', category: 'EVENT' },
              { label: 'ATHLETES', value: '200+', icon: '🏊', category: 'EVENT' },
              { label: 'PRIZE POOL', value: '$50K', icon: '💰', category: 'EVENT' },
              { label: 'SPONSORS', value: '12', icon: '🤝', category: 'SPONSORSHIP' },
              { label: 'MEDIA REACH', value: '2.5M', icon: '📺', category: 'SPONSORSHIP' },
              { label: 'ATTENDEES', value: '5K', icon: '👥', category: 'SPONSORSHIP' },
              { label: 'LIVE STREAM', value: '500K', icon: '📱', category: 'SPONSORSHIP' },
            ],
          },
          participants: {
            create: [
              {
                name: 'Emma Wilson',
                description: 'Freestyle\\nState Champion',
                image_url: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=300&h=300&fit=crop',
              },
              {
                name: 'Alex Rodriguez',
                description: 'Butterfly\\nRegional Record Holder',
                image_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=300&fit=crop',
              },
              {
                name: 'Sofia Martinez',
                description: 'Backstroke\\nJunior National Champion',
                image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
              },
            ],
          },
          schedule: {
            create: [
              {
                day: 1,
                date: 'July 15, 2024',
                events: ['100m Freestyle Preliminaries', '200m Butterfly Preliminaries', '100m Backstroke Finals'],
              },
              {
                day: 2,
                date: 'July 16, 2024',
                events: ['200m Freestyle Finals', '100m Butterfly Finals', '4x100m Medley Relay'],
              },
              {
                day: 3,
                date: 'July 17, 2024',
                events: ['50m Freestyle Sprints', '400m Individual Medley', 'Awards Ceremony'],
              },
            ],
          },
          checkpoints: {
            create: [
              { amount: 25000, reward: 'Logo on event materials + social media mentions', unlocked: true },
              { amount: 50000, reward: 'Logo on pool deck + VIP hospitality', unlocked: true },
              { amount: 75000, reward: 'Title sponsorship + naming rights', unlocked: true },
              { amount: 100000, reward: 'Exclusive presenting sponsor + premium benefits', unlocked: false },
            ],
          },
          ticket_sales: {
            create: [
              { month: 'Mar', sold: 500, revenue: 15000 },
              { month: 'Apr', sold: 1200, revenue: 40000 },
              { month: 'May', sold: 2500, revenue: 90000 },
              { month: 'Jun', sold: 3500, revenue: 130000 },
              { month: 'Jul', sold: 4500, revenue: 170000 },
              { month: 'Aug', sold: 5000, revenue: 200000 },
            ],
          },
        },
      },
      social_links: {
        create: [
          { platform: 'instagram', username: '@summerswim2024' },
          { platform: 'twitter', username: '@summerswim24' },
          { platform: 'youtube', username: 'Summer Swimming Championship' },
          { platform: 'facebook', username: 'Summer Swimming Championship 2024' },
        ],
      },
    },
  })

  // Add more sample users for discovery page
  const additionalUsers = [
    // Emma Davis - Swimming
    {
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      primary_sport: 'Swimming',
      location_id: locations[2].id, // Miami
      achievements: 'State Champion',
      rating: 4.85,
      current_funding: 1800,
      goal_funding: 4000,
      fit_type: 'up-and-coming',
    },
    // Alex Rodriguez - Soccer
    {
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@example.com',
      primary_sport: 'Soccer',
      location_id: locations[3].id, // Austin
      achievements: 'MLS Academy Graduate',
      rating: 4.94,
      current_funding: 2800,
      goal_funding: 6000,
      fit_type: 'top-talent',
    },
    // Jake Thompson - Track & Field
    {
      name: 'Jake Thompson',
      email: 'jake.thompson@example.com',
      primary_sport: 'Track & Field',
      location_id: locations[5].id, // Portland
      achievements: 'National Qualifier',
      rating: 4.88,
      current_funding: 3500,
      goal_funding: 7000,
      fit_type: 'top-talent',
    },
    // Sofia Martinez - Gymnastics
    {
      name: 'Sofia Martinez',
      email: 'sofia.martinez@example.com',
      primary_sport: 'Gymnastics',
      location_id: locations[4].id, // Denver
      achievements: 'World Championship Qualifier',
      rating: 4.96,
      current_funding: 4200,
      goal_funding: 8500,
      fit_type: 'top-talent',
    },
    // Maya Patel - Content Creation
    {
      name: 'Maya Patel',
      email: 'maya.patel@example.com',
      primary_sport: 'Content Creation',
      location_id: locations[6].id, // New York
      achievements: 'Sports Content Creator',
      rating: 4.87,
      price: '$2,500',
      period: 'per campaign',
      fit_type: 'brand-ambassador',
      talent_type_id: talentTypes[1].id, // Content Creator
    },
  ]

  for (const userData of additionalUsers) {
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        primary_sport: userData.primary_sport,
        base_location_id: userData.location_id,
        country_code: 'US',
        country_flag: '🇺🇸',
        team_emoji: getEmojiForSport(userData.primary_sport),
        rating: userData.rating,
        bio: `Professional ${userData.primary_sport.toLowerCase()} athlete seeking sponsorship opportunities.`,
        category: 'TALENT',
        talent_type_id: userData.talent_type_id || talentTypes[0].id, // Default to Athlete
        verification_status: 'VERIFIED',
        years_experience: Math.floor(Math.random() * 10) + 2,
        talent_profile: {
          create: {
            current_funding: userData.current_funding,
            goal_funding: userData.goal_funding,
            price: userData.price,
            period: userData.period,
            achievements: userData.achievements,
            fit_type: userData.fit_type,
          },
        },
      },
    })
  }

  console.log('👥 Created sample users and profiles')

  // Create some sponsor relationships
  await prisma.sponsorRelation.create({
    data: {
      sponsor_id: thunderHawks.id,
      sponsored_id: sarahChen.id,
      amount: 2500,
      tier: 'Gold Sponsor',
      status: 'ACTIVE',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
    },
  })

  console.log('🤝 Created sponsor relationships')

  console.log('✅ Database seeding completed successfully!')
}

function getEmojiForSport(sport: string): string {
  const sportEmojis: { [key: string]: string } = {
    'Tennis': '🎾',
    'Basketball': '🏀',
    'Soccer': '⚽',
    'Swimming': '🏊',
    'Track & Field': '🏃',
    'Gymnastics': '🤸',
    'Cycling': '🚴',
    'Content Creation': '📱',
  }
  return sportEmojis[sport] || '🏃'
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
