import { NextRequest, NextResponse } from 'next/server'
import { getDiscoverData } from '@/lib/services/discover-service'
import { supabaseAdmin } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DISCOVER API ROUTE ===')

    // Get user session for authentication (optional for discover)
    let session = null
    if (supabaseAdmin) {
      try {
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.getSession()
        if (!sessionError) {
          session = sessionData.session
        }
      } catch (err) {
        console.log('No session available, continuing with anonymous access')
      }
    }

    console.log('Session exists:', !!session)
    console.log('User ID:', session?.user?.id || 'anonymous')

    const { searchParams } = new URL(request.url)

    const filters = {
      activeTab: searchParams.get('activeTab') || 'talents',
      searchMode: (searchParams.get('searchMode') as 'filter' | 'search' | 'ai') || 'filter',
      searchQuery: searchParams.get('searchQuery') || '',
      aiQuery: searchParams.get('aiQuery') || '',
      selectedTalentType: searchParams.get('selectedTalentType') || '',
      selectedFit: searchParams.get('selectedFit') || '',
      selectedSport: searchParams.get('selectedSport') || '',
      selectedLeague: searchParams.get('selectedLeague') || '',
      selectedExperience: searchParams.get('selectedExperience') || '',
      selectedRating: searchParams.get('selectedRating') || '',
      selectedLocation: searchParams.get('selectedLocation') || '',
      selectedBudget: searchParams.get('selectedBudget')
        ? JSON.parse(searchParams.get('selectedBudget')!) as [number, number]
        : undefined,
      startDate: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      endDate: searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : undefined,
    }

    console.log('Calling getDiscoverData with filters:', filters)
    const data = await getDiscoverData(filters)
    console.log('Discover data returned successfully')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching discover data:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
