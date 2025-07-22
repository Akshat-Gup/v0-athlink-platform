import { Card } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { Trophy, Medal, Award, Star, Target, Zap, Calendar } from "lucide-react"
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/molecules";

interface Achievement {
  id: number
  title: string
  description: string
  date: string
  type: "gold" | "silver" | "bronze" | "tournament" | "ranking" | "special"
  image?: string
}

interface AchievementsSectionProps {
  achievements: Achievement[]
  title: string
}

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

export function AchievementsSection({ achievements, title }: AchievementsSectionProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
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

interface Competition {
  id: number;
  tournament: string;
  date: string;
  location: string;
  image?: string;
}

interface PastResult {
  id: number;
  tournament: string;
  date: string;
  result: string;
  image?: string;
}

interface UpcomingCompetitionsProps {
  competitions: Competition[];
  title: string;
}

interface PastResultsProps {
  results: Record<string, PastResult[]>;
  title: string;
}

export function UpcomingCompetitions({ competitions, title }: UpcomingCompetitionsProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {competitions.map((comp) => (
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
  );
}

export function PastResults({ results, title }: PastResultsProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-8">
        {Object.entries(results)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, yearResults]) => (
            <div key={year}>
              <h4 className="text-md font-semibold mb-2">{year}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {yearResults.map((result) => (
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
  );
}