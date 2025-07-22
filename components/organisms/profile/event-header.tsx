"use client"

import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"
import { ArrowLeft, Star, MapPin, Calendar, Heart, Share, MessageCircle, BarChart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EventHeaderProps {
  event: {
    id: number
    name: string
    location: string
    rating: number
    status: string
    image: string
    coverImage: string
    country: string
    category: string
    eventDetails: {
      startDate: string
    }
  }
  onShareClick: () => void
}

export function EventHeader({ event, onShareClick }: EventHeaderProps) {
  return (
    <>
      <Link href="/discover">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 sm:top-8 left-2 sm:left-4 lg:left-4 xl:left-[max(0.5rem,calc((100vw-80rem)/2-1rem))] z-50 bg-white hover:bg-gray-50 rounded-full shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>

      <div className="relative h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl overflow-visible mb-12 sm:mb-16 lg:mb-20">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <Image
            src={event.coverImage || "/placeholder.svg"}
            alt="Cover"
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 left-3 sm:left-6 lg:left-8">
          <div className="relative flex items-center">
            <div className="bg-white rounded-full shadow-xl border-2 sm:border-4 border-white flex items-center pr-2 sm:pr-3 lg:pr-4">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.name}
                width={128}
                height={128}
                className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
              />
              <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 lg:ml-4">
                <span className="text-lg sm:text-xl lg:text-2xl">{event.country}</span>
                <span className="text-lg sm:text-xl lg:text-2xl">{event.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{event.name}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                <span className="text-sm">{event.rating}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{event.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{event.eventDetails.startDate}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {event.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button variant="outline" className="bg-transparent rounded-full" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="bg-transparent text-sm px-3 sm:px-4" onClick={onShareClick}>
            <Share className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button className="bg-black hover:bg-gray-900 text-sm px-3 sm:px-4">
            <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Contact</span>
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-sm px-3 sm:px-4">
            <BarChart className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Analyse</span>
          </Button>
        </div>
      </div>
    </>
  )
}
