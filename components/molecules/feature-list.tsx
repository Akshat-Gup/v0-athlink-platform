import { Check } from "lucide-react"

interface FeatureListProps {
  features: string[]
}

export function FeatureList({ features }: FeatureListProps) {
  return (
    <div className="grid gap-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700 text-sm">{feature}</span>
        </div>
      ))}
    </div>
  )
}
