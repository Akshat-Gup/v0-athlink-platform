"use client"

import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { ArrowLeft, Star, MapPin, Heart, Share, MessageCircle, Sparkles, Calendar, BarChart, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TooltipProvider } from "@/components/molecules";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/organisms";
import { QrCode, Copy, Link as LinkIcon, Twitter, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { ProfileEdit } from "@/components/templates/user/profile-edit";

interface EventHeaderProps {
  event?: {
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
  onShareClick?: () => void
}

export function EventHeader({ event, onShareClick }: EventHeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const { isFavorited, isLoading, toggleFavorite } = useFavorites(
    event?.id || 0, 
    'event'
  );

  // Check if current user owns this profile
  const isOwner = isAuthenticated && event && user?.id === event.id;

  // Fetch profile data for editing if user is the owner
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOwner && user?.id) {
        try {
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    if (isOwner) {
      fetchProfileData();
    }
  }, [isOwner, user?.id]);

  if (!event) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Event information unavailable</p>
      </div>
    )
  }

  return (
    <>
      <Link href="/discover">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 sm:top-4 left-2 sm:left-4 lg:left-4 xl:left-[max(0.5rem,calc((100vw-80rem)/2-1rem))] z-50 bg-white hover:bg-gray-50 rounded-full shadow-lg"
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
                alt={event.name || "Event"}
                width={128}
                height={128}
                className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
              />
              <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 lg:ml-4">
                <span className="text-lg sm:text-xl lg:text-2xl">{event.country || "🌍"}</span>
                <span className="text-lg sm:text-xl lg:text-2xl">{event.category || "📅"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{event.name || "Event Name Unavailable"}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                <span className="text-sm">{event.rating || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{event.location || "Location unavailable"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{event.eventDetails?.startDate || "Date unavailable"}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {event.status || "Status unavailable"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button 
            variant="outline" 
            className={`bg-transparent rounded-full ${isFavorited ? 'text-red-500 border-red-500' : ''}`}
            size="icon"
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          {isOwner && profileData && (
            <ProfileEdit
              userId={event.id}
              talentProfile={profileData.talent_profile}
              teamProfile={profileData.team_profile}
              eventProfile={profileData.event_profile}
            >
              <Button variant="outline" className="bg-transparent rounded-full" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </ProfileEdit>
          )}
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
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const { isFavorited, isLoading, toggleFavorite } = useFavorites(
    talent?.id || 0, 
    'talent'
  );

  // Check if current user owns this profile
  const isOwner = isAuthenticated && user?.id === talent.id;

  // Fetch profile data for editing if user is the owner
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOwner && user?.id) {
        try {
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    if (isOwner) {
      fetchProfileData();
    }
  }, [isOwner, user?.id]);

  return (
    <>
      {/* Back Button */}
      <Link href="/discover">
        <Button
          variant="ghost"
          size="icon"
              className="fixed top-4 sm:top-4 left-2 sm:left-4 lg:left-4 xl:left-[max(0.5rem,calc((100vw-80rem)/2-1rem))] z-50 bg-white hover:bg-gray-50 rounded-full shadow-lg"
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
              <Button 
                variant="outline" 
                className={`bg-transparent rounded-full ${isFavorited ? 'text-red-500 border-red-500' : ''}`}
                size="icon"
                onClick={toggleFavorite}
                disabled={isLoading}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              {isOwner && profileData && (
                <ProfileEdit
                  userId={talent.id}
                  talentProfile={profileData.talent_profile}
                  teamProfile={profileData.team_profile}
                  eventProfile={profileData.event_profile}
                >
                  <Button variant="outline" className="bg-transparent rounded-full" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </ProfileEdit>
              )}
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

interface TeamHeaderProps {
  team: {
    id: number;
    name: string;
    sport: string;
    location: string;
    country: string;
    league: string;
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

export function TeamHeader({ team, onShareClick }: TeamHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const { isFavorited, isLoading, toggleFavorite } = useFavorites(
    team?.id || 0, 
    'team'
  );

  // Check if current user owns this profile
  const isOwner = isAuthenticated && user?.id === team.id;

  // Fetch profile data for editing if user is the owner
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOwner && user?.id) {
        try {
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    if (isOwner) {
      fetchProfileData();
    }
  }, [isOwner, user?.id]);

  return (
    <>
      {/* Back Button */}
      <Link href="/discover">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 sm:top-4 left-2 sm:left-4 lg:left-4 xl:left-[max(0.5rem,calc((100vw-80rem)/2-1rem))] z-50 bg-white hover:bg-gray-50 rounded-full shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>

      {/* Banner with Profile Image Overlay */}
      <div className="relative h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl overflow-visible mb-12 sm:mb-16 lg:mb-20">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <Image
            src={team.coverImage || "/placeholder.svg"}
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
                src={team.image || "/placeholder.svg"}
                alt={team.name}
                width={128}
                height={128}
                className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
              />
              <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 lg:ml-4">
                <span className="text-lg sm:text-xl lg:text-2xl">{team.country}</span>
                <span className="text-lg sm:text-xl lg:text-2xl">{team.league}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Info Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{team.name}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-gray-900 mr-1" />
                <span className="text-sm">{team.rating}</span>
              </div>
              <Link
                href={`/discover?location=${encodeURIComponent(team.location)}`}
                className="flex items-center hover:text-green-600 transition-colors cursor-pointer"
              >
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{team.location}</span>
              </Link>
              <Badge variant="secondary" className="text-xs">
                {team.achievements}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button 
            variant="outline" 
            className={`bg-transparent rounded-full ${isFavorited ? 'text-red-500 border-red-500' : ''}`}
            size="icon"
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          {isOwner && profileData && (
            <ProfileEdit
              userId={team.id}
              talentProfile={profileData.talent_profile}
              teamProfile={profileData.team_profile}
              eventProfile={profileData.event_profile}
            >
              <Button variant="outline" className="bg-transparent rounded-full" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </ProfileEdit>
          )}
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
                <DialogTitle>Share Team Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">Scan to view team profile</p>
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
                    <Button variant="outline" className="justify-start bg-transparent">
                      <svg className="h-4 w-4 mr-2" fill="#0A66C2" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </Button>
                    <Button variant="outline" className="justify-start bg-transparent">
                      <svg className="h-4 w-4 mr-2" fill="#25D366" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                      </svg>
                      WhatsApp
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
            <BarChart className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Analyse</span>
          </Button>
        </div>
      </div>
    </>
  );
}
