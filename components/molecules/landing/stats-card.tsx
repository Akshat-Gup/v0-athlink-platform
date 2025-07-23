interface StatsCardProps {
  value?: string
  label?: string
  color?: string
}

export function StatsCard({ value, label, color = "text-gray-500" }: StatsCardProps) {
  const displayValue = value || "Information unavailable"
  const displayLabel = label || "No data"
  
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color} mb-2`}>
        {displayValue}
      </div>
      <div className="text-gray-600">{displayLabel}</div>
    </div>
  )
}
