import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, Heart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: PageProps) {
  const { category } = params

  const allItems = [
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
    },
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
    },
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
    },
    {
      id: 7,
      name: "Winter Sports Expo",
      sport: "Multi-Sport",
      location: "Aspen, CO",
      rating: 4.96,
      price: "$12,000",
      period: "per event",
      image: "https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?w=400&h=300&fit=crop",
      achievements: "3-Day Event",
      category: "event",
    },
    {
      id: 8,
      name: "Beach Volleyball Tournament",
      sport: "Volleyball",
      location: "San Diego, CA",
      rating: 4.89,
      price: "$6,500",
      period: "per event",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop",
      achievements: "Professional League",
      category: "event",
    },
  ]

  const filteredItems = allItems.filter((item) => item.category === category.slice(0, -1))

  const getTitle = () => {
    switch (category) {
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
          <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-4"
            >
              <Link href={`/profile/${item.id}`}>
                <div className="relative mb-4 -mx-4 -mt-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
              <CardContent className="p-0 px-4">
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
                <p className="text-gray-600 text-sm mb-3">{item.achievements}</p>

                {item.currentFunding && item.goalFunding ? (
                  renderProgressBar(item.currentFunding, item.goalFunding)
                ) : (
                  <div className="flex items-baseline">
                    <span className="font-semibold text-gray-900">{item.price}</span>
                    <span className="text-gray-600 text-sm ml-1">{item.period}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
