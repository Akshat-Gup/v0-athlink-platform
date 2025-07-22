"use client"

import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/molecules/card"
import { Progress } from "@/components/atoms/progress"
import { Instagram, Twitter, Youtube, Facebook, ExternalLink } from "lucide-react"

interface EventSidebarProps {
  event: {
    currentFunding: number
    goalFunding: number
    checkpoints: Array<{
      amount: number
      reward: string
      unlocked: boolean
    }>
    eventDetails: {
      startDate: string
      duration: string
      venue: string
      capacity: string
      ticketPrice: string
    }
    socials: {
      instagram: string
      twitter: string
      youtube: string
      facebook: string
    }
  }
}

export function EventSidebar({ event }: EventSidebarProps) {
  const renderProgressBar = (current: number, goal: number) => {
    const percentage = (current / goal) * 100
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-gray-900">${current.toLocaleString()}</span>
          <span className="text-gray-600">of ${goal.toLocaleString()}</span>
        </div>
        <Progress value={percentage} className="h-2 [&>div]:bg-green-500" />
      </div>
    )
  }

  return (
    <div className="hidden lg:block space-y-6 ml-8">
      <div className="sticky top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto overflow-x-visible px-2 -mx-2">
        <Card className="p-6 shadow-xl border-0">
          <h3 className="text-lg font-semibold mb-4">Sponsorship Opportunities</h3>
          {renderProgressBar(event.currentFunding, event.goalFunding)}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm">Sponsorship Packages</h4>
            {event.checkpoints.map((checkpoint, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  checkpoint.unlocked 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">${checkpoint.amount.toLocaleString()}</span>
                  {checkpoint.unlocked && <Badge className="bg-green-500">Unlocked</Badge>}
                </div>
                <p className="text-xs text-gray-600">{checkpoint.reward}</p>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">Sponsor Event</Button>
        </Card>

        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Event Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Start Date</span>
              <span className="text-sm font-medium">{event.eventDetails.startDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duration</span>
              <span className="text-sm font-medium">{event.eventDetails.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Venue</span>
              <span className="text-sm font-medium">{event.eventDetails.venue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Capacity</span>
              <span className="text-sm font-medium">{event.eventDetails.capacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tickets</span>
              <span className="text-sm font-medium">{event.eventDetails.ticketPrice}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Social Media</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-500" />
                <span className="text-sm">{event.socials.instagram}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{event.socials.twitter}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-500" />
                <span className="text-sm">{event.socials.youtube}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{event.socials.facebook}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
