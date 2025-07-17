"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface PageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = params
  const [showSponsorModal, setShowSponsorModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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
    demographics: {
      age: 24,
      followers: "125K",
      engagement: "8.5%",
      reach: "2.1M",
    },
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
    pastResults: [
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
    mediaGallery: [
      {
        id: 1,
        type: "image",
        url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
        title: "Training Session",
      },
      {
        id: 2,
        type: "video",
        url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
        title: "Match Highlights",
      },
      {
        id: 3,
        type: "image",
        url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
        title: "Victory Celebration",
      },
    ],
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
        <p className="text-xs text-gray-600">in campaign</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/discover">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Hero Profile Section */}
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl overflow-hidden">
            <Image
              src={profile.coverImage || "/placeholder.svg"}
              alt="Cover"
              width={1200}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-16 left-8">
            <Image
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-white object-cover"
            />
          </div>
          <div className="pt-20 px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{profile.country}</span>
                      <span className="text-2xl">{profile.team}</span>
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
                <Button className="bg-green-500 hover:bg-green-600 animate-shimmer shadow-lg shadow-green-500/25">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyse
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Demographics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{profile.demographics.age}</div>
                      <div className="text-sm text-gray-600">Age</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{profile.demographics.followers}</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{profile.demographics.engagement}</div>
                      <div className="text-sm text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{profile.demographics.reach}</div>
                      <div className="text-sm text-gray-600">Monthly Reach</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ranking Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={profile.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="wins" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Past Results</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.pastResults.map((result) => (
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
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Media Gallery</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {profile.mediaGallery.map((media) => (
                      <div key={media.id} className="relative group cursor-pointer">
                        <Image
                          src={media.url || "/placeholder.svg"}
                          alt={media.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {media.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
                          <p className="text-white text-sm font-medium">{media.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
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
