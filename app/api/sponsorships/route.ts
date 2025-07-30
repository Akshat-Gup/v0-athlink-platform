import { NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"

// GET /api/sponsorships - List sponsorship requests with filters
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role') // 'sponsor' or 'athlete'
    const campaignId = searchParams.get('campaign_id')

    let query = supabaseAdmin
      .from('sponsorship_requests')
      .select(`
        *,
        campaign:campaigns(*),
        sponsor:users!sponsor_id(id, name, email, profile_image_id),
        athlete:users!athlete_id(id, name, email, profile_image_id, primary_sport),
        perk_tier:perk_tiers(*)
      `)

    // Filter by role
    if (role === 'sponsor') {
      query = query.eq('sponsor_id', user.id)
    } else if (role === 'athlete') {
      query = query.eq('athlete_id', user.id)
    } else {
      // Default: show requests where user is either sponsor or athlete
      query = query.or(`sponsor_id.eq.${user.id},athlete_id.eq.${user.id}`)
    }

    // Additional filters
    if (status) {
      query = query.eq('status', status)
    }
    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }

    const { data: sponsorshipRequests, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sponsorship requests:', error)
      return NextResponse.json({ error: 'Failed to fetch sponsorship requests' }, { status: 500 })
    }

    return NextResponse.json({ sponsorshipRequests })
  } catch (error) {
    console.error('Error in sponsorships GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/sponsorships - Create a new sponsorship request
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      campaign_id,
      athlete_id,
      perk_tier_id,
      amount,
      custom_perks,
      message,
      is_custom = false
    } = body

    // Validate required fields
    if (!campaign_id || !athlete_id || !amount) {
      return NextResponse.json({
        error: 'Missing required fields: campaign_id, athlete_id, amount'
      }, { status: 400 })
    }

    // Verify the campaign exists
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .eq('id', campaign_id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Create the sponsorship request
    const { data: sponsorshipRequest, error } = await supabaseAdmin
      .from('sponsorship_requests')
      .insert({
        campaign_id,
        sponsor_id: user.id,
        athlete_id,
        perk_tier_id: perk_tier_id || null,
        amount: parseFloat(amount),
        custom_perks,
        message,
        is_custom,
        status: 'PENDING',
        escrow_status: 'HELD'
      })
      .select(`
        *,
        campaign:campaigns(*),
        sponsor:users!sponsor_id(id, name, email, profile_image_id),
        athlete:users!athlete_id(id, name, email, profile_image_id, primary_sport),
        perk_tier:perk_tiers(*)
      `)
      .single()

    if (error) {
      console.error('Error creating sponsorship request:', error)
      return NextResponse.json({ error: 'Failed to create sponsorship request' }, { status: 500 })
    }

    return NextResponse.json({ sponsorshipRequest }, { status: 201 })
  } catch (error) {
    console.error('Error in sponsorships POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/sponsorships - Update sponsorship request status
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, escrow_status } = body

    if (!id || !status) {
      return NextResponse.json({
        error: 'Missing required fields: id, status'
      }, { status: 400 })
    }

    // Verify the user has permission to update this request
    const { data: existingRequest, error: fetchError } = await supabaseAdmin
      .from('sponsorship_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingRequest) {
      return NextResponse.json({ error: 'Sponsorship request not found' }, { status: 404 })
    }

    // Only the athlete can approve/reject, sponsor can cancel
    if (existingRequest.athlete_id !== user.id && existingRequest.sponsor_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this request' }, { status: 403 })
    }

    // Update the request
    const updateData: any = { status }
    if (escrow_status) {
      updateData.escrow_status = escrow_status
    }

    const { data: updatedRequest, error } = await supabaseAdmin
      .from('sponsorship_requests')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        campaign:campaigns(*),
        sponsor:users!sponsor_id(id, name, email, profile_image_id),
        athlete:users!athlete_id(id, name, email, profile_image_id, primary_sport),
        perk_tier:perk_tiers(*)
      `)
      .single()

    if (error) {
      console.error('Error updating sponsorship request:', error)
      return NextResponse.json({ error: 'Failed to update sponsorship request' }, { status: 500 })
    }

    return NextResponse.json({ sponsorshipRequest: updatedRequest })
  } catch (error) {
    console.error('Error in sponsorships PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
