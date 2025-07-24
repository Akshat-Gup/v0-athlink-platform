"use client"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/button"
import { Card } from "../../molecules/card"
import { Badge } from "../../atoms/badge"
import { Progress } from "../../atoms/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../organisms/dialog"
import { Target, Calendar, DollarSign, Users, Eye, Edit, Play, Pause, X } from "lucide-react"
import { useAuth } from "../../../hooks/use-auth"
import { useToast } from "../../../hooks/use-toast"

interface Campaign {
  id: number
  title: string
  description?: string
  funding_goal: number
  current_funding: number
  status: string
  deadline?: string
  created_at: string
  perk_tiers: Array<{
    id: number
    tier_name: string
    amount: number
    description: string
    deliverables: string
    max_sponsors?: number
    current_sponsors: number
  }>
  _count?: {
    sponsorship_requests: number
  }
}

interface CampaignDisplayProps {
  showCreateButton?: boolean
  limit?: number
}

export function CampaignDisplay({ showCreateButton = true, limit }: CampaignDisplayProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCampaigns()
    }
  }, [isAuthenticated])

  const fetchCampaigns = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(limit ? data.campaigns.slice(0, limit) : data.campaigns)
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCampaignStatus = async (campaignId: number, status: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setCampaigns(prev => 
          prev.map(campaign => 
            campaign.id === campaignId 
              ? { ...campaign, status }
              : campaign
          )
        )
        toast({
          title: "Campaign Updated",
          description: `Campaign ${status.toLowerCase()} successfully.`,
        })
      }
    } catch (error) {
      console.error('Failed to update campaign:', error)
      toast({
        title: "Error",
        description: "Failed to update campaign status.",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  const formatDeliverables = (deliverables: string) => {
    try {
      const parsed = JSON.parse(deliverables)
      const items = []
      if (parsed.instagram_ads) items.push(`${parsed.instagram_ads} Instagram ads`)
      if (parsed.twitter_posts) items.push(`${parsed.twitter_posts} Twitter posts`)
      if (parsed.youtube_mentions) items.push(`${parsed.youtube_mentions} YouTube mentions`)
      if (parsed.custom) items.push(parsed.custom)
      return items.join(', ') || 'Custom deliverables'
    } catch {
      return 'Custom deliverables'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please sign in to view your campaigns.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading campaigns...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Campaigns</h2>
        {showCreateButton && (
          <Button className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Create New Campaign
          </Button>
        )}
      </div>

      {campaigns.length === 0 ? (
        <Card className="p-8 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first sponsorship campaign to start raising funds for your athletic goals.
          </p>
          {showCreateButton && (
            <Button className="flex items-center gap-2 mx-auto">
              <Target className="h-4 w-4" />
              Create Your First Campaign
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{campaign.title}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  {campaign.description && (
                    <p className="text-gray-600 mb-3">{campaign.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {campaign.status === 'OPEN' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCampaignStatus(campaign.id, 'PAUSED')}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : campaign.status === 'PAUSED' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCampaignStatus(campaign.id, 'OPEN')}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                  <span className="text-sm text-gray-600">
                    ${campaign.current_funding.toLocaleString()} / ${campaign.funding_goal.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={calculateProgress(campaign.current_funding, campaign.funding_goal)}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {calculateProgress(campaign.current_funding, campaign.funding_goal).toFixed(1)}% funded
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {campaign.perk_tiers.length}
                  </div>
                  <div className="text-xs text-gray-500">Tiers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {campaign._count?.sponsorship_requests || 0}
                  </div>
                  <div className="text-xs text-gray-500">Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {campaign.perk_tiers.reduce((sum, tier) => sum + tier.current_sponsors, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Sponsors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {campaign.deadline ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : '∞'}
                  </div>
                  <div className="text-xs text-gray-500">Days Left</div>
                </div>
              </div>

              {/* Perk Tiers Preview */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sponsorship Tiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {campaign.perk_tiers.slice(0, 3).map((tier) => (
                    <div key={tier.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{tier.tier_name}</span>
                        <span className="text-sm font-bold text-green-600">
                          ${tier.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{tier.description}</p>
                      <p className="text-xs text-gray-500">
                        {formatDeliverables(tier.deliverables)}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">
                        {tier.current_sponsors}/{tier.max_sponsors || '∞'} sponsors
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {selectedCampaign.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Campaign Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    ${selectedCampaign.current_funding.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Raised</div>
                </Card>
                <Card className="p-4 text-center">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    ${selectedCampaign.funding_goal.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Goal</div>
                </Card>
                <Card className="p-4 text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedCampaign.perk_tiers.reduce((sum, tier) => sum + tier.current_sponsors, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Sponsors</div>
                </Card>
                <Card className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedCampaign.deadline ? Math.max(0, Math.ceil((new Date(selectedCampaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : '∞'}
                  </div>
                  <div className="text-sm text-gray-500">Days Left</div>
                </Card>
              </div>

              {/* All Perk Tiers */}
              <div>
                <h3 className="text-lg font-medium mb-4">All Sponsorship Tiers</h3>
                <div className="space-y-4">
                  {selectedCampaign.perk_tiers.map((tier) => (
                    <Card key={tier.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{tier.tier_name}</h4>
                        <span className="text-lg font-bold text-green-600">
                          ${tier.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{tier.description}</p>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Deliverables:</p>
                        <p className="text-sm text-gray-600">
                          {formatDeliverables(tier.deliverables)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {tier.current_sponsors} / {tier.max_sponsors || '∞'} sponsors
                        </span>
                        <Badge variant={tier.current_sponsors < (tier.max_sponsors || Infinity) ? "secondary" : "outline"}>
                          {tier.current_sponsors < (tier.max_sponsors || Infinity) ? "Available" : "Full"}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
