import { prisma } from '@/lib/prisma'

// Get talent profile data
export async function getTalentProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        base_location: true,
        talent_type: true,
        talent_profile: {
          include: {
            stats: true,
            achievements_list: true,
            competitions: {
              orderBy: { year: 'desc' },
            },
            performance_data: {
              orderBy: { created_at: 'asc' },
            },
            checkpoints: {
              orderBy: { amount: 'asc' },
            },
          },
        },
        social_links: true,
        media_items: {
          orderBy: { created_at: 'desc' },
        },
        sponsors: {
          include: {
            sponsor: true,
          },
        },
      },
    })

    if (!user || !user.talent_profile) {
      return null
    }

    // Transform data to match the existing mock data structure
    const profile = {
      id: user.id,
      email: user.email, // Add email for ownership verification
      name: user.name,
      sport: user.primary_sport,
      location: `${user.base_location.city}, ${user.base_location.state}`,
      country: user.country_flag,
      team: user.team_emoji,
      rating: user.rating,
      currentFunding: user.talent_profile.current_funding,
      goalFunding: user.talent_profile.goal_funding,
      price: user.talent_profile.price,
      period: user.talent_profile.period,
      image: user.media_items.find(m => m.media_type === 'PHOTO')?.url || 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop',
      coverImage: user.media_items.find(m => m.category === 'cover')?.url || 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop',
      achievements: user.talent_profile.achievements,
      category: 'talent',
      bio: user.bio,
      stats: {
        tournaments: user.talent_profile.competitions.length,
        wins: user.talent_profile.competitions.filter(c => c.result.includes('W') || c.result.includes('Win')).length,
        ranking: user.talent_profile.stats.find(s => s.label === 'RANKING')?.value || '#' + Math.floor(user.rating * 20),
      },
      
      // Transform stats by category
      demographics: user.talent_profile.stats.filter(s => s.category === 'DEMOGRAPHICS').map(s => ({
        label: s.label,
        value: s.value,
        icon: s.icon,
      })),
      performanceStats: user.talent_profile.stats.filter(s => s.category === 'PERFORMANCE').map(s => ({
        label: s.label,
        value: s.value,
        icon: s.icon,
      })),
      
      // Social links
      socials: user.social_links.reduce((acc, link) => {
        acc[link.platform] = link.username
        return acc
      }, {} as Record<string, string>),
      
      // Achievements list
      achievementsList: user.talent_profile.achievements_list.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        date: a.date,
        type: a.type,
      })),
      
      // Competition results grouped by year
      pastResults: user.talent_profile.competitions.reduce((acc, comp) => {
        const year = comp.year.toString()
        if (!acc[year]) acc[year] = []
        acc[year].push({
          id: comp.id,
          tournament: comp.tournament,
          date: comp.date,
          result: comp.result,
          image: comp.image_url,
        })
        return acc
      }, {} as Record<string, any[]>),
      
      // Upcoming competitions (temporary mock data - should be moved to database)
      upcomingCompetitions: [
        {
          id: 1,
          tournament: "Wimbledon Qualifier",
          date: "August 2024",
          location: "London, UK",
          image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop",
        },
        {
          id: 2,
          tournament: "Olympic Trials",
          date: "September 2024", 
          location: "Paris, France",
          image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop",
        },
      ],
      
      // Performance data
      performanceData: user.talent_profile.performance_data.map(p => ({
        month: p.month,
        ranking: p.ranking,
        wins: p.wins,
      })),
      
      // Checkpoints
      checkpoints: user.talent_profile.checkpoints.map(c => ({
        amount: c.amount,
        reward: c.reward,
        unlocked: c.unlocked,
      })),
      
      // Media gallery (grouped by type)
      mediaGallery: {
        photos: user.media_items.filter(m => m.media_type === 'PHOTO' && m.platform !== 'youtube').map(m => ({
          id: m.id,
          url: m.url,
          title: m.title,
          category: m.category,
        })),
        videos: user.media_items.filter(m => m.media_type === 'VIDEO' || m.platform === 'youtube').map(m => ({
          id: m.id,
          url: m.url,
          title: m.title,
          category: m.category,
        })),
      },
    }

    return profile
  } catch (error) {
    console.error('Error fetching talent profile:', error)
    return null
  }
}

