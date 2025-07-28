"use client"

import { useState } from "react"

interface SponsorshipRequestData {
  campaign_id: number
  athlete_id: number
  perk_tier_id?: number
  amount: number
  custom_perks?: string
  message?: string
  is_custom: boolean
}

export function useCampaignSponsorship() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitSponsorshipRequest = async (requestData: SponsorshipRequestData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/sponsorship-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit sponsorship request')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error submitting sponsorship request:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitSponsorshipRequest,
    isSubmitting
  }
}
