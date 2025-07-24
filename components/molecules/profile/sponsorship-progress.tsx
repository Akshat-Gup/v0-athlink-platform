import React from "react"
import { Progress } from "@/components/atoms/progress"
import { Badge } from "@/components/atoms/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/molecules/tooltip"
import { Card } from "@/components/molecules/card"
import { Lock, Unlock, Check } from "lucide-react"

interface SponsorshipPerk {
  id: number
  amount: number
  title: string
  description: string
  isUnlocked: boolean
  isYours?: boolean
  isCustom?: boolean
}

interface SponsorshipProgressProps {
  totalRequested: number
  currentFunding: number
  yourContribution: number
  perks: SponsorshipPerk[]
  className?: string
}

export function SponsorshipProgress({
  totalRequested,
  currentFunding,
  yourContribution,
  perks,
  className = ""
}: SponsorshipProgressProps) {
  const progressPercentage = Math.min((currentFunding / totalRequested) * 100, 100)
  const yourContributionPercentage = Math.min((yourContribution / totalRequested) * 100, 100)
  
  // Sort perks by amount for display
  const sortedPerks = [...perks].sort((a, b) => a.amount - b.amount)

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Progress Bar with Contribution Thumb */}
        <Card className="border-none shadow-none">
        
        {/* Amount Display */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-3xl font-bold text-gray-900">${currentFunding.toLocaleString()}</span>
          <span className="text-lg text-gray-600 font-medium">of ${totalRequested.toLocaleString()}</span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative mb-8 py-2">
          {/* Modern thin progress bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 transition-all duration-700 ease-out rounded-full shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
            
            {/* Your Contribution Thumb */}
            {yourContribution > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="absolute -top-1 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full cursor-pointer shadow-lg transform -translate-x-1/2 z-20 hover:scale-110 transition-transform duration-200"
                    style={{ left: `${yourContributionPercentage}%` }}
                  >
                    <div className="w-full h-full bg-emerald-500 rounded-full scale-75"></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="z-50" side="top" align="center" sideOffset={5}>
                  <p>Your contribution: ${yourContribution.toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Perk Markers */}
            {sortedPerks.map((perk) => {
              const perkPercentage = Math.min((perk.amount / totalRequested) * 100, 100)
              const isUnlockedByUser = yourContribution >= perk.amount // Based on user contribution
              const isYourPerk = perk.isYours
              
              return (
                <Tooltip key={perk.id}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`absolute -top-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm cursor-pointer z-10 transition-all duration-200 hover:scale-110 transform -translate-x-1/2 ${
                        isYourPerk 
                          ? 'bg-emerald-600' 
                          : isUnlockedByUser 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                      }`}
                      style={{ left: `${perkPercentage}%` }}
                    >
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="z-50" side="top" align="center" sideOffset={5}>
                    <div className="text-center">
                      <p className="font-medium">${perk.amount.toLocaleString()}</p>
                      <p className="text-sm">{perk.title}</p>
                      {isYourPerk && <p className="text-xs text-emerald-300">Your perk</p>}
                      {!isYourPerk && isUnlockedByUser && <p className="text-xs text-green-300">Unlocked by your contribution</p>}
                      {!isYourPerk && !isUnlockedByUser && <p className="text-xs text-gray-400">Contribute ${perk.amount.toLocaleString()} to unlock</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>

        {/* Your Contribution Display */}
        {yourContribution > 0 && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Your total contribution: <span className="font-semibold text-emerald-600">${yourContribution.toLocaleString()}</span></p>
          </div>
        )}
      </Card>

      {/* Sponsorship Packages
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sponsorship Packages</h3>
        <div className="space-y-3">
          {sortedPerks.map((perk) => {
            const isUnlockedByUser = yourContribution >= perk.amount
            const isYourPerk = perk.isYours
            
            return (
              <div
                key={perk.id}
                className={`p-4 border-2 rounded-xl transition-all ${
                  isYourPerk
                    ? 'border-black-500 bg-black-50'
                    : isUnlockedByUser
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-full ${
                      isYourPerk
                        ? 'bg-black-500'
                        : isUnlockedByUser
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                    }`}>
                      {isYourPerk ? (
                        <Check className="h-3 w-3 text-white" />
                      ) : isUnlockedByUser ? (
                        <Unlock className="h-3 w-3 text-white" />
                      ) : (
                        <Lock className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <h4 className={`font-semibold ${
                      isYourPerk ? 'text-black-900' : isUnlockedByUser ? 'text-green-900' : 'text-gray-600'
                    }`}>
                      {perk.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      isYourPerk
                        ? 'bg-black-100 text-black-800 border-black-300'
                        : isUnlockedByUser
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                    }>
                      ${perk.amount.toLocaleString()}
                    </Badge>
                    
                    {isYourPerk && (
                      <Badge className="bg-black-500 text-white text-xs">
                        {perk.isCustom ? 'Custom Terms' : 'Unlocked'}
                      </Badge>
                    )}
                    {!isYourPerk && isUnlockedByUser && (
                      <Badge className="bg-green-600 text-white text-xs">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className={`text-sm ${
                  isYourPerk ? 'text-black-700' : isUnlockedByUser ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {perk.description}
                </p>
              </div>
            )
          })}
        </div>
      </Card> */}
      </div>
    </TooltipProvider>
  )
}
