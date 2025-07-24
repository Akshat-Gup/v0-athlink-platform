import { useState, useEffect } from "react"
import { SponsorshipTarget } from "@/components/templates/user/sponsorship-modal"

interface SponsorshipPerk {
  id: number
  amount: number
  title: string
  description: string
  isUnlocked: boolean
  isCustom?: boolean
}

interface SponsorshipContribution {
  id: number
  targetId: number
  targetType: SponsorshipTarget
  amount: number
  perks: number[]
  customConditions?: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

interface SponsorshipData {
  targetId: number
  targetType: SponsorshipTarget
  targetName: string
  targetImage?: string
  totalRequested: number
  currentFunding: number
  yourContribution: number
  perks: SponsorshipPerk[]
  yourPerks: SponsorshipPerk[]
}

const SPONSORSHIP_STORAGE_KEY = "athlink-sponsorships"

export function useSponsorshipData() {
  const [contributions, setContributions] = useState<SponsorshipContribution[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load contributions from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContributions = localStorage.getItem(SPONSORSHIP_STORAGE_KEY)
      if (savedContributions) {
        try {
          setContributions(JSON.parse(savedContributions))
        } catch (error) {
          console.error("Failed to parse sponsorship data:", error)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save contributions to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded) {
      localStorage.setItem(SPONSORSHIP_STORAGE_KEY, JSON.stringify(contributions))
    }
  }, [contributions, isLoaded])

  const addContribution = (
    targetId: number,
    targetType: SponsorshipTarget,
    amount: number,
    selectedPerks: number[],
    customConditions?: string
  ) => {
    const newContribution: SponsorshipContribution = {
      id: Date.now(), // Simple ID generation
      targetId,
      targetType,
      amount,
      perks: selectedPerks,
      customConditions,
      createdAt: new Date().toISOString(),
      status: customConditions ? "pending" : "approved"
    }

    setContributions(prev => [...prev, newContribution])
    return newContribution
  }

  const getContributionsForTarget = (targetId: number, targetType: SponsorshipTarget) => {
    return contributions.filter(c => c.targetId === targetId && c.targetType === targetType)
  }

  const getTotalContributionForTarget = (targetId: number, targetType: SponsorshipTarget) => {
    return getContributionsForTarget(targetId, targetType)
      .filter(c => c.status === "approved")
      .reduce((total, c) => total + c.amount, 0)
  }

  const getYourPerksForTarget = (targetId: number, targetType: SponsorshipTarget, allPerks: SponsorshipPerk[]) => {
    const targetContributions = getContributionsForTarget(targetId, targetType)
      .filter(c => c.status === "approved")
    
    const yourPerks: SponsorshipPerk[] = []
    
    targetContributions.forEach(contribution => {
      contribution.perks.forEach(perkId => {
        const perk = allPerks.find(p => p.id === perkId)
        if (perk && !yourPerks.some(yp => yp.id === perk.id)) {
          yourPerks.push({
            ...perk,
            isCustom: !!contribution.customConditions
          })
        }
      })
    })

    return yourPerks
  }

  // Mock function to get sponsorship data for a target
  const getSponsorshipData = (targetId: number, targetType: SponsorshipTarget): SponsorshipData => {
    // This would typically come from an API
    const mockData = getMockSponsorshipData(targetId, targetType)
    const yourContribution = getTotalContributionForTarget(targetId, targetType)
    const yourPerks = getYourPerksForTarget(targetId, targetType, mockData.perks)

    return {
      ...mockData,
      yourContribution,
      yourPerks
    }
  }

  return {
    contributions,
    addContribution,
    getContributionsForTarget,
    getTotalContributionForTarget,
    getSponsorshipData,
    isLoaded
  }
}

// Mock data function - replace with actual API calls
function getMockSponsorshipData(targetId: number, targetType: SponsorshipTarget): Omit<SponsorshipData, 'yourContribution' | 'yourPerks'> {
  const baseData = {
    targetId,
    targetType,
    targetName: `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} ${targetId}`,
    totalRequested: 25000,
    currentFunding: 15000,
  }

  if (targetType === "talent") {
    return {
      ...baseData,
      targetName: "Alex Rodriguez",
      perks: [
        {
          id: 1,
          amount: 5000,
          title: "Team logo on social media + team photo",
          description: "Your company logo featured in social media posts and team photographs",
          isUnlocked: false
        },
        {
          id: 2,
          amount: 10000,
          title: "Logo on practice jerseys + facility tour",
          description: "Logo placement on practice jerseys and exclusive facility tour",
          isUnlocked: false
        },
        {
          id: 3,
          amount: 15000,
          title: "Logo on game jerseys + VIP game tickets",
          description: "Prominent logo on game jerseys and VIP tickets to games",
          isUnlocked: false
        },
        {
          id: 4,
          amount: 25000,
          title: "Naming rights to training facility + exclusive events",
          description: "Naming rights and exclusive access to special events",
          isUnlocked: false
        }
      ]
    }
  }

  if (targetType === "event") {
    return {
      ...baseData,
      targetName: "Championship Tournament 2025",
      perks: [
        {
          id: 5,
          amount: 5000,
          title: "Logo on event materials",
          description: "Company logo on all event promotional materials",
          isUnlocked: false
        },
        {
          id: 6,
          amount: 10000,
          title: "Booth space + announcements",
          description: "Exhibition booth and event announcements",
          isUnlocked: false
        },
        {
          id: 7,
          amount: 15000,
          title: "Title sponsor recognition",
          description: "Title sponsor status with naming rights",
          isUnlocked: false
        }
      ]
    }
  }

  // Team type
  return {
    ...baseData,
    targetName: "Thunder Hawks Team",
    perks: [
      {
        id: 8,
        amount: 5000,
        title: "Team sponsor recognition",
        description: "Recognition as official team sponsor",
        isUnlocked: false
      },
      {
        id: 9,
        amount: 10000,
        title: "Uniform sponsorship",
        description: "Logo on team uniforms",
        isUnlocked: false
      },
      {
        id: 10,
        amount: 15000,
        title: "Season sponsor package",
        description: "Complete season sponsorship package",
        isUnlocked: false
      }
    ]
  }
}
