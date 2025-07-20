"use client"

import { Button } from "@/components/ui/button"
import { AchievementsSection } from "@/components/custom/achievement-card"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Heart,
  ArrowLeft,
  MapPin,
  Trophy,
  Calendar,
  Sparkles,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Target,
  ExternalLink,
  Share,
  Users,
  CalendarIcon,
  Copy,
  QrCode,
  MessageCircle,
  Building,
  Clock,
  Award,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

interface PageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = params
  const [showSponsorModal, setShowSponsorModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showVideosModal, setShowVideosModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showInstagramModal, setShowInstagramModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAllDemographics, setShowAllDemographics] = useState(false)
  const [showAllPerformanceStats, setShowAllPerformanceStats] = useState(false)

  // Mock data - in real app this would come from API based on ID and type
  const getProfileData = (id: string) => {
    const profileId = Number.parseInt(id)

    // Team profiles
    if (profileId === 3) {
      return {
        type: "team",
        id: profileId,
        name: "Elite Runners Club",
        sport: "Track & Field",
        location: "New York, NY",
        country: "🇺🇸",
        team: "🏃‍♂️",
        rating: 4.92,
        currentFunding: 15000,
        goalFunding: 50000,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop",
        achievements: "12 Professional Athletes",
        category: "team",
        bio: "Elite Runners Club is a premier track and field team based in New York, featuring 12 professional athletes competing at national and international levels. We're seeking sponsorship to support our athletes' training, equipment, and competition expenses.",
        stats: {
          members: 12,
          competitions: 25,
          wins: 18,
        },
        teamType: "Professional",
        founded: "2019",
        members: [
          {
            id: 1,
            name: "Sarah Chen",
            sport: "400m Sprint",
            image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop",
            achievements: "Olympic Qualifier",
            role: "Captain",
          },
          {
            id: 2,
            name: "Marcus Johnson",
            sport: "Long Jump",
            image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=100&h=100&fit=crop",
            achievements: "National Champion",
            role: "Member",
          },
          {
            id: 3,
            name: "Emma Wilson",
            sport: "800m",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
            achievements: "State Record Holder",
            role: "Member",
          },
          {
            id: 4,
            name: "Jake Thompson",
            sport: "Marathon",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            achievements: "Boston Qualifier",
            role: "Member",
          },
        ],
        upcomingEvents: [
          {
            id: 1,
            name: "National Track Championships",
            date: "August 2024",
            location: "Eugene, OR",
            participants: 8,
          },
          {
            id: 2,
            name: "Olympic Trials",
            date: "September 2024",
            location: "Los Angeles, CA",
            participants: 4,
          },
        ],
        sponsorshipPackages: [
          {
            name: "Bronze Sponsor",
            price: "$5,000",
            benefits: [
              "Logo on team uniforms",
              "Social media mentions",
              "Event program listing",
              "Quarterly progress reports",
            ],
          },
          {
            name: "Silver Sponsor",
            price: "$15,000",
            benefits: [
              "All Bronze benefits",
              "Logo on team equipment",
              "VIP event access",
              "Meet & greet opportunities",
              "Custom content creation",
            ],
          },
          {
            name: "Gold Sponsor",
            price: "$30,000",
            benefits: [
              "All Silver benefits",
              "Title sponsor recognition",
              "Exclusive training access",
              "Athlete appearances",
              "Co-branded marketing materials",
            ],
          },
        ],
      }
    }

    // Event profiles
    if (profileId === 4) {
      return {
        type: "event",
        id: profileId,
        name: "Swimming Championships",
        sport: "Swimming",
        location: "Miami, FL",
        country: "🇺🇸",
        team: "🏊‍♀️",
        rating: 4.88,
        currentFunding: 25000,
        goalFunding: 75000,
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=300&fit=crop",
        achievements: "National Championship Event",
        category: "event",
        bio: "The Swimming Championships is a premier national-level swimming competition featuring over 200 athletes from across the country. This three-day event showcases the best talent in competitive swimming and offers excellent sponsorship opportunities for brands looking to reach a dedicated sports audience.",
        stats: {
          participants: 200,
          days: 3,
          events: 32,
        },
        eventType: "Championship",
        startDate: "July 15, 2024",
        endDate: "July 17, 2024",
        venue: "Miami Aquatic Center",
        organizer: "USA Swimming Federation",
        expectedAttendance: 5000,
        participants: [
          {
            id: 1,
            name: "Emma Wilson",
            sport: "Freestyle",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
            achievements: "State Champion",
            events: ["100m Free", "200m Free"],
          },
          {
            id: 2,
            name: "Alex Rodriguez",
            sport: "Butterfly",
            image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
            achievements: "Regional Record Holder",
            events: ["100m Fly", "200m Fly"],
          },
          {
            id: 3,
            name: "Sofia Martinez",
            sport: "Backstroke",
            image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop",
            achievements: "Junior National Champion",
            events: ["100m Back", "200m Back"],
          },
        ],
        schedule: [
          {
            day: "Day 1",
            date: "July 15, 2024",
            events: ["100m Freestyle Preliminaries", "200m Butterfly Preliminaries", "100m Backstroke Finals"],
          },
          {
            day: "Day 2",
            date: "July 16, 2024",
            events: ["200m Freestyle Finals", "100m Breaststroke Preliminaries", "400m Individual Medley Finals"],
          },
          {
            day: "Day 3",
            date: "July 17, 2024",
            events: ["50m Freestyle Finals", "200m Backstroke Finals", "4x100m Relay Finals"],
          },
        ],
        sponsorshipPackages: [
          {
            name: "Event Sponsor",
            price: "$10,000",
            benefits: [
              "Logo on event materials",
              "PA announcements",
              "Social media promotion",
              "Event program advertisement",
            ],
          },
          {
            name: "Title Sponsor",
            price: "$25,000",
            benefits: [
              "All Event Sponsor benefits",
              "Event naming rights",
              "VIP hospitality area",
              "Live stream logo placement",
              "Award ceremony recognition",
            ],
          },
          {
            name: "Presenting Sponsor",
            price: "$50,000",
            benefits: [
              "All Title Sponsor benefits",
              "Exclusive category rights",
              "Custom activation space",
              "Athlete meet & greets",
              "Year-round marketing partnership",
            ],
          },
        ],
      }
    }

    // Default talent profile (existing)
    return {
      type: "talent",
      id: profileId,
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
      socials: {
        instagram: "@sarahchen_tennis",
        twitter: "@sarahchen",
        youtube: "Sarah Chen Tennis",
        facebook: "Sarah Chen Official",
      },
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
    }
  }

  const profile = getProfileData(id)

  const renderProgressBar = (current: number, goal: number) => {
    const percentage = (current / goal) * 100
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-gray-900">${current.toLocaleString()}</span>
          <span className="text-gray-600">of ${goal.toLocaleString()}</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    )
  }

  const renderStatsGrid = (stats: any[], title: string, showAll: boolean, setShowAll: (show: boolean) => void) => {
    const displayStats = showAll ? stats : stats.slice(0, 4)

    return (
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button
            variant="ghost"
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `View All ${stats.length} Stats`} →
          </Button>
        </div>
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
          {displayStats.map((stat, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 min-w-[120px] sm:min-w-[140px] text-center shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
            >
              <div className="text-xl sm:text-2xl mb-2 text-gray-600">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const renderTalentProfile = () => (
    <>
      {activeTab === "overview" && (
        <>
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-600 text-sm sm:text-base">{profile.bio}</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-500" />
                <span className="text-sm">{profile.achievements}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="text-sm">8 years experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm">World Ranking #{profile.stats.ranking}</span>
              </div>
            </div>
          </Card>

          {renderStatsGrid(profile.demographics, "Demographics", showAllDemographics, setShowAllDemographics)}
          {renderStatsGrid(
            profile.performanceStats,
            "Performance Stats",
            showAllPerformanceStats,
            setShowAllPerformanceStats,
          )}

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Ranking Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profile.performanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ranking" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {activeTab === "results" && (
        <>
          <AchievementsSection />
        </>
      )}

      {activeTab === "media" && (
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Media Gallery</h3>
            <p className="text-gray-600">Media content will be displayed here</p>
          </Card>
        </div>
      )}
    </>
  )

  const renderTeamProfile = () => (
    <>
      {activeTab === "overview" && (
        <>
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">About the Team</h3>
            <p className="text-gray-600 text-sm sm:text-base">{profile.bio}</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Team Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.members}</div>
                <div className="text-sm text-gray-600">Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.competitions}</div>
                <div className="text-sm text-gray-600">Competitions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.wins}</div>
                <div className="text-sm text-gray-600">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{profile.founded}</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Team Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{member.name}</h4>
                    <p className="text-xs text-gray-600">{member.sport}</p>
                    <p className="text-xs text-gray-500">{member.achievements}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {profile.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">{event.name}</h4>
                    <p className="text-xs text-gray-600">
                      {event.date} • {event.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.participants} athletes
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {activeTab === "results" && (
        <>
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Team Achievements</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                    Championship
                  </Badge>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">National Track Championships</h4>
                <p className="text-sm text-gray-600">Team placed 2nd overall with 8 individual medals</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                    Recognition
                  </Badge>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Team of the Year Award</h4>
                <p className="text-sm text-gray-600">Recognized for outstanding performance and sportsmanship</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === "media" && (
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Team Media</h3>
            <p className="text-gray-600">Team photos and videos will be displayed here</p>
          </Card>
        </div>
      )}
    </>
  )

  const renderEventProfile = () => (
    <>
      {activeTab === "overview" && (
        <>
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">About the Event</h3>
            <p className="text-gray-600 text-sm sm:text-base">{profile.bio}</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    {profile.startDate} - {profile.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    {profile.venue}, {profile.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Organized by {profile.organizer}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.participants}</div>
                  <div className="text-sm text-gray-600">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.days}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.events}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.expectedAttendance.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Expected Attendance</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Featured Participants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Image
                    src={participant.image || "/placeholder.svg"}
                    alt={participant.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{participant.name}</h4>
                    <p className="text-xs text-gray-600">{participant.sport}</p>
                    <p className="text-xs text-gray-500">{participant.achievements}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
            <div className="space-y-4">
              {profile.schedule.map((day, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold">{day.day}</h4>
                    <span className="text-sm text-gray-600">({day.date})</span>
                  </div>
                  <div className="space-y-2">
                    {day.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="text-sm text-gray-600 pl-6">
                        • {event}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {activeTab === "results" && (
        <>
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Event History</h3>
            <p className="text-gray-600">Previous event results and highlights will be displayed here</p>
          </Card>
        </>
      )}

      {activeTab === "media" && (
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Event Media</h3>
            <p className="text-gray-600">Event photos and promotional materials will be displayed here</p>
          </Card>
        </div>
      )}
    </>
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Persistent Back Button */}
          <Link href="/discover">
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 sm:top-8 left-2 sm:left-4 lg:left-4 xl:left-[max(0.5rem,calc((100vw-80rem)/2-1rem))] z-50 bg-white hover:bg-gray-50 rounded-full shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          {/* Banner with Profile Image Overlay - Mobile Optimized */}
          <div className="relative h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl overflow-visible mb-12 sm:mb-16 lg:mb-20">
            <div className="w-full h-full rounded-xl overflow-hidden">
              <Image
                src={profile.coverImage || "/placeholder.svg"}
                alt="Cover"
                width={1200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Image with Pill Background - Mobile Responsive */}
            <div className="absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 left-3 sm:left-6 lg:left-8">
              <div className="relative flex items-center">
                {/* Pill Background - Responsive */}
                <div className="bg-white rounded-full shadow-xl border-2 sm:border-4 border-white flex items-center pr-2 sm:pr-3 lg:pr-4">
                  {/* Profile Image - Responsive sizes */}
                  <Image
                    src={profile.image || "/placeholder.svg"}
                    alt={profile.name}
                    width={128}
                    height={128}
                    className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                  />
                  {/* Icons - Responsive */}
                  <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 lg:ml-4">
                    <span className="text-lg sm:text-xl lg:text-2xl">{profile.country}</span>
                    <span className="text-lg sm:text-xl lg:text-2xl">{profile.team}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h1>
                  {profile.type === "team" && <Users className="h-5 w-5 text-gray-600" />}
                  {profile.type === "event" && <CalendarIcon className="h-5 w-5 text-gray-600" />}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                    <span className="text-sm">{profile.rating}</span>
                  </div>
                  <Link
                    href={`/discover?location=${encodeURIComponent(profile.location)}`}
                    className="flex items-center hover:text-green-600 transition-colors cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{profile.location}</span>
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {profile.achievements}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Button variant="outline" className="bg-transparent rounded-full" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-transparent text-sm px-3 sm:px-4">
                    <Share className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Share Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* QR Code */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">Scan to view profile</p>
                    </div>

                    {/* Share Options */}
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="bg-black hover:bg-gray-900 animate-shimmer shadow-lg shadow-black/25 text-sm px-3 sm:px-4">
                <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 animate-shimmer shadow-lg shadow-green-500/25 text-sm px-3 sm:px-4">
                <Sparkles className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sponsor</span>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Sticky Tabs - Mobile Optimized */}
              <div className="sticky top-0 z-40 bg-white pt-4 pb-4 border-b border-gray-100 left-0 right-0 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
                <div className="w-full max-w-7xl mx-auto">
                  <div className="bg-gray-50 rounded-full p-1 flex w-full">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${
                        activeTab === "overview"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline ml-2">Overview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("results")}
                      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${
                        activeTab === "results"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Trophy className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline ml-2">{profile.type === "event" ? "History" : "Results"}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("media")}
                      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${
                        activeTab === "media" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline ml-2">Media</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Render content based on profile type */}
              {profile.type === "talent" && renderTalentProfile()}
              {profile.type === "team" && renderTeamProfile()}
              {profile.type === "event" && renderEventProfile()}
            </div>

            {/* Scrollable Sticky Sidebar - Hidden on Mobile */}
            <div className="hidden lg:block space-y-6 ml-8">
              <div className="sticky top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto overflow-x-visible px-2 -mx-2">
                <Card className="p-6 shadow-xl border-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {profile.type === "event" ? "Event Funding" : "Sponsorship Progress"}
                  </h3>
                  {renderProgressBar(profile.currentFunding, profile.goalFunding)}

                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-sm">Sponsorship Packages</h4>
                    {profile.sponsorshipPackages?.map((pkg, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{pkg.name}</span>
                          <span className="font-bold text-green-600">{pkg.price}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {pkg.benefits.slice(0, 2).map((benefit, i) => (
                            <div key={i}>• {benefit}</div>
                          ))}
                          {pkg.benefits.length > 2 && (
                            <div className="text-gray-500">+ {pkg.benefits.length - 2} more benefits</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Dialog open={showSponsorModal} onOpenChange={setShowSponsorModal}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
                        {profile.type === "event" ? "Sponsor Event" : "Sponsor Now"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl mx-4">
                      <DialogHeader>
                        <DialogTitle>Sponsorship Packages</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {profile.sponsorshipPackages?.map((pkg, index) => (
                            <Card key={index} className="p-4 border-2 hover:border-green-500 transition-colors">
                              <h4 className="font-semibold mb-2">{pkg.name}</h4>
                              <p className="text-2xl font-bold text-green-500 mb-4">{pkg.price}</p>
                              <ul className="text-sm space-y-1">
                                {pkg.benefits.map((benefit, i) => (
                                  <li key={i}>• {benefit}</li>
                                ))}
                              </ul>
                              <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Select Package</Button>
                            </Card>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          <Button variant="outline" className="flex-1 bg-transparent">
                            Custom Package
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </Card>

                {profile.type === "talent" && profile.socials && (
                  <Card className="p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-500" />
                          <span className="text-sm">{profile.socials.instagram}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{profile.socials.twitter}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{profile.socials.youtube}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{profile.socials.facebook}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar - Bottom Sheet Style */}
          <div className="lg:hidden mt-6">
            <Card className="p-4 shadow-xl border-0">
              <h3 className="text-lg font-semibold mb-4">
                {profile.type === "event" ? "Event Funding" : "Sponsorship Progress"}
              </h3>
              {renderProgressBar(profile.currentFunding, profile.goalFunding)}

              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-sm">Sponsorship Packages</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.sponsorshipPackages?.slice(0, 2).map((pkg, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{pkg.name}</span>
                        <span className="font-bold text-green-600 text-xs">{pkg.price}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {pkg.benefits.slice(0, 1).map((benefit, i) => (
                          <div key={i}>• {benefit}</div>
                        ))}
                        <div className="text-gray-500">+ {pkg.benefits.length - 1} more</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Dialog open={showSponsorModal} onOpenChange={setShowSponsorModal}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
                    {profile.type === "event" ? "Sponsor Event" : "Sponsor Now"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl mx-4">
                  <DialogHeader>
                    <DialogTitle>Sponsorship Packages</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.sponsorshipPackages?.map((pkg, index) => (
                        <Card key={index} className="p-4 border-2 hover:border-green-500 transition-colors">
                          <h4 className="font-semibold mb-2">{pkg.name}</h4>
                          <p className="text-xl font-bold text-green-500 mb-3">{pkg.price}</p>
                          <ul className="text-xs space-y-1">
                            {pkg.benefits.slice(0, 3).map((benefit, i) => (
                              <li key={i}>• {benefit}</li>
                            ))}
                            {pkg.benefits.length > 3 && (
                              <li className="text-gray-500">+ {pkg.benefits.length - 3} more</li>
                            )}
                          </ul>
                          <Button className="w-full mt-3 bg-green-500 hover:bg-green-600 text-xs">
                            Select Package
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
