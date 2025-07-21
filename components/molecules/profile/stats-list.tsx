"use client"

import { Card } from "@/components/molecules/card"
import { LucideIcon } from "lucide-react"

interface StatsListProps {
  stats: Array<{
    icon: LucideIcon | string
    text: string
    label?: string
    value?: string
  }>
  title: string
}

export function StatsList({ stats, title }: StatsListProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          // Handle different data formats
          const displayText = stat.text || `${stat.value}` || `${stat.label}: ${stat.value}`
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
