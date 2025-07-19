"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star } from "lucide-react"

export function AchievementsSection() {
  const achievements = [
    {
      id: 1,
      title: "Olympic Qualifier",
      description: "Qualified for the 2024 Paris Olympics",
      date: "March 2024",
      type: "major",
      icon: Trophy,
    },
    {
      id: 2,
      title: "National Champion",
      description: "Won the National Tennis Championship",
      date: "August 2023",
      type: "championship",
      icon: Medal,
    },
    {
      id: 3,
      title: "Rising Star Award",
      description: "Recognized as the most promising young athlete",
      date: "December 2023",
      type: "recognition",
      icon: Star,
    },
    {
      id: 4,
      title: "Tournament Winner",
      description: "First place at the Regional Tennis Open",
      date: "June 2023",
      type: "tournament",
      icon: Award,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "championship":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "recognition":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "tournament":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon
          return (
            <div
              key={achievement.id}
              className="p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <Badge className={`text-xs ${getTypeColor(achievement.type)}`}>{achievement.type}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                  <p className="text-xs text-gray-500">{achievement.date}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
