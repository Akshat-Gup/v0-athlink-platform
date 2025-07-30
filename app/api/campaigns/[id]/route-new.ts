import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

// GET single campaign by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
        }

        const { data: campaign, error } = await supabaseAdmin
            .from('campaigns')
            .select(`
        *,
        athlete:users(*),
        perk_tiers:perk_tiers!perk_tiers_campaign_id_fkey(*)
      `)
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
            }
            console.error('Error fetching campaign:', error)
            return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
        }

        // Get accepted sponsorships
        const { data: acceptedSponsorships, error: sponsorshipError } = await supabaseAdmin
            .from('sponsorship_requests')
            .select(`
        amount,
        sponsor:users!sponsorship_requests_sponsor_id_fkey(name, profile_image)
      `)
            .eq('campaign_id', id)
            .eq('status', 'ACCEPTED')

        // Get pending requests count
        const { count: pendingRequestsCount, error: pendingError } = await supabaseAdmin
            .from('sponsorship_requests')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', id)
            .eq('status', 'PENDING')

        if (sponsorshipError || pendingError) {
            console.error('Error fetching sponsorship data:', sponsorshipError || pendingError)
        }

        // Calculate metrics
        const acceptedAmount = acceptedSponsorships?.reduce((sum, req) => sum + (req.amount || 0), 0) || 0
        const remaining_goal = Math.max(0, campaign.funding_goal - acceptedAmount)
        const progress_percentage = (acceptedAmount / campaign.funding_goal) * 100

        const campaignWithMetrics = {
            ...campaign,
            current_funding: acceptedAmount,
            remaining_goal,
            progress_percentage: Math.round(progress_percentage * 100) / 100,
            accepted_sponsorships: acceptedSponsorships || [],
            pending_requests_count: pendingRequestsCount || 0,
            is_fully_funded: remaining_goal <= 0,
            sponsors_count: acceptedSponsorships?.length || 0,
            perk_tiers: campaign.perk_tiers?.filter((tier: any) => tier.is_active).sort((a: any, b: any) => a.amount - b.amount) || []
        }

        return NextResponse.json({ campaign: campaignWithMetrics })

    } catch (error) {
        console.error('Error fetching campaign:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Full campaign update
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
        }

        const body = await request.json()
        const { title, description, funding_goal, deadline, perk_tiers } = body

        if (!title || !funding_goal || funding_goal <= 0) {
            return NextResponse.json({ error: 'Title and valid funding goal are required' }, { status: 400 })
        }

        if (!perk_tiers || !Array.isArray(perk_tiers) || perk_tiers.length === 0) {
            return NextResponse.json({ error: 'At least one perk tier is required' }, { status: 400 })
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

        // Check if user owns the campaign
        const { data: existingCampaign, error: campaignError } = await supabaseAdmin
            .from('campaigns')
            .select('*')
            .eq('id', id)
            .eq('athlete_id', dbUser.id)
            .single()

        if (campaignError || !existingCampaign) {
            return NextResponse.json({ error: 'Campaign not found or unauthorized' }, { status: 404 })
        }

        // Update campaign basic info
        const { error: updateError } = await supabaseAdmin
            .from('campaigns')
            .update({
                title,
                description,
                funding_goal: parseFloat(funding_goal),
                deadline: deadline ? new Date(deadline).toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (updateError) {
            console.error('Error updating campaign:', updateError)
            return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
        }

        // Delete existing perk tiers
        await supabaseAdmin
            .from('perk_tiers')
            .delete()
            .eq('campaign_id', id)

        // Create new perk tiers
        const newTiers = perk_tiers.map((tier: any) => ({
            campaign_id: id,
            tier_name: tier.tier_name,
            amount: parseFloat(tier.amount),
            description: tier.description,
            deliverables: JSON.stringify(tier.deliverables || {}),
            max_sponsors: tier.max_sponsors || null,
            current_sponsors: 0,
            is_active: true
        }))

        const { error: tiersError } = await supabaseAdmin
            .from('perk_tiers')
            .insert(newTiers)

        if (tiersError) {
            console.error('Error creating perk tiers:', tiersError)
            return NextResponse.json({ error: 'Failed to update perk tiers' }, { status: 500 })
        }

        // Get updated campaign with new perk tiers
        const { data: updatedCampaign, error: fetchError } = await supabaseAdmin
            .from('campaigns')
            .select(`
        *,
        perk_tiers:perk_tiers!perk_tiers_campaign_id_fkey(*),
        athlete:users(id, name, primary_sport, profile_image)
      `)
            .eq('id', id)
            .single()

        if (fetchError) {
            console.error('Error fetching updated campaign:', fetchError)
            return NextResponse.json({ error: 'Campaign updated but failed to fetch result' }, { status: 200 })
        }

        return NextResponse.json({
            success: true,
            campaign: {
                ...updatedCampaign,
                perk_tiers: updatedCampaign.perk_tiers?.filter((tier: any) => tier.is_active).sort((a: any, b: any) => a.amount - b.amount) || []
            }
        })

    } catch (error) {
        console.error('Error updating campaign:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
        }

        const body = await request.json()
        const { status } = body

        if (!status || !['OPEN', 'PAUSED', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return NextResponse.json({ error: 'Valid status is required' }, { status: 400 })
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

        // Update campaign (only if user owns it)
        const { error: updateError, count } = await supabaseAdmin
            .from('campaigns')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('athlete_id', dbUser.id)

        if (updateError) {
            console.error('Error updating campaign status:', updateError)
            return NextResponse.json({ error: 'Failed to update campaign status' }, { status: 500 })
        }

        if (count === 0) {
            return NextResponse.json({ error: 'Campaign not found or unauthorized' }, { status: 404 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error updating campaign:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - Delete campaign
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
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

        // Check if campaign exists and user owns it
        const { data: existingCampaign, error: campaignError } = await supabaseAdmin
            .from('campaigns')
            .select('id')
            .eq('id', id)
            .eq('athlete_id', dbUser.id)
            .single()

        if (campaignError || !existingCampaign) {
            return NextResponse.json({ error: 'Campaign not found or unauthorized' }, { status: 404 })
        }

        // Check if campaign has any sponsorship requests
        const { count: sponsorshipCount, error: countError } = await supabaseAdmin
            .from('sponsorship_requests')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', id)

        if (countError) {
            console.error('Error checking sponsorship requests:', countError)
            return NextResponse.json({ error: 'Failed to check campaign dependencies' }, { status: 500 })
        }

        if (sponsorshipCount && sponsorshipCount > 0) {
            return NextResponse.json({
                error: 'Cannot delete campaign with existing sponsorship requests. Set status to CANCELLED instead.'
            }, { status: 400 })
        }

        // Delete campaign (cascade will handle perk tiers if set up in DB)
        const { error: deleteError } = await supabaseAdmin
            .from('campaigns')
            .delete()
            .eq('id', id)

        if (deleteError) {
            console.error('Error deleting campaign:', deleteError)
            return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error deleting campaign:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
