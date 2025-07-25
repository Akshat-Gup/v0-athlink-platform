"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./use-auth"

interface PerkTier {
  id: number
  tier_name: string
  amount: number
  description: string
  deliverables: string | object
  max_sponsors?: number
  current_sponsors: number
}

interface Campaign {
  id: number
  title: string
  description?: string
  funding_goal: number
  current_funding: number
  status: string
  deadline?: string
  created_at: string
  updated_at: string
  perk_tiers: PerkTier[]
  progress_percentage: number
  remaining_goal: number
  is_fully_funded: boolean
  sponsors_count: number
}

export function useCampaignData() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const fetchUserCampaigns = useCallback(async () => {
    if (!isAuthenticated) {
      setCampaigns([])
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/campaigns?own_only=true')
      
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch campaigns')
      }
    } catch (err) {
      setError('Failed to fetch campaigns')
      console.error('Error fetching campaigns:', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchCampaignById = useCallback(async (id: number): Promise<Campaign | null> => {
    try {
      const response = await fetch(`/api/campaigns/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        return data.campaign
      } else {
        console.error('Failed to fetch campaign by ID')
        return null
      }
    } catch (err) {
      console.error('Error fetching campaign by ID:', err)
      return null
    }
  }, [])

  const getUserActiveCampaign = useCallback((): Campaign | null => {
    return campaigns.find(campaign => 
      campaign.status === 'OPEN' || campaign.status === 'PAUSED'
    ) || null
  }, [campaigns])

  const createCampaign = useCallback(async (campaignData: {
    title: string
    description?: string
    funding_goal: number
    deadline?: string
    perk_tiers: any[]
  }): Promise<Campaign | null> => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      })

      if (response.ok) {
        const data = await response.json()
        await fetchUserCampaigns() // Refresh the list
        return data.campaign
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create campaign')
        return null
      }
    } catch (err) {
      setError('Failed to create campaign')
      console.error('Error creating campaign:', err)
      return null
    }
  }, [])

  const updateCampaign = useCallback(async (id: number, campaignData: {
    title: string
    description?: string
    funding_goal: number
    deadline?: string
    perk_tiers: any[]
  }): Promise<Campaign | null> => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      })

      if (response.ok) {
        const data = await response.json()
        await fetchUserCampaigns() // Refresh the list
        return data.campaign
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update campaign')
        return null
      }
    } catch (err) {
      setError('Failed to update campaign')
      console.error('Error updating campaign:', err)
      return null
    }
  }, [fetchUserCampaigns])

  const updateCampaignStatus = useCallback(async (id: number, status: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchUserCampaigns() // Refresh the list
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update campaign status')
        return false
      }
    } catch (err) {
      setError('Failed to update campaign status')
      console.error('Error updating campaign status:', err)
      return false
    }
  }, [fetchUserCampaigns])

  const deleteCampaign = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchUserCampaigns() // Refresh the list
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete campaign')
        return false
      }
    } catch (err) {
      setError('Failed to delete campaign')
      console.error('Error deleting campaign:', err)
      return false
    }
  }, [fetchUserCampaigns])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCampaigns()
    }
  }, [isAuthenticated, fetchUserCampaigns])

  return {
    campaigns,
    loading,
    error,
    fetchUserCampaigns,
    fetchCampaignById,
    getUserActiveCampaign,
    createCampaign,
    updateCampaign,
    updateCampaignStatus,
    deleteCampaign,
    refreshCampaigns: fetchUserCampaigns
  }
}
