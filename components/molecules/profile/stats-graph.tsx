
import { Card } from "@/components/molecules/card"
import { ResponsiveContainer, BarChart as ReBarChart, XAxis, YAxis, Tooltip, Bar } from "recharts"
import React from "react"

interface StatsGraphProps {
  data: Array<{ month: string; sold: number }>
  title?: string
}

export function StatsGraph({ data, title }: StatsGraphProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sold" fill="#22c55e" />
        </ReBarChart>
      </ResponsiveContainer>
    </Card>
  )
}
