"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useAuth } from "./use-auth"
import { sponsorshipEvents, SPONSORSHIP_EVENTS } from "@/lib/sponsorship-events"

interface SponsorContribution {
  id: number
  campaign_id: number
  athlete_id: number
  amount: number
  status: string
  created_at: string
  custom_perks?: string
  campaign: {
    title: string
  }
  athlete: {
    name: string
    email: string
  }
}

interface SponsorContributionsContextType {
  contributions: SponsorContribution[]
  isLoading: boolean
  error: string | null
  refreshContributions: () => Promise<void>
  getTotalContributionForAthlete: (athleteId: number) => number
  getTotalContributionForCampaign: (campaignId: number) => number
  getContributionsForAthlete: (athleteId: number) => SponsorContribution[]
  getPendingContributionsCount: () => number
}

const SponsorContributionsContext = createContext<SponsorContributionsContextType | undefined>(undefined)

export function SponsorContributionsProvider({ children }: { children: React.ReactNode }) {
  const [contributions, setContributions] = useState<SponsorContribution[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const refreshContributions = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/sponsorship-requests')
      
      if (!response.ok) {
        throw new Error('Failed to fetch sponsorship requests')
      }

      const data = await response.json()
      
      // Set the contributions from the response (sent_requests are the sponsor's contributions)
      setContributions(data.sent_requests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching sponsor contributions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch contributions when component mounts or user changes
  useEffect(() => {
    refreshContributions()
  }, [user])

  // Listen for sponsorship events to refresh contributions
  useEffect(() => {
    const handleApproval = () => {
      console.log('Sponsorship approved - refreshing contributions')
      refreshContributions()
    }

    const handleRejection = () => {
      console.log('Sponsorship rejected - refreshing contributions')
      refreshContributions()
    }

    sponsorshipEvents.on(SPONSORSHIP_EVENTS.REQUEST_APPROVED, handleApproval)
    sponsorshipEvents.on(SPONSORSHIP_EVENTS.REQUEST_REJECTED, handleRejection)

    return () => {
      sponsorshipEvents.off(SPONSORSHIP_EVENTS.REQUEST_APPROVED, handleApproval)
      sponsorshipEvents.off(SPONSORSHIP_EVENTS.REQUEST_REJECTED, handleRejection)
    }
  }, [])

  // Get total contribution for a specific athlete/campaign
  const getTotalContributionForAthlete = (athleteId: number) => {
    return contributions
      .filter(c => c.athlete_id === athleteId && c.status === 'ACCEPTED')
      .reduce((total, c) => total + c.amount, 0)
  }

  // Get total contribution for a specific campaign
  const getTotalContributionForCampaign = (campaignId: number) => {
    return contributions
      .filter(c => c.campaign_id === campaignId && c.status === 'ACCEPTED')
      .reduce((total, c) => total + c.amount, 0)
  }

  // Get all contributions for a specific athlete
  const getContributionsForAthlete = (athleteId: number) => {
    return contributions.filter(c => c.athlete_id === athleteId)
  }

  // Get pending contributions count
  const getPendingContributionsCount = () => {
    return contributions.filter(c => c.status === 'PENDING').length
  }

  const value = {
    contributions,
    isLoading,
    error,
    refreshContributions,
    getTotalContributionForAthlete,
    getTotalContributionForCampaign,
    getContributionsForAthlete,
    getPendingContributionsCount
  }

  return (
    <SponsorContributionsContext.Provider value={value}>
      {children}
    </SponsorContributionsContext.Provider>
  )
}

export function useSponsorContributions() {
  const context = useContext(SponsorContributionsContext)
  
  if (context === undefined) {
    // Fallback for components not wrapped in provider
    const [contributions, setContributions] = useState<SponsorContribution[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    const refreshContributions = async () => {
      if (!user) return

      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/sponsorship-requests')
        
        if (!response.ok) {
          throw new Error('Failed to fetch sponsorship requests')
        }

        const data = await response.json()
        
        // Set the contributions from the response (sent_requests are the sponsor's contributions)
        setContributions(data.sent_requests || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching sponsor contributions:', err)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      refreshContributions()
    }, [user])

    // Listen for sponsorship events to refresh contributions
    useEffect(() => {
      const handleApproval = () => {
        console.log('Sponsorship approved - refreshing contributions (fallback)')
        refreshContributions()
      }

      const handleRejection = () => {
        console.log('Sponsorship rejected - refreshing contributions (fallback)')
        refreshContributions()
      }

      sponsorshipEvents.on(SPONSORSHIP_EVENTS.REQUEST_APPROVED, handleApproval)
      sponsorshipEvents.on(SPONSORSHIP_EVENTS.REQUEST_REJECTED, handleRejection)

      return () => {
        sponsorshipEvents.off(SPONSORSHIP_EVENTS.REQUEST_APPROVED, handleApproval)
        sponsorshipEvents.off(SPONSORSHIP_EVENTS.REQUEST_REJECTED, handleRejection)
      }
    }, [])

    // Get total contribution for a specific athlete/campaign
    const getTotalContributionForAthlete = (athleteId: number) => {
      return contributions
        .filter(c => c.athlete_id === athleteId && c.status === 'ACCEPTED')
        .reduce((total, c) => total + c.amount, 0)
    }

    // Get total contribution for a specific campaign
    const getTotalContributionForCampaign = (campaignId: number) => {
      return contributions
        .filter(c => c.campaign_id === campaignId && c.status === 'ACCEPTED')
        .reduce((total, c) => total + c.amount, 0)
    }

    // Get all contributions for a specific athlete
    const getContributionsForAthlete = (athleteId: number) => {
      return contributions.filter(c => c.athlete_id === athleteId)
    }

    // Get pending contributions count
    const getPendingContributionsCount = () => {
      return contributions.filter(c => c.status === 'PENDING').length
    }

    return {
      contributions,
      isLoading,
      error,
      refreshContributions,
      getTotalContributionForAthlete,
      getTotalContributionForCampaign,
      getContributionsForAthlete,
      getPendingContributionsCount
    }
  }
  
  return context
}
