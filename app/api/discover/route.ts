import { NextRequest, NextResponse } from 'next/server'
import { getDiscoverData } from '@/lib/services/discover-service'

export async function GET(request: NextRequest) {
  try {
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

    const data = await getDiscoverData(filters)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching discover data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
