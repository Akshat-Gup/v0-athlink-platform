"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { User, CalendarIcon, Trophy, Building } from "lucide-react"
import { UserRole } from "@/hooks/use-user-role"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export type { UserRole }

interface JoinRoleSelectorProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onRoleSelect?: (role: UserRole) => void
  currentRole?: UserRole | null
  children: React.ReactNode
}

interface RoleOption {
  id: UserRole
  label: string
  description: string
  icon: React.ReactNode
}

const roleOptions: RoleOption[] = [
  {
    id: "Talent",
    label: "Talent",
    description: "Individual athlete or performer seeking sponsorship opportunities",
    icon: <User className="h-10 w-10 text-blue-600" />
  },
  {
    id: "Event Leader",
    label: "Event Leader",
    description: "Organizer of sports events, tournaments, or competitions", 
    icon: <CalendarIcon className="h-10 w-10 text-green-600" />
  },
  {
    id: "Team Leader",
    label: "Team Leader",
    description: "Manager or captain of sports teams and athletic groups",
    icon: <Trophy className="h-10 w-10 text-purple-600" />
  },
  {
    id: "Sponsor",
    label: "Sponsor",
    description: "Brand or individual looking to sponsor athletic talent and events",
    icon: <Building className="h-10 w-10 text-orange-600" />
  }
]

export function JoinRoleSelector({ 
  isOpen: externalIsOpen, 
  onOpenChange: externalOnOpenChange, 
  onRoleSelect, 
  currentRole, 
  children 
}: JoinRoleSelectorProps) {
  const { userRole, isAuthenticated, user } = useAuth()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(currentRole || (userRole as UserRole) || null)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const onOpenChange = externalOnOpenChange || setInternalIsOpen

  // Update local state when currentRole or userRole changes
  useEffect(() => {
    setSelectedRole(currentRole || (userRole as UserRole) || null)
  }, [currentRole, userRole])

  const handleRoleClick = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleJoin = async () => {
    if (!selectedRole) return

    if (isAuthenticated) {
      // For authenticated users, update role in database
      setUpdating(true)
      try {
        const response = await fetch('/api/auth/user/role', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: selectedRole }),
        })

        if (!response.ok) {
          throw new Error('Failed to update role')
        }

        toast({
          title: "Role Updated",
          description: `You are now ${selectedRole}! Welcome to your new role.`,
        })

        // Close dialog and refresh page to update auth state
        onOpenChange(false)
        setTimeout(() => window.location.reload(), 1000)
      } catch (error) {
        console.error('Error updating role:', error)
        toast({
          title: "Error",
          description: "Failed to update role. Please try again.",
          variant: "destructive",
        })
      } finally {
        setUpdating(false)
      }
    } else {
      // For non-authenticated users, use callback
      if (onRoleSelect) {
        onRoleSelect(selectedRole)
      }
      onOpenChange(false)
      toast({
        title: "Role Selected",
        description: `You selected ${selectedRole}. Sign in to save your role permanently.`,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-8">
        <DialogHeader className="text-center mb-8">
          <DialogTitle className="text-2xl font-semibold">
            {isAuthenticated ? `Change Your Role` : 'What would you like to join as?'}
          </DialogTitle>
          {isAuthenticated && user && (
            <p className="text-gray-600 mt-2">
              Current role: <span className="font-medium">{userRole || 'Not set'}</span>
            </p>
          )}
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          {roleOptions.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === role.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{role.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-500">
            {isAuthenticated 
              ? "Your role will be saved to your account and synced across all devices."
              : "Sign in to save your role permanently across all devices."
            }
          </div>
          <Button 
            onClick={handleJoin}
            disabled={!selectedRole || updating}
            className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? "Updating..." : isAuthenticated ? `Change to ${selectedRole || "..."}` : `Join as ${selectedRole || "..."}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
