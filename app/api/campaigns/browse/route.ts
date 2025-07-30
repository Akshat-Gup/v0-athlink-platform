import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function GET() {
  try {
    // Fetch active campaigns from all athletes (for sponsor browsing)
    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        *,
        athlete:users(*),
        perk_tiers:perk_tiers!perk_tiers_campaign_id_fkey(*)
      `)
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching campaigns for browsing:', error)
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }

    // Get sponsorship request counts for each campaign
    const campaignsWithCounts = await Promise.all(
      (campaigns || []).map(async (campaign) => {
        const { count, error: countError } = await supabaseAdmin
          .from('sponsorship_requests')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)

        if (countError) {
          console.error('Error counting sponsorship requests:', countError)
        }

        return {
          ...campaign,
          _count: {
            sponsorship_requests: count || 0
          },
          perk_tiers: campaign.perk_tiers?.sort((a: any, b: any) => a.amount - b.amount) || []
        }
      })
    )

    return NextResponse.json({ campaigns: campaignsWithCounts })

  } catch (error) {
    console.error('Error fetching campaigns for browsing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
