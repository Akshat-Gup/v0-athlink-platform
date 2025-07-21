interface StatsCardProps {
  value: string
  label: string
  color: string
}

export function StatsCard({ value, label, color }: StatsCardProps) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}
