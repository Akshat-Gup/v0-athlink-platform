import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/molecules/card"
import Image from "next/image"
import React from "react"

interface Sponsor {
  id: number
  name: string
  logo?: string
  tier?: string
  amount: number
}

interface StatsSponsorsProps {
  sponsors: Sponsor[]
  title?: string
}

export function StatsSponsors({ sponsors, title }: StatsSponsorsProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="flex items-center gap-4 p-4 border rounded-xl">
            <Image
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              width={80}
              height={40}
              className="w-20 h-10 object-contain"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{sponsor.name}</h4>
              <p className="text-sm text-gray-600">{sponsor.tier}</p>
            </div>
            <Badge className="bg-green-500">${sponsor.amount.toLocaleString()}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface Participant {
  id: number
  name: string
  image?: string
  description?: string
}

interface StatsProfileProps {
  participants: Participant[]
  title?: string
}

export function StatsProfile({ participants, title }: StatsProfileProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((participant) => (
          <Card key={participant.id} className="p-4 flex items-center gap-4">
            <Image
              src={participant.image || "/placeholder.svg"}
              alt={participant.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">{participant.name}</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">{participant.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}
