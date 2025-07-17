import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, Heart, ArrowLeft, MapPin, Trophy, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = params

  // Mock data - in real app this would come from API
  const profile = {
    id: Number.parseInt(id),
    name: "Sarah Chen",
    sport: "Tennis",
    location: "Los Angeles, CA",
    rating: 4.95,
    currentFunding: 2500,
    goalFunding: 5000,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop",
    achievements: "Olympic Qualifier",
    category: "talent",
    bio: "Professional tennis player with 8 years of competitive experience. Currently training for the upcoming Olympic qualifiers and seeking sponsorship to support my journey to represent my country at the highest level.",
    stats: {
      tournaments: 45,
      wins: 32,
      ranking: 15,
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
        <p className="text-xs text-gray-600">in campaign</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/discover">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-start gap-6">
                <Image
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <Button size="icon" variant="ghost">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                      <span className="text-sm text-gray-900">{profile.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{profile.bio}</p>
                  <div className="flex gap-4">
                    <Button className="bg-green-500 hover:bg-green-600">Sponsor Now</Button>
                    <Button variant="outline">Contact</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{profile.stats.tournaments}</div>
                  <div className="text-sm text-gray-600">Tournaments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{profile.stats.wins}</div>
                  <div className="text-sm text-gray-600">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">#{profile.stats.ranking}</div>
                  <div className="text-sm text-gray-600">Ranking</div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Campaign Progress</h3>
              {renderProgressBar(profile.currentFunding, profile.goalFunding)}
              <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Support Campaign</Button>
            </Card>

            <Card className="p-6 mt-6">
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
