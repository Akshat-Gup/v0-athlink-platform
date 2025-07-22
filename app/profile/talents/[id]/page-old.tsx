"use client"

import { Button } from "@/components/atoms/button"
import { AchievementsSection } from "@/components/molecules/profile/profile-card"
import { Card } from "@/components/molecules/card"
import { Progress } from "@/components/atoms/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Badge } from "@/components/atoms/badge"
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
  Copy,
  LinkIcon,
  QrCode,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/molecules/tooltip"
import { getTalentMockData } from "../../../../lib/mock-profile-data"

interface PageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = params
  const profile = getTalentMockData(id)
  const [showSponsorModal, setShowSponsorModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showVideosModal, setShowVideosModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showInstagramModal, setShowInstagramModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAllDemographics, setShowAllDemographics] = useState(false)
  const [showAllPerformanceStats, setShowAllPerformanceStats] = useState(false)

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
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Generate Short Link
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start bg-transparent">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                        <Button variant="outline" className="justify-start bg-transparent">
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </Button>
                        <Button variant="outline" className="justify-start bg-transparent">
                          <svg className="h-4 w-4 mr-2" fill="#0A66C2" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          LinkedIn
                        </Button>
                        <Button variant="outline" className="justify-start bg-transparent">
                          <svg className="h-4 w-4 mr-2" fill="#25D366" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                          </svg>
                          WhatsApp
                        </Button>
                      </div>
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
                <span className="hidden sm:inline">Analyse</span>
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

                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Wins</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={profile.performanceData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="wins" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Team Section */}
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Team</h3>
                    <div className="text-gray-600 text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm">Team members will be displayed here</p>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "results" && (
                <>
                  <AchievementsSection 
                    achievements={profile.achievementsList} 
                    title="Achievements" 
                  />
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Competitions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <Card className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Past Results</h3>
                    <div className="space-y-8">
                      {Object.entries(profile.pastResults)
                        .sort((a, b) => Number(b[0]) - Number(a[0]))
                        .map(([year, results]) => (
                          <div key={year}>
                            <h4 className="text-md font-semibold mb-2">{year}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {results.map((result: any) => (
                                <div key={result.id} className="p-4 border rounded-xl bg-white flex flex-col relative">
                                  <Image
                                    src={result.image || "/placeholder.svg"}
                                    alt={result.tournament}
                                    width={300}
                                    height={200}
                                    className="w-full h-32 object-cover rounded-lg mb-3"
                                  />
                                  <h4 className="font-semibold pr-12">{result.tournament}</h4>
                                  <p className="text-sm text-gray-600">{result.date}</p>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                                        <Trophy className="h-5 w-5 text-gray-600" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{result.result}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "media" && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Photos Row - Gallery Effect */}
                  <Dialog open={showPhotosModal} onOpenChange={setShowPhotosModal}>
                    <DialogTrigger asChild>
                      <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <h3 className="text-lg font-semibold mb-4">Photos</h3>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                          {profile.mediaGallery.photos.map((photo) => (
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
                        {["Training", "Showcase", "Events", "Behind the Scenes"].map((category) => {
                          const categoryPhotos = profile.mediaGallery.photos.filter(
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
                          {profile.mediaGallery.videos.map((video) => (
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
                        {["Competition", "Training", "Behind the Scenes"].map((category) => {
                          const categoryVideos = profile.mediaGallery.videos.filter(
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
                          {profile.mediaGallery.youtube.map((video) => (
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

                  {/* Instagram Row - Gallery Effect */}
                  <Dialog open={showInstagramModal} onOpenChange={setShowInstagramModal}>
                    <DialogTrigger asChild>
                      <Card className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex items-center gap-2 mb-4">
                          <Instagram className="h-5 w-5 text-pink-500" />
                          <h3 className="text-lg font-semibold">Instagram</h3>
                        </div>
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                          {profile.mediaGallery.instagram.map((post) => (
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
                        {profile.mediaGallery.instagram.map((post) => (
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

            {/* Scrollable Sticky Sidebar - Hidden on Mobile */}
            <div className="hidden lg:block space-y-6 ml-8">
              <div className="sticky top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto overflow-x-visible px-2 -mx-2">
                <Card className="p-6 shadow-xl border-0">
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
              </div>
            </div>
          </div>

          {/* Mobile Sidebar - Bottom Sheet Style */}
          <div className="lg:hidden mt-6">
            <Card className="p-4 shadow-xl border-0">
              <h3 className="text-lg font-semibold mb-4">Campaign Progress</h3>
              {renderProgressBar(profile.currentFunding, profile.goalFunding)}

              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-sm">Sponsorship Checkpoints</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        {checkpoint.unlocked && <Badge className="bg-green-500 text-xs">Unlocked</Badge>}
                      </div>
                      <p className="text-xs text-gray-600">{checkpoint.reward}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Dialog open={showSponsorModal} onOpenChange={setShowSponsorModal}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Support Campaign</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl mx-4">
                  <DialogHeader>
                    <DialogTitle>Sponsorship Packages</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="flex-1 bg-green-500 hover:bg-green-600">Choose Package</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Custom Negotiation
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>

            <Card className="p-4 shadow-lg mt-4">
              <h3 className="text-lg font-semibold mb-4">Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span className="text-xs truncate">{profile.socials.instagram}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-blue-500" />
                  <span className="text-xs truncate">{profile.socials.twitter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span className="text-xs truncate">{profile.socials.youtube}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <span className="text-xs truncate">{profile.socials.facebook}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
