import { Card } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { Trophy, Medal, Award, Star, Target, Zap } from "lucide-react"

interface Achievement {
  id: number
  title: string
  description: string
  date: string
  type: "gold" | "silver" | "bronze" | "tournament" | "ranking" | "special"
  image?: string
}

const achievements: Achievement[] = [
  {
    id: 1,
    title: "US Open Semifinalist",
    description: "Reached semifinals at the US Open Tennis Championships",
    date: "March 2024",
    type: "gold",
  },
  {
    id: 2,
    title: "Miami Open Quarter Finals",
    description: "Advanced to quarter finals at Miami Open",
    date: "February 2024",
    type: "silver",
  },
  {
    id: 3,
    title: "Top 15 World Ranking",
    description: "Achieved career-high ranking of #15 in WTA rankings",
    date: "January 2024",
    type: "ranking",
  },
  {
    id: 4,
    title: "Olympic Qualifier",
    description: "Qualified for upcoming Olympic Games",
    date: "December 2023",
    type: "special",
  },
  {
    id: 5,
    title: "French Open First Round",
    description: "Competed in French Open main draw",
    date: "June 2023",
    type: "tournament",
  },
  {
    id: 6,
    title: "Rising Star Award",
    description: "Received WTA Rising Star Award for breakthrough performance",
    date: "November 2023",
    type: "special",
  },
]

const getAchievementIcon = (type: Achievement["type"]) => {
  switch (type) {
    case "gold":
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case "silver":
      return <Medal className="h-5 w-5 text-gray-400" />
    case "bronze":
      return <Award className="h-5 w-5 text-amber-600" />
    case "tournament":
      return <Target className="h-5 w-5 text-blue-500" />
    case "ranking":
      return <Star className="h-5 w-5 text-purple-500" />
    case "special":
      return <Zap className="h-5 w-5 text-green-500" />
    default:
      return <Trophy className="h-5 w-5 text-gray-500" />
  }
}

const getAchievementBadgeColor = (type: Achievement["type"]) => {
  switch (type) {
    case "gold":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "silver":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "bronze":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "tournament":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "ranking":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "special":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function AchievementsSection() {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getAchievementIcon(achievement.type)}
                <Badge variant="outline" className={`text-xs ${getAchievementBadgeColor(achievement.type)}`}>
                  {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                </Badge>
              </div>
              <span className="text-xs text-gray-500">{achievement.date}</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{achievement.title}</h4>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
