"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { Heart, Star, MapPin, Users, Calendar, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FavoriteProfile {
  id: string
  profile_type: 'talent' | 'team' | 'event'
  created_at: string
  profile: {
    id: number
    name: string
    primary_sport: string
    profile_image_id?: number
    country_flag: string
    rating: number
    bio: string
    talent_profile?: {
      id: number
      current_funding?: number
      goal_funding?: number
      achievements: string
    }
    team_profile?: {
      id: number
      current_funding?: number
      goal_funding?: number
      league: string
      wins: number
      losses: number
      ranking?: number
    }
    event_profile?: {
      id: number
      current_funding?: number
      goal_funding?: number
      start_date: string
      end_date: string
      venue: string
      status: string
    }
  }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchFavorites()
  }, [isAuthenticated])

  const fetchFavorites = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/favorites')
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }
      
      const data = await response.json()
      setFavorites(data.favorites)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFavorite = async (profileId: number) => {
    try {
      const response = await fetch(`/api/favorites?profile_id=${profileId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.profile.id !== profileId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const getProfileUrl = (profile: FavoriteProfile) => {
    const baseUrl = `/profile/${profile.profile_type}s/${profile.profile.id}`
    return baseUrl
  }

  const getProfileStats = (profile: FavoriteProfile) => {
    switch (profile.profile_type) {
      case 'talent':
        return profile.profile.talent_profile?.achievements || 'No achievements listed'
      case 'team':
        const team = profile.profile.team_profile
        return team ? `${team.wins}W-${team.losses}L in ${team.league}` : 'No stats available'
      case 'event':
        const event = profile.profile.event_profile
        return event ? `${event.venue} • ${event.status}` : 'No details available'
      default:
        return ''
    }
  }

  const getProfileIcon = (profileType: string) => {
    switch (profileType) {
      case 'talent':
        return <Star className="h-4 w-4" />
      case 'team':
        return <Users className="h-4 w-4" />
      case 'event':
        return <Calendar className="h-4 w-4" />
      default:
        return null
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-red-600">
              Error: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          My Watchlist
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Keep track of your favorite athletes, teams, and events
        </p>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">
              Start exploring profiles and click the heart icon to add them to your watchlist
            </p>
            <Link href="/discover">
              <Button>Discover Profiles</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={favorite.profile.profile_image_id ? `/api/files/${favorite.profile.profile_image_id}` : undefined} 
                      />
                      <AvatarFallback>
                        {favorite.profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{favorite.profile.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getProfileIcon(favorite.profile_type)}
                          <span className="ml-1 capitalize">{favorite.profile_type}</span>
                        </Badge>
                        <span className="text-xs text-gray-500">{favorite.profile.country_flag}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(favorite.profile.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>{favorite.profile.rating}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {favorite.profile.primary_sport}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {favorite.profile.bio}
                </p>

                <div className="text-xs text-gray-500">
                  {getProfileStats(favorite)}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500">
                    Added {new Date(favorite.created_at).toLocaleDateString()}
                  </span>
                  <Link href={getProfileUrl(favorite)}>
                    <Button size="sm">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {favorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Watchlist Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{favorites.length}</div>
                <div className="text-sm text-gray-600">Total Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {favorites.filter(f => f.profile_type === 'talent').length}
                </div>
                <div className="text-sm text-gray-600">Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {favorites.filter(f => f.profile_type === 'team').length}
                </div>
                <div className="text-sm text-gray-600">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {favorites.filter(f => f.profile_type === 'event').length}
                </div>
                <div className="text-sm text-gray-600">Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
