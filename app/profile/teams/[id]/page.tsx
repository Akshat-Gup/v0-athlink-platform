"use client"

import { Button } from "@/components/atoms/button"
import { Card } from "@/components/molecules/card"
import { Progress } from "@/components/atoms/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Badge } from "@/components/atoms/badge"
import {
  Star,
  Heart,
  ArrowLeft,
  MapPin,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  ExternalLink,
  Share,
  Users,
  CalendarIcon,
  QrCode,
  MessageCircle,
  Shield,
  BarChart,
  Trophy,
  Play,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Tooltip, TooltipProvider } from "@/components/molecules/tooltip"

interface PageProps {
  params: {
    id: string
  }
}

export default function TeamProfilePage({ params }: PageProps) {
  const { id } = params
  const [activeTab, setActiveTab] = useState("overview")
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showVideosModal, setShowVideosModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showInstagramModal, setShowInstagramModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Mock data for team
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
                src={team.coverImage || "/placeholder.svg"}
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
                    src={team.image || "/placeholder.svg"}
                    alt={team.name}
                    width={128}
                    height={128}
                    className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                  />
                  <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 lg:ml-4">
                    <span className="text-lg sm:text-xl lg:text-2xl">{team.country}</span>
                    <span className="text-lg sm:text-xl lg:text-2xl">{team.league}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{team.name}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                    <span className="text-sm">{team.rating}</span>
                  </div>
                  <Link
                    href={`/discover?location=${encodeURIComponent(team.location)}`}
                    className="flex items-center hover:text-green-600 transition-colors cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{team.location}</span>
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {team.achievements}
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
                    <DialogTitle>Share Team Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">Scan to view team profile</p>
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
                      onClick={() => setActiveTab("roster")}
                      className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 min-w-0 ${
                        activeTab === "roster"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Shield className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline ml-2">Roster</span>
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
                      <span className="hidden sm:inline ml-2">Results</span>
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

              {activeTab === "overview" && (
                <>
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">About the Team</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{team.bio}</p>
                  </Card>
                  {renderStatsGrid(team.teamStats, "Team Information")}
                  {renderStatsGrid(team.performanceStats, "Performance Stats")}
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Season Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={team.performanceData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="ranking" stroke="#22c55e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Games</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {team.upcomingGames.map((game) => (
                        <Card key={game.id} className="p-4">
                          <Image
                            src={game.image || "/placeholder.svg"}
                            alt={game.opponent}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold">vs {game.opponent}</h4>
                          <p className="text-sm text-gray-600">{game.date}</p>
                          <p className="text-sm text-gray-600">{game.location}</p>
                          <p className="text-sm text-gray-600">{game.time}</p>
                        </Card>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Current Sponsors</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {team.sponsors.map((sponsor) => (
                        <div
                          key={sponsor.id}
                          className="flex flex-col items-center gap-2 p-4 border rounded-xl text-center"
                        >
                          <Image
                            src={sponsor.logo || "/placeholder.svg"}
                            alt={sponsor.name}
                            width={80}
                            height={40}
                            className="w-20 h-10 object-contain"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{sponsor.name}</h4>
                            <p className="text-xs text-gray-600">{sponsor.tier}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "roster" && (
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Team Roster</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {team.roster.map((player) => (
                      <Card key={player.id} className="p-4">
                        <div className="flex items-center gap-4">
                          <Image
                            src={player.image || "/placeholder.svg"}
                            alt={player.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover rounded-full"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{player.name}</h4>
                            <p className="text-sm text-gray-600">{player.position}</p>
                            <p className="text-sm text-gray-600">#{player.number}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold">{player.stats.ppg}</p>
                            <p className="text-xs text-gray-600">PPG</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{player.stats.apg}</p>
                            <p className="text-xs text-gray-600">APG</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{player.stats.rpg}</p>
                            <p className="text-xs text-gray-600">RPG</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === "results" && (
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Results</h3>
                  <div className="space-y-4">
                    {team.recentResults.map((result) => (
                      <div key={result.id} className="flex items-center gap-4 p-4 border rounded-xl">
                        <Image
                          src={result.image || "/placeholder.svg"}
                          alt={result.opponent}
                          width={80}
                          height={60}
                          className="w-20 h-15 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">vs {result.opponent}</h4>
                          <p className="text-sm text-gray-600">{result.date}</p>
                          <p className="text-sm text-gray-600">{result.location}</p>
                        </div>
                        <Badge className="bg-green-500">{result.result}</Badge>
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
                          {team.mediaGallery.photos.map((photo) => (
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
                        {["Training", "Games", "Events", "Behind the Scenes"].map((category) => {
                          const categoryPhotos = team.mediaGallery.photos.filter((photo) => photo.category === category)
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
                          {team.mediaGallery.videos.map((video) => (
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
                        {["Game Highlights", "Training", "Behind the Scenes"].map((category) => {
                          const categoryVideos = team.mediaGallery.videos.filter((video) => video.category === category)
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
                          {team.mediaGallery.youtube.map((video) => (
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
                        {team.mediaGallery.youtube.map((video) => (
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
                          {team.mediaGallery.instagram.map((post) => (
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
                        {team.mediaGallery.instagram.map((post) => (
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
                  <h3 className="text-lg font-semibold mb-4">Sponsorship Campaign</h3>
                  {renderProgressBar(team.currentFunding, team.goalFunding)}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-sm">Sponsorship Packages</h4>
                    {team.checkpoints.map((checkpoint, index) => (
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
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Sponsor Team</Button>
                </Card>
                <Card className="p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">{team.socials.instagram}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{team.socials.twitter}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{team.socials.youtube}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{team.socials.facebook}</span>
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
