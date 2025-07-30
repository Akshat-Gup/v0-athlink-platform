import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const athleteId = searchParams.get('athlete_id')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = parseInt(searchParams.get('offset') || '0')
        const ownOnly = searchParams.get('own_only') === 'true'

        let query = supabaseAdmin
            .from('campaigns')
            .select(`
        *,
        athlete:users!athlete_id(id, name, email, category, bio, rating, primary_sport, country_flag, profile_image_id),
        perk_tiers(*),
        sponsorship_requests(amount, status, sponsor:users!sponsor_id(name, profile_image_id))
      `)

        // If requesting own campaigns only, require authentication
        if (ownOnly) {
            const authHeader = request.headers.get('Authorization')
            if (!authHeader) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            const token = authHeader.replace('Bearer ', '')
            const { data: { user }, error: authError } = await supabase.auth.getUser(token)

            if (authError || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            query = query.eq('athlete_id', user.id)
        } else {
            // Apply public filters
            if (status) {
                query = query.eq('status', status)
            }
            if (athleteId) {
                query = query.eq('athlete_id', athleteId)
            }
        }

        // Apply pagination
        const { data: campaigns, error } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            console.error('Error fetching campaigns:', error)
            return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
        }

        // Calculate metrics for each campaign
        const campaignsWithMetrics = campaigns?.map((campaign: any) => {
            const acceptedAmount = campaign.sponsorship_requests
                ?.filter((req: any) => req.status === 'APPROVED')
                .reduce((sum: number, req: any) => sum + req.amount, 0) || 0

            const remaining_goal = Math.max(0, campaign.funding_goal - acceptedAmount)
            const progress_percentage = (acceptedAmount / campaign.funding_goal) * 100
            const pending_requests_count = campaign.sponsorship_requests
                ?.filter((req: any) => req.status === 'PENDING').length || 0

            return {
                ...campaign,
                current_funding: acceptedAmount,
                remaining_goal,
                progress_percentage: Math.round(progress_percentage * 100) / 100,
                accepted_sponsorships: campaign.sponsorship_requests?.filter((req: any) => req.status === 'APPROVED') || [],
                pending_requests_count,
                is_fully_funded: remaining_goal <= 0,
                sponsors_count: campaign.sponsorship_requests?.filter((req: any) => req.status === 'APPROVED').length || 0
            }
        }) || []

        return NextResponse.json({ campaigns: campaignsWithMetrics })
    } catch (error) {
        console.error('Error in campaigns GET:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

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
        const { title, description, funding_goal, deadline, perk_tiers } = body

        // Validate required fields
        if (!title || !description || !funding_goal) {
            return NextResponse.json({
                error: 'Missing required fields: title, description, funding_goal'
            }, { status: 400 })
        }

        // Create campaign
        const { data: campaign, error: campaignError } = await supabaseAdmin
            .from('campaigns')
            .insert({
                athlete_id: user.id,
                title,
                description,
                funding_goal: parseFloat(funding_goal),
                deadline: deadline ? new Date(deadline).toISOString() : null,
                status: 'OPEN'
            })
            .select()
            .single()

        if (campaignError) {
            console.error('Error creating campaign:', campaignError)
            return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
        }

        // Create perk tiers if provided
        if (perk_tiers && Array.isArray(perk_tiers) && perk_tiers.length > 0) {
            const tierInserts = perk_tiers.map(tier => ({
                campaign_id: campaign.id,
                tier_name: tier.tier_name,
                amount: parseFloat(tier.amount),
                description: tier.description,
                deliverables: tier.deliverables,
                max_sponsors: tier.max_sponsors ? parseInt(tier.max_sponsors) : null
            }))

            const { error: tiersError } = await supabaseAdmin
                .from('perk_tiers')
                .insert(tierInserts)

            if (tiersError) {
                console.error('Error creating perk tiers:', tiersError)
                // Continue even if perk tiers fail - campaign is created
            }
        }

        // Fetch the complete campaign with relations
        const { data: completeCampaign, error: fetchError } = await supabaseAdmin
            .from('campaigns')
            .select(`
        *,
        athlete:users!athlete_id(id, name, email, category, bio, rating, primary_sport),
        perk_tiers(*)
      `)
            .eq('id', campaign.id)
            .single()

        if (fetchError) {
            console.error('Error fetching complete campaign:', fetchError)
            return NextResponse.json({ campaign }, { status: 201 })
        }

        return NextResponse.json({ campaign: completeCampaign }, { status: 201 })
    } catch (error) {
        console.error('Error in campaigns POST:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
