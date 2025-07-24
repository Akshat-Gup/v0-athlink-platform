"use client"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/button"
import { Input } from "../../atoms/input"
import { Card } from "../../molecules/card"
import { Badge } from "../../atoms/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../organisms/dialog"
import { Plus, Target, Calendar, DollarSign, Trophy, Instagram, Twitter, Youtube } from "lucide-react"
import { useAuth } from "../../../hooks/use-auth"
import { useToast } from "../../../hooks/use-toast"

interface PerkTier {
  tier_name: string
  amount: number
  description: string
  deliverables: {
    instagram_ads?: number
    twitter_posts?: number
    youtube_mentions?: number
    custom?: string
  }
  max_sponsors?: number
}

interface CampaignCreationProps {
  children?: React.ReactNode
  onCampaignCreated?: (campaign: any) => void
}

const defaultPerkTiers: PerkTier[] = [
  {
    tier_name: "Bronze Tier",
    amount: 500,
    description: "Entry level sponsorship with social media exposure",
    deliverables: {
      instagram_ads: 1,
      twitter_posts: 2
    },
    max_sponsors: 10
  },
  {
    tier_name: "Silver Tier",
    amount: 1000,
    description: "Enhanced visibility across multiple platforms",
    deliverables: {
      instagram_ads: 3,
      twitter_posts: 2
    },
    max_sponsors: 5
  },
  {
    tier_name: "Gold Tier",
    amount: 2500,
    description: "Premium sponsorship with maximum exposure",
    deliverables: {
      instagram_ads: 5,
      twitter_posts: 3,
      youtube_mentions: 1
    },
    max_sponsors: 3
  }
]

export function CampaignCreation({ children, onCampaignCreated }: CampaignCreationProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Campaign form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fundingGoal, setFundingGoal] = useState("")
  const [deadline, setDeadline] = useState("")
  const [perkTiers, setPerkTiers] = useState<PerkTier[]>(defaultPerkTiers)

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a campaign.",
        variant: "destructive"
      })
      return
    }

    if (!title || !fundingGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in the campaign title and funding goal.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          funding_goal: parseFloat(fundingGoal),
          deadline: deadline ? new Date(deadline).toISOString() : null,
          perk_tiers: perkTiers.map(tier => ({
            ...tier,
            deliverables: JSON.stringify(tier.deliverables)
          }))
        }),
      })

      if (response.ok) {
        const newCampaign = await response.json()
        toast({
          title: "Campaign Created!",
          description: "Your sponsorship campaign is now live and open for sponsors.",
        })
        
        // Reset form
        setTitle("")
        setDescription("")
        setFundingGoal("")
        setDeadline("")
        setPerkTiers(defaultPerkTiers)
        setIsOpen(false)
        
        onCampaignCreated?.(newCampaign.campaign)
      } else {
        const error = await response.json()
        toast({
          title: "Error Creating Campaign",
          description: error.error || "Something went wrong. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePerkTier = (index: number, field: keyof PerkTier, value: any) => {
    const updated = [...perkTiers]
    updated[index] = { ...updated[index], [field]: value }
    setPerkTiers(updated)
  }

  const updateDeliverables = (index: number, deliverable: string, value: number | string) => {
    const updated = [...perkTiers]
    updated[index] = {
      ...updated[index],
      deliverables: {
        ...updated[index].deliverables,
        [deliverable]: value
      }
    }
    setPerkTiers(updated)
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please sign in to create a sponsorship campaign.</p>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Create Sponsorship Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Campaign Info */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Campaign Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Help me compete in the 2025 Olympics"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell sponsors about your goals and how their support will help..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Goal ($) *
                  </label>
                  <Input
                    type="number"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    placeholder="10000"
                    min="100"
                    step="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Deadline
                  </label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Perk Tiers */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Sponsorship Tiers
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Define what sponsors get in return for their support. These are default offers that sponsors can accept immediately.
            </p>
            
            <div className="space-y-4">
              {perkTiers.map((tier, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tier Name
                      </label>
                      <Input
                        value={tier.tier_name}
                        onChange={(e) => updatePerkTier(index, 'tier_name', e.target.value)}
                        placeholder="Bronze Tier"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($)
                      </label>
                      <Input
                        type="number"
                        value={tier.amount}
                        onChange={(e) => updatePerkTier(index, 'amount', parseInt(e.target.value))}
                        min="0"
                        step="50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Sponsors
                      </label>
                      <Input
                        type="number"
                        value={tier.max_sponsors || ''}
                        onChange={(e) => updatePerkTier(index, 'max_sponsors', e.target.value ? parseInt(e.target.value) : undefined)}
                        min="1"
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={tier.description}
                      onChange={(e) => updatePerkTier(index, 'description', e.target.value)}
                      placeholder="What sponsors get for this tier"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deliverables
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <Input
                          type="number"
                          value={tier.deliverables.instagram_ads || ''}
                          onChange={(e) => updateDeliverables(index, 'instagram_ads', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          className="text-sm"
                        />
                        <span className="text-xs text-gray-500">ads</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-500" />
                        <Input
                          type="number"
                          value={tier.deliverables.twitter_posts || ''}
                          onChange={(e) => updateDeliverables(index, 'twitter_posts', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          className="text-sm"
                        />
                        <span className="text-xs text-gray-500">posts</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        <Input
                          type="number"
                          value={tier.deliverables.youtube_mentions || ''}
                          onChange={(e) => updateDeliverables(index, 'youtube_mentions', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          className="text-sm"
                        />
                        <span className="text-xs text-gray-500">mentions</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Campaign Preview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Funding Goal:</span>
                <span className="text-green-600 font-bold">
                  ${fundingGoal ? parseInt(fundingGoal).toLocaleString() : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Available Tiers:</span>
                <span>{perkTiers.length} tiers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant="secondary">Open for Sponsorship</Badge>
              </div>
            </div>
          </Card>
          
          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading || !title || !fundingGoal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
