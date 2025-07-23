import { NextRequest, NextResponse } from 'next/server'
import { getTalentById } from '@/lib/data/talents'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const talent = await getTalentById(id)
    
    if (!talent) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 })
    }
    
    return NextResponse.json(talent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch talent' }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const updatedTalent = await updateTalent(id, data)
    return NextResponse.json(updatedTalent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update talent' }, 
      { status: 500 }
    )
  }
}
