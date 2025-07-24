"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Progress } from '@/components/atoms/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { CalendarDays, DollarSign, Target, Users, Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// Helper functions
const calculateProgress = (current: number, goal: number) => {
  return Math.min((current / goal) * 100, 100)
}

const getTimeRemaining = (deadline: string) => {
  const now = new Date()
  const end = new Date(deadline)
  
  if (end < now) {
    return 'Expired'
  }
  
  return `${formatDistanceToNow(end)} remaining`
}

const getStatusColor = (campaignStatus: string) => {
  switch (campaignStatus) {
    case 'active': return 'bg-green-500'
    case 'completed': return 'bg-blue-500'
    case 'expired': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

interface PerkTier {
  id: string
  name: string
  description: string
  amount: number
  max_sponsors: number | null
  current_sponsors: number
  perks: string[]
}

interface Campaign {
  id: string
  title: string
  description: string
  goal_amount: number
  current_funding: number
  deadline: string
  status: 'active' | 'completed' | 'expired'
  profile_id: string
  profile_type: 'talent' | 'team' | 'event'
  created_at: string
  perk_tiers: PerkTier[]
  profile?: {
    id: string
    name: string
    image_url?: string
    location?: string
  }
}

interface CampaignListProps {
  profileId?: string
  profileType?: 'talent' | 'team' | 'event'
  status?: 'active' | 'completed' | 'expired'
  limit?: number
  onCampaignSelect?: (campaign: Campaign) => void
}

export function CampaignList({ 
  profileId, 
  profileType, 
  status = 'active', 
  limit,
  onCampaignSelect 
}: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [profileId, profileType, status, limit])

  const fetchCampaigns = async () => {
    try {
      const params = new URLSearchParams()
      if (profileId) params.append('profile_id', profileId)
      if (profileType) params.append('profile_type', profileType)
      if (status) params.append('status', status)
      if (limit) params.append('limit', limit.toString())

      const response = await fetch(`/api/campaigns?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch campaigns')

      const data = await response.json()
      setCampaigns(data.campaigns)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  const getTimeRemaining = (deadline: string) => {
    const now = new Date()
    const end = new Date(deadline)
    
    if (end < now) {
      return 'Expired'
    }
    
    return `${formatDistanceToNow(end)} remaining`
  }

  const getStatusColor = (campaignStatus: string) => {
    switch (campaignStatus) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'expired': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No campaigns found</p>
            <p className="text-sm">Be the first to create a fundraising campaign!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card 
          key={campaign.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onCampaignSelect?.(campaign)}
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {campaign.description}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(campaign.status)} text-white ml-2`}>
                {campaign.status}
              </Badge>
            </div>

            {campaign.profile && (
              <div className="flex items-center gap-2 mt-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={campaign.profile.image_url} />
                  <AvatarFallback>
                    {campaign.profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{campaign.profile.name}</span>
                <Badge variant="outline" className="text-xs">
                  {campaign.profile_type}
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Funding Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  ${campaign.current_funding.toLocaleString()} / ${campaign.goal_amount.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={calculateProgress(campaign.current_funding, campaign.goal_amount)} 
                className="h-2"
              />
              <div className="text-xs text-gray-500">
                {calculateProgress(campaign.current_funding, campaign.goal_amount).toFixed(1)}% funded
              </div>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">${campaign.goal_amount.toLocaleString()}</div>
                  <div className="text-gray-500">Goal</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium text-xs">{getTimeRemaining(campaign.deadline)}</div>
                  <div className="text-gray-500">Time</div>
                </div>
              </div>
            </div>

            {/* Perk Tiers Preview */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Sponsorship Tiers ({campaign.perk_tiers.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {campaign.perk_tiers.slice(0, 3).map((tier) => (
                  <Badge key={tier.id} variant="secondary" className="text-xs">
                    ${tier.amount}
                  </Badge>
                ))}
                {campaign.perk_tiers.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{campaign.perk_tiers.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full" 
              variant={campaign.status === 'active' ? 'default' : 'secondary'}
              onClick={(e) => {
                e.stopPropagation()
                onCampaignSelect?.(campaign)
              }}
            >
              {campaign.status === 'active' ? 'View & Sponsor' : 'View Campaign'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Campaign Detail Modal/Page Component
interface CampaignDetailProps {
  campaign: Campaign
  onBack?: () => void
}

export function CampaignDetail({ campaign, onBack }: CampaignDetailProps) {
  const [selectedTier, setSelectedTier] = useState<PerkTier | null>(null)

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          ← Back to Campaigns
        </Button>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{campaign.title}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {campaign.description}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(campaign.status)} text-white`}>
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Funding Progress</h3>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${campaign.current_funding.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  of ${campaign.goal_amount.toLocaleString()} goal
                </div>
              </div>
            </div>
            <Progress 
              value={calculateProgress(campaign.current_funding, campaign.goal_amount)} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{calculateProgress(campaign.current_funding, campaign.goal_amount).toFixed(1)}% funded</span>
              <span>{getTimeRemaining(campaign.deadline)}</span>
            </div>
          </div>

          {/* Sponsorship Tiers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sponsorship Tiers</h3>
            <div className="grid gap-4">
              {campaign.perk_tiers.map((tier) => (
                <Card 
                  key={tier.id} 
                  className={`cursor-pointer transition-all ${
                    selectedTier?.id === tier.id ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTier(tier)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <div className="text-right">
                        <div className="text-xl font-bold">${tier.amount}</div>
                        {tier.max_sponsors && (
                          <div className="text-xs text-gray-500">
                            {tier.current_sponsors}/{tier.max_sponsors} sponsors
                          </div>
                        )}
                      </div>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Perks included:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tier.perks.map((perk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tier.max_sponsors && tier.current_sponsors >= tier.max_sponsors ? (
                      <Badge variant="secondary" className="mt-3">
                        Fully Sponsored
                      </Badge>
                    ) : (
                      <Button 
                        className="w-full mt-3" 
                        disabled={campaign.status !== 'active'}
                      >
                        Sponsor This Tier
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
