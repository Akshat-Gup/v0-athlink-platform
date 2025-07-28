"use client"

import { SponsorshipRequestsDashboard } from "@/components/organisms/sponsorships/sponsorship-requests-dashboard"
import { useAuth } from "@/hooks/use-auth"
import { useUserRole } from "@/hooks/use-user-role"

export default function SponsorshipRequestsPage() {
  const { user, loading } = useAuth()
  const { selectedUserRole } = useUserRole()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view sponsorship requests.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SponsorshipRequestsDashboard 
          userRole={selectedUserRole === "Sponsor" ? "sponsor" : "athlete"}
        />
      </div>
    </div>
  )
}
