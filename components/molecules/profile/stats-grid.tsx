"use client"

import { Card } from "@/components/molecules/card"

interface StatsGridProps {
  stats: Array<{
    label: string
    value: string
    icon: string
  }>
  title: string
}

export function StatsGrid({ stats, title }: StatsGridProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 min-w-[120px] sm:min-w-[140px] text-center shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
          >
            <div className="text-xl sm:text-2xl mb-2 text-gray-600">{stat.icon}</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
