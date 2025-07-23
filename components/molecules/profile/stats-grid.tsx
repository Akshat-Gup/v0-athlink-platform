"use client"

import { Card } from "@/components/molecules/card"
import { LucideIcon } from "lucide-react"
import { Clock } from "lucide-react"

interface ScheduleItem {
  day: number
  date: string
  events: string[]
}

interface StatsScheduleProps {
  schedule?: ScheduleItem[]
  title?: string
}

export function StatsSchedule({ schedule = [], title = "Schedule" }: StatsScheduleProps) {
  if (!schedule || schedule.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-6">
        {schedule.map((item) => (
          <div key={item.day} className="p-4 border rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-green-500" />
              <h4 className="font-semibold text-md">
                Day {item.day || "N/A"} <span className="text-gray-500 font-normal">({item.date || "No date"})</span>
              </h4>
            </div>
            <ul className="space-y-2 pl-8 list-disc text-gray-700">
              {(item.events || []).map((eventItem, index) => (
                <li key={index}>{eventItem || "No event details"}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface StatsGridProps {
  stats?: Array<{
    label: string
    value: string
    icon: string
  }>
  title?: string
}

export function StatsGrid({ stats = [], title = "Statistics" }: StatsGridProps) {
  if (!stats || stats.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 min-w-[120px] sm:min-w-[140px] text-center shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
          >
            <div className="text-xl sm:text-2xl mb-2 text-gray-600">{stat.icon || "📊"}</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value || "N/A"}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{stat.label || "No data"}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface StatsListProps {
  stats?: Array<{
    icon: LucideIcon | string
    text: string
    label?: string
    value?: string
  }>
  title?: string
}

export function StatsList({ stats = [], title = "Stats" }: StatsListProps) {
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          // Handle different data formats
          const displayText = stat.text || `${stat.value}` || `${stat.label}: ${stat.value}` || "No data available"
          const IconComponent = stat.icon as LucideIcon
          
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 text-green-500 flex-shrink-0 flex items-center justify-center">
                {typeof stat.icon === 'string' ? (
                  <span className="text-sm">{stat.icon}</span>
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>
              <span className="text-gray-900 font-medium">{displayText}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}


