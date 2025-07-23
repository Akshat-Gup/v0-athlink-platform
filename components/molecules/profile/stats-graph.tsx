import { Card } from "@/components/molecules/card"
import { ResponsiveContainer, BarChart as ReBarChart, XAxis, YAxis, Tooltip, Bar } from "recharts"
import React from "react"
import { LineChart, Line } from "recharts"

interface StatsGraphDataItem {
  month: string;
  [key: string]: number | string;
}

interface StatsGraphProps {
  data?: Array<StatsGraphDataItem>
  title?: string
  dataKey?: string
  color?: string
}

export function StatsGraph({ data = [], title = "Statistics", dataKey = "value", color = "#10b981" }: StatsGraphProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-16 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} />
        </ReBarChart>
      </ResponsiveContainer>
    </Card>
  )
}

interface StatsLineGraphProps {
  data?: Array<{ month: string; ranking: number; }>
  title?: string
}

export function StatsLineGraph({ data = [], title = "Performance Trend" }: StatsLineGraphProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-16 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ranking" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

