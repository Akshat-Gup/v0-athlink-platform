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
      profile_id, 
      profile_type, // "talent", "team", "event"
      amount, 
      custom_conditions, 
      message
    } = body

    if (!profile_id || !profile_type || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Profile ID, profile type, and valid amount are required' }, { status: 400 })
    }

    // Get sponsor user from database
    const { data: sponsor, error: sponsorError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single()

    if (sponsorError || !sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    // Get the profile owner (athlete/campaign owner)
    const { data: profileOwner, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', profile_id)
      .single()

    if (profileError || !profileOwner) {
      return NextResponse.json({ error: 'Profile owner not found' }, { status: 404 })
    }

    // Create contribution request in the SponsorContribution table
    const { data: contributionRequest, error: createError } = await supabaseAdmin
      .from('sponsor_contributions')
      .insert({
        sponsor_id: sponsor.id,
        recipient_id: profileOwner.id,
        amount,
        currency: 'USD',
        message: message || custom_conditions || null,
        status: 'PENDING'
      })
      .select(`
        *,
        sponsor:users!sponsor_contributions_sponsor_id_fkey(id, name, email),
        recipient:users!sponsor_contributions_recipient_id_fkey(id, name, email)
      `)
      .single()

    if (createError) {
      console.error('Error creating contribution request:', createError)
      return NextResponse.json({ error: 'Failed to create contribution request' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      contribution_request: contributionRequest
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating contribution request:', error)
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

    // Get contribution requests sent by this user (as sponsor)
    const { data: sentRequests, error: sentError } = await supabaseAdmin
      .from('sponsor_contributions')
      .select(`
        *,
        recipient:users!sponsor_contributions_recipient_id_fkey(id, name, email)
      `)
      .eq('sponsor_id', dbUser.id)
      .order('created_at', { ascending: false })

    // Get contribution requests received by this user (as profile owner)
    const { data: receivedRequests, error: receivedError } = await supabaseAdmin
      .from('sponsor_contributions')
      .select(`
        *,
        sponsor:users!sponsor_contributions_sponsor_id_fkey(id, name, email)
      `)
      .eq('recipient_id', dbUser.id)
      .order('created_at', { ascending: false })

    if (sentError || receivedError) {
      console.error('Error fetching contribution requests:', sentError || receivedError)
      return NextResponse.json({ error: 'Failed to fetch contribution requests' }, { status: 500 })
    }

    return NextResponse.json({ 
      sent_requests: sentRequests || [],
      received_requests: receivedRequests || []
    })

  } catch (error) {
    console.error('Error fetching contribution requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
