"use client"

import { useState, useEffect } from 'react'
import { useToast } from './use-toast'

interface UseFavoritesResult {
  isFavorited: boolean
  isLoading: boolean
  toggleFavorite: () => Promise<void>
  checkFavoriteStatus: () => Promise<void>
}

export function useFavorites(profileId: string | number, profileType: 'talent' | 'team' | 'event'): UseFavoritesResult {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/check/${profileId}`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.is_favorited)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?profile_id=${profileId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setIsFavorited(false)
          toast({
            title: "Removed from favorites",
            description: "Profile has been removed from your watchlist",
          })
        } else {
          const error = await response.json()
          throw new Error(error.error || 'Failed to remove favorite')
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile_id: parseInt(profileId.toString()),
            profile_type: profileType
          })
        })

        if (response.ok) {
          setIsFavorited(true)
          toast({
            title: "Added to favorites",
            description: "Profile has been added to your watchlist",
          })
        } else {
          const error = await response.json()
          if (response.status === 409) {
            // Already favorited
            setIsFavorited(true)
            return
          }
          if (response.status === 401) {
            toast({
              title: "Please log in",
              description: "You need to be logged in to add favorites",
              variant: "destructive"
            })
            return
          }
          throw new Error(error.error || 'Failed to add favorite')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (profileId) {
      checkFavoriteStatus()
    }
  }, [profileId])

  return {
    isFavorited,
    isLoading,
    toggleFavorite,
    checkFavoriteStatus
  }
}
