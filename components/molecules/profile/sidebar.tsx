import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/molecules/card"
import { Instagram, Twitter, Youtube, Facebook, ExternalLink } from "lucide-react"
import React from "react"

interface Checkpoint {
  amount: number
  reward: string
  unlocked: boolean
}

interface SidebarSponsorshipProps {
  currentFunding?: number
  goalFunding?: number
  checkpoints?: Checkpoint[]
  renderProgressBar: (current: number, goal: number) => React.ReactNode
  title?: string
  subtitle?: string
  submitButtonText?: string
}

export function SidebarSponsorship({ currentFunding = 0, goalFunding = 0, checkpoints = [], renderProgressBar, title = "Sponsorship", subtitle = "Milestones", submitButtonText = "Submit" }: SidebarSponsorshipProps) {
  if (!checkpoints || checkpoints.length === 0) {
    return (
      <Card className="p-6 shadow-xl border-0">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 shadow-xl border-0">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {renderProgressBar(currentFunding, goalFunding)}
      <div className="mt-6 space-y-3">
        <h4 className="font-medium text-sm">{subtitle}</h4>
        {checkpoints.map((checkpoint, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              checkpoint.unlocked 
                ? "bg-green-50 border-green-200" 
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">${checkpoint.amount?.toLocaleString() || 0}</span>
              {checkpoint.unlocked && <Badge className="bg-green-500">Unlocked</Badge>}
            </div>
            <p className="text-xs text-gray-600">{checkpoint.reward || "No reward information"}</p>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">{submitButtonText}</Button>
    </Card>
  )
}

interface Socials {
  instagram?: string
  twitter?: string
  youtube?: string
  facebook?: string
}

interface SidebarSocialsProps {
  socials?: Socials
  title?: string
}

export function SidebarSocials({ socials = {}, title = "Social Media" }: SidebarSocialsProps) {
  const hasSocials = socials && Object.values(socials).some(social => social);
  
  if (!hasSocials) {
    return (
      <Card className="p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-4 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {socials.instagram && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-500" />
              <span className="text-sm">{socials.instagram}</span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        )}
        {socials.twitter && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Twitter className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{socials.twitter}</span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        )}
        {socials.youtube && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-500" />
              <span className="text-sm">{socials.youtube}</span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        )}
        {socials.facebook && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{socials.facebook}</span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    </Card>
  )
}
