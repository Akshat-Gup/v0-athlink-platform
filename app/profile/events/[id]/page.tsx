"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Heart,
  ArrowLeft,
  MapPin,
  Calendar,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  ExternalLink,
  Share,
  CalendarIcon,
  QrCode,
  MessageCircle,
  Clock,
  Globe,
  BarChart,
  Users,
  Tv,
  Smartphone,
  Handshake,
  Play,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { XAxis, YAxis, ResponsiveContainer, BarChart as ReBarChart, Bar } from "recharts"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

interface PageProps {
  params: {
    id: string
  }
}

export default function EventProfilePage({ params }: PageProps) {
  const { id } = params
  const [activeTab, setActiveTab] = useState("overview")
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showVideosModal, setShowVideosModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showInstagramModal, setShowInstagramModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Mock data for event
  const event = {
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

  const renderProgressBar = (current: number, goal: number) => {
    const percentage = (current / goal) * 100
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-gray-900">${current.toLocaleString()}</span>
          <span className="text-gray-600">of ${goal.toLocaleString()}</span>
        </div>
        <Progress value={percentage} className="h-2 [&>div]:bg-green-500" />
      </div>
    )
  }

  const renderEventDetails = () => {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-6">Event Details</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-500 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-gray-900 font-medium">
              {event.eventDetails.startDate} - {event.eventDetails.endDate}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-500 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-gray-900 font-medium">{event.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-500 flex-shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="text-gray-900 font-medium">Organized by {event.eventDetails.organizer}</span>
          </div>
        </div>
      </Card>
    )
  }

  const renderSponsorshipImpact = () => {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-6">Sponsorship Impact</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-500 flex-shrink-0">
              <Handshake className="w-5 h-5" />
            </div>
            <span className="text-gray-900 font-medium">12 Current Sponsors</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-500 flex-shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <span className="text-gray-900 font-medium">2.5M Media Reach</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-500 flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-gray-900 font-medium">5K Expected Attendees</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-500 flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-gray-900 font-medium">500K Live Stream Viewers</span>
          </div>
        </div>
      </Card>
    )
  }

  const renderStatsGrid = (stats: any[], title: string) => {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
          {stats.map((stat, index) => (
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <Link href="/discover">
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 sm:top-8 left-2 sm:left-4 lg:left-4 xl:left-[max(0.5rem,calc((100vw-80rem)/2-1rem))] z-50 bg-white hover:bg-gray-50 rounded-full shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="relative h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl overflow-visible mb-12 sm:mb-16 lg:mb-20">
            <div className="w-full h-full rounded-xl overflow-hidden">
              <Image
                src={event.coverImage || "/placeholder.svg"}
                alt="Cover"
                width={1200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 left-3 sm:left-6 lg:left-8">
              <div className="relative flex items-center">
                <div className="bg-white rounded-full shadow-xl border-2 sm:border-4 border-white flex items-center pr-2 sm:pr-3 lg:pr-4">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    width={128}
                    height={128}
                    className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                  />
                  <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 lg:ml-4">
                    <span className="text-lg sm:text-xl lg:text-2xl">{event.country}</span>
                    <span className="text-lg sm:text-xl lg:text-2xl">{event.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{event.name}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                    <span className="text-sm">{event.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">{event.eventDetails.startDate}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {event.status}
                  </Badge>
                </div>
              </div>
            </div>

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
                    <DialogTitle>Share Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">Scan to view event details</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="bg-black hover:bg-gray-900 text-sm px-3 sm:px-4">
                <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-sm px-3 sm:px-4">
                <BarChart className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analyse</span>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="sticky top-0 z-40 bg-white pt-4 pb-4 border-b border-gray-100 left-0 right-0 -mx-3 sm:-mx-4 lg:mx-0 px-3 sm:px-4 lg:px-0">
                <div className="w-full max-w-7xl mx-auto">
                  <div className="bg-gray-50 rounded-full p-1 flex w-full">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${activeTab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline ml-2">Overview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("schedule")}
                      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${activeTab === "schedule" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline ml-2">Schedule</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("media")}
                      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${activeTab === "media" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline ml-2">Media</span>
                    </button>
                  </div>
                </div>
              </div>

              {activeTab === "overview" && (
                <>
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">About the Event</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{event.bio}</p>
                  </Card>
                  {renderEventDetails()}
                  {renderSponsorshipImpact()}
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Featured Participants</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {event.featuredParticipants.map((participant) => (
                        <Card key={participant.id} className="p-4 flex items-center gap-4">
                          <Image
                            src={participant.image || "/placeholder.svg"}
                            alt={participant.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold">{participant.name}</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-line">{participant.description}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Ticket Sales Progress</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <ReBarChart data={event.ticketSales}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sold" fill="#22c55e" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Current Sponsors</h3>
                    <div className="space-y-4">
                      {event.sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="flex items-center gap-4 p-4 border rounded-xl">
                          <Image
                            src={sponsor.logo || "/placeholder.svg"}
                            alt={sponsor.name}
                            width={80}
                            height={40}
                            className="w-20 h-10 object-contain"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{sponsor.name}</h4>
                            <p className="text-sm text-gray-600">{sponsor.tier}</p>
                          </div>
                          <Badge className="bg-green-500">${sponsor.amount.toLocaleString()}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "schedule" && (
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
                  <div className="space-y-6">
                    {event.schedule.map((item) => (
                      <div key={item.day} className="p-4 border rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <Clock className="h-5 w-5 text-green-500" />
                          <h4 className="font-semibold text-md">
                            Day {item.day} <span className="text-gray-500 font-normal">({item.date})</span>
                          </h4>
                        </div>
                        <ul className="space-y-2 pl-8 list-disc text-gray-700">
                          {item.events.map((eventItem, index) => (
                            <li key={index}>{eventItem}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === "media" && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Photos Row - Gallery Effect */}
                  <Dialog open={showPhotosModal} onOpenChange={setShowPhotosModal}>
                    <DialogTrigger asChild>
                      <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h3 className="text-lg font-semibold mb-4">Photos</h3>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                          {event.mediaGallery.photos.map((photo) => (
                            <Image
                              key={photo.id}
                              src={photo.url || "/placeholder.svg"}
                              alt={photo.title}
                              width={200}
                              height={150}
                              className="flex-shrink-0 w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            />
                          ))}
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto mx-4">
                      <DialogHeader>
                        <DialogTitle>Photos</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-8">
                        {["Event Setup", "Competition", "Awards", "Behind the Scenes"].map((category) => {
                          const categoryPhotos = event.mediaGallery.photos.filter(
                            (photo) => photo.category === category,
                          )
                          if (categoryPhotos.length === 0) return null

                          return (
                            <div key={category}>
                              <h4 className="text-lg font-semibold mb-4">{category}</h4>
                              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                                {categoryPhotos.map((photo) => (
                                  <div key={photo.id} className="break-inside-avoid">
                                    <Image
                                      src={photo.url || "/placeholder.svg"}
                                      alt={photo.title}
                                      width={400}
                                      height={300}
                                      className="w-full rounded-lg object-cover"
                                      style={{ height: "auto" }}
                                    />
                                    <p className="text-sm text-gray-600 mt-2 px-1">{photo.title}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Videos Row - Gallery Effect */}
                  <Dialog open={showVideosModal} onOpenChange={setShowVideosModal}>
                    <DialogTrigger asChild>
                      <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h3 className="text-lg font-semibold mb-4">Videos</h3>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                          {event.mediaGallery.videos.map((video) => (
                            <div key={video.id} className="relative flex-shrink-0">
                              <Image
                                src={video.url || "/placeholder.svg"}
                                alt={video.title}
                                width={200}
                                height={150}
                                className="w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto mx-4">
                      <DialogHeader>
                        <DialogTitle>Videos</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-8">
                        {["Competition", "Event Highlights", "Behind the Scenes"].map((category) => {
                          const categoryVideos = event.mediaGallery.videos.filter(
                            (video) => video.category === category,
                          )
                          if (categoryVideos.length === 0) return null

                          return (
                            <div key={category}>
                              <h4 className="text-lg font-semibold mb-4">{category}</h4>
                              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                                {categoryVideos.map((video) => (
                                  <div key={video.id} className="break-inside-avoid">
                                    <div className="relative">
                                      <Image
                                        src={video.url || "/placeholder.svg"}
                                        alt={video.title}
                                        width={400}
                                        height={300}
                                        className="w-full rounded-lg object-cover"
                                        style={{ height: "auto" }}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 px-1">{video.title}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* YouTube Row - Gallery Effect */}
                  <Dialog open={showYoutubeModal} onOpenChange={setShowYoutubeModal}>
                    <DialogTrigger asChild>
                      <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex items-center gap-2 mb-4">
                          <Youtube className="h-5 w-5 text-red-500" />
                          <h3 className="text-lg font-semibold">YouTube</h3>
                        </div>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                          {event.mediaGallery.youtube.map((video) => (
                            <div key={video.id} className="relative flex-shrink-0">
                              <Image
                                src={video.url || "/placeholder.svg"}
                                alt={video.title}
                                width={200}
                                height={150}
                                className="w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Youtube className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 bg-white rounded-full p-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl mx-4">
                      <DialogHeader>
                        <DialogTitle>YouTube Videos</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {event.mediaGallery.youtube.map((video) => (
                          <div key={video.id} className="relative">
                            <Image
                              src={video.url || "/placeholder.svg"}
                              alt={video.title}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Youtube className="h-12 w-12 text-red-500 bg-white rounded-full p-3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Instagram Row - Gallery Effect */}
                  <Dialog open={showInstagramModal} onOpenChange={setShowInstagramModal}>
                    <DialogTrigger asChild>
                      <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex items-center gap-2 mb-4">
                          <Instagram className="h-5 w-5 text-pink-500" />
                          <h3 className="text-lg font-semibold">Instagram</h3>
                        </div>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                          {event.mediaGallery.instagram.map((post) => (
                            <Image
                              key={post.id}
                              src={post.url || "/placeholder.svg"}
                              alt={post.title}
                              width={200}
                              height={150}
                              className="flex-shrink-0 w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            />
                          ))}
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl mx-4">
                      <DialogHeader>
                        <DialogTitle>Instagram Posts</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {event.mediaGallery.instagram.map((post) => (
                          <Image
                            key={post.id}
                            src={post.url || "/placeholder.svg"}
                            alt={post.title}
                            width={400}
                            height={300}
                            className="w-full h-32 sm:h-48 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            <div className="hidden lg:block space-y-6 ml-8">
              <div className="sticky top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto overflow-x-visible px-2 -mx-2">
                <Card className="p-6 shadow-xl border-0">
                  <h3 className="text-lg font-semibold mb-4">Sponsorship Opportunities</h3>
                  {renderProgressBar(event.currentFunding, event.goalFunding)}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-sm">Sponsorship Packages</h4>
                    {event.checkpoints.map((checkpoint, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${checkpoint.unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">${checkpoint.amount.toLocaleString()}</span>
                          {checkpoint.unlocked && <Badge className="bg-green-500">Unlocked</Badge>}
                        </div>
                        <p className="text-xs text-gray-600">{checkpoint.reward}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Sponsor Event</Button>
                </Card>
                <Card className="p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Start Date</span>
                      <span className="text-sm font-medium">{event.eventDetails.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="text-sm font-medium">{event.eventDetails.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Venue</span>
                      <span className="text-sm font-medium">{event.eventDetails.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Capacity</span>
                      <span className="text-sm font-medium">{event.eventDetails.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tickets</span>
                      <span className="text-sm font-medium">{event.eventDetails.ticketPrice}</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">{event.socials.instagram}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{event.socials.twitter}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{event.socials.youtube}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{event.socials.facebook}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
