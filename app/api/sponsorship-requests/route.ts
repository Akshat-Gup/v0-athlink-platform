import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user?.email) {
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
      is_custom 
    } = body

    if (!campaign_id || !athlete_id || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Campaign ID, athlete ID, and valid amount are required' }, { status: 400 })
    }

    if (is_custom && !custom_perks) {
      return NextResponse.json({ error: 'Custom perks are required for custom offers' }, { status: 400 })
    }

    // Get user from database (sponsor)
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single()

    if (userError || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify campaign exists and is open
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .select('id')
      .eq('id', campaign_id)
      .in('status', ['OPEN', 'ACTIVE'])
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found or not open for sponsorship' }, { status: 404 })
    }

    // If not custom, verify perk tier exists and has availability
    if (!is_custom && perk_tier_id) {
      const { data: perkTier, error: perkTierError } = await supabaseAdmin
        .from('perk_tiers')
        .select('id, max_sponsors, current_sponsors')
        .eq('id', perk_tier_id)
        .eq('campaign_id', campaign_id)
        .eq('is_active', true)
        .single()

      if (perkTierError || !perkTier) {
        return NextResponse.json({ error: 'Perk tier not found' }, { status: 404 })
      }

      if (perkTier.max_sponsors && perkTier.current_sponsors >= perkTier.max_sponsors) {
        return NextResponse.json({ error: 'This sponsorship tier is full' }, { status: 400 })
      }
    }

    // Create sponsorship request
    const { data: sponsorshipRequest, error: createError } = await supabaseAdmin
      .from('sponsorship_requests')
      .insert({
        campaign_id,
        sponsor_id: dbUser.id,
        athlete_id,
        perk_tier_id: is_custom ? null : perk_tier_id,
        amount,
        custom_perks: is_custom ? custom_perks : null,
        message,
        is_custom,
        status: 'PENDING',
        escrow_status: 'HELD'
      })
      .select(`
        *,
        campaign:campaigns(title),
        athlete:users!sponsorship_requests_athlete_id_fkey(name, email),
        perk_tier:perk_tiers(tier_name, description)
      `)
      .single()

    if (createError) {
      console.error('Error creating sponsorship request:', createError)
      return NextResponse.json({ error: 'Failed to create sponsorship request' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      sponsorship_request: sponsorshipRequest 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating sponsorship request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single()

    if (userError || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get sponsorship requests sent by this user
    const { data: sentRequests, error: sentError } = await supabaseAdmin
      .from('sponsorship_requests')
      .select(`
        *,
        campaign:campaigns(title),
        athlete:users!sponsorship_requests_athlete_id_fkey(name, email),
        perk_tier:perk_tiers(tier_name, description)
      `)
      .eq('sponsor_id', dbUser.id)
      .order('created_at', { ascending: false })

    // Get sponsorship requests received by this user (as athlete)
    const { data: receivedRequests, error: receivedError } = await supabaseAdmin
      .from('sponsorship_requests')
      .select(`
        *,
        campaign:campaigns(title),
        sponsor:users!sponsorship_requests_sponsor_id_fkey(name, email),
        perk_tier:perk_tiers(tier_name, description)
      `)
      .eq('athlete_id', dbUser.id)
      .order('created_at', { ascending: false })

    if (sentError || receivedError) {
      console.error('Error fetching sponsorship requests:', sentError || receivedError)
      return NextResponse.json({ error: 'Failed to fetch sponsorship requests' }, { status: 500 })
    }

    return NextResponse.json({ 
      sent_requests: sentRequests || [],
      received_requests: receivedRequests || []
    })

  } catch (error) {
    console.error('Error fetching sponsorship requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
