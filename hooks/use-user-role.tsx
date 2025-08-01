"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export type UserRole = "Talent" | "Event Leader" | "Team Leader" | "Sponsor"

const USER_ROLE_STORAGE_KEY = "athlink-user-role"

export function useUserRole() {
  const { isAuthenticated, databaseUser, loading } = useAuth()
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null)
  const [authenticatedUserRole, setAuthenticatedUserRole] = useState<UserRole | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch authenticated user's role from database
  useEffect(() => {
    if (loading) return

    if (isAuthenticated && databaseUser) {
      setUserRole()
    } else {
      setAuthenticatedUserRole(null)
      loadFromLocalStorage()
    }
  }, [isAuthenticated, databaseUser, loading])

  const setUserRole = () => {
    try {
      const role = databaseUser?.user_role
      if (role && isValidUserRole(role)) {
        setAuthenticatedUserRole(role as UserRole)
        setSelectedUserRole(role as UserRole)
      }
    } catch (error) {
      console.error("Error setting user role:", error)
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
    if (typeof window !== "undefined" && isLoaded && !isAuthenticated) {
      if (selectedUserRole) {
        localStorage.setItem(USER_ROLE_STORAGE_KEY, selectedUserRole)
      } else {
        localStorage.removeItem(USER_ROLE_STORAGE_KEY)
      }
    }
  }, [selectedUserRole, isLoaded, isAuthenticated])

  const handleRoleSelect = (role: UserRole) => {
    if (isAuthenticated) {
      console.warn("Authenticated users should update their role through the profile settings")
      return
    }
    setSelectedUserRole(role)
  }

  const clearRole = () => {
    if (isAuthenticated) {
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
    isAuthenticated: isAuthenticated,
    isUsingDatabaseRole: isAuthenticated && !!authenticatedUserRole
  }
}

function isValidUserRole(role: string): role is UserRole {
  return ["Talent", "Event Leader", "Team Leader", "Sponsor"].includes(role)
}
