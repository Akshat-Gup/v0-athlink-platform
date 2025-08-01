import { supabaseAdmin } from '@/lib/supabase'

async function checkDatabaseContent() {
    console.log('🔍 Checking database content...')

    try {
        // Check users table
        const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select('*')
            .limit(10)

        if (usersError) {
            console.error('❌ Error fetching users:', usersError)
        } else {
            console.log('👥 Users table:', {
                totalSample: users?.length || 0,
                users: users?.map(u => ({
                    id: u.id,
                    name: u.name,
                    category: u.category,
                    primary_sport: u.primary_sport,
                    is_active: u.is_active,
                    rating: u.rating
                }))
            })
        }

        // Check talent_profiles table
        const { data: talentProfiles, error: talentError } = await supabaseAdmin
            .from('talent_profiles')
            .select('*')
            .limit(5)

        if (talentError) {
            console.error('❌ Error fetching talent profiles:', talentError)
        } else {
            console.log('🏃 Talent profiles table:', {
                totalSample: talentProfiles?.length || 0,
                profiles: talentProfiles?.map(p => ({
                    user_id: p.user_id,
                    price: p.price,
                    fit_type: p.fit_type
                }))
            })
        }

        // Check team_profiles table
        const { data: teamProfiles, error: teamError } = await supabaseAdmin
            .from('team_profiles')
            .select('*')
            .limit(5)

        if (teamError) {
            console.error('❌ Error fetching team profiles:', teamError)
        } else {
            console.log('🏀 Team profiles table:', {
                totalSample: teamProfiles?.length || 0
            })
        }

        // Check locations table
        const { data: locations, error: locationError } = await supabaseAdmin
            .from('locations')
            .select('*')
            .limit(5)

        if (locationError) {
            console.error('❌ Error fetching locations:', locationError)
        } else {
            console.log('📍 Locations table:', {
                totalSample: locations?.length || 0,
                locations: locations?.map(l => ({
                    id: l.id,
                    city: l.city,
                    country: l.country
                }))
            })
        }

        // Check the specific query that discover uses
        console.log('\n🎯 Testing discover query...')
        const { data: discoverUsers, error: discoverError } = await supabaseAdmin
            .from('users')
            .select(`
        *,
        base_location:locations!base_location_id(*),
        talent_type:talent_types!talent_type_id(*),
        talent_profile:talent_profiles(*),
        team_profile:team_profiles(*),
        event_profile:event_profiles(*),
        user_tags:user_tags(tag:tags(*)),
        media_items(*)
      `)
            .neq('category', 'SPONSOR')
            .eq('is_active', true)
            .limit(5)

        if (discoverError) {
            console.error('❌ Discover query error:', discoverError)
        } else {
            console.log('✅ Discover query result:', {
                count: discoverUsers?.length || 0,
                sample: discoverUsers?.[0] ? {
                    id: discoverUsers[0].id,
                    name: discoverUsers[0].name,
                    category: discoverUsers[0].category,
                    hasLocation: !!discoverUsers[0].base_location,
                    hasTalentProfile: !!discoverUsers[0].talent_profile,
                    hasTeamProfile: !!discoverUsers[0].team_profile
                } : 'No data'
            })
        }

    } catch (error) {
        console.error('❌ Script error:', error)
    }
}

checkDatabaseContent()
