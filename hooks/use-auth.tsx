"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

interface UserProfile {
  category: string
  isAthlete: boolean
  isTeam: boolean
  isEvent: boolean
}

interface User {
  id: number
  name: string
  email: string
  user_role: string | null
  primary_sport: string
  // Add other user fields as needed
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated" && session?.user?.email) {
      fetchUserProfile()
    } else {
      setUser(null)
      setProfile(null)
      setLoading(false)
    }
  }, [session, status])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/user")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setProfile(data.profile)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    session,
    user,
    profile,
    loading: loading || status === "loading",
    isAuthenticated: !!session,
    userRole: user?.user_role || null,
    isAthlete: profile?.isAthlete || false,
    isTeam: profile?.isTeam || false,
    isEvent: profile?.isEvent || false,
  }
}
