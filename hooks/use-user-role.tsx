import { useState, useEffect } from "react"

export type UserRole = "Talent" | "Event Leader" | "Team Leader" | "Sponsor"

const USER_ROLE_STORAGE_KEY = "athlink-user-role"

export function useUserRole() {
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load the role from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY)
      if (savedRole && isValidUserRole(savedRole)) {
        setSelectedUserRole(savedRole as UserRole)
      }
      setIsLoaded(true)
    }
  }, [])

  // Save the role to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded) {
      if (selectedUserRole) {
        localStorage.setItem(USER_ROLE_STORAGE_KEY, selectedUserRole)
      } else {
        localStorage.removeItem(USER_ROLE_STORAGE_KEY)
      }
    }
  }, [selectedUserRole, isLoaded])

  const handleRoleSelect = (role: UserRole) => {
    setSelectedUserRole(role)
  }

  const clearRole = () => {
    setSelectedUserRole(null)
  }

  return {
    selectedUserRole,
    handleRoleSelect,
    clearRole,
    isLoaded
  }
}

function isValidUserRole(role: string): role is UserRole {
  return ["Talent", "Event Leader", "Team Leader", "Sponsor"].includes(role)
}
