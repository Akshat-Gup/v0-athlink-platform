"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/organisms/sheet"
import { User, CalendarIcon, Trophy, Building } from "lucide-react"
import { UserRole } from "./join-role-selector"

interface MobileJoinRoleSelectorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onRoleSelect: (role: UserRole) => void
  currentRole?: UserRole | null
  children: React.ReactNode
}

interface RoleOption {
  id: UserRole
  label: string
  icon: React.ReactNode
}

const roleOptions: RoleOption[] = [
  {
    id: "Talent",
    label: "Talent",
    icon: <User className="h-8 w-8 text-gray-600" />
  },
  {
    id: "Event Leader",
    label: "Event Leader", 
    icon: <CalendarIcon className="h-8 w-8 text-gray-600" />
  },
  {
    id: "Team Leader",
    label: "Team Leader",
    icon: <Trophy className="h-8 w-8 text-gray-600" />
  },
  {
    id: "Sponsor",
    label: "Sponsor",
    icon: <Building className="h-8 w-8 text-gray-600" />
  }
]

export function MobileJoinRoleSelector({ isOpen, onOpenChange, onRoleSelect, currentRole, children }: MobileJoinRoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(currentRole || null)

  // Update local state when currentRole changes
  useEffect(() => {
    setSelectedRole(currentRole || null)
  }, [currentRole])

  const handleRoleClick = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleJoin = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole)
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="p-6">
        <SheetHeader className="text-center mb-6">
          <SheetTitle className="text-xl font-semibold">What would you like to join as?</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mb-6">
          {roleOptions.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                selectedRole === role.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {role.icon}
                </div>
                <h3 className="text-lg font-medium">{role.label}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleJoin}
            disabled={!selectedRole}
            className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            Join as {selectedRole || "..."}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
