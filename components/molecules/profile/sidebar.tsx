import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/molecules/card"
import { Instagram, Twitter, Youtube, Facebook, ExternalLink, Edit, Plus } from "lucide-react"
import React, { useState, useEffect } from "react"
import { SponsorshipModal } from "@/components/templates/user/sponsorship-modal"
import { SponsorshipProgress } from "@/components/molecules/profile/sponsorship-progress"
import { CampaignCreation } from "@/components/templates/athlete/campaign-creation"
import { useUserRole } from "@/hooks/use-user-role"
import { useSponsorshipData } from "@/hooks/use-sponsorship-data"
import { useCampaignData } from "@/hooks/use-campaign-data"
import { useAuth } from "@/hooks/use-auth"
import { Session } from "next-auth"

interface Checkpoint {
  amount: number
  reward: string
  description?: string
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
  profileId?: string
  profileType?: "talent" | "event" | "team"
  session?: Session | null
  profileOwnerId?: string | number // ID of the profile owner to check ownership
  campaignData?: {
    id: number
    title: string
    description: string
    funding_goal: number
    current_funding: number
    deadline?: string
    perk_tiers: Array<{
      tier_name: string
      amount: number
      description: string
      deliverables: any
      max_sponsors: number
    }>
  } // Campaign data for this profile (for visitors viewing someone else's profile)
  onCampaignUpdated?: () => void // Callback to refresh campaign data
}

