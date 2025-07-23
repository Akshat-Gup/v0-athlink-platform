import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/molecules/card"
import { Users } from "lucide-react"
import Image from "next/image"
import React from "react"

interface Sponsor {
  id: number
  name: string
  logo?: string
  tier?: string
  amount?: number
}

interface StatsSponsorsProps {
  sponsors?: Sponsor[]
  title?: string
}

export function StatsSponsors({ sponsors = [], title = "Sponsors" }: StatsSponsorsProps) {
  if (!sponsors || sponsors.length === 0) {
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
      <div className="space-y-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="flex items-center gap-4 p-4 border rounded-xl">
            <Image
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name || "Sponsor"}
              width={80}
              height={40}
              className="w-20 h-10 object-contain"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{sponsor.name || "Unknown sponsor"}</h4>
              <p className="text-sm text-gray-600">{sponsor.tier || "No tier information"}</p>
            </div>
            {sponsor.amount &&
              <Badge className="bg-blue-500">${sponsor.amount.toLocaleString()}</Badge>}
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
  participants?: Participant[]
  title?: string
  emptyText?: string
}

export function StatsProfile({ participants = [], title = "Participants", emptyText = "Information unavailable" }: StatsProfileProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {!participants || participants.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            {emptyText}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((participant) => (
            <Card key={participant.id} className="p-4 flex items-center gap-4">
              <Image
                src={participant.image || "/placeholder.svg"}
                alt={participant.name || "Participant"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{participant.name || "Unknown participant"}</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{participant.description || "No description"}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}

// Team roster component
interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  image?: string;
  stats: {
    ppg: number;
    apg: number;
    rpg: number;
  };
}

interface TeamRosterProps {
  roster?: Player[];
  title?: string;
  emptyText?: string;
}

export function TeamRoster({ roster = [], title = "Team Roster", emptyText = "Information unavailable" }: TeamRosterProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {!roster || roster.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          {emptyText}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roster.map((player) => (
            <Card key={player.id} className="p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={player.image || "/placeholder.svg"}
                  alt={player.name || "Player"}
                  width={60}
                  height={60}
                  className="w-15 h-15 object-cover rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{player.name || "Unknown player"}</h4>
                  <p className="text-sm text-gray-600">{player.position || "No position"}</p>
                  <p className="text-sm text-gray-600">#{player.number || "0"}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{player.stats?.ppg || 0}</p>
                  <p className="text-xs text-gray-600">PPG</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{player.stats?.apg || 0}</p>
                  <p className="text-xs text-gray-600">APG</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{player.stats?.rpg || 0}</p>
                  <p className="text-xs text-gray-600">RPG</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
