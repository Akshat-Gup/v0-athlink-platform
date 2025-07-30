"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { ProfileEdit } from "../templates/user/profile-edit"
import { useState, useEffect } from "react"

export function UserProfile() {
  const { user, extendedUser, profile, loading, signOut } = useAuth()
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    // Fetch full profile data including talent/team/event profiles
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/profile/${user.id}`)
          if (response.ok) {
            const data = await response.json()
            setProfileData(data)
          }
        } catch (error) {
          console.error("Error fetching profile data:", error)
        }
      }
    }

    if (user && user.id) {
      fetchProfileData()
    }
  }, [user])

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center p-6">
          <p className="text-gray-500">Please sign in to view your profile</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Welcome, {extendedUser?.name || user.email}!
          <div className="flex gap-2">
            <ProfileEdit
              talentProfile={profileData?.talent_profile}
              teamProfile={profileData?.team_profile}
              eventProfile={profileData?.event_profile}
            />
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Primary Sport</p>
          <p className="font-medium">{extendedUser?.primary_sport || 'Not specified'}</p>
        </div>

        {extendedUser?.user_role && (
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <Badge variant="secondary">{extendedUser.user_role}</Badge>
          </div>
        )}

        {profile && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Profile Type</p>
            <div className="flex gap-2">
              {profile.isAthlete && <Badge variant="secondary">Athlete</Badge>}
              {profile.isTeam && <Badge variant="secondary">Team</Badge>}
              {profile.isEvent && <Badge variant="secondary">Event</Badge>}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            🎉 Login successful! You are now authenticated and can access all features.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
