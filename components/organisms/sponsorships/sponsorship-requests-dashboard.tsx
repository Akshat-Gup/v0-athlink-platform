"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Card } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Textarea } from "@/components/atoms/textarea"
import { Check, X, Clock, Eye, MessageCircle, User, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sponsorshipEvents, SPONSORSHIP_EVENTS } from "@/lib/sponsorship-events"

interface SponsorshipRequest {
  id: number
  campaign_id: number
  sponsor_id: number
  athlete_id: number
  perk_tier_id?: number
  amount: number
  custom_perks?: string
  message?: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED"
  is_custom: boolean
  escrow_status: string
  created_at: string
  updated_at: string
  campaign: {
    id: number
    title: string
    description?: string
    funding_goal: number
    current_funding: number
    status: string
  }
  sponsor: {
    id: number
    name: string
    email: string
  }
  athlete: {
    id: number
    name: string
    email: string
  }
  perk_tier?: {
    id: number
    tier_name: string
    amount: number
    description: string
  }
}

interface SponsorshipRequestsDashboardProps {
  campaignId?: number
  userRole: "athlete" | "sponsor"
}

export function SponsorshipRequestsDashboard({ campaignId, userRole }: SponsorshipRequestsDashboardProps) {
  const [requests, setRequests] = useState<{ sent_requests: SponsorshipRequest[], received_requests: SponsorshipRequest[] }>({
    sent_requests: [],
    received_requests: []
  })
  const [selectedRequest, setSelectedRequest] = useState<SponsorshipRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [revisionModalOpen, setRevisionModalOpen] = useState(false)
  const [revisionAmount, setRevisionAmount] = useState("")
  const [revisionMessage, setRevisionMessage] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchSponsorshipRequests()
  }, [])

  const fetchSponsorshipRequests = async () => {
    try {
      const response = await fetch('/api/sponsorship-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching contribution requests:', error)
      toast({
        title: "Error",
        description: "Failed to load contribution requests",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestAction = async (requestId: number, action: "ACCEPTED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/sponsorship-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Sponsorship request ${action === "ACCEPTED" ? "accepted" : "rejected"} successfully`,
          variant: "default"
        })
        
        // Emit event to notify other components
        if (action === "ACCEPTED") {
          sponsorshipEvents.emit(SPONSORSHIP_EVENTS.REQUEST_APPROVED, { requestId })
        } else {
          sponsorshipEvents.emit(SPONSORSHIP_EVENTS.REQUEST_REJECTED, { requestId })
        }
        
        fetchSponsorshipRequests() // Refresh the list
      } else {
        throw new Error('Failed to update request')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action === "ACCEPTED" ? "accept" : "reject"} sponsorship request`,
        variant: "destructive"
      })
    }
  }

  const handleReviseRequest = async () => {
    if (!selectedRequest) return

    try {
      // Cancel the current request
      await fetch(`/api/sponsorship-requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "CANCELLED" })
      })

      // Create a new request with revised terms
      const response = await fetch('/api/sponsorship-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: selectedRequest.campaign_id,
          athlete_id: selectedRequest.athlete_id,
          amount: parseFloat(revisionAmount),
          custom_perks: selectedRequest.custom_perks,
          message: revisionMessage,
          is_custom: selectedRequest.is_custom
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Revised sponsorship request submitted successfully",
          variant: "default"
        })
        setRevisionModalOpen(false)
        setRevisionAmount("")
        setRevisionMessage("")
        fetchSponsorshipRequests()
      } else {
        throw new Error('Failed to submit revised request')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit revised request",
        variant: "destructive"
      })
    }
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "ACCEPTED":
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" /> Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800"><X className="h-3 w-3 mr-1" /> Rejected</Badge>
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const displayRequests = userRole === "athlete" ? requests.received_requests : requests.sent_requests

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {userRole === "athlete" ? "Sponsorship Requests" : "My Sponsorship Requests"}
        </h2>
        <Badge variant="outline" className="text-sm">
          {displayRequests.length} requests
        </Badge>
      </div>

      {displayRequests.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sponsorship requests
          </h3>
          <p className="text-gray-600">
            {userRole === "athlete" 
              ? "You haven't received any sponsorship requests yet."
              : "You haven't sent any sponsorship requests yet."
            }
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {displayRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{request.campaign.title}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {userRole === "athlete" ? "Sponsor:" : "Campaign Owner:"} {
                          userRole === "athlete" ? request.sponsor.name : request.athlete.name
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{formatCurrency(request.amount)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {request.message && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  )}

                  {request.is_custom && (
                    <Badge variant="outline" className="mb-4">Custom Terms</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Sponsorship Request Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Campaign</Label>
                          <p className="text-lg font-medium">{request.campaign.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Sponsor</Label>
                            <p>{request.sponsor.name}</p>
                            <p className="text-sm text-gray-600">{request.sponsor.email}</p>
                          </div>
                          <div>
                            <Label>Amount</Label>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(request.amount)}</p>
                          </div>
                        </div>
                        {request.message && (
                          <div>
                            <Label>Message</Label>
                            <p className="bg-gray-50 p-3 rounded-lg">{request.message}</p>
                          </div>
                        )}
                        {request.custom_perks && (
                          <div>
                            <Label>Custom Terms</Label>
                            <p className="bg-gray-50 p-3 rounded-lg">{request.custom_perks}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Action buttons based on user role and request status */}
                  {userRole === "athlete" && request.status === "PENDING" && (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleRequestAction(request.id, "ACCEPTED")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRequestAction(request.id, "REJECTED")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}

                  {userRole === "sponsor" && request.status === "REJECTED" && (
                    <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request)
                            setRevisionAmount(request.amount.toString())
                            setRevisionMessage(request.message || "")
                          }}
                        >
                          Revise
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Revise Sponsorship Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="revision-amount">New Amount ($)</Label>
                            <Input
                              id="revision-amount"
                              type="number"
                              value={revisionAmount}
                              onChange={(e) => setRevisionAmount(e.target.value)}
                              placeholder="Enter new amount"
                            />
                          </div>
                          <div>
                            <Label htmlFor="revision-message">Message</Label>
                            <Textarea
                              id="revision-message"
                              value={revisionMessage}
                              onChange={(e) => setRevisionMessage(e.target.value)}
                              placeholder="Add a message about your revised offer..."
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setRevisionModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleReviseRequest}
                              disabled={!revisionAmount || parseFloat(revisionAmount) <= 0}
                            >
                              Submit Revision
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
