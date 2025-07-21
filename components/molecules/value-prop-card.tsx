import { Zap, TrendingUp, Target } from "lucide-react"
import { Card, CardContent } from "@/components/molecules/card"

interface ValuePropCardProps {
  title: string
  description: string
  icon: "zap" | "trending-up" | "target"
  gradient: string
}

const iconMap = {
  "zap": Zap,
  "trending-up": TrendingUp,
  "target": Target,
}

export function ValuePropCard({ title, description, icon, gradient }: ValuePropCardProps) {
  const IconComponent = iconMap[icon]

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-8">
        <div className="mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
