import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: 'Invalid profile ID' },
                { status: 400 }
            )
        }

        // Find the user's active campaign
        const { data: campaign, error } = await supabaseAdmin
            .from('campaigns')
            .select(`
        *,
        perk_tiers:perk_tiers!perk_tiers_campaign_id_fkey(*)
      `)
            .eq('athlete_id', id)
            .eq('status', 'ACTIVE')
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'No active campaign found for this profile' },
                    { status: 404 }
                )
            }
            console.error('Error fetching campaign data:', error)
            return NextResponse.json(
                { error: 'Failed to fetch campaign data' },
                { status: 500 }
            )
        }

        // Sort perk tiers by amount
        const campaignWithSortedTiers = {
            ...campaign,
            perk_tiers: campaign.perk_tiers?.sort((a: any, b: any) => a.amount - b.amount) || []
        }

        return NextResponse.json(campaignWithSortedTiers)
    } catch (error) {
        console.error('Error fetching campaign data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch campaign data' },
            { status: 500 }
        )
    }
}
