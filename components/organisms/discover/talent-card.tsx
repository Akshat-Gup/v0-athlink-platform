import { Card, CardContent } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"
import { Progress } from "@/components/atoms/progress"
import { Star, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface TalentCardProps {
  item?: {
    id: number
    name: string
    image: string
    talentType: string
    rating: number
    sport: string
    location: string
    achievements: string
    category: string
    currentFunding?: number
    goalFunding?: number
    price?: string
    period?: string
  }
  showTalentType?: boolean
  onTalentTypeClick?: (talentType: string) => void
  onFavoriteToggle?: (id: number, e: React.MouseEvent) => void
  isFavorite?: boolean
  animationDelay?: number
}

export function TalentCard({
  item,
  showTalentType = true,
  onTalentTypeClick,
  onFavoriteToggle,
  isFavorite = false,
  animationDelay = 0
}: TalentCardProps) {
  if (!item) {
    return (
      <Card className="p-4 h-full">
        <div className="text-center py-8 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  const renderProgressBar = (current: number, goal: number) => {
    const percentage = (current / goal) * 100
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="font-semibold">${current.toLocaleString()}</span>
          <span className="text-gray-600">${goal.toLocaleString()}</span>
        </div>
        <Progress value={percentage} className="h-1" />
      </div>
    )
  }

  return (
    <Card
      className="group cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-4 animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="relative mb-4 -mx-4 -mt-4">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name || "Talent"}
          width={400}
          height={300}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {showTalentType && (
          <Badge
            className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onTalentTypeClick && item.talentType) {
                onTalentTypeClick(item.talentType.toLowerCase().replace(/\s+/g, "-"))
              }
            }}
          >
            {item.talentType || "Unknown Type"}
          </Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full h-8 w-8 transition-transform hover:scale-110"
          onClick={(e) => onFavoriteToggle && onFavoriteToggle(item.id, e)}
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </Button>
      </div>
      
      <Link href={`/profile/${item.category || 'talent'}s/${item.id}`} className="flex flex-col flex-1">
        <CardContent className="p-0 px-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{item.name || "Name unavailable"}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-current text-gray-900" />
              <span className="text-sm text-gray-900 ml-1">{item.rating || "N/A"}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">
            {item.sport || "Sport unavailable"} in {item.location || "Location unavailable"}
          </p>
          <p className="text-gray-600 text-sm mb-3 flex-1">{item.achievements || "No achievements listed"}</p>

          <div className="mt-auto">
            {item.currentFunding && item.goalFunding ? (
              <div className="mb-4">
                {renderProgressBar(item.currentFunding, item.goalFunding)}
              </div>
            ) : item.price && item.period ? (
              <div className="flex items-baseline mb-4">
                <span className="font-semibold text-gray-900">{item.price}</span>
                <span className="text-gray-600 text-sm ml-1">{item.period}</span>
              </div>
            ) : (
              <div className="mb-4 text-gray-500 text-sm">
                Pricing information unavailable
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Profile
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
