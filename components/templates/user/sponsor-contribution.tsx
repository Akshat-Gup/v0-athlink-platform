"use client"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/button"
import { Input } from "../../atoms/input"
import { Card } from "../../molecules/card"
import { Badge } from "../../atoms/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../organisms/dialog"
import { Plus, DollarSign, Calendar, User } from "lucide-react"
import { useAuth } from "../../../hooks/use-auth"

interface Contribution {
  id: string
  amount: number
  description?: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

interface SponsorContributionProps {
  children?: React.ReactNode
}

export function SponsorContribution({ children }: SponsorContributionProps) {
  const { user, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  // Fetch contributions when component mounts or dialog opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchContributions()
    }
  }, [isOpen, isAuthenticated])

  const fetchContributions = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/sponsor/contributions')
      if (response.ok) {
        const data = await response.json()
        setContributions(data.contributions || [])
      }
    } catch (error) {
      console.error('Failed to fetch contributions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitContribution = async () => {
    if (!amount || !isAuthenticated) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/sponsor/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description.trim() || undefined
        }),
      })

      if (response.ok) {
        const newContribution = await response.json()
        setContributions(prev => [newContribution.contribution, ...prev])
        setAmount("")
        setDescription("")
      } else {
        console.error('Failed to add contribution')
      }
    } catch (error) {
      console.error('Error adding contribution:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const totalContributions = contributions.reduce((sum, contrib) => sum + contrib.amount, 0)

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please sign in to track your sponsor contributions.</p>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Manage Contributions
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Sponsor Contributions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Contributions</h3>
                <p className="text-3xl font-bold text-green-600">${totalContributions.toLocaleString()}</p>
                <p className="text-sm text-gray-600">from {contributions.length} contribution{contributions.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  Sponsor
                </Badge>
                <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
              </div>
            </div>
          </Card>

          {/* Add New Contribution */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Contribution
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter contribution amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this contribution for?"
                  maxLength={200}
                />
              </div>
              <Button 
                onClick={handleSubmitContribution}
                disabled={!amount || submitting}
                className="w-full"
              >
                {submitting ? "Adding..." : "Add Contribution"}
              </Button>
            </div>
          </Card>

          {/* Contributions List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contribution History</h3>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading contributions...</p>
              </div>
            ) : contributions.length === 0 ? (
              <Card className="p-8 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No contributions yet.</p>
                <p className="text-sm text-gray-500">Add your first contribution above to get started.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {contributions.map((contribution) => (
                  <Card key={contribution.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-600">
                            ${contribution.amount.toLocaleString()}
                          </p>
                          {contribution.description && (
                            <p className="text-sm text-gray-600">{contribution.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(contribution.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
