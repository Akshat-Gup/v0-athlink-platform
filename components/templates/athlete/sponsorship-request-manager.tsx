"use client"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/button"
import { Card } from "../../molecules/card"
import { Badge } from "../../atoms/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../organisms/dialog"
import { CheckCircle, XCircle, DollarSign, Calendar, User, MessageSquare, Eye } from "lucide-react"
import { useAuth } from "../../../hooks/use-auth"
import { useToast } from "../../../hooks/use-toast"

interface SponsorshipRequest {
  id: number
  campaign_id: number
  amount: number
  custom_perks?: string
  message?: string
  status: string
  is_custom: boolean
  escrow_status: string
  created_at: string
  campaign: {
    title: string
  }
  sponsor: {
    name: string
    email: string
  }
  perk_tier?: {
    tier_name: string
    description: string
  }
}

export function SponsorshipRequestManager() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<SponsorshipRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SponsorshipRequest | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests()
    }
  }, [isAuthenticated])

  const fetchRequests = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/sponsorship-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data.received_requests)
      }
    } catch (error) {
      console.error('Failed to fetch sponsorship requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestResponse = async (requestId: number, action: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/sponsorship-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      })

      if (response.ok) {
        setRequests(prev => 
          prev.map(request => 
            request.id === requestId 
              ? { ...request, status: action }
              : request
          )
        )
        
        toast({
          title: action === 'ACCEPTED' ? "Request Accepted!" : "Request Rejected",
          description: action === 'ACCEPTED' 
            ? "Funds have been released from escrow and added to your campaign."
            : "The sponsor has been notified of your decision.",
        })
        
        setSelectedRequest(null)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update request.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast({
        title: "Error",
        description: "Failed to update request. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDeliverables = (request: SponsorshipRequest) => {
    if (request.is_custom && request.custom_perks) {
      return request.custom_perks
    }
    if (request.perk_tier) {
      return request.perk_tier.description
    }
    return 'Standard sponsorship package'
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please sign in to view sponsorship requests.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading sponsorship requests...</p>
      </div>
    )
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING')
  const otherRequests = requests.filter(r => r.status !== 'PENDING')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Sponsorship Requests</h2>
        <Badge variant="secondary">
          {pendingRequests.length} pending
        </Badge>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-yellow-600">⏳ Pending Approval</h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">
                        ${request.amount.toLocaleString()} Sponsorship
                      </h4>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      {request.is_custom && (
                        <Badge variant="outline">Custom Offer</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>From: <span className="font-medium">{request.sponsor.name}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Campaign: <span className="font-medium">{request.campaign.title}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Received: {new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">What they want:</span> {formatDeliverables(request)}
                      </p>
                    </div>

                    {request.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Message from sponsor:</p>
                            <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRequestResponse(request.id, 'ACCEPTED')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequestResponse(request.id, 'REJECTED')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Requests */}
      {otherRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">📋 Request History</h3>
          <div className="space-y-3">
            {otherRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-medium">${request.amount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">from {request.sponsor.name}</span>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    {request.is_custom && (
                      <Badge variant="outline">Custom</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <Card className="p-8 text-center">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sponsorship requests yet</h3>
          <p className="text-gray-600">
            Create a campaign to start receiving sponsorship offers from supporters.
          </p>
        </Card>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Sponsorship Request Details
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Amount</h4>
                  <p className="text-2xl font-bold text-green-600">
                    ${selectedRequest.amount.toLocaleString()}
                  </p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Sponsor</h4>
                  <p className="font-medium">{selectedRequest.sponsor.name}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.sponsor.email}</p>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-2">Campaign</h4>
                <p>{selectedRequest.campaign.title}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Deliverables</h4>
                <Card className="p-4 bg-gray-50">
                  <p>{formatDeliverables(selectedRequest)}</p>
                </Card>
              </div>

              {selectedRequest.message && (
                <div>
                  <h4 className="font-medium mb-2">Message from Sponsor</h4>
                  <Card className="p-4 bg-blue-50">
                    <p>{selectedRequest.message}</p>
                  </Card>
                </div>
              )}

              {selectedRequest.status === 'PENDING' && (
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleRequestResponse(selectedRequest.id, 'REJECTED')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                  <Button
                    onClick={() => handleRequestResponse(selectedRequest.id, 'ACCEPTED')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Request
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
