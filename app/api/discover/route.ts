import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getDiscoverData } from '@/lib/services/discover-service'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    // Verify authentication first
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('Authentication error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate search parameters
    const { searchParams } = new URL(request.url)

    let selectedBudget: [number, number] | undefined
    try {
      const budgetParam = searchParams.get('selectedBudget')
      selectedBudget = budgetParam ? JSON.parse(budgetParam) as [number, number] : undefined
    } catch (parseError) {
      console.error('Error parsing selectedBudget:', parseError)
      return NextResponse.json(
        { error: 'Invalid budget parameter format' },
        { status: 400 }
      )
    }

    let startDate: Date | undefined
    let endDate: Date | undefined
    try {
      const startDateParam = searchParams.get('startDate')
      const endDateParam = searchParams.get('endDate')
      startDate = startDateParam ? new Date(startDateParam) : undefined
      endDate = endDateParam ? new Date(endDateParam) : undefined

      // Validate dates if provided
      if (startDate && isNaN(startDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid start date format' },
          { status: 400 }
        )
      }
      if (endDate && isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid end date format' },
          { status: 400 }
        )
      }
    } catch (dateError) {
      console.error('Error parsing dates:', dateError)
      return NextResponse.json(
        { error: 'Invalid date parameter format' },
        { status: 400 }
      )
    }

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
      selectedBudget,
      startDate,
      endDate,
    }

    // Validate search mode
    if (!['filter', 'search', 'ai'].includes(filters.searchMode)) {
      return NextResponse.json(
        { error: 'Invalid search mode. Must be filter, search, or ai' },
        { status: 400 }
      )
    }

    const data = await getDiscoverData(filters)
    return NextResponse.json(data)

  } catch (error) {
    console.error('Server error in discover API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
