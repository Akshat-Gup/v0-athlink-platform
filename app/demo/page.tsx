import { UserProfile } from "@/components/auth/user-profile"
import { UserRoleManager } from "@/components/auth/user-role-manager"
import { JoinRoleSelector } from "@/components/templates"
import { SponsorContribution } from "@/components/templates"
import { CampaignCreation } from "@/components/templates"
import { CampaignDisplay } from "@/components/templates"
import { SponsorCampaignBrowser } from "@/components/templates"
import { SponsorshipRequestManager } from "@/components/templates/athlete/sponsorship-request-manager"
import { Button } from "@/components/atoms/button"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Athlete-Sponsor Campaign Demo</h1>
          <p className="text-gray-600">
            Test the complete campaign system: athletes create campaigns, sponsors make offers with escrow protection
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <JoinRoleSelector>
            <Button variant="outline">Change Role</Button>
          </JoinRoleSelector>
          <SponsorContribution>
            <Button className="bg-green-600 hover:bg-green-700">Manage Contributions</Button>
          </SponsorContribution>
          <CampaignCreation>
            <Button className="bg-blue-600 hover:bg-blue-700">Create Campaign</Button>
          </CampaignCreation>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserProfile />
          <UserRoleManager />
        </div>
        
        {/* Campaign System Demo */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🎯 Campaign System Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-600 mb-2">For Athletes (Talent Role)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create sponsorship campaigns with funding goals</li>
                  <li>• Set multiple sponsorship tiers with default perks</li>
                  <li>• Receive sponsor offers with escrow protection</li>
                  <li>• Accept/reject custom sponsorship terms</li>
                  <li>• Track campaign progress and sponsors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-600 mb-2">For Sponsors (Sponsor Role)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Browse active athlete campaigns</li>
                  <li>• Choose from preset sponsorship tiers</li>
                  <li>• Make custom offers with negotiated terms</li>
                  <li>• Funds held in escrow until completion</li>
                  <li>• Track sponsorship commitments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Campaign Components */}
          <CampaignDisplay limit={3} />
          
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">💰 Sponsorship Requests (Athlete View)</h2>
            <SponsorshipRequestManager />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🔍 Browse Campaigns (Sponsor View)</h2>
            <SponsorCampaignBrowser />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Available Test Accounts</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-medium text-blue-600 mb-2">Athletes (Role: Talent)</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• sarah.chen@example.com (Tennis)</li>
                  <li>• marcus.johnson@example.com (Basketball)</li>
                  <li>• emma.davis@example.com (Swimming)</li>
                  <li>• alex.rodriguez@example.com (Soccer)</li>
                  <li>• jake.thompson@example.com (Track & Field)</li>
                  <li>• sofia.martinez@example.com (Gymnastics)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-600 mb-2">Teams & Events</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• team@thunderhawks.com (Team Leader)</li>
                  <li>• info@summerswim2024.com (Event Leader)</li>
                  <li>• maya.patel@example.com (Content Creator)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-orange-600 mb-2">Sponsors (Role: Sponsor)</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• sponsors@techcorp.com (TechCorp - Technology)</li>
                  <li>• partnerships@athletegear.com (AthleteGear - Equipment)</li>
                  <li>• sponsorships@powerboost.com (PowerBoost - Energy)</li>
                  <li>• sponsors@fitnesspro.com (FitnessPro - Fitness Gear)</li>
                  <li>• partnerships@velocitysports.com (Velocity - Nutrition)</li>
                  <li>• athlete.support@championfs.com (Champion - Financial)</li>
                  <li>• sponsorships@sportstech.io (SportsTech - Technology)</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2 italic">
                  * Sponsors have separate accounts but don't appear on the discover page
                </p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 rounded-md text-center">
                <div className="font-medium text-blue-800">Talent</div>
                <div className="text-xs text-blue-600">6 users</div>
              </div>
              <div className="p-3 bg-green-50 rounded-md text-center">
                <div className="font-medium text-green-800">Event Leader</div>
                <div className="text-xs text-green-600">1 user</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-md text-center">
                <div className="font-medium text-purple-800">Team Leader</div>
                <div className="text-xs text-purple-600">1 user</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-md text-center">
                <div className="font-medium text-orange-800">Sponsor</div>
                <div className="text-xs text-orange-600">7 users</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-blue-800 text-sm">
                <strong>Password for all accounts:</strong> 12345678
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Each user has an individual role that persists with their account. You can update your role after logging in.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Role System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Database-Driven Roles</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Roles stored in database per user</li>
                <li>✅ Persistent across sessions</li>
                <li>✅ Auto-assigned based on profile type</li>
                <li>✅ User-updatable through interface</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Fallback System</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ LocalStorage for non-authenticated users</li>
                <li>✅ Seamless transition on login</li>
                <li>✅ Role-based feature access</li>
                <li>✅ Sponsorship system integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
