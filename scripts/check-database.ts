import { supabaseAdmin } from '../lib/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function checkDatabase() {
    try {
        console.log('Checking database contents...')

        // Get users with their profiles
        const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select(`
        *,
        talent_profile:talent_profiles(*),
        team_profile:team_profiles(*),
        event_profile:event_profiles(*)
      `)

        if (usersError) {
            throw usersError
        }

        console.log(`Found ${users?.length || 0} users:`)
        users?.forEach(user => {
            const profileType = user.talent_profile ? 'Talent' :
                user.team_profile ? 'Team' :
                    user.event_profile ? 'Event' : 'No Profile'
            console.log(`- ${user.email} (${user.name}) - ${profileType} - Active: ${user.is_active} - Verified: ${user.verification_status}`)
        })

        // Get sponsors
        const { data: sponsors, error: sponsorsError } = await supabaseAdmin
            .from('sponsors')
            .select('*')

        if (sponsorsError) {
            console.error('Error fetching sponsors:', sponsorsError)
        } else {
            console.log(`\nFound ${sponsors?.length || 0} sponsors:`)
            sponsors?.forEach(sponsor => {
                console.log(`- ${sponsor.email} (${sponsor.name}) - Active: ${sponsor.is_active}`)
            })
        }

        // Get campaigns
        const { data: campaigns, error: campaignsError } = await supabaseAdmin
            .from('campaigns')
            .select('id, title, status, funding_goal, current_funding')

        if (campaignsError) {
            console.error('Error fetching campaigns:', campaignsError)
        } else {
            console.log(`\nFound ${campaigns?.length || 0} campaigns:`)
            campaigns?.forEach(campaign => {
                console.log(`- ${campaign.title} - Status: ${campaign.status} - Funding: $${campaign.current_funding}/$${campaign.funding_goal}`)
            })
        }

        // Get locations
        const { data: locations, error: locationsError } = await supabaseAdmin
            .from('locations')
            .select('id, city, state, country')
            .limit(5)

        if (locationsError) {
            console.error('Error fetching locations:', locationsError)
        } else {
            console.log(`\nSample locations (showing first 5):`)
            locations?.forEach(location => {
                console.log(`- ${location.city}, ${location.state}, ${location.country}`)
            })
        }

        console.log('\n✅ Database check completed!')

    } catch (error) {
        console.error('❌ Error checking database:', error)
    }
}

checkDatabase()