// Get team profile data
export async function getTeamProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        base_location: true,
        team_profile: {
          include: {
            stats: true,
            roster: true,
            games: {
              orderBy: { created_at: 'desc' },
            },
            performance_data: {
              orderBy: { created_at: 'asc' },
            },
            checkpoints: {
              orderBy: { amount: 'asc' },
            },
          },
        },
        social_links: true,
        media_items: {
          orderBy: { created_at: 'desc' },
        },
        sponsors: {
          include: {
            sponsor: true,
          },
        },
      },
    })

    if (!user || !user.team_profile) {
      return null
    }

    const profile = {
      id: user.id,
      email: user.email, // Add email for ownership verification
      name: user.name,
      sport: user.primary_sport,
      location: `${user.base_location.city}, ${user.base_location.state}`,
      country: user.country_flag,
      league: user.team_emoji,
      rating: user.rating,
      currentFunding: user.team_profile.current_funding,
      goalFunding: user.team_profile.goal_funding,
      image: user.media_items.find(m => m.media_type === 'PHOTO')?.url || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
      coverImage: user.media_items.find(m => m.category === 'cover')?.url || 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&h=300&fit=crop',
      achievements: `${user.team_profile.wins} Wins, Ranking #${user.team_profile.ranking}`,
      category: 'team',
      bio: user.bio,
      
      stats: {
        wins: user.team_profile.wins,
        losses: user.team_profile.losses,
        ranking: user.team_profile.ranking,
        members: user.team_profile.members,
      },
      
      // Transform stats by category
      teamStats: user.team_profile.stats.filter(s => s.category === 'GENERAL').map(s => ({
        label: s.label,
        value: s.value,
        icon: s.icon,
      })),
      performanceStats: user.team_profile.stats.filter(s => s.category === 'PERFORMANCE').map(s => ({
        label: s.label,
        value: s.value,
        icon: s.icon,
      })),
      
      // Social links
      socials: user.social_links.reduce((acc, link) => {
        acc[link.platform] = link.username
        return acc
      }, {} as Record<string, string>),
      
      // Roster
      roster: user.team_profile.roster.map(member => ({
        id: member.id,
        name: member.name,
        position: member.position,
        number: member.number,
        image: member.image_url,
        stats: member.stats,
      })),
      
      // Games
      upcomingGames: user.team_profile.games.filter(g => g.is_upcoming).map(g => ({
        id: g.id,
        opponent: g.opponent,
        date: g.date,
        location: g.location,
        time: g.time,
        image: g.image_url,
      })),
      recentResults: user.team_profile.games.filter(g => !g.is_upcoming).map(g => ({
        id: g.id,
        opponent: g.opponent,
        date: g.date,
        result: g.result,
        location: g.location,
        image: g.image_url,
      })),
      
      // Performance data
      performanceData: user.team_profile.performance_data.map(p => ({
        month: p.month,
        ranking: p.ranking,
        wins: p.wins,
      })),
      
      // Checkpoints
      checkpoints: user.team_profile.checkpoints.map(c => ({
        amount: c.amount,
        reward: c.reward,
        unlocked: c.unlocked,
      })),
      
      // Sponsors
      sponsors: user.sponsors.map(s => ({
        id: s.id,
        name: s.sponsor.name,
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
        tier: s.tier,
        amount: s.amount,
      })),
      
      // Media gallery
      mediaGallery: {
        photos: user.media_items.filter(m => m.media_type === 'PHOTO').map(m => ({
          id: m.id,
          url: m.url,
          title: m.title,
          category: m.category,
        })),
        videos: user.media_items.filter(m => m.media_type === 'VIDEO').map(m => ({
          id: m.id,
          url: m.url,
          title: m.title,
          category: m.category,
        })),
      },
    }

    return profile
  } catch (error) {
    console.error('Error fetching team profile:', error)
    return null
  }
}

