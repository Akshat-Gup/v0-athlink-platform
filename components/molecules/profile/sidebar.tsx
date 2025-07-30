import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"
import { Card } from "@/components/molecules/card"
import { Instagram, Twitter, Youtube, Facebook, ExternalLink, Edit, Plus, MessageCircle } from "lucide-react"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { SponsorshipModal } from "@/components/templates/user/sponsorship-modal"
import { SponsorshipProgress } from "@/components/molecules/profile/sponsorship-progress"
import { CampaignCreation } from "@/components/templates/athlete/campaign-creation"
import { useUserRole } from "@/hooks/use-user-role"
import { useSponsorshipData } from "@/hooks/use-sponsorship-data"
import { useCampaignSponsorship } from "@/hooks/use-campaign-sponsorship"
import { useCampaignData } from "@/hooks/use-campaign-data"
import { useAuth } from "@/hooks/use-auth"
import { usePendingRequestsCount } from "@/hooks/use-pending-requests"
import { useSponsorContributions } from "@/hooks/use-sponsor-contributions"
import { sponsorshipEvents, SPONSORSHIP_EVENTS } from "@/lib/sponsorship-events"
import { Session } from "@supabase/supabase-js"

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
  campaignData,
  onCampaignUpdated
}: SidebarSponsorshipProps) {
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false)
  const { selectedUserRole } = useUserRole()
  const { user } = useAuth()
  const { getTotalContributionForTarget } = useSponsorshipData()
  const { submitSponsorshipRequest, isSubmitting } = useCampaignSponsorship()
  const { count: pendingRequestsCount } = usePendingRequestsCount()
  const { getUserActiveCampaign, fetchUserCampaigns } = useCampaignData()
  const { getTotalContributionForAthlete, refreshContributions, contributions } = useSponsorContributions()

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

  // Listen for sponsorship events to refresh display
  useEffect(() => {
    const handleSponsorshipUpdate = () => {
      console.log('Sponsorship updated - refreshing sidebar display')
      refreshContributions()
      onCampaignUpdated?.() // Also refresh campaign data
    }

    sponsorshipEvents.on(SPONSORSHIP_EVENTS.REQUEST_APPROVED, handleSponsorshipUpdate)
    sponsorshipEvents.on(SPONSORSHIP_EVENTS.REQUEST_REJECTED, handleSponsorshipUpdate)

    return () => {
      sponsorshipEvents.off(SPONSORSHIP_EVENTS.REQUEST_APPROVED, handleSponsorshipUpdate)
      sponsorshipEvents.off(SPONSORSHIP_EVENTS.REQUEST_REJECTED, handleSponsorshipUpdate)
    }
  }, [refreshContributions, onCampaignUpdated])

  // Get user's contribution for this specific profile (use real database data)
  const userContribution = isSponsor
    ? getTotalContributionForAthlete(Number(profileOwnerId) || Number(profileId) || 1)
    : getTotalContributionForTarget(Number(profileId) || 1, profileType)

  // Get custom perks for sponsors (approved custom sponsorship requests)
  const customPerks = isSponsor ? contributions.filter(contribution =>
    contribution.athlete_id === (Number(profileOwnerId) || Number(profileId) || 1) &&
    contribution.status === 'ACCEPTED' &&
    contribution.custom_perks
  ) : []

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
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${isUnlockedByUser
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

      {/* Custom Perks Section for Sponsors */}
      {isSponsor && customPerks.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-sm">Your Custom Perks</h4>
          {customPerks.map((perk, index) => (
            <div
              key={`custom-${perk.id}`}
              className="p-3 rounded-lg border bg-blue-50 border-blue-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">${perk.amount?.toLocaleString() || 0}</span>
                <Badge className="bg-blue-600 text-white">Custom Approved</Badge>
              </div>
              <p className="text-xs text-blue-800 font-medium mb-1">Custom Sponsorship</p>
              {perk.custom_perks && (
                <p className="text-xs text-blue-700">{perk.custom_perks}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Conditional button based on user role and ownership */}
      {isProfileOwner ? (
        <div className="space-y-3">
          {/* Sponsorship Requests Dashboard Link */}
          <Link href="/sponsorship-requests">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white relative"
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              View Sponsorship Requests
              {pendingRequestsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs min-w-[1.5rem] h-6 flex items-center justify-center">
                  {pendingRequestsCount}
                </Badge>
              )}
            </Button>
          </Link>

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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Campaign
            </Button>
          </CampaignCreation>
        </div>
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
        onSponsor={async (amount, selectedPerks, customConditions) => {
          try {
            if (!displayCampaign) {
              console.error('No campaign found for this profile:', { campaignData, activeCampaign, profileId })
              throw new Error('No campaign found for this profile')
            }

            console.log('Submitting sponsorship request with:', {
              campaign_id: displayCampaign.id,
              athlete_id: Number(profileOwnerId) || Number(profileId) || 1,
              amount,
              custom_perks: customConditions,
              message: customConditions || '',
              is_custom: !!customConditions
            })

            // Submit sponsorship request using the campaign data
            await submitSponsorshipRequest({
              campaign_id: displayCampaign.id,
              athlete_id: Number(profileOwnerId) || Number(profileId) || 1,
              amount,
              custom_perks: customConditions,
              message: customConditions || '',
              is_custom: !!customConditions
            })

            console.log('Sponsorship request submitted:', {
              campaign_id: displayCampaign.id,
              athlete_id: Number(profileOwnerId) || Number(profileId) || 1,
              amount,
              selectedPerks,
              customConditions
            })

            // Close the modal
            setIsSponsorshipModalOpen(false)

            // Show success message
            alert('Sponsorship request submitted! The campaign owner will review your request.')

          } catch (error) {
            console.error('Error submitting sponsorship request:', error)
            alert(`Failed to submit sponsorship request: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
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
