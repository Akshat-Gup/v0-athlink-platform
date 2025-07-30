"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

export type UserRole = "Talent" | "Event Leader" | "Team Leader" | "Sponsor"

const USER_ROLE_STORAGE_KEY = "athlink-user-role"

export function useUserRole() {
  const { user, loading } = useAuth()
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null)
  const [authenticatedUserRole, setAuthenticatedUserRole] = useState<UserRole | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch authenticated user's role from database
  useEffect(() => {
    if (loading) return

    if (user?.email) {
      fetchUserRole()
    } else {
      setAuthenticatedUserRole(null)
      loadFromLocalStorage()
    }
  }, [user, loading])

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/auth/user")
      if (response.ok) {
        const data = await response.json()
        const role = data.user?.user_role
        if (role && isValidUserRole(role)) {
          setAuthenticatedUserRole(role as UserRole)
          setSelectedUserRole(role as UserRole)
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error)
      loadFromLocalStorage()
    } finally {
      setIsLoaded(true)
    }
  }

  const loadFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY)
      if (savedRole && isValidUserRole(savedRole)) {
        setSelectedUserRole(savedRole as UserRole)
      }
      setIsLoaded(true)
    }
  }

  // Save to localStorage only for non-authenticated users
  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded && !user) {
      if (selectedUserRole) {
        localStorage.setItem(USER_ROLE_STORAGE_KEY, selectedUserRole)
      } else {
        localStorage.removeItem(USER_ROLE_STORAGE_KEY)
      }
    }
  }, [selectedUserRole, isLoaded, user])

  const handleRoleSelect = (role: UserRole) => {
    if (user) {
      console.warn("Authenticated users should update their role through the profile settings")
      return
    }
    setSelectedUserRole(role)
  }

  const clearRole = () => {
    if (user) {
      console.warn("Cannot clear role for authenticated users")
      return
    }
    setSelectedUserRole(null)
  }

  return {
    selectedUserRole,
    handleRoleSelect,
    clearRole,
    isLoaded,
    isAuthenticated: !!user,
    isUsingDatabaseRole: !!user && !!authenticatedUserRole
  }
}

function isValidUserRole(role: string): role is UserRole {
  return ["Talent", "Event Leader", "Team Leader", "Sponsor"].includes(role)
}
