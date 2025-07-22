"use client"

import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/molecules/card"
import { Progress } from "@/components/atoms/progress"
import { SidebarSocials, SidebarSponsorship } from "@/components/molecules"

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

interface DefaultSidebarProps {
  item: {
    currentFunding: number
    goalFunding: number
    checkpoints: Array<{
      amount: number
      reward: string
      unlocked: boolean
    }>
    socials: {
      instagram: string
      twitter: string
      youtube: string
      facebook: string
    }
  },
  title: string
  subtitle: string
  submitButtonText?: string
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
        <SidebarSponsorship
          currentFunding={event.currentFunding}
          goalFunding={event.goalFunding}
          checkpoints={event.checkpoints}
          renderProgressBar={renderProgressBar}
          title="Sponsorship Opportunities"
          subtitle="Sponsorship Packages"
          submitButtonText="Sponsor Event"
        />

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

        <SidebarSocials socials={event.socials} />
      </div>
    </div>
  )
}

export function DefaultSidebar({ item, title, subtitle, submitButtonText }: DefaultSidebarProps) {
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
        <SidebarSponsorship
          currentFunding={item.currentFunding}
          goalFunding={item.goalFunding}
          checkpoints={item.checkpoints}
          renderProgressBar={renderProgressBar}
          title={title}
          subtitle={subtitle}
          submitButtonText={submitButtonText}
        />
        <SidebarSocials socials={item.socials} />
      </div>
    </div>
  )
}