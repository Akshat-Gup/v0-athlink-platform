"use client"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/button"
import { Input } from "../../atoms/input"
import { Card } from "../../molecules/card"
import { Badge } from "../../atoms/badge"
import { Progress } from "../../atoms/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../organisms/dialog"
import { Heart, DollarSign, Calendar, Users, Target, Send, Edit3 } from "lucide-react"
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
  athlete: {
    id: number
    name: string
    email: string
    primary_sport: string
  }
  perk_tiers: Array<{
    id: number
    tier_name: string
    amount: number
    description: string
    deliverables: string
    max_sponsors?: number
    current_sponsors: number
  }>
}

interface SponsorshipRequest {
  amount: number
  perk_tier_id?: number
  custom_perks?: string
  message?: string
  is_custom: boolean
}

export function SponsorCampaignBrowser() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [sponsorshipModal, setSponsorshipModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState<any>(null)
  const [customOffer, setCustomOffer] = useState(false)
  const [sponsorshipRequest, setSponsorshipRequest] = useState<SponsorshipRequest>({
    amount: 0,
    message: '',
    is_custom: false
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/campaigns/browse')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns)
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSponsorClick = (campaign: Campaign, tier?: any) => {
    setSelectedCampaign(campaign)
    setSelectedTier(tier)
    setCustomOffer(!tier)
    setSponsorshipRequest({
      amount: tier?.amount || 0,
      perk_tier_id: tier?.id,
      message: '',
      is_custom: !tier,
      custom_perks: tier ? undefined : ''
    })
    setSponsorshipModal(true)
  }

  const submitSponsorshipRequest = async () => {
    if (!isAuthenticated || !selectedCampaign) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a sponsorship offer.",
        variant: "destructive"
      })
      return
    }

    if (sponsorshipRequest.amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid sponsorship amount.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/sponsorship-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: selectedCampaign.id,
          athlete_id: selectedCampaign.athlete.id,
          ...sponsorshipRequest
        }),
      })

      if (response.ok) {
        toast({
          title: "Sponsorship Request Sent!",
          description: customOffer 
            ? "Your custom offer has been sent to the athlete for review."
            : "Your sponsorship request has been sent and funds are being held in escrow.",
        })
        setSponsorshipModal(false)
        setSelectedCampaign(null)
        setSelectedTier(null)
        setCustomOffer(false)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to send sponsorship request.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error sending sponsorship request:', error)
      toast({
        title: "Error",
        description: "Failed to send sponsorship request. Please try again.",
        variant: "destructive"
      })
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

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return '∞'
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading sponsorship opportunities...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sponsorship Opportunities</h1>
        <p className="text-gray-600">Discover and support talented athletes on their journey to success</p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="p-8 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns available</h3>
          <p className="text-gray-600">Check back later for new sponsorship opportunities.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{campaign.title}</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {campaign.athlete.primary_sport}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    by <span className="font-medium">{campaign.athlete.name}</span>
                  </p>
                  {campaign.description && (
                    <p className="text-gray-600 mb-3">{campaign.description}</p>
                  )}
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
                  {calculateProgress(campaign.current_funding, campaign.funding_goal).toFixed(1)}% funded • {getDaysLeft(campaign.deadline)} days left
                </p>
              </div>

              {/* Sponsorship Tiers */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Sponsorship Tiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {campaign.perk_tiers.map((tier) => (
                    <Card key={tier.id} className="p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{tier.tier_name}</span>
                        <span className="text-lg font-bold text-green-600">
                          ${tier.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        {formatDeliverables(tier.deliverables)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {tier.current_sponsors}/{tier.max_sponsors || '∞'} sponsors
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => handleSponsorClick(campaign, tier)}
                          disabled={tier.max_sponsors ? tier.current_sponsors >= tier.max_sponsors : false}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {tier.max_sponsors && tier.current_sponsors >= tier.max_sponsors ? 'Full' : 'Sponsor Now'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Custom Offer Button */}
                <Button 
                  variant="outline" 
                  onClick={() => handleSponsorClick(campaign)}
                  className="w-full border-dashed border-2 border-gray-300 hover:border-blue-300"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Make Custom Offer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sponsorship Request Modal */}
      <Dialog open={sponsorshipModal} onOpenChange={setSponsorshipModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              {customOffer ? 'Make Custom Offer' : `Sponsor ${selectedTier?.tier_name}`}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Info */}
              <Card className="p-4 bg-gray-50">
                <h3 className="font-medium mb-1">{selectedCampaign.title}</h3>
                <p className="text-sm text-gray-600">by {selectedCampaign.athlete.name}</p>
              </Card>

              {/* Sponsorship Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sponsorship Amount ($) *
                  </label>
                  <Input
                    type="number"
                    value={sponsorshipRequest.amount}
                    onChange={(e) => setSponsorshipRequest(prev => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0
                    }))}
                    min="1"
                    step="1"
                    disabled={!customOffer}
                  />
                  {!customOffer && selectedTier && (
                    <p className="text-xs text-gray-500 mt-1">
                      Fixed amount for {selectedTier.tier_name}
                    </p>
                  )}
                </div>

                {customOffer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What you'd like in return *
                    </label>
                    <textarea
                      value={sponsorshipRequest.custom_perks || ''}
                      onChange={(e) => setSponsorshipRequest(prev => ({
                        ...prev,
                        custom_perks: e.target.value
                      }))}
                      placeholder="e.g., 2 Instagram posts featuring our brand, 1 YouTube video mention..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                )}

                {!customOffer && selectedTier && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What you'll receive
                    </label>
                    <Card className="p-3 bg-green-50">
                      <p className="text-sm">{formatDeliverables(selectedTier.deliverables)}</p>
                    </Card>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to athlete (optional)
                  </label>
                  <textarea
                    value={sponsorshipRequest.message || ''}
                    onChange={(e) => setSponsorshipRequest(prev => ({
                      ...prev,
                      message: e.target.value
                    }))}
                    placeholder="Add a personal message..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={2}
                    maxLength={300}
                  />
                </div>
              </div>

              {/* Terms Notice */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                  {customOffer 
                    ? "Your custom offer will be sent to the athlete for review. If accepted, funds will be held in escrow until deliverables are completed."
                    : "Funds will be held in escrow and released to the athlete once they accept your sponsorship and complete the agreed deliverables."
                  }
                </p>
              </Card>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSponsorshipModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={submitSponsorshipRequest}
                  disabled={!sponsorshipRequest.amount || (customOffer && !sponsorshipRequest.custom_perks)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {customOffer ? 'Send Custom Offer' : 'Send Sponsorship Request'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
