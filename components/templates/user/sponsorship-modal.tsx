import React, { useState } from "react"
import { Button } from "@/components/atoms/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Checkbox } from "@/components/atoms/checkbox"
import { Card } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { Progress } from "@/components/atoms/progress"
import { Heart, Trophy, Star, Gift } from "lucide-react"

export type SponsorshipTarget = "talent" | "event" | "team"

interface SponsorshipPerk {
  id: number
  amount: number
  title: string
  description: string
  isUnlocked: boolean
  isCustom?: boolean
}

interface SponsorshipData {
  targetId: number
  targetType: SponsorshipTarget
  targetName: string
  targetImage?: string
  totalRequested: number
  currentFunding: number
  yourContribution: number
  perks: SponsorshipPerk[]
  yourPerks: SponsorshipPerk[]
}

interface SponsorshipModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  sponsorshipData: SponsorshipData
  onSponsor: (amount: number, selectedPerks: number[], customConditions?: string) => void
  children: React.ReactNode
}

export function SponsorshipModal({ 
  isOpen, 
  onOpenChange, 
  sponsorshipData, 
  onSponsor, 
  children 
}: SponsorshipModalProps) {
  const [contributionAmount, setContributionAmount] = useState<string>("")
  const [selectedPerks, setSelectedPerks] = useState<number[]>([])
  const [customConditions, setCustomConditions] = useState<string>("")
  const [showCustomConditions, setShowCustomConditions] = useState(false)

  const remainingNeeded = sponsorshipData.totalRequested - sponsorshipData.currentFunding
  const progressPercentage = (sponsorshipData.currentFunding / sponsorshipData.totalRequested) * 100
  const yourContributionPercentage = (sponsorshipData.yourContribution / sponsorshipData.totalRequested) * 100

  const handlePerkToggle = (perkId: number) => {
    setSelectedPerks(prev => 
      prev.includes(perkId) 
        ? prev.filter(id => id !== perkId)
        : [...prev, perkId]
    )
  }

  const handleSponsor = () => {
    const amount = parseFloat(contributionAmount)
    if (amount > 0) {
      onSponsor(amount, selectedPerks, customConditions || undefined)
      setContributionAmount("")
      setSelectedPerks([])
      setCustomConditions("")
      onOpenChange(false)
    }
  }

  const availablePerks = sponsorshipData.perks.filter(perk => 
    perk.amount <= (sponsorshipData.yourContribution + parseFloat(contributionAmount || "0"))
  )

  const getTargetIcon = () => {
    switch (sponsorshipData.targetType) {
      case "talent":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "event":
        return <Trophy className="h-5 w-5 text-emerald-500" />
      case "team":
        return <Heart className="h-5 w-5 text-red-500" />
      default:
        return <Gift className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
            {getTargetIcon()}
            Sponsor {sponsorshipData.targetName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Funding Information */}
          <div className="space-y-6">
            {/* Funding Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Funding Overview</h3>
              <div className="space-y-4">
                <div className="relative">
                  {/* Modern thin progress bar */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 transition-all duration-700 ease-out rounded-full shadow-sm"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  {/* Your contribution thumb */}
                  {sponsorshipData.yourContribution > 0 && (
                    <div 
                      className="absolute -top-1 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-lg transform -translate-x-1/2 z-10"
                      style={{ left: `${yourContributionPercentage}%` }}
                      title={`Your contribution: $${sponsorshipData.yourContribution.toLocaleString()}`}
                    >
                      <div className="w-full h-full bg-emerald-500 rounded-full scale-75"></div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Requested</p>
                    <p className="font-semibold text-lg">${sponsorshipData.totalRequested.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Funding</p>
                    <p className="font-semibold text-lg text-green-600">${sponsorshipData.currentFunding.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining Needed</p>
                    <p className="font-semibold text-lg text-red-600">${remainingNeeded.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-gray-600">Your Total Contribution</p>
                  <p className="font-semibold text-xl text-emerald-600">${sponsorshipData.yourContribution.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Your Current Perks */}
            {sponsorshipData.yourPerks.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Current Perks</h3>
                <div className="space-y-3">
                  {sponsorshipData.yourPerks.map((perk) => (
                    <div key={perk.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-emerald-900">{perk.title}</h4>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                          ${perk.amount.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-emerald-700">{perk.description}</p>
                      {perk.isCustom && (
                        <Badge variant="outline" className="mt-2 bg-purple-100 text-purple-800">
                          Custom Terms
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Contribution Input */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Make a Contribution</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contribution">Contribution Amount</Label>
                  <Input
                    id="contribution"
                    type="number"
                    placeholder="Enter amount"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-conditions"
                    checked={showCustomConditions}
                    onCheckedChange={(checked) => setShowCustomConditions(checked === true)}
                  />
                  <Label htmlFor="custom-conditions">Add custom conditions</Label>
                </div>

                {showCustomConditions && (
                  <div>
                    <Label htmlFor="conditions">Custom Conditions</Label>
                    <textarea
                      id="conditions"
                      placeholder="Describe any custom conditions or requirements..."
                      value={customConditions}
                      onChange={(e) => setCustomConditions(e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Available Perks */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Available Sponsorship Packages</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sponsorshipData.perks.map((perk) => {
                  const isAvailable = availablePerks.some(p => p.id === perk.id)
                  const isSelected = selectedPerks.includes(perk.id)
                  
                  return (
                    <div
                      key={perk.id}
                      className={`p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50"
                          : isAvailable
                            ? "border-green-500 bg-green-50 hover:bg-green-100"
                            : "border-gray-200 bg-gray-50"
                      }`}
                      onClick={() => isAvailable && handlePerkToggle(perk.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-medium ${
                          isSelected ? "text-emerald-900" : isAvailable ? "text-green-900" : "text-gray-600"
                        }`}>
                          {perk.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            isSelected 
                              ? "bg-emerald-100 text-emerald-800" 
                              : isAvailable 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-600"
                          }>
                            ${perk.amount.toLocaleString()}
                          </Badge>
                          {isAvailable && (
                            <Badge className="bg-green-500 text-white text-xs">
                              {isSelected ? "Selected" : "Unlocked"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${
                        isSelected ? "text-emerald-700" : isAvailable ? "text-green-700" : "text-gray-500"
                      }`}>
                        {perk.description}
                      </p>
                      {!isAvailable && (
                        <p className="text-xs text-gray-500 mt-1">
                          Requires total contribution of ${perk.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSponsor}
            disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Contribute ${contributionAmount ? parseFloat(contributionAmount).toLocaleString() : "0"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
