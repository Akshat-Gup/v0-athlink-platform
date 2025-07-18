"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BudgetSlider } from "@/components/custom/button-slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SimpleCalendar } from "@/components/ui/simple-calendar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Heart,
  Star,
  CalendarIcon,
  Users,
  Filter,
  Sparkles,
  Plus,
  Menu,
  User,
  Trophy,
  Building,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { format } from "date-fns"

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("talents")
  const [searchMode, setSearchMode] = useState("filter") // "filter", "search", or "ai"
  const [showFavorites, setShowFavorites] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [selectedTalentType, setSelectedTalentType] = useState("")
  const [selectedFit, setSelectedFit] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")
  const [selectedBudget, setSelectedBudget] = useState<[number, number]>([0, 10000])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedRating, setSelectedRating] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      // Calculate when bottom of search bar hits top of screen
      const searchBarHeight = 200 // Approximate height of search bar section
      setIsScrolled(window.scrollY > searchBarHeight)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const allItems = [
    // Talents
    {
      id: 1,
      name: "Sarah Chen",
      sport: "Tennis",
      location: "Los Angeles, CA",
      rating: 4.95,
      currentFunding: 2500,
      goalFunding: 5000,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      achievements: "Olympic Qualifier",
      category: "talent",
      talentType: "Professional Athlete",
      tags: ["Professional", "Olympic Level", "Tennis"],
      keywords: ["tennis", "olympic", "professional", "los angeles"],
    },
    {
      id: 2,
      name: "Marcus Johnson",
      sport: "Basketball",
      location: "Chicago, IL",
      rating: 4.87,
      currentFunding: 3200,
      goalFunding: 8000,
      image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=300&fit=crop",
      achievements: "NCAA Champion",
      category: "talent",
      talentType: "College Athlete",
      tags: ["College", "NCAA", "Basketball"],
      keywords: ["basketball", "ncaa", "champion", "chicago"],
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      sport: "Soccer",
      location: "Austin, TX",
      rating: 4.94,
      currentFunding: 2800,
      goalFunding: 6000,
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
      achievements: "MLS Rising Star",
      category: "talent",
      talentType: "Semi-Pro Athlete",
      tags: ["Semi-Professional", "Rising Star", "Soccer"],
      keywords: ["soccer", "mls", "rising star", "austin"],
    },
    {
      id: 9,
      name: "Emma Wilson",
      sport: "Swimming",
      location: "Miami, FL",
      rating: 4.91,
      currentFunding: 1800,
      goalFunding: 4500,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      achievements: "State Champion",
      category: "talent",
      talentType: "Amateur Athlete",
      tags: ["Amateur", "State Level", "Swimming"],
      keywords: ["swimming", "state", "champion", "miami"],
    },
    {
      id: 10,
      name: "Jake Thompson",
      sport: "Track & Field",
      location: "Portland, OR",
      rating: 4.88,
      currentFunding: 3500,
      goalFunding: 7000,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      achievements: "National Qualifier",
      category: "talent",
      talentType: "Professional Athlete",
      tags: ["Professional", "National Level", "Track & Field"],
      keywords: ["track", "field", "national", "portland"],
    },
    {
      id: 11,
      name: "Sofia Martinez",
      sport: "Gymnastics",
      location: "Denver, CO",
      rating: 4.96,
      currentFunding: 4200,
      goalFunding: 8500,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      achievements: "World Championship Qualifier",
      category: "talent",
      talentType: "Elite Athlete",
      tags: ["Elite", "World Level", "Gymnastics"],
      keywords: ["gymnastics", "world", "championship", "denver"],
    },
    {
      id: 16,
      name: "Maya Patel",
      sport: "Content Creation",
      location: "San Francisco, CA",
      rating: 4.89,
      currentFunding: 1500,
      goalFunding: 3000,
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c1c2?w=400&h=300&fit=crop",
      achievements: "100K Followers",
      category: "talent",
      talentType: "Content Creator",
      tags: ["Influencer", "Social Media", "Content"],
      keywords: ["content", "creator", "social media", "san francisco"],
    },
    {
      id: 17,
      name: "David Kim",
      sport: "Photography",
      location: "New York, NY",
      rating: 4.92,
      currentFunding: 2200,
      goalFunding: 4000,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      achievements: "Award-Winning Photographer",
      category: "talent",
      talentType: "Creative Professional",
      tags: ["Creative", "Award Winner", "Photography"],
      keywords: ["photography", "art", "visual", "new york"],
    },
    // Teams
    {
      id: 3,
      name: "Elite Runners Club",
      sport: "Track & Field",
      location: "New York, NY",
      rating: 4.92,
      price: "$5,000",
      period: "per event",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      achievements: "Team of 12 Athletes",
      category: "team",
      talentType: "Athletic Team",
      tags: ["Team", "Professional", "Track & Field"],
      keywords: ["running", "track", "team", "new york"],
    },
    {
      id: 6,
      name: "Cycling Team Pro",
      sport: "Cycling",
      location: "Denver, CO",
      rating: 4.91,
      currentFunding: 4200,
      goalFunding: 10000,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      achievements: "Tour de France Qualifiers",
      category: "team",
      talentType: "Professional Team",
      tags: ["Team", "Elite", "Cycling"],
      keywords: ["cycling", "tour de france", "team", "denver"],
    },
    // Events
    {
      id: 4,
      name: "Swimming Championships",
      sport: "Swimming",
      location: "Miami, FL",
      rating: 4.88,
      price: "$8,500",
      period: "per event",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop",
      achievements: "National Event",
      category: "event",
      talentType: "Championship Event",
      tags: ["Event", "National", "Swimming"],
      keywords: ["swimming", "championships", "national", "miami"],
    },
  ]

  const upAndComingItems = [
    {
      id: 18,
      name: "Riley Johnson",
      sport: "Tennis",
      location: "Phoenix, AZ",
      rating: 4.76,
      currentFunding: 800,
      goalFunding: 2500,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      achievements: "Junior Champion",
      category: "talent",
      talentType: "Athlete",
      keywords: ["tennis", "junior", "rising", "phoenix"],
    },
    {
      id: 19,
      name: "Carlos Mendez",
      sport: "Boxing",
      location: "Las Vegas, NV",
      rating: 4.82,
      currentFunding: 1200,
      goalFunding: 3500,
      image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=300&fit=crop",
      achievements: "Amateur Champion",
      category: "talent",
      talentType: "Athlete",
      keywords: ["boxing", "amateur", "rising", "las vegas"],
    },
  ]

  const aiReports = [
    {
      id: 100,
      title: "",
      subtitle: "",
      date: "",
      readTime: "",
      image: "",
      tags: [],
      summary: "",
      isCreateCard: true,
    },
    {
      id: 101,
      title: "Sarah Chen Performance Analysis",
      subtitle: "Tennis talent ROI and engagement metrics Q1 2024",
      date: "March 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      tags: ["Performance", "Tennis", "ROI"],
      summary:
        "Comprehensive analysis of Sarah Chen's sponsorship performance, social media engagement, and tournament results.",
      isCreateCard: false,
    },
    {
      id: 102,
      title: "YouTube Creator Sponsorship Trends",
      subtitle: "Gaming and lifestyle influencers market analysis",
      date: "February 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      tags: ["YouTube", "Gaming", "Trends"],
      summary:
        "Market trends for gaming and lifestyle YouTube creators, including average sponsorship rates and engagement metrics.",
      isCreateCard: false,
    },
    {
      id: 103,
      title: "Basketball Athletes ROI Report",
      subtitle: "NCAA and professional basketball sponsorship performance",
      date: "January 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=300&fit=crop",
      tags: ["Basketball", "NCAA", "Sponsorship"],
      summary: "Analysis of basketball talent sponsorship returns, comparing NCAA players with professional athletes.",
      isCreateCard: false,
    },
    {
      id: 104,
      title: "TikTok Creators Market Report",
      subtitle: "Short-form content creators and brand partnerships",
      date: "December 2023",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
      tags: ["TikTok", "Social Media", "Brands"],
      summary:
        "Comprehensive report on TikTok creator sponsorship rates, engagement metrics, and successful brand partnerships.",
      isCreateCard: false,
    },
    {
      id: 105,
      title: "Swimming Championship Talent Analysis",
      subtitle: "Performance metrics and sponsorship potential",
      date: "November 2023",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop",
      tags: ["Swimming", "Championships", "Analytics"],
      summary: "Deep dive into swimming talent performance data, sponsorship opportunities, and market positioning.",
      isCreateCard: false,
    },
    {
      id: 106,
      title: "Instagram Fitness Influencers",
      subtitle: "Health and wellness creator sponsorship landscape",
      date: "October 2023",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      tags: ["Instagram", "Fitness", "Wellness"],
      summary:
        "Analysis of fitness and wellness Instagram influencers, their sponsorship rates, and audience demographics.",
      isCreateCard: false,
    },
    {
      id: 107,
      title: "Cycling Team Performance Review",
      subtitle: "Team sponsorship effectiveness and media coverage",
      date: "September 2023",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      tags: ["Cycling", "Team", "Media"],
      summary: "Performance review of cycling team sponsorships, media reach, and return on investment analysis.",
      isCreateCard: false,
    },
    {
      id: 108,
      title: "Twitch Streamers Sponsorship Study",
      subtitle: "Gaming streamers and brand collaboration insights",
      date: "August 2023",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      tags: ["Twitch", "Gaming", "Streaming"],
      summary:
        "Detailed study of Twitch streamer sponsorship deals, viewer engagement, and brand collaboration success rates.",
      isCreateCard: false,
    },
  ]

  const getFilteredItems = () => {
    let filtered = allItems

    // Filter by active tab
    if (activeTab !== "all") {
      filtered = filtered.filter((item) => item.category === activeTab.slice(0, -1))
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.achievements.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.keywords?.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply AI query
    if (aiQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(aiQuery.toLowerCase()) ||
          item.sport.toLowerCase().includes(aiQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(aiQuery.toLowerCase()) ||
          item.achievements.toLowerCase().includes(aiQuery.toLowerCase()) ||
          item.keywords?.some((keyword) => keyword.toLowerCase().includes(aiQuery.toLowerCase())),
      )
    }

    if (selectedExperience) {
      filtered = filtered.filter(
        (item) =>
          item.talentType &&
          item.talentType.toLowerCase().includes(selectedExperience.toLowerCase())
      );
    }

    if (selectedBudget) {
      filtered = filtered.filter((item) => {
        // Use remaining funding (goalFunding - currentFunding) or price for budget filtering
        let budget = 0;
        if (typeof item.goalFunding === "number" && typeof item.currentFunding === "number") {
          budget = item.goalFunding - item.currentFunding;
        } else if (typeof item.price === "string") {
          budget = Number(item.price.replace(/[^0-9.-]+/g, ""));
        }
        return budget >= selectedBudget[0] && budget <= selectedBudget[1];
      });
    }

    return filtered
  }

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
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

  const getSectionTitle = () => {
    if (searchMode === "ai") {
      return "Past AI Industry Reports"
    }
    switch (activeTab) {
      case "talents":
        return "Popular talents in Los Angeles"
      case "events":
        return "Available events next month"
      case "teams":
        return "Top teams looking for sponsors"
      default:
        return "All Items"
    }
  }

  const filteredItems = getFilteredItems()

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header Islands */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Island */}
          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 h-12 w-12 flex items-center justify-center">
            <Link href="/landing">
              <Image src="/athlink-logo.png" alt="Athlink" width={20} height={20} />
            </Link>
          </div>

          {/* Navigation Tabs Island - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab("talents")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "talents"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } md:space-x-2`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Talents</span>
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "events"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } md:space-x-2`}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden md:inline">Events</span>
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "teams"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } md:space-x-2`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Teams</span>
              </button>
            </nav>
          </div>

          {/* User Actions Island - Desktop */}
          <div className="hidden md:flex bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
            <div className="flex items-center space-x-2">
              <Sheet open={showFavorites} onOpenChange={setShowFavorites}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Heart className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Your Watchlist</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {favorites.length === 0 ? (
                      <p className="text-gray-600">No items in your watchlist yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {allItems
                          .filter((item) => favorites.includes(item.id))
                          .map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-2 border rounded">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-600">{item.sport}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              {isScrolled && (
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Search className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" className="text-sm font-medium px-4 text-gray-900 bg-white hover:bg-gray-50">
                Sign In
              </Button>
              <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium px-4">
                    Join
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-8">
                  <DialogHeader className="text-center mb-8">
                    <DialogTitle className="text-2xl font-semibold">What would you like to join as?</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Talent</h3>
                      </div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <CalendarIcon className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Event Leader</h3>
                      </div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Trophy className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Team Leader</h3>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium">Sponsor</h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg">Next</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Sheet open={showFavorites} onOpenChange={setShowFavorites}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Watchlist
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Your Watchlist</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        {favorites.length === 0 ? (
                          <p className="text-gray-600">No items in your watchlist yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {allItems
                              .filter((item) => favorites.includes(item.id))
                              .map((item) => (
                                <div key={item.id} className="flex items-center space-x-3 p-2 border rounded">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-600">{item.sport}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                  {isScrolled && (
                    <Button variant="ghost" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full justify-start text-gray-900 bg-white hover:bg-gray-50">
                    Sign In
                  </Button>
                  <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-8">
                      <DialogHeader className="text-center mb-8">
                        <DialogTitle className="text-2xl font-semibold">What would you like to join as?</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Talent</h3>
                          </div>
                        </div>
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <CalendarIcon className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Event Leader</h3>
                          </div>
                        </div>
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <Trophy className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Team Leader</h3>
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-6">
                        <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                              <Building className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium">Sponsor</h3>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-8">
                        <Button className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg">Next</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      {!isScrolled && (
        <div className="pt-24 pb-6 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center">
              {/* Main Search Bar */}
              <div className="flex-1 max-w-4xl relative">
                <div className="flex bg-white border-2 border-gray-300 rounded-full shadow-lg h-16 items-center">
                  {searchMode === "ai" ? (
                    <div className="flex-1 px-6 py-4">
                      <Input
                        placeholder="Find with AI"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        className="border-0 p-0 text-sm placeholder-gray-500 focus-visible:ring-0 h-auto"
                      />
                    </div>
                  ) : searchMode === "search" ? (
                    <div className="flex-1 px-6 py-4">
                      <Input
                        placeholder="Search by keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 p-0 text-sm placeholder-gray-500 focus-visible:ring-0 h-auto"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 px-6 py-4 border-r border-gray-200 flex items-center">
                        <div className="w-full">
                          <div className="text-xs font-semibold text-gray-500 mb-1">TYPE OF TALENT</div>
                          <Select value={selectedTalentType} onValueChange={setSelectedTalentType}>
                            <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-left">
                              <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional-athlete">Professional Athlete</SelectItem>
                              <SelectItem value="college-athlete">College Athlete</SelectItem>
                              <SelectItem value="semi-pro-athlete">Semi-Pro Athlete</SelectItem>
                              <SelectItem value="amateur-athlete">Amateur Athlete</SelectItem>
                              <SelectItem value="elite-athlete">Elite Athlete</SelectItem>
                              <SelectItem value="content-creator">Content Creator</SelectItem>
                              <SelectItem value="creative-professional">Creative Professional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex-1 px-6 py-4 border-r border-gray-200 flex items-center">
                        <div className="w-full">
                          <div className="text-xs font-semibold text-gray-500 mb-1">FIT</div>
                          <Select value={selectedFit} onValueChange={setSelectedFit}>
                            <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 text-left">
                              <SelectValue placeholder="Select fit..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top-talent">Top Talent</SelectItem>
                              <SelectItem value="up-and-coming">Up and Coming</SelectItem>
                              <SelectItem value="brand-ambassador">Brand Ambassador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex-1 px-6 py-4 border-r border-gray-200 flex items-center">
                        <div className="w-full">
                          <div className="text-xs font-semibold text-gray-500 mb-1">DURATION</div>
                          <div className="flex items-center space-x-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="p-0 h-auto text-sm text-gray-500 hover:bg-transparent text-left"
                                >
                                  {startDate ? format(startDate, "MMM dd") : "Start"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <SimpleCalendar selected={startDate} onSelect={setStartDate} />
                              </PopoverContent>
                            </Popover>
                            <span className="text-gray-400">-</span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="p-0 h-auto text-sm text-gray-500 hover:bg-transparent text-left"
                                >
                                  {endDate ? format(endDate, "MMM dd") : "End"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <SimpleCalendar selected={endDate} onSelect={setEndDate} />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="px-2 py-2 flex items-center">
                    <div className="bg-gray-100 rounded-full p-1 flex">
                      <Button
                        size="sm"
                        onClick={() => setSearchMode("filter")}
                        className={`rounded-full px-3 h-10 ${
                          searchMode === "filter"
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 animate-shimmer"
                            : "bg-transparent text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setSearchMode("search")}
                        className={`rounded-full px-3 h-10 ${
                          searchMode === "search"
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 animate-shimmer"
                            : "bg-transparent text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setSearchMode("ai")}
                        className={`rounded-full px-3 h-10 ${
                          searchMode === "ai"
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 animate-shimmer"
                            : "bg-transparent text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Filter Buttons Below Search Bar */}
                <div className="flex items-center justify-center space-x-3 mt-4">
                  {selectedTalentType === "athlete" && (
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0">
                        <SelectValue placeholder="Sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0">
                      <SelectValue placeholder="Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="semi-professional">Semi-Professional</SelectItem>
                      <SelectItem value="amateur">Amateur</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                    </SelectContent>
                  </Select>
                  <BudgetSlider
                    min={0}
                    max={100000}
                    step={1000}
                    defaultValue={selectedBudget}
                    onChange={setSelectedBudget}
                  />
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="bg-transparent border-0 hover:bg-gray-100 rounded-lg px-3 py-2 h-auto text-sm w-auto min-w-0 flex items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        <SelectValue placeholder="Rating" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                          ))}
                          <span className="ml-2">5.0</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="4">
                        <div className="flex items-center">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                          ))}
                          <Star className="h-3 w-3 text-gray-300" />
                          <span className="ml-2">4.0+</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="3">
                        <div className="flex items-center">
                          {[...Array(3)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                          ))}
                          {[...Array(2)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-gray-300" />
                          ))}
                          <span className="ml-2">3.0+</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isScrolled ? "pt-24" : ""}`}>
        {/* Popular Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{getSectionTitle()}</h2>
            <div className="flex items-center gap-4">
              {searchMode !== "ai" && (
                <Link href={`/discover/${activeTab}`}>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Show all
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {searchMode === "ai" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiReports.map((report, index) => (
                <Card
                  key={report.id}
                  className="group cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {report.isCreateCard ? (
                    <>
                      <div className="relative mb-4 -mx-6 -mt-6">
                        <div className="w-full h-48 bg-gray-50 rounded-t-lg flex items-center justify-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <Plus className="h-8 w-8 text-gray-600" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-0 px-6 flex flex-col justify-between" style={{ minHeight: "180px" }}>
                        <div className="text-center flex-1 flex flex-col justify-center">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Use our AI to create custom reports on talent performance, sponsorship ROI, and market
                            trends.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Create Report
                        </Button>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <div className="relative mb-4 -mx-6 -mt-6">
                        <Image
                          src={report.image || "/placeholder.svg"}
                          alt={report.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {report.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} className="bg-white/90 text-gray-900 hover:bg-white text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <CardContent className="p-0 px-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">{report.date}</span>
                          <span className="text-sm text-gray-500">{report.readTime}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{report.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.subtitle}</p>
                        <p className="text-gray-500 text-xs mb-4 line-clamp-3">{report.summary}</p>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Read Report
                        </Button>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.slice(0, 8).map((item, index) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-4 animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative mb-4 -mx-4 -mt-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {!selectedTalentType && (
                      <Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">
                        {item.talentType}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                      onClick={(e) => toggleFavorite(item.id, e)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>
                  <Link href={`/profile/${item.id}`} className="flex flex-col flex-1">
                    <CardContent className="p-0 px-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-current text-gray-900" />
                          <span className="text-sm text-gray-900 ml-1">{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        {item.sport} in {item.location}
                      </p>
                      <p className="text-gray-600 text-sm mb-3 flex-1">{item.achievements}</p>

                      {/* Fixed bottom section */}
                      <div className="mt-auto">
                        {item.currentFunding && item.goalFunding ? (
                          <div className="mb-4">{renderProgressBar(item.currentFunding, item.goalFunding)}</div>
                        ) : (
                          <div className="flex items-baseline mb-4">
                            <span className="font-semibold text-gray-900">{item.price}</span>
                            <span className="text-gray-600 text-sm ml-1">{item.period}</span>
                          </div>
                        )}

                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Up and Coming Section */}
        {activeTab === "talents" && searchMode !== "ai" && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Up and Coming</h2>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Show all
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upAndComingItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-4 flex flex-col h-full"
                >
                  <div className="relative mb-4 -mx-4 -mt-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {!selectedTalentType && (
                      <Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">
                        {item.talentType}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                      onClick={(e) => toggleFavorite(item.id, e)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>
                  <Link href={`/profile/${item.id}`} className="flex flex-col flex-1">
                    <CardContent className="p-0 px-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-current text-gray-900" />
                          <span className="text-sm text-gray-900 ml-1">{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        {item.sport} in {item.location}
                      </p>
                      <p className="text-gray-600 text-sm mb-3 flex-1">{item.achievements}</p>
                      {/* Fixed bottom section */}
                      <div className="mt-auto">
                        {item.currentFunding && item.goalFunding ? (
                          <div className="mb-4">{renderProgressBar(item.currentFunding, item.goalFunding)}</div>
                        ) : (
                          <div className="flex items-baseline mb-4">
                            <span className="font-semibold text-gray-900">{item.price}</span>
                            <span className="text-gray-600 text-sm ml-1">{item.period}</span>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
