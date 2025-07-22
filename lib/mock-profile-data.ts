// Mock data for event profile
import { Calendar, MapPin, CalendarIcon, Handshake, Tv, Users, Smartphone, Trophy, Target } from "lucide-react"

export function getEventMockData(id: string) {
  return {
    id: Number.parseInt(id),
    name: "Summer Swimming Championship 2024",
    sport: "Swimming",
    location: "Aquatics Center, Miami",
    country: "🇺🇸",
    category: "🏊",
    rating: 4.9,
    currentFunding: 75000,
    goalFunding: 100000,
    image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=300&fit=crop",
    status: "Upcoming Event",
    eventType: "tournament",
    bio: "The premier swimming championship bringing together the best swimmers from across the nation. This three-day tournament features intense competition, entertainment, and networking opportunities for players, fans, and sponsors alike.",
    eventDetails: {
      startDate: "August 15, 2024",
      endDate: "August 17, 2024",
      duration: "3 days",
      venue: "Aquatics Center",
      capacity: "5,000",
      ticketPrice: "$20-100",
      organizer: "USA Swimming Federation",
    },
    // Event details data for StatsList component
    eventDetailsData: [
      {
        icon: Calendar,
        text: "August 15, 2024 - August 17, 2024"
      },
      {
        icon: MapPin,
        text: "Aquatics Center, Miami"
      },
      {
        icon: CalendarIcon,
        text: "Organized by USA Swimming Federation"
      }
    ],
    // Sponsorship impact data for StatsList component
    sponsorshipImpactData: [
      {
        icon: Handshake,
        text: "12 Current Sponsors"
      },
      {
        icon: Tv,
        text: "2.5M Media Reach"
      },
      {
        icon: Users,
        text: "5K Expected Attendees"
      },
      {
        icon: Smartphone,
        text: "500K Live Stream Viewers"
      }
    ],
    eventStats: [
      { label: "START DATE", value: "Aug 15", icon: "📅" },
      { label: "DURATION", value: "3 Days", icon: "⏱️" },
      { label: "CAPACITY", value: "5K", icon: "🎫" },
      { label: "ATHLETES", value: "200+", icon: "🏊" },
      { label: "PRIZE POOL", value: "$50K", icon: "💰" },
    ],
    sponsorshipStats: [
      { label: "SPONSORS", value: "12", icon: "🤝" },
      { label: "MEDIA REACH", value: "2.5M", icon: "📺" },
      { label: "ATTENDEES", value: "5K", icon: "👥" },
      { label: "LIVE STREAM", value: "500K", icon: "📱" },
    ],
    socials: {
      instagram: "@summerswim2024",
      twitter: "@summerswim24",
      youtube: "Summer Swimming Championship",
      facebook: "Summer Swimming Championship 2024",
    },
    checkpoints: [
      { amount: 25000, reward: "Logo on event materials + social media mentions", unlocked: true },
      { amount: 50000, reward: "Logo on pool deck + VIP hospitality", unlocked: true },
      { amount: 75000, reward: "Title sponsorship + naming rights", unlocked: true },
      { amount: 100000, reward: "Exclusive presenting sponsor + premium benefits", unlocked: false },
    ],
    ticketSales: [
      { month: "Mar", sold: 500, revenue: 15000 },
      { month: "Apr", sold: 1200, revenue: 40000 },
      { month: "May", sold: 2500, revenue: 90000 },
      { month: "Jun", sold: 3500, revenue: 130000 },
      { month: "Jul", sold: 4500, revenue: 170000 },
      { month: "Aug", sold: 5000, revenue: 200000 },
    ],
    featuredParticipants: [
      {
        id: 1,
        name: "Emma Wilson",
        description: "Freestyle\nState Champion",
        image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=300&h=300&fit=crop",
      },
      {
        id: 2,
        name: "Alex Rodriguez",
        description: "Butterfly\nRegional Record Holder",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=300&fit=crop",
      },
      {
        id: 3,
        name: "Sofia Martinez",
        description: "Backstroke\nJunior National Champion",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
      },
    ],
    schedule: [
      {
        day: 1,
        date: "July 15, 2024",
        events: ["100m Freestyle Preliminaries", "200m Butterfly Preliminaries", "100m Backstroke Finals"],
      },
      {
        day: 2,
        date: "July 16, 2024",
        events: ["200m Freestyle Finals", "100m Butterfly Finals", "4x100m Medley Relay"],
      },
      {
        day: 3,
        date: "July 17, 2024",
        events: ["50m Freestyle Sprints", "400m Individual Medley", "Awards Ceremony"],
      },
    ],
    sponsors: [
      {
        id: 1,
        name: "SportsCorp",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop",
        tier: "Title Sponsor",
        amount: 50000,
      },
      {
        id: 2,
        name: "Athletic Gear Co",
        logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=100&fit=crop",
        tier: "Official Partner",
        amount: 25000,
      },
    ],
    mediaGallery: {
      photos: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Championship Pool",
          category: "Event Setup",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Opening Ceremony",
          category: "Event Setup",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Swimming Competition",
          category: "Competition",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Victory Moment",
          category: "Competition",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Awards Ceremony",
          category: "Awards",
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
          title: "Medal Presentation",
          category: "Awards",
        },
        {
          id: 7,
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          title: "Event Setup",
          category: "Behind the Scenes",
        },
        {
          id: 8,
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          title: "Team Preparation",
          category: "Behind the Scenes",
        },
      ],
      videos: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Race Highlights",
          category: "Competition",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Championship Finals",
          category: "Competition",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Event Recap",
          category: "Event Highlights",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Best Moments",
          category: "Event Highlights",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Behind the Scenes",
          category: "Behind the Scenes",
        },
      ],
      youtube: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Event Highlights",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Championship Recap",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Athlete Interviews",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Event Preview",
        },
      ],
      instagram: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Event Day",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Championship Moments",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Victory Celebration",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Awards Night",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Team Spirit",
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
          title: "Event Atmosphere",
        },
      ],
    }
  }
}
interface Achievement {
  id: number
  title: string
  description: string
  date: string
  type: "gold" | "silver" | "bronze" | "tournament" | "ranking" | "special"
  image?: string
}
// Mock data for talent profile
export function getTalentMockData(id: string) {
  const profile = {
    id: Number.parseInt(id),
    name: "Sarah Chen",
    sport: "Tennis",
    location: "Los Angeles, CA",
    country: "🇺🇸",
    team: "🎾",
    rating: 4.95,
    currentFunding: 2500,
    goalFunding: 5000,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop",
    achievements: "Olympic Qualifier",
    category: "talent",
    bio: "Professional tennis player with 8 years of competitive experience. Currently training for the upcoming Olympic qualifiers and seeking sponsorship to support my journey to represent my country at the highest level.",
    stats: {
      tournaments: 45,
      wins: 32,
      ranking: 15,
    },
    talentDetailsData: [
    {
      icon: Trophy,
      text: "Olympic Qualifier",
    },
    {
      icon: Calendar,
      text: "8 years experience"
    },
    {
      icon: Target,
      text: `World Ranking #15` // This line will be fixed below
    }
  ],
    demographics: [
      { label: "GENDER", value: "Female", icon: "👤" },
      { label: "AGE", value: "24", icon: "📅" },
      { label: "HEIGHT", value: "5'7\"", icon: "📏" },
      { label: "WEIGHT", value: "130 lbs", icon: "⚖️" },
      { label: "REACH", value: "2.1M", icon: "📱" },
    ],
    performanceStats: [
      { label: "RANKING", value: "#15", icon: "🏆" },
      { label: "WIN RATE", value: "71%", icon: "📊" },
      { label: "TOURNAMENTS", value: "45", icon: "🎾" },
      { label: "PRIZE MONEY", value: "$125K", icon: "💰" },
      { label: "FOLLOWERS", value: "125K", icon: "👥" },
    ],
    teamList: [],
    socials: {
      instagram: "@sarahchen_tennis",
      twitter: "@sarahchen",
      youtube: "Sarah Chen Tennis",
      facebook: "Sarah Chen Official",
    },
    achievementsList: [
      {
        id: 1,
        title: "US Open Semifinalist",
        description: "Reached semifinals at the US Open Tennis Championships",
        date: "March 2024",
        type: "gold",
      },
      {
        id: 2,
        title: "Miami Open Quarter Finals",
        description: "Advanced to quarter finals at Miami Open",
        date: "February 2024",
        type: "silver",
      },
      {
        id: 3,
        title: "Top 15 World Ranking",
        description: "Achieved career-high ranking of #15 in WTA rankings",
        date: "January 2024",
        type: "ranking",
      },
      {
        id: 4,
        title: "Olympic Qualifier",
        description: "Qualified for upcoming Olympic Games",
        date: "December 2023",
        type: "special",
      },
      {
        id: 5,
        title: "French Open First Round",
        description: "Competed in French Open main draw",
        date: "June 2023",
        type: "tournament",
      },
      {
        id: 6,
        title: "Rising Star Award",
        description: "Received WTA Rising Star Award for breakthrough performance",
        date: "November 2023",
        type: "special",
      },
    ] as Achievement[],
    checkpoints: [
      { amount: 1000, reward: "Social media shoutout + signed photo", unlocked: true },
      { amount: 2500, reward: "Logo on training gear + monthly updates", unlocked: true },
      { amount: 5000, reward: "Logo on competition outfit + VIP event access", unlocked: false },
      { amount: 7500, reward: "Personal training session + exclusive content", unlocked: false },
    ],
    performanceData: [
      { month: "Jan", ranking: 25, wins: 2 },
      { month: "Feb", ranking: 22, wins: 3 },
      { month: "Mar", ranking: 18, wins: 4 },
      { month: "Apr", ranking: 15, wins: 5 },
      { month: "May", ranking: 15, wins: 3 },
      { month: "Jun", ranking: 12, wins: 6 },
    ],
    pastResults: {
      2024: [
        {
          id: 1,
          tournament: "US Open Qualifier",
          date: "March 2024",
          result: "Semifinalist",
          image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop",
        },
        {
          id: 2,
          tournament: "Miami Open",
          date: "February 2024",
          result: "Quarter Finals",
          image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop",
        },
      ],
      2023: [
        {
          id: 3,
          tournament: "French Open Qualifier",
          date: "June 2023",
          result: "First Round",
          image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop",
        },
      ],
    },
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
    mediaGallery: {
      photos: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
          title: "Training Session",
          category: "Training",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
          title: "Victory Celebration",
          category: "Showcase",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Championship Match",
          category: "Showcase",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Practice Court",
          category: "Training",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Awards Ceremony",
          category: "Events",
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
          title: "Team Photo",
          category: "Behind the Scenes",
        },
        {
          id: 7,
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          title: "Gym Training",
          category: "Training",
        },
        {
          id: 8,
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          title: "Media Interview",
          category: "Behind the Scenes",
        },
      ],
      videos: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
          title: "Match Highlights",
          category: "Competition",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
          title: "Training Montage",
          category: "Training",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Behind the Scenes",
          category: "Behind the Scenes",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Tournament Prep",
          category: "Training",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Victory Speech",
          category: "Competition",
        },
      ],
      youtube: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
          title: "Training Routine",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
          title: "Q&A Session",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Day in My Life",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Equipment Review",
        },
      ],
      instagram: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
          title: "Behind the Scenes",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
          title: "Morning Training",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
          title: "Competition Day",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          title: "Recovery Session",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Celebration",
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
          title: "Team Building",
        },
      ],
    },
  };
  return profile;
}

