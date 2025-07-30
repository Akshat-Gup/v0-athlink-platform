import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

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
            return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 })
        }

        const body = await request.json()
        const { status } = body

        if (!status || !['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
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

        // Get the sponsorship request to verify ownership
        const { data: sponsorshipRequest, error: requestError } = await supabaseAdmin
            .from('sponsorship_requests')
            .select(`
        *,
        campaign:campaigns(*),
        perk_tier:perk_tiers(*)
      `)
            .eq('id', id)
            .eq('athlete_id', dbUser.id)
            .eq('status', 'PENDING')
            .single()

        if (requestError || !sponsorshipRequest) {
            return NextResponse.json({ error: 'Sponsorship request not found or already processed' }, { status: 404 })
        }

        // Update sponsorship request status
        const { data: updatedRequest, error: updateError } = await supabaseAdmin
            .from('sponsorship_requests')
            .update({
                status,
                escrow_status: status === 'ACCEPTED' ? 'RELEASED' : 'RETURNED'
            })
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            console.error('Error updating sponsorship request:', updateError)
            return NextResponse.json({ error: 'Failed to update sponsorship request' }, { status: 500 })
        }

        // If accepted, update campaign funding and perk tier sponsor count
        if (status === 'ACCEPTED') {
            // Update campaign funding
            const { error: campaignError } = await supabaseAdmin
                .from('campaigns')
                .update({
                    current_funding: sponsorshipRequest.campaign.current_funding + sponsorshipRequest.amount
                })
                .eq('id', sponsorshipRequest.campaign_id)

            if (campaignError) {
                console.error('Error updating campaign funding:', campaignError)
                // Note: In a real app, you might want to implement transaction rollback here
            }

            // If it's a perk tier sponsorship, increment sponsor count
            if (sponsorshipRequest.perk_tier_id && sponsorshipRequest.perk_tier) {
                const { error: perkTierError } = await supabaseAdmin
                    .from('perk_tiers')
                    .update({
                        current_sponsors: sponsorshipRequest.perk_tier.current_sponsors + 1
                    })
                    .eq('id', sponsorshipRequest.perk_tier_id)

                if (perkTierError) {
                    console.error('Error updating perk tier sponsor count:', perkTierError)
                    // Note: In a real app, you might want to implement transaction rollback here
                }
            }
        }

        return NextResponse.json({
            success: true,
            sponsorship_request: updatedRequest
        })

    } catch (error) {
        console.error('Error updating sponsorship request:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