export function SidebarSponsorship({ 
  currentFunding = 0, 
  goalFunding = 0, 
  checkpoints = [], 
  renderProgressBar, 
  title = "Sponsorship", 
  subtitle = "Milestones", 
  submitButtonText = "Submit",
  profileId = "",
  profileType = "talent",
  session = null,
  profileOwnerId = undefined,
  campaignData = null,
  onCampaignUpdated
}: SidebarSponsorshipProps) {
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false)
  const { selectedUserRole } = useUserRole()
  const { user } = useAuth()
  const { getTotalContributionForTarget, addContribution } = useSponsorshipData()
  const { getUserActiveCampaign, fetchUserCampaigns } = useCampaignData()
  
  const isSponsor = selectedUserRole === "Sponsor"
  
  // Check if the current user is the owner of this profile
  const isProfileOwner = session?.user?.email && (
    session.user.email === profileOwnerId || 
    session.user.id === profileOwnerId ||
    user?.email === profileOwnerId ||
    user?.id === profileOwnerId
  )
  
  // Get user's active campaign for editing (only for profile owners)
  const activeCampaign = isProfileOwner ? getUserActiveCampaign() : null
  
  // Use the provided campaign data (for visitors) or the user's own campaign (for owners)
  const displayCampaign = campaignData || activeCampaign
  
  // Use campaign data if available, otherwise fall back to props
  const campaignCheckpoints = displayCampaign?.perk_tiers?.map(tier => ({
    amount: tier.amount,
    reward: tier.tier_name,
    description: tier.description,
    unlocked: false // Will be determined by user contribution
  })) || []
  
  const campaignGoal = displayCampaign?.funding_goal || goalFunding
  const campaignCurrent = displayCampaign?.current_funding || currentFunding
  
  // Use campaign checkpoints if available, otherwise use props
  const finalCheckpoints = campaignCheckpoints.length > 0 ? campaignCheckpoints : checkpoints

  // Refresh campaigns after campaign creation/update
  const handleCampaignUpdated = async (campaign: any) => {
    await fetchUserCampaigns() // Refresh user campaigns
    onCampaignUpdated?.() // Call parent refresh function
  }
  
  // Get user's contribution for this specific profile (not mock data)
  const userContribution = getTotalContributionForTarget(Number(profileId) || 1, profileType)
  
  // Check if this profile has campaign data
  const hasCampaignData = finalCheckpoints && finalCheckpoints.length > 0 && campaignGoal > 0
  if (!hasCampaignData && !isProfileOwner) {
    return (
      <Card className="p-6 shadow-xl border-0">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Information unavailable</p>
        </div>
      </Card>
    )
  }

  if (!hasCampaignData && isProfileOwner) {
    return (
      <Card className="p-6 shadow-xl border-0">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No campaign set up yet</p>
          <p className="text-sm text-gray-400 mb-6">Create a sponsorship campaign to attract sponsors and showcase your goals.</p>
          
          {/* Campaign Creation Modal */}
          <CampaignCreation onCampaignCreated={handleCampaignUpdated}>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CampaignCreation>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 shadow-xl border-0">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {/* Campaign Title and Description */}
      {displayCampaign && (
        <div className="pb-4">
          <h4 className="font-semibold text-black-900 mb-2">{displayCampaign.title}</h4>
          {displayCampaign.description && (
            <p className="text-sm text-black-800 leading-relaxed">{displayCampaign.description}</p>
          )}
        </div>
      )}
      
      {/* Enhanced Progress Bar with Sponsorship Progress Component */}
      <SponsorshipProgress 
        totalRequested={campaignGoal}
        currentFunding={campaignCurrent}
        yourContribution={userContribution}
        perks={finalCheckpoints.map((checkpoint, index) => {
          return {
            id: index + 1,
            amount: checkpoint.amount,
            title: checkpoint.reward,
            description: `Unlock ${checkpoint.reward} when your contribution reaches $${checkpoint.amount.toLocaleString()}`,
            isUnlocked: userContribution >= checkpoint.amount // Based on user contribution
          }
        })}
      />
      
      {/* Sponsorship Checkpoints */}
      <div className="mt-6 space-y-3">
        <h4 className="font-medium text-sm">{subtitle}</h4>
        {finalCheckpoints.map((checkpoint, index) => {
          const isUnlockedByUser = userContribution >= checkpoint.amount
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                isUnlockedByUser 
                  ? "bg-green-50 border-green-200" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">${checkpoint.amount?.toLocaleString() || 0}</span>
                {isUnlockedByUser && <Badge className="bg-green-600 text-white">Unlocked</Badge>}
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">{checkpoint.reward || "No reward information"}</p>
              {checkpoint.description && (
                <p className="text-xs text-gray-500">{checkpoint.description}</p>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Conditional button based on user role and ownership */}
      {isProfileOwner ? (
        <CampaignCreation 
          editCampaign={displayCampaign ? {
            id: displayCampaign.id,
            title: displayCampaign.title,
            description: displayCampaign.description,
            funding_goal: displayCampaign.funding_goal,
            deadline: displayCampaign.deadline,
            perk_tiers: displayCampaign.perk_tiers.map(tier => ({
              tier_name: tier.tier_name,
              amount: tier.amount,
              description: tier.description,
              deliverables: typeof tier.deliverables === 'string' 
                ? (() => {
                    try {
                      return JSON.parse(tier.deliverables)
                    } catch {
                      return { custom: tier.deliverables }
                    }
                  })()
                : tier.deliverables,
              max_sponsors: tier.max_sponsors
            }))
          } : null}
          onCampaignCreated={handleCampaignUpdated}
        >
          <Button 
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Campaign
          </Button>
        </CampaignCreation>
      ) : isSponsor ? (
        <Button 
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setIsSponsorshipModalOpen(true)}
        >
          {submitButtonText}
        </Button>
      ) : (
        <Button className="w-full mt-6 bg-gray-400 cursor-not-allowed text-gray-600" disabled>
          {submitButtonText} (Sponsors Only)
        </Button>
      )}
      
      {/* Sponsorship Modal */}
      <SponsorshipModal
        isOpen={isSponsorshipModalOpen}
        onOpenChange={setIsSponsorshipModalOpen}
        sponsorshipData={{
          targetId: Number(profileId) || 1,
          targetType: profileType,
          targetName: title,
          targetImage: undefined,
          totalRequested: campaignGoal, // Use campaign goal funding
          currentFunding: campaignCurrent, // Use campaign current funding
          yourContribution: userContribution, // Use actual user contribution for this profile
          perks: finalCheckpoints.map((checkpoint, index) => ({
            id: index + 1,
            amount: checkpoint.amount,
            title: checkpoint.reward,
            description: `Unlock ${checkpoint.reward} when your contribution reaches $${checkpoint.amount.toLocaleString()}`,
            isUnlocked: userContribution >= checkpoint.amount
          })),
          yourPerks: finalCheckpoints.filter((checkpoint, index) => userContribution >= checkpoint.amount).map((checkpoint, index) => ({
            id: index + 1,
            amount: checkpoint.amount,
            title: checkpoint.reward,
            description: `Unlock ${checkpoint.reward} when your contribution reaches $${checkpoint.amount.toLocaleString()}`,
            isUnlocked: true
          }))
        }}
        onSponsor={(amount, selectedPerks, customConditions) => {
          // Add the contribution using the hook
          addContribution(
            Number(profileId) || 1,
            profileType,
            amount,
            selectedPerks,
            customConditions
          )
          
          console.log('Sponsorship contribution added:', { 
            profileId, 
            profileType, 
            amount, 
            selectedPerks, 
            customConditions,
            newTotal: userContribution + amount
          })
          
          // Close the modal
          setIsSponsorshipModalOpen(false)
          
          // In a real app, you might want to show a success message
          // or refresh the page to show updated data
          window.location.reload() // Temporary refresh to show updated data
        }}
      >
        <div></div>
      </SponsorshipModal>
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
