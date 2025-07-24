import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/organisms/dialog"
import { User, CalendarIcon, Trophy, Building } from "lucide-react"
import { UserRole } from "@/hooks/use-user-role"

export type { UserRole }

interface JoinRoleSelectorProps {
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
    icon: <User className="h-10 w-10 text-gray-600" />
  },
  {
    id: "Event Leader",
    label: "Event Leader", 
    icon: <CalendarIcon className="h-10 w-10 text-gray-600" />
  },
  {
    id: "Team Leader",
    label: "Team Leader",
    icon: <Trophy className="h-10 w-10 text-gray-600" />
  },
  {
    id: "Sponsor",
    label: "Sponsor",
    icon: <Building className="h-10 w-10 text-gray-600" />
  }
]

export function JoinRoleSelector({ isOpen, onOpenChange, onRoleSelect, currentRole, children }: JoinRoleSelectorProps) {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-8">
        <DialogHeader className="text-center mb-8">
          <DialogTitle className="text-2xl font-semibold">What would you like to join as?</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {roleOptions.slice(0, 3).map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className={`border-2 rounded-2xl p-8 cursor-pointer transition-colors ${
                selectedRole === role.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  {role.icon}
                </div>
                <h3 className="text-lg font-medium">{role.label}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-6">
          <div
            onClick={() => handleRoleClick("Sponsor")}
            className={`border-2 rounded-2xl p-8 cursor-pointer transition-colors ${
              selectedRole === "Sponsor"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Building className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium">Sponsor</h3>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleJoin}
            disabled={!selectedRole}
            className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join as {selectedRole || "..."}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
