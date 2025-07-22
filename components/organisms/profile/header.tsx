"use client"

import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { ArrowLeft, Star, MapPin, Heart, Share, MessageCircle, Sparkles, Calendar, BarChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TooltipProvider } from "@/components/molecules";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/organisms";
import { QrCode, Copy, Link as LinkIcon, Twitter, Instagram } from "lucide-react";
import { useState } from "react";

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
interface TalentHeaderProps {
  talent: {
    id: number;
    name: string;
    sport: string;
    location: string;
    country: string;
    team: string;
    rating: number;
    currentFunding: number;
    goalFunding: number;
    image: string;
    coverImage: string;
    achievements: string;
    category: string;
  };
  onShareClick: () => void;
}

export function TalentHeader({ talent, onShareClick }: TalentHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      {/* Back Button */}
      <Link href="/discover">
        <Button
          variant="ghost"
          size="icon"
              className="fixed top-4 sm:top-8 left-2 sm:left-4 lg:left-4 xl:left-[max(0.5rem,calc((100vw-80rem)/2-1rem))] z-50 bg-white hover:bg-gray-50 rounded-full shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          {/* Cover Image */}
          <div className="relative h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl overflow-visible mb-12 sm:mb-16 lg:mb-20">
            <div className="w-full h-full rounded-xl overflow-hidden">
              <Image
                src={talent.coverImage || "/placeholder.svg"}
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
                    src={talent.image || "/placeholder.svg"}
                    alt={talent.name}
                    width={128}
                    height={128}
                    className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                  />
                  <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 lg:ml-4">
                    <span className="text-lg sm:text-xl lg:text-2xl">{talent.country}</span>
                    <span className="text-lg sm:text-xl lg:text-2xl">{talent.team}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Talent Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{talent.name}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                    <span className="text-sm">{talent.rating}</span>
                  </div>
                  <Link
                    href={`/discover?location=${encodeURIComponent(talent.location)}`}
                    className="flex items-center hover:text-green-600 transition-colors cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{talent.location}</span>
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {talent.achievements}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Button variant="outline" className="bg-transparent rounded-full" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent text-sm px-3 sm:px-4"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Share Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">Scan to view profile</p>
                    </div>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Generate Short Link
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start bg-transparent">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                        <Button variant="outline" className="justify-start bg-transparent">
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="bg-black hover:bg-gray-900 text-sm px-3 sm:px-4">
                <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-sm px-3 sm:px-4">
                <Sparkles className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analyse</span>
              </Button>
            </div>
          </div>
        </>
  );
}
