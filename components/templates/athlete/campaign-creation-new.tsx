"use client"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/button"
import { Input } from "../../atoms/input"
import { Card } from "../../molecules/card"
import { Badge } from "../../atoms/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../organisms/dialog"
import { Plus, Target, Calendar, DollarSign, Trophy, Instagram, Twitter, Youtube, Trash2 } from "lucide-react"
import { useAuth } from "../../../hooks/use-auth"
import { useToast } from "../../../hooks/use-toast"

interface PerkTier {
  id?: number
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
  editCampaign?: {
    id: number
    title: string
    description?: string
    funding_goal: number
    deadline?: string
    perk_tiers: PerkTier[]
  } | null
}

export function CampaignCreation({ children, onCampaignCreated, editCampaign }: CampaignCreationProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Campaign form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fundingGoal, setFundingGoal] = useState("")
  const [deadline, setDeadline] = useState("")
  const [perkTiers, setPerkTiers] = useState<PerkTier[]>([
    {
      tier_name: "Supporter",
      amount: 100,
      description: "Basic support with social media shoutout",
      deliverables: {
        instagram_ads: 1,
        twitter_posts: 1
      },
      max_sponsors: 20
    },
    {
      tier_name: "Training Partner",
      amount: 500,
      description: "Enhanced support with multiple platform mentions",
      deliverables: {
        instagram_ads: 2,
        twitter_posts: 3
      },
      max_sponsors: 10
    },
    {
      tier_name: "Competition Sponsor",
      amount: 1500,
      description: "Premium sponsorship with event promotion",
      deliverables: {
        instagram_ads: 3,
        twitter_posts: 5,
        youtube_mentions: 1
      },
      max_sponsors: 5
    },
    {
      tier_name: "Elite Partner",
      amount: 5000,
      description: "Ultimate partnership with comprehensive promotion",
      deliverables: {
        instagram_ads: 5,
        twitter_posts: 10,
        youtube_mentions: 2,
        custom: "Personal training session, meet & greet"
      },
      max_sponsors: 2
    }
  ])

  const isEditMode = !!editCampaign

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      if (editCampaign) {
        // Populate form with edit data
        setTitle(editCampaign.title || "")
        setDescription(editCampaign.description || "")
        setFundingGoal(editCampaign.funding_goal?.toString() || "")
        setDeadline(editCampaign.deadline ? editCampaign.deadline.split('T')[0] : "")
        
        // Process perk tiers from database
        if (editCampaign.perk_tiers && editCampaign.perk_tiers.length > 0) {
          const processedTiers = editCampaign.perk_tiers.map(tier => {
            let deliverables = { instagram_ads: 0, twitter_posts: 0, youtube_mentions: 0, custom: '' }
            
            if (typeof tier.deliverables === 'string') {
              try {
                const parsed = JSON.parse(tier.deliverables)
                if (Array.isArray(parsed)) {
                  deliverables.custom = parsed.join(', ')
                } else {
                  deliverables = { ...deliverables, ...parsed }
                }
              } catch (e) {
                deliverables.custom = tier.deliverables
              }
            } else {
              deliverables = { ...deliverables, ...tier.deliverables }
            }
            
            return {
              id: tier.id,
              tier_name: tier.tier_name,
              amount: tier.amount,
              description: tier.description,
              deliverables,
              max_sponsors: tier.max_sponsors
            }
          })
          setPerkTiers(processedTiers)
        }
      } else {
        // Reset to default state for new campaign
        setTitle("")
        setDescription("")
        setFundingGoal("")
        setDeadline("")
        setPerkTiers([
          {
            tier_name: "Supporter",
            amount: 100,
            description: "Basic support with social media shoutout",
            deliverables: {
              instagram_ads: 1,
              twitter_posts: 1
            },
            max_sponsors: 20
          },
          {
            tier_name: "Training Partner",
            amount: 500,
            description: "Enhanced support with multiple platform mentions",
            deliverables: {
              instagram_ads: 2,
              twitter_posts: 3
            },
            max_sponsors: 10
          },
          {
            tier_name: "Competition Sponsor",
            amount: 1500,
            description: "Premium sponsorship with event promotion",
            deliverables: {
              instagram_ads: 3,
              twitter_posts: 5,
              youtube_mentions: 1
            },
            max_sponsors: 5
          },
          {
            tier_name: "Elite Partner",
            amount: 5000,
            description: "Ultimate partnership with comprehensive promotion",
            deliverables: {
              instagram_ads: 5,
              twitter_posts: 10,
              youtube_mentions: 2,
              custom: "Personal training session, meet & greet"
            },
            max_sponsors: 2
          }
        ])
      }
    }
  }, [isOpen, editCampaign])

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

    if (perkTiers.length === 0) {
      toast({
        title: "Missing Sponsorship Tiers",
        description: "Please add at least one sponsorship tier.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const url = isEditMode ? `/api/campaigns/${editCampaign.id}` : '/api/campaigns'
      const method = isEditMode ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          funding_goal: parseFloat(fundingGoal),
          deadline: deadline ? new Date(deadline).toISOString() : null,
          perk_tiers: perkTiers.map(tier => ({
            tier_name: tier.tier_name,
            amount: tier.amount,
            description: tier.description,
            deliverables: tier.deliverables,
            max_sponsors: tier.max_sponsors
          }))
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: isEditMode ? "Campaign Updated!" : "Campaign Created!",
          description: isEditMode 
            ? "Your sponsorship campaign has been successfully updated."
            : "Your sponsorship campaign is now live and open for sponsors.",
        })
        
        setIsOpen(false)
        onCampaignCreated?.(result.campaign)
      } else {
        const error = await response.json()
        toast({
          title: isEditMode ? "Error Updating Campaign" : "Error Creating Campaign",
          description: error.error || "Something went wrong. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error with campaign:', error)
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update campaign. Please try again." : "Failed to create campaign. Please try again.",
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

  const addPerkTier = () => {
    const newTier: PerkTier = {
      tier_name: `Tier ${perkTiers.length + 1}`,
      amount: 1000,
      description: "Custom sponsorship tier",
      deliverables: {
        instagram_ads: 1,
        twitter_posts: 1
      },
      max_sponsors: 5
    }
    setPerkTiers([...perkTiers, newTier])
  }

  const removePerkTier = (index: number) => {
    if (perkTiers.length > 1) {
      const updated = perkTiers.filter((_, i) => i !== index)
      setPerkTiers(updated)
    }
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
            {isEditMode ? 'Edit Sponsorship Campaign' : 'Create Sponsorship Campaign'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Campaign Info */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Campaign Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Support My Olympic Training"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell sponsors about your goals and what this funding will help you achieve..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Funding Goal
                  </label>
                  <Input
                    type="number"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    placeholder="10000"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Deadline (Optional)
                  </label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Sponsorship Tiers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Sponsorship Tiers</h3>
              <Button onClick={addPerkTier} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </div>

            <div className="space-y-4">
              {perkTiers.map((tier, index) => (
                <Card key={index} className="p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">Tier {index + 1}</Badge>
                    {perkTiers.length > 1 && (
                      <Button
                        onClick={() => removePerkTier(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tier Name</label>
                      <Input
                        value={tier.tier_name}
                        onChange={(e) => updatePerkTier(index, 'tier_name', e.target.value)}
                        placeholder="e.g., Bronze Supporter"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Amount ($)</label>
                      <Input
                        type="number"
                        value={tier.amount}
                        onChange={(e) => updatePerkTier(index, 'amount', parseInt(e.target.value) || 0)}
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input
                      value={tier.description}
                      onChange={(e) => updatePerkTier(index, 'description', e.target.value)}
                      placeholder="What benefits will sponsors receive?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Sponsors</label>
                      <Input
                        type="number"
                        value={tier.max_sponsors || ''}
                        onChange={(e) => updatePerkTier(index, 'max_sponsors', parseInt(e.target.value) || null)}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Deliverables</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm mb-2">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          Instagram Posts
                        </label>
                        <Input
                          type="number"
                          value={tier.deliverables.instagram_ads || ''}
                          onChange={(e) => updateDeliverables(index, 'instagram_ads', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm mb-2">
                          <Twitter className="h-4 w-4 text-blue-400" />
                          Twitter Posts
                        </label>
                        <Input
                          type="number"
                          value={tier.deliverables.twitter_posts || ''}
                          onChange={(e) => updateDeliverables(index, 'twitter_posts', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm mb-2">
                          <Youtube className="h-4 w-4 text-red-600" />
                          YouTube Mentions
                        </label>
                        <Input
                          type="number"
                          value={tier.deliverables.youtube_mentions || ''}
                          onChange={(e) => updateDeliverables(index, 'youtube_mentions', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-2">Custom Deliverables</label>
                      <Input
                        value={tier.deliverables.custom || ''}
                        onChange={(e) => updateDeliverables(index, 'custom', e.target.value)}
                        placeholder="e.g., Logo on equipment, meet & greet"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : (isEditMode ? "Update Campaign" : "Create Campaign")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
