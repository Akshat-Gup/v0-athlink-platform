"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Textarea } from '@/components/atoms/textarea'
import { Badge } from '@/components/atoms/badge'
import { Plus, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PerkTier {
  name: string
  description: string
  amount: string
  max_sponsors: string
  perks: string[]
}

interface CampaignData {
  title: string
  description: string
  goal_amount: string
  deadline: string
  profile_id: string
  profile_type: 'talent' | 'team' | 'event'
}

interface CampaignCreatorProps {
  profileId: string
  profileType: 'talent' | 'team' | 'event'
  onSuccess?: () => void
}

export function CampaignCreator({ profileId, profileType, onSuccess }: CampaignCreatorProps) {
  const [campaignData, setCampaignData] = useState<CampaignData>({
    title: '',
    description: '',
    goal_amount: '',
    deadline: '',
    profile_id: profileId,
    profile_type: profileType
  })

  const [perkTiers, setPerkTiers] = useState<PerkTier[]>([{
    name: '',
    description: '',
    amount: '',
    max_sponsors: '',
    perks: ['']
  }])

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addPerkTier = () => {
    setPerkTiers([...perkTiers, {
      name: '',
      description: '',
      amount: '',
      max_sponsors: '',
      perks: ['']
    }])
  }

  const removePerkTier = (index: number) => {
    if (perkTiers.length > 1) {
      setPerkTiers(perkTiers.filter((_, i) => i !== index))
    }
  }

  const updatePerkTier = (index: number, field: keyof PerkTier, value: string | string[]) => {
    const updated = [...perkTiers]
    updated[index] = { ...updated[index], [field]: value }
    setPerkTiers(updated)
  }

  const addPerk = (tierIndex: number) => {
    const updated = [...perkTiers]
    updated[tierIndex].perks.push('')
    setPerkTiers(updated)
  }

  const removePerk = (tierIndex: number, perkIndex: number) => {
    const updated = [...perkTiers]
    if (updated[tierIndex].perks.length > 1) {
      updated[tierIndex].perks.splice(perkIndex, 1)
      setPerkTiers(updated)
    }
  }

  const updatePerk = (tierIndex: number, perkIndex: number, value: string) => {
    const updated = [...perkTiers]
    updated[tierIndex].perks[perkIndex] = value
    setPerkTiers(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!campaignData.title || !campaignData.description || !campaignData.goal_amount || !campaignData.deadline) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      // Validate perk tiers
      for (const tier of perkTiers) {
        if (!tier.name || !tier.description || !tier.amount) {
          toast({
            title: "Error",
            description: "Please fill in all perk tier fields",
            variant: "destructive"
          })
          return
        }
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaignData,
          goal_amount: parseFloat(campaignData.goal_amount),
          deadline: new Date(campaignData.deadline).toISOString(),
          perk_tiers: perkTiers.map(tier => ({
            ...tier,
            amount: parseFloat(tier.amount),
            max_sponsors: tier.max_sponsors ? parseInt(tier.max_sponsors) : null,
            perks: tier.perks.filter(perk => perk.trim() !== '')
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create campaign')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: "Campaign created successfully!"
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/campaigns/${result.campaign.id}`)
      }

    } catch (error) {
      console.error('Error creating campaign:', error)
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Fundraising Campaign</CardTitle>
          <CardDescription>
            Create a campaign to raise funds with custom perk tiers for sponsors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                placeholder="Enter campaign title"
                value={campaignData.title}
                onChange={(e) => setCampaignData({ ...campaignData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal_amount">Goal Amount ($) *</Label>
              <Input
                id="goal_amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="5000"
                value={campaignData.goal_amount}
                onChange={(e) => setCampaignData({ ...campaignData, goal_amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your campaign, goals, and how the funds will be used..."
              value={campaignData.description}
              onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Campaign Deadline *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={campaignData.deadline}
              onChange={(e) => setCampaignData({ ...campaignData, deadline: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Perk Tiers</CardTitle>
              <CardDescription>
                Create different sponsorship tiers with unique perks and benefits
              </CardDescription>
            </div>
            <Button type="button" onClick={addPerkTier} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {perkTiers.map((tier, tierIndex) => (
            <Card key={tierIndex} className="border-dashed">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Tier {tierIndex + 1}</Badge>
                  {perkTiers.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removePerkTier(tierIndex)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tier Name *</Label>
                    <Input
                      placeholder="Bronze Sponsor"
                      value={tier.name}
                      onChange={(e) => updatePerkTier(tierIndex, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sponsorship Amount ($) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="100"
                      value={tier.amount}
                      onChange={(e) => updatePerkTier(tierIndex, 'amount', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tier Description *</Label>
                  <Textarea
                    placeholder="Describe this sponsorship tier..."
                    value={tier.description}
                    onChange={(e) => updatePerkTier(tierIndex, 'description', e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Sponsors (optional)</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Leave empty for unlimited"
                    value={tier.max_sponsors}
                    onChange={(e) => updatePerkTier(tierIndex, 'max_sponsors', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Perks & Benefits</Label>
                    <Button
                      type="button"
                      onClick={() => addPerk(tierIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Perk
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {tier.perks.map((perk, perkIndex) => (
                      <div key={perkIndex} className="flex gap-2">
                        <Input
                          placeholder="Social media shoutout"
                          value={perk}
                          onChange={(e) => updatePerk(tierIndex, perkIndex, e.target.value)}
                        />
                        {tier.perks.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removePerk(tierIndex, perkIndex)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  )
}