// Get event profile data
export async function getEventProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        base_location: true,
        event_profile: {
          include: {
            location: true,
            stats: true,
            participants: true,
            schedule: true,
            checkpoints: {
              orderBy: { amount: 'asc' },
            },
            ticket_sales: {
              orderBy: { created_at: 'asc' },
            },
          },
        },
        social_links: true,
        media_items: {
          orderBy: { created_at: 'desc' },
        },
        sponsors: {
          include: {
            sponsor: true,
          },
        },
      },
    })

    if (!user || !user.event_profile) {
      return null
    }

    const profile = {
      id: user.id,
      email: user.email, // Add email for ownership verification
      name: user.name,
      sport: user.primary_sport,
      location: `${user.event_profile.location.city}, ${user.event_profile.location.state}`,
      country: user.country_flag,
      category: user.team_emoji,
      rating: user.rating,
      currentFunding: user.event_profile.current_funding,
      goalFunding: user.event_profile.goal_funding,
      image: user.media_items.find(m => m.media_type === 'PHOTO')?.url || 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&h=400&fit=crop',
      coverImage: user.media_items.find(m => m.category === 'cover')?.url || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=300&fit=crop',
      status: user.event_profile.status,
      eventType: user.event_profile.event_type,
      bio: user.bio,
      
      eventDetails: {
        startDate: user.event_profile.start_date,
        endDate: user.event_profile.end_date,
        duration: user.event_profile.duration,
        venue: user.event_profile.venue,
        capacity: user.event_profile.capacity,
        ticketPrice: user.event_profile.ticket_price,
        organizer: user.event_profile.organizer,
      },
      
      // Transform stats by category
      eventStats: user.event_profile.stats.filter(s => s.category === 'EVENT').map(s => ({
        label: s.label,
        value: s.value,
        icon: s.icon,
      })),
      sponsorshipStats: user.event_profile.stats.filter(s => s.category === 'SPONSORSHIP').map(s => ({
        label: s.label,
        value: s.value,
        icon: s.icon,
      })),
      
      // Social links
      socials: user.social_links.reduce((acc, link) => {
        acc[link.platform] = link.username
        return acc
      }, {} as Record<string, string>),
      
      // Featured participants
      featuredParticipants: user.event_profile.participants.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.image_url,
      })),
      
      // Schedule
      schedule: user.event_profile.schedule.map(s => ({
        day: s.day,
        date: s.date,
        events: s.events as string[],
      })),
      
      // Ticket sales data
      ticketSales: user.event_profile.ticket_sales.map(ts => ({
        month: ts.month,
        sold: ts.sold,
        revenue: ts.revenue,
      })),
      
      // Checkpoints
      checkpoints: user.event_profile.checkpoints.map(c => ({
        amount: c.amount,
        reward: c.reward,
        unlocked: c.unlocked,
      })),
      
      // Sponsors
      sponsors: user.sponsors.map(s => ({
        id: s.id,
        name: s.sponsor.name,
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
        tier: s.tier,
        amount: s.amount,
      })),
      
      // Media gallery
      mediaGallery: {
        photos: user.media_items.filter(m => m.media_type === 'PHOTO').map(m => ({
          id: m.id,
          url: m.url,
          title: m.title,
          category: m.category,
        })),
        videos: user.media_items.filter(m => m.media_type === 'VIDEO').map(m => ({
          id: m.id,
          url: m.url,
          title: m.title,
          category: m.category,
        })),
      },
    }

    return profile
  } catch (error) {
    console.error('Error fetching event profile:', error)
    return null
  }
}
