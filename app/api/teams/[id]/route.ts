import { NextRequest, NextResponse } from 'next/server'

// Teams API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // TODO: Replace with actual database query
    const team = { id, name: "Sample Team" }
    
    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch team' }, 
      { status: 500 }
    )
  }
}
