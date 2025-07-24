import { Suspense } from 'react'
import { CampaignList } from '@/components/organisms/campaigns/campaign-list'
import { CampaignCreator } from '@/components/organisms/campaigns/campaign-creator'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/tabs'
import { Plus, Target, TrendingUp, Heart } from 'lucide-react'

interface CampaignsPageProps {
  params: {
    id: string
  }
  searchParams: {
    tab?: 'active' | 'completed' | 'create'
    profile_type?: 'talent' | 'team' | 'event'
  }
}

export default function CampaignsPage({ params, searchParams }: CampaignsPageProps) {
  const { id } = params
  const { tab = 'active', profile_type } = searchParams

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Fundraising Campaigns</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Support athletes, teams, and events through direct sponsorship campaigns with exclusive perks and benefits
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold">$127,450</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sponsors</p>
                <p className="text-2xl font-bold">342</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={tab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
          </TabsList>
          
          {tab !== 'create' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          )}
        </div>

        <TabsContent value="active" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Active Campaigns</h2>
            <div className="text-sm text-gray-600">
              {profile_type && `Filtered by: ${profile_type}`}
            </div>
          </div>
          
          <Suspense fallback={<div>Loading campaigns...</div>}>
            <CampaignList 
              profileId={id} 
              profileType={profile_type}
              status="active"
              onCampaignSelect={(campaign) => {
                // Handle campaign selection - could navigate or show modal
                console.log('Selected campaign:', campaign)
              }}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Completed Campaigns</h2>
          </div>
          
          <Suspense fallback={<div>Loading campaigns...</div>}>
            <CampaignList 
              profileId={id} 
              profileType={profile_type}
              status="completed"
              onCampaignSelect={(campaign) => {
                console.log('Selected campaign:', campaign)
              }}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="max-w-4xl mx-auto">
            <CampaignCreator 
              profileId={id}
              profileType={profile_type || 'talent'}
              onSuccess={() => {
                // Redirect to active campaigns tab
                window.location.href = `/campaigns?tab=active&profile_type=${profile_type}`
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Featured Campaigns Section */}
      {tab === 'active' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Featured Campaigns</h2>
            <p className="text-gray-600">Discover trending fundraising campaigns across all sports</p>
          </div>
          
          <Suspense fallback={<div>Loading featured campaigns...</div>}>
            <CampaignList 
              status="active"
              limit={6}
              onCampaignSelect={(campaign) => {
                console.log('Selected featured campaign:', campaign)
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}
