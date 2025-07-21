// Mock data for event profile
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
    },
  }
}