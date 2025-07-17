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
  Trophy,
  Calendar,
  Sparkles,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Target,
  Play,
  ExternalLink,
  Share,
  Users,
  CalendarIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

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

  // Mock data - in real app this would come from API
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
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
          title: "Victory Celebration",
        },
      ],
      videos: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
          title: "Match Highlights",
        },
      ],
      youtube: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
          title: "Training Routine",
        },
      ],
      instagram: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
          title: "Behind the Scenes",
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
        <Progress value={percentage} className="h-2" />
      </div>
    )
  }

  const renderStatsGrid = (stats: any[], title: string) => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="ghost" className="text-sm text-gray-600 hover:text-gray-900">
          View All Stats →
        </Button>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex-shrink-0 bg-gray-50 rounded-2xl p-6 min-w-[140px] text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner with Back Button Overlay */}
        <div className="relative h-64 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl overflow-hidden mb-8">
          <Image
            src={profile.coverImage || "/placeholder.svg"}
            alt="Cover"
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
          <Link href="/discover">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Profile Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Image
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-white object-cover -mt-16"
            />
            <div className="ml-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{profile.country}</span>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎾</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                  <span className="text-sm">{profile.rating}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <Badge variant="secondary">{profile.achievements}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 animate-shimmer shadow-lg shadow-green-500/25">
              <Sparkles className="h-4 w-4 mr-2" />
              Analyse
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2 inline-flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "results"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Results</span>
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "media"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Media</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </Card>

                {renderStatsGrid(profile.demographics, "Demographics")}
                {renderStatsGrid(profile.performanceStats, "Performance Stats")}

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ranking Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={profile.performanceData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="ranking" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Monthly Wins</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={profile.performanceData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="wins" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
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
              </>
            )}

            {activeTab === "results" && (
              <>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Upcoming Competitions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.upcomingCompetitions.map((comp) => (
                      <Card key={comp.id} className="p-4">
                        <Image
                          src={comp.image || "/placeholder.svg"}
                          alt={comp.tournament}
                          width={300}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold">{comp.tournament}</h4>
                        <p className="text-sm text-gray-600">{comp.date}</p>
                        <p className="text-sm text-gray-600">{comp.location}</p>
                      </Card>
                    ))}
                  </div>
                </Card>

                {Object.entries(profile.pastResults).map(([year, results]) => (
                  <Card key={year} className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Past Results - {year}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {results.map((result: any) => (
                        <Card key={result.id} className="p-4">
                          <Image
                            src={result.image || "/placeholder.svg"}
                            alt={result.tournament}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold">{result.tournament}</h4>
                          <p className="text-sm text-gray-600">{result.date}</p>
                          <Badge className="mt-2">{result.result}</Badge>
                        </Card>
                      ))}
                    </div>
                  </Card>
                ))}
              </>
            )}

            {activeTab === "media" && (
              <div className="grid md:grid-cols-2 gap-6">
                <Dialog open={showPhotosModal} onOpenChange={setShowPhotosModal}>
                  <DialogTrigger asChild>
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-semibold mb-4">Photos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {profile.mediaGallery.photos.slice(0, 4).map((photo) => (
                          <Image
                            key={photo.id}
                            src={photo.url || "/placeholder.svg"}
                            alt={photo.title}
                            width={200}
                            height={150}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Photos</DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-3 gap-4">
                      {profile.mediaGallery.photos.map((photo) => (
                        <Image
                          key={photo.id}
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showVideosModal} onOpenChange={setShowVideosModal}>
                  <DialogTrigger asChild>
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-semibold mb-4">Videos</h3>
                      <div className="relative">
                        <Image
                          src={profile.mediaGallery.videos[0]?.url || "/placeholder.svg"}
                          alt="Video thumbnail"
                          width={400}
                          height={300}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-2" />
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Videos</DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-4">
                      {profile.mediaGallery.videos.map((video) => (
                        <div key={video.id} className="relative">
                          <Image
                            src={video.url || "/placeholder.svg"}
                            alt={video.title}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showYoutubeModal} onOpenChange={setShowYoutubeModal}>
                  <DialogTrigger asChild>
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-4">
                        <Youtube className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold">YouTube</h3>
                      </div>
                      <div className="relative">
                        <Image
                          src={profile.mediaGallery.youtube[0]?.url || "/placeholder.svg"}
                          alt="YouTube thumbnail"
                          width={400}
                          height={300}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Youtube className="h-8 w-8 text-red-500 bg-white rounded-full p-2" />
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>YouTube Videos</DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-4">
                      {profile.mediaGallery.youtube.map((video) => (
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

                <Dialog open={showInstagramModal} onOpenChange={setShowInstagramModal}>
                  <DialogTrigger asChild>
                    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-4">
                        <Instagram className="h-5 w-5 text-pink-500" />
                        <h3 className="text-lg font-semibold">Instagram</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {profile.mediaGallery.instagram.slice(0, 4).map((post) => (
                          <Image
                            key={post.id}
                            src={post.url || "/placeholder.svg"}
                            alt={post.title}
                            width={200}
                            height={150}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Instagram Posts</DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-3 gap-4">
                      {profile.mediaGallery.instagram.map((post) => (
                        <Image
                          key={post.id}
                          src={post.url || "/placeholder.svg"}
                          alt={post.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Campaign Progress</h3>
              {renderProgressBar(profile.currentFunding, profile.goalFunding)}

              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-sm">Sponsorship Checkpoints</h4>
                {profile.checkpoints.map((checkpoint, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      checkpoint.unlocked
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">${checkpoint.amount.toLocaleString()}</span>
                      {checkpoint.unlocked && <Badge className="bg-green-500">Unlocked</Badge>}
                    </div>
                    <p className="text-xs text-gray-600">{checkpoint.reward}</p>
                  </div>
                ))}
              </div>

              <Dialog open={showSponsorModal} onOpenChange={setShowSponsorModal}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Support Campaign</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Sponsorship Packages</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-4 border-2 border-green-500">
                        <h4 className="font-semibold mb-2">Bronze Package</h4>
                        <p className="text-2xl font-bold text-green-500 mb-2">$1,000</p>
                        <ul className="text-sm space-y-1">
                          <li>• Social media mentions</li>
                          <li>• Signed merchandise</li>
                          <li>• Monthly updates</li>
                        </ul>
                      </Card>
                      <Card className="p-4 border-2">
                        <h4 className="font-semibold mb-2">Silver Package</h4>
                        <p className="text-2xl font-bold mb-2">$2,500</p>
                        <ul className="text-sm space-y-1">
                          <li>• Logo on training gear</li>
                          <li>• Event invitations</li>
                          <li>• Exclusive content</li>
                        </ul>
                      </Card>
                    </div>
                    <div className="flex gap-4">
                      <Button className="flex-1 bg-green-500 hover:bg-green-600">Choose Package</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Custom Negotiation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>

            <Card className="p-6">
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
          </div>
        </div>
      </div>
    </div>
  )
}
