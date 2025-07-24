"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/select"
import { useToast } from "@/hooks/use-toast"

export type UserRole = "Talent" | "Event Leader" | "Team Leader" | "Sponsor"

const roleDescriptions = {
  "Talent": "Individual athlete or performer seeking sponsorship opportunities",
  "Event Leader": "Organizer of sports events, tournaments, or competitions",
  "Team Leader": "Manager or captain of sports teams and athletic groups",
  "Sponsor": "Brand or individual looking to sponsor athletic talent and events"
}

const roleColors = {
  "Talent": "bg-blue-100 text-blue-800 border-blue-300",
  "Event Leader": "bg-green-100 text-green-800 border-green-300",
  "Team Leader": "bg-purple-100 text-purple-800 border-purple-300",
  "Sponsor": "bg-orange-100 text-orange-800 border-orange-300"
}

export function UserRoleManager() {
  const { user, userRole, loading } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(userRole as UserRole || null)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-pulse text-gray-500">Loading role information...</div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center p-6">
          <p className="text-gray-500">Please sign in to manage your role</p>
        </CardContent>
      </Card>
    )
  }

  const handleRoleUpdate = async () => {
    if (!selectedRole || selectedRole === userRole) {
      return
    }

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
        description: `Your role has been changed to ${selectedRole}`,
      })

      // Refresh the page to update the auth state
      window.location.reload()
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      })
      setSelectedRole(userRole as UserRole || null)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Role Management
          {userRole && (
            <Badge className={roleColors[userRole as UserRole] || "bg-gray-100 text-gray-800"}>
              Current: {userRole}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Your Role</h3>
          <Select 
            value={selectedRole || ""} 
            onValueChange={(value) => setSelectedRole(value as UserRole)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your role on the platform" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleDescriptions).map(([role, description]) => (
                <SelectItem key={role} value={role}>
                  <div>
                    <div className="font-medium">{role}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRole && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{selectedRole}</h4>
            <p className="text-sm text-gray-600">{roleDescriptions[selectedRole]}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Your role helps us customize your experience and show relevant features.
          </div>
          <Button 
            onClick={handleRoleUpdate}
            disabled={!selectedRole || selectedRole === userRole || updating}
            className="ml-4"
          >
            {updating ? "Updating..." : "Update Role"}
          </Button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">All Platform Roles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(roleDescriptions).map(([role, description]) => (
              <div key={role} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{role}</span>
                  <Badge 
                    variant="outline" 
                    className={roleColors[role as UserRole] || "bg-gray-100 text-gray-800"}
                  >
                    {role}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
