import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Target, Clock, Calendar, MapPin, Star } from "lucide-react"

interface Achievement {
  id: string
  type: "competition" | "award" | "personal" | "record"
  title: string
  value: string
  description?: string
  event?: string
  date?: string
  location?: string
  icon?: "trophy" | "medal" | "award" | "target" | "star"
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    type: "competition",
    title: "1st Place",
    value: "Regional Swimming Championship",
    description: "Freestyle 100m - Personal best time of 52.3 seconds",
    event: "State Regional Championships 2024",
    date: "March 2024",
    location: "Austin, TX",
    icon: "trophy",
  },
  {
    id: "2",
    type: "award",
    title: "MVP Award",
    value: "Team Captain & Most Valuable Player",
    description: "Led team to district championship with outstanding leadership",
    event: "High School Swimming Team",
    date: "May 2024",
    icon: "star",
  },
  {
    id: "3",
    type: "personal",
    title: "Personal Best",
    value: "52.3 seconds",
    description: "Freestyle 100m - New personal record",
    event: "Regional Championships",
    date: "March 2024",
    icon: "target",
  },
  {
    id: "4",
    type: "competition",
    title: "2nd Place",
    value: "State Championship",
    description: "Butterfly 200m - Qualified for nationals",
    event: "Texas State Swimming Championships",
    date: "February 2024",
    location: "Dallas, TX",
    icon: "medal",
  },
  {
    id: "5",
    type: "record",
    title: "School Record",
    value: "Backstroke 50m - 26.8s",
    description: "Broke 15-year-old school record by 0.3 seconds",
    event: "Lincoln High School",
    date: "January 2024",
    icon: "award",
  },
  {
    id: "6",
    type: "award",
    title: "Sportsmanship Award",
    value: "Outstanding Character",
    description: "Recognized for exemplary conduct and team spirit",
    event: "District Swimming League",
    date: "April 2024",
    icon: "star",
  },
]

const getAchievementIcon = (iconType: string, type: string) => {
  const iconProps = { className: "h-12 w-12" }

  switch (iconType) {
    case "trophy":
      return <Trophy {...iconProps} className="h-12 w-12 text-yellow-600" />
    case "medal":
      return <Medal {...iconProps} className="h-12 w-12 text-orange-600" />
    case "award":
      return <Award {...iconProps} className="h-12 w-12 text-purple-600" />
    case "target":
      return <Target {...iconProps} className="h-12 w-12 text-green-600" />
    case "star":
      return <Star {...iconProps} className="h-12 w-12 text-blue-600" />
    default:
      // Default icon based on type
      if (type === "competition") return <Trophy {...iconProps} className="h-12 w-12 text-yellow-600" />
      if (type === "award") return <Award {...iconProps} className="h-12 w-12 text-purple-600" />
      if (type === "personal") return <Target {...iconProps} className="h-12 w-12 text-green-600" />
      return <Medal {...iconProps} className="h-12 w-12 text-orange-600" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "competition":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "award":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "personal":
      return "bg-green-100 text-green-800 border-green-200"
    case "record":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function AchievementsSection() {
  const [showAll, setShowAll] = useState(false)
  
  const displayedAchievements = showAll ? mockAchievements : mockAchievements.slice(0, 2)

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {displayedAchievements.map((achievement) => (
          <Card key={achievement.id} className="p-4">
            {/* Icon as Image */}
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              {getAchievementIcon(achievement.icon || "", achievement.type)}
            </div>
            
            {/* Title - Value */}
            <h4 className="font-semibold">
              {achievement.title} - {achievement.value}
            </h4>
            
            {/* Event */}
            {achievement.event && (
              <p className="text-sm text-gray-600">{achievement.event}</p>
            )}
            
            {/* Date */}
            {achievement.date && (
              <p className="text-sm text-gray-600">{achievement.date}</p>
            )}
          </Card>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          {showAll ? 'Show Less ↑' : 'View All Achievements →'}
        </button>
      </div>
    </Card>
  )
}