// Mock data for team profile
export function getTeamMockData(id: string) {
  const team = {
    id: Number.parseInt(id),
    name: "Thunder Hawks Basketball",
    sport: "Basketball",
    location: "Chicago, IL",
    country: "🇺🇸",
    league: "🏀",
    rating: 4.8,
    currentFunding: 15000,
    goalFunding: 25000,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&h=300&fit=crop",
    achievements: "Regional Champions 2024",
    category: "team",
    bio: "Professional basketball team competing in the regional league. We're a diverse group of talented athletes working together to achieve excellence on and off the court. Currently seeking sponsorship to upgrade our training facilities and equipment.",
    stats: {
      wins: 28,
      losses: 12,
      ranking: 3,
      members: 15,
    },
    teamStats: [
      { label: "FOUNDED", value: "2018", icon: "📅" },
      { label: "MEMBERS", value: "15", icon: "👥" },
      { label: "LEAGUE", value: "Regional", icon: "🏆" },
      { label: "HOME VENUE", value: "Hawks Arena", icon: "🏟️" },
    ],
    performanceStats: [
      { label: "RANKING", value: "#3", icon: "🏆" },
      { label: "WIN RATE", value: "70%", icon: "📊" },
      { label: "GAMES PLAYED", value: "40", icon: "🏀" },
      { label: "POINTS AVG", value: "89.5", icon: "🎯" },
    ],
    socials: {
      instagram: "@thunderhawks_bball",
      twitter: "@thunderhawks",
      youtube: "Thunder Hawks Basketball",
      facebook: "Thunder Hawks Official",
    },
    checkpoints: [
      { amount: 5000, reward: "Team logo on social media + team photo", unlocked: true },
      { amount: 10000, reward: "Logo on practice jerseys + facility tour", unlocked: true },
      { amount: 15000, reward: "Logo on game jerseys + VIP game tickets", unlocked: true },
      { amount: 25000, reward: "Naming rights to training facility + exclusive events", unlocked: false },
    ],
    performanceData: [
      { month: "Jan", ranking: 8, wins: 3 },
      { month: "Feb", ranking: 6, wins: 5 },
      { month: "Mar", ranking: 4, wins: 6 },
      { month: "Apr", ranking: 3, wins: 7 },
      { month: "May", ranking: 3, wins: 4 },
      { month: "Jun", ranking: 2, wins: 3 },
    ],
    roster: [
      {
        id: 1,
        name: "Marcus Johnson",
        position: "Point Guard",
        number: 23,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        stats: { ppg: 18.5, apg: 7.2, rpg: 4.1 },
      },
      {
        id: 2,
        name: "David Chen",
        position: "Shooting Guard",
        number: 15,
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop",
        stats: { ppg: 22.1, apg: 3.8, rpg: 5.2 },
      },
      {
        id: 3,
        name: "Alex Rodriguez",
        position: "Small Forward",
        number: 7,
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=300&fit=crop",
        stats: { ppg: 16.8, apg: 4.5, rpg: 6.9 },
      },
      {
        id: 4,
        name: "James Wilson",
        position: "Power Forward",
        number: 32,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
        stats: { ppg: 14.2, apg: 2.1, rpg: 8.7 },
      },
    ],
    upcomingGames: [
      {
        id: 1,
        opponent: "City Wolves",
        date: "August 15, 2024",
        location: "Hawks Arena",
        time: "7:00 PM",
        image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=200&fit=crop",
      },
      {
        id: 2,
        opponent: "Metro Lions",
        date: "August 22, 2024",
        location: "Lions Stadium",
        time: "6:30 PM",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
      },
    ],
    recentResults: [
      {
        id: 1,
        opponent: "Valley Eagles",
        date: "July 28, 2024",
        result: "W 95-87",
        location: "Hawks Arena",
        image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=200&fit=crop",
      },
      {
        id: 2,
        opponent: "River Sharks",
        date: "July 21, 2024",
        result: "W 102-89",
        location: "Sharks Court",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
      },
    ],
    sponsors: [
      {
        id: 1,
        name: "SportsCorp",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop",
        tier: "Title Sponsor",
      },
      {
        id: 2,
        name: "Athletic Gear Co",
        logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=100&fit=crop",
        tier: "Official Partner",
      },
    ],
    mediaGallery: {
      photos: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Team Practice",
          category: "Training",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Skill Development",
          category: "Training",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          title: "Championship Game",
          category: "Games",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop",
          title: "Victory Celebration",
          category: "Games",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Awards Ceremony",
          category: "Events",
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
          title: "Team Building",
          category: "Events",
        },
        {
          id: 7,
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          title: "Locker Room",
          category: "Behind the Scenes",
        },
        {
          id: 8,
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          title: "Team Meeting",
          category: "Behind the Scenes",
        },
      ],
      videos: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Game Highlights",
          category: "Game Highlights",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Best Plays",
          category: "Game Highlights",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          title: "Training Session",
          category: "Training",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop",
          title: "Practice Drills",
          category: "Training",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Behind the Scenes",
          category: "Behind the Scenes",
        },
      ],
      youtube: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Season Highlights",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Behind the Scenes",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          title: "Player Interviews",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop",
          title: "Team Documentary",
        },
      ],
      instagram: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=300&fit=crop",
          title: "Game Day",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
          title: "Team Bonding",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          title: "Victory Dance",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop",
          title: "Training Hard",
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: "Championship Trophy",
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
          title: "Team Spirit",
        },
      ],
    },
  };
  return team;
}


