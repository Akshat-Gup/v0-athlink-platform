"use client"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/button"
import { Input } from "../../atoms/input"
import { Card } from "../../molecules/card"
import { Badge } from "../../atoms/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../organisms/dialog"
import { Edit, Save, X, User, Mail, MapPin, Trophy, Calendar, Star } from "lucide-react"
import { useAuth } from "../../../hooks/use-auth"
import { useToast } from "../../../hooks/use-toast"

interface EditableProfile {
  name: string
  primary_sport: string
  bio: string
  years_experience: number
  country_code: string
  team_emoji: string
  // Talent profile fields
  current_funding?: number
  goal_funding?: number
  price?: string
  period?: string
  achievements?: string
  fit_type?: string
  // Team profile fields
  league?: string
  wins?: number
  losses?: number
  ranking?: number
  members?: number
  // Event profile fields
  venue?: string
  capacity?: number
  ticket_price?: number
  organizer?: string
  event_type?: string
}

interface ProfileEditProps {
  children?: React.ReactNode
  userId?: number // If provided, check if user can edit this profile
  talentProfile?: any
  teamProfile?: any
  eventProfile?: any
}

export function ProfileEdit({ children, userId, talentProfile, teamProfile, eventProfile }: ProfileEditProps) {
  const { user, profile, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editedProfile, setEditedProfile] = useState<EditableProfile>({
    name: '',
    primary_sport: '',
    bio: '',
    years_experience: 0,
    country_code: '',
    team_emoji: ''
  })

  // Check if user can edit this profile
  const canEdit = !userId || (user?.id === userId)

  useEffect(() => {
    if (isOpen && user && canEdit) {
      // Initialize form with current user data
      setEditedProfile({
        name: user.name || '',
        primary_sport: user.primary_sport || '',
        bio: (user as any).bio || '',
        years_experience: (user as any).years_experience || 0,
        country_code: (user as any).country_code || '',
        team_emoji: (user as any).team_emoji || '',
        // Talent profile
        current_funding: talentProfile?.current_funding || 0,
        goal_funding: talentProfile?.goal_funding || 0,
        price: talentProfile?.price || '',
        period: talentProfile?.period || '',
        achievements: talentProfile?.achievements || '',
        fit_type: talentProfile?.fit_type || '',
        // Team profile
        league: teamProfile?.league || '',
        wins: teamProfile?.wins || 0,
        losses: teamProfile?.losses || 0,
        ranking: teamProfile?.ranking || 0,
        members: teamProfile?.members || 0,
        // Event profile
        venue: eventProfile?.venue || '',
        capacity: eventProfile?.capacity || 0,
        ticket_price: eventProfile?.ticket_price || 0,
        organizer: eventProfile?.organizer || '',
        event_type: eventProfile?.event_type || ''
      })
    }
  }, [isOpen, user, canEdit, talentProfile, teamProfile, eventProfile])

  const handleSave = async () => {
    if (!user || !canEdit) {
      toast({
        title: "Unauthorized",
        description: "You can only edit your own profile.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/profile/edit', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      })

      if (response.ok) {
        toast({
          title: "Profile Updated!",
          description: "Your profile has been successfully updated.",
        })
        setIsOpen(false)
        // Refresh page to show updated data
        window.location.reload()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update profile.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof EditableProfile, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isAuthenticated || !canEdit) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  value={editedProfile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Sport *
                </label>
                <Input
                  value={editedProfile.primary_sport}
                  onChange={(e) => updateField('primary_sport', e.target.value)}
                  placeholder="e.g., Basketball, Tennis, Soccer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  value={editedProfile.years_experience}
                  onChange={(e) => updateField('years_experience', parseInt(e.target.value) || 0)}
                  min="0"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code
                </label>
                <Input
                  value={editedProfile.country_code}
                  onChange={(e) => updateField('country_code', e.target.value.toUpperCase())}
                  placeholder="US, UK, CA, etc."
                  maxLength={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Tell others about yourself, your goals, and achievements..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editedProfile.bio.length}/500 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Emoji
                </label>
                <Input
                  value={editedProfile.team_emoji}
                  onChange={(e) => updateField('team_emoji', e.target.value)}
                  placeholder="🏀 ⚽ 🎾"
                  maxLength={2}
                />
              </div>
            </div>
          </Card>

          {/* Talent Profile */}
          {profile?.isAthlete && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Athlete Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Funding ($)
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.current_funding || 0}
                    onChange={(e) => updateField('current_funding', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Goal ($)
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.goal_funding || 0}
                    onChange={(e) => updateField('goal_funding', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sponsorship Price ($)
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.price || 0}
                    onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <Input
                    value={editedProfile.period || ''}
                    onChange={(e) => updateField('period', e.target.value)}
                    placeholder="e.g., Monthly, Per Event, Season"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fit Type
                  </label>
                  <select
                    value={editedProfile.fit_type || ''}
                    onChange={(e) => updateField('fit_type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select fit type</option>
                    <option value="Brand Ambassador">Brand Ambassador</option>
                    <option value="Event Sponsor">Event Sponsor</option>
                    <option value="Equipment Partner">Equipment Partner</option>
                    <option value="Training Sponsor">Training Sponsor</option>
                    <option value="Competition Sponsor">Competition Sponsor</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievements
                  </label>
                  <textarea
                    value={editedProfile.achievements || ''}
                    onChange={(e) => updateField('achievements', e.target.value)}
                    placeholder="List your major achievements, awards, and accomplishments..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                    maxLength={1000}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Team Profile */}
          {profile?.isTeam && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Team Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    League
                  </label>
                  <Input
                    value={editedProfile.league || ''}
                    onChange={(e) => updateField('league', e.target.value)}
                    placeholder="e.g., NBA, Premier League, NCAA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Members
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.members || 0}
                    onChange={(e) => updateField('members', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wins
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.wins || 0}
                    onChange={(e) => updateField('wins', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Losses
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.losses || 0}
                    onChange={(e) => updateField('losses', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Ranking
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.ranking || 0}
                    onChange={(e) => updateField('ranking', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Event Profile */}
          {profile?.isEvent && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <Input
                    value={editedProfile.venue || ''}
                    onChange={(e) => updateField('venue', e.target.value)}
                    placeholder="Event venue name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.capacity || 0}
                    onChange={(e) => updateField('capacity', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Price ($)
                  </label>
                  <Input
                    type="number"
                    value={editedProfile.ticket_price || 0}
                    onChange={(e) => updateField('ticket_price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer
                  </label>
                  <Input
                    value={editedProfile.organizer || ''}
                    onChange={(e) => updateField('organizer', e.target.value)}
                    placeholder="Event organizer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={editedProfile.event_type || ''}
                    onChange={(e) => updateField('event_type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select event type</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Championship">Championship</option>
                    <option value="League">League</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Training Camp">Training Camp</option>
                    <option value="Clinic">Clinic</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading || !editedProfile.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
