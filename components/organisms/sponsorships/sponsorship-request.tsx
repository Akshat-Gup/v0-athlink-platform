"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { Textarea } from '@/components/atoms/textarea'
import { Badge } from '@/components/atoms/badge'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group'
import { Checkbox } from '@/components/atoms/checkbox'
import { DollarSign, Gift, MessageSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PerkTier {
  id: string
  name: string
  description: string
  amount: number
  max_sponsors: number | null
  current_sponsors: number
  perks: string[]
}

interface SponsorshipRequestProps {
  campaignId: string
  perkTiers: PerkTier[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function SponsorshipRequest({ 
  campaignId, 
  perkTiers, 
  onSuccess, 
  onCancel 
}: SponsorshipRequestProps) {
  const [requestType, setRequestType] = useState<'predefined' | 'custom'>('predefined')
  const [selectedTierId, setSelectedTierId] = useState<string>('')
  const [customAmount, setCustomAmount] = useState('')
  const [customTerms, setCustomTerms] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const selectedTier = perkTiers.find(tier => tier.id === selectedTierId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (requestType === 'predefined' && !selectedTierId) {
        toast({
          title: "Error",
          description: "Please select a sponsorship tier",
          variant: "destructive"
        })
        return
      }

      if (requestType === 'custom') {
        if (!customAmount || !customTerms) {
          toast({
            title: "Error",
            description: "Please fill in amount and terms for custom sponsorship",
            variant: "destructive"
          })
          return
        }
      }

      const requestData = {
        campaign_id: campaignId,
        type: requestType,
        ...(requestType === 'predefined' ? {
          perk_tier_id: selectedTierId,
          amount: selectedTier?.amount.toString()
        } : {
          amount: customAmount,
          custom_terms: customTerms
        }),
        ...(message && { message })
      }

      const response = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit sponsorship request')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: result.auto_accepted 
          ? "Sponsorship request accepted automatically!" 
          : "Sponsorship request submitted successfully!",
      })

      if (onSuccess) {
        onSuccess()
      }

    } catch (error) {
      console.error('Error submitting sponsorship request:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const availableTiers = perkTiers.filter(tier => 
    !tier.max_sponsors || tier.current_sponsors < tier.max_sponsors
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Submit Sponsorship Request
        </CardTitle>
        <CardDescription>
          Choose a predefined tier or propose custom sponsorship terms
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Sponsorship Type</Label>
            <RadioGroup
              value={requestType}
              onValueChange={(value) => setRequestType(value as 'predefined' | 'custom')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="predefined" id="predefined" />
                <Label htmlFor="predefined">Choose from predefined tiers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Propose custom terms</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Predefined Tiers */}
          {requestType === 'predefined' && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Sponsorship Tier</Label>
              
              {availableTiers.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-gray-500">
                    <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No available sponsorship tiers</p>
                    <p className="text-sm">All tiers are currently full or unavailable</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {availableTiers.map((tier) => (
                    <Card 
                      key={tier.id}
                      className={`cursor-pointer transition-all ${
                        selectedTierId === tier.id 
                          ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTierId(tier.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{tier.name}</h3>
                              <Badge variant="outline" className="text-sm">
                                ${tier.amount}
                              </Badge>
                              {tier.max_sponsors && (
                                <Badge variant="secondary" className="text-xs">
                                  {tier.current_sponsors}/{tier.max_sponsors} taken
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                            
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-700">Perks included:</div>
                              <ul className="text-sm text-gray-600">
                                {tier.perks.slice(0, 3).map((perk, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    {perk}
                                  </li>
                                ))}
                                {tier.perks.length > 3 && (
                                  <li className="text-xs text-gray-500 ml-4">
                                    +{tier.perks.length - 3} more perks
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <Checkbox 
                              checked={selectedTierId === tier.id}
                              onChange={() => setSelectedTierId(tier.id)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom Terms */}
          {requestType === 'custom' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customAmount">Sponsorship Amount ($) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="customAmount"
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="1000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customTerms">Proposed Terms & Benefits *</Label>
                <Textarea
                  id="customTerms"
                  placeholder="Describe what you're offering in return for this sponsorship (e.g., logo placement, social media mentions, event naming rights, etc.)"
                  value={customTerms}
                  onChange={(e) => setCustomTerms(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>
          )}

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (optional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Textarea
                id="message"
                placeholder="Add a personal message to the campaign organizer..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="pl-10"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading || (requestType === 'predefined' && availableTiers.length === 0)}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Component for displaying sponsorship requests (for campaign owners)
interface SponsorshipRequestListProps {
  campaignId: string
  onRequestUpdate?: () => void
}

export function SponsorshipRequestList({ campaignId, onRequestUpdate }: SponsorshipRequestListProps) {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/sponsorships?campaign_id=${campaignId}`)
      if (!response.ok) throw new Error('Failed to fetch requests')
      
      const data = await response.json()
      setRequests(data.sponsorships)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/sponsorships/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'accept' ? 'accepted' : 'rejected' })
      })

      if (!response.ok) throw new Error(`Failed to ${action} request`)

      toast({
        title: "Success",
        description: `Sponsorship request ${action}ed successfully`
      })

      fetchRequests()
      onRequestUpdate?.()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} request`,
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div>Loading requests...</div>
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No sponsorship requests yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">${request.amount}</Badge>
                  <Badge className={
                    request.status === 'pending' ? 'bg-yellow-500' :
                    request.status === 'accepted' ? 'bg-green-500' :
                    'bg-red-500'
                  }>
                    {request.status}
                  </Badge>
                </div>
                
                {request.type === 'custom' && request.custom_terms && (
                  <p className="text-sm text-gray-600 mb-2">{request.custom_terms}</p>
                )}
                
                {request.message && (
                  <p className="text-sm italic text-gray-500">&ldquo;{request.message}&rdquo;</p>
                )}
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    onClick={() => handleRequestAction(request.id, 'accept')}
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRequestAction(request.id, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
