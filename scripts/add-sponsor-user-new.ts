import { supabaseAdmin } from '../lib/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function addSponsorUser() {
    console.log('👤 Adding sponsor user...')

    try {
        const sponsorEmail = 'sponsor@example.com'
        const defaultPassword = '12345678'

        // Check if sponsor user already exists
        const { data: existingUser, error: userCheckError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', sponsorEmail)
            .single()

        if (existingUser && !userCheckError) {
            console.log('✅ Sponsor user already exists!')
            console.log(`📧 Email: ${existingUser.email}`)
            console.log(`👤 Name: ${existingUser.name}`)
            console.log(`🎭 Role: ${existingUser.user_role}`)
            return
        }

        // Get a location (we'll use Los Angeles)
        const { data: location, error: locationError } = await supabaseAdmin
            .from('locations')
            .select('*')
            .eq('city', 'Los Angeles')
            .single()

        if (locationError || !location) {
            console.error('❌ No location found. Please ensure locations are seeded first.')
            // Use a default UUID for location if none found
            console.log('Using default location...')
        }

        // First create the Supabase Auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: sponsorEmail,
            password: defaultPassword,
            email_confirm: true,
            user_metadata: {
                name: 'Corporate Sponsor'
            }
        })

        if (authError) {
            // Check if user already exists in auth
            if (authError.message.includes('already registered')) {
                console.log('✅ Auth user already exists, creating database record...')

                // Get existing auth user
                const { data: existingAuthUser, error: getAuthError } = await supabaseAdmin.auth.admin.listUsers()
                const authUserData = existingAuthUser?.users.find(u => u.email === sponsorEmail)

                if (!authUserData) {
                    throw new Error('Could not find existing auth user')
                }

                // Create database user record
                const { data: sponsorUser, error: createUserError } = await supabaseAdmin
                    .from('users')
                    .insert({
                        id: authUserData.id,
                        name: 'Corporate Sponsor',
                        email: sponsorEmail,
                        user_role: 'Sponsor',
                        primary_sport: 'Business',
                        base_location_id: location?.id || '00000000-0000-0000-0000-000000000000',
                        country_code: 'US',
                        country_flag: '🇺🇸',
                        team_emoji: '🏢',
                        rating: 5.0,
                        bio: 'Corporate sponsor looking to support talented athletes and events. We believe in investing in the future of sports and helping athletes achieve their dreams.',
                        category: 'SPONSOR',
                        verification_status: 'VERIFIED',
                        years_experience: 10,
                    })
                    .select()
                    .single()

                if (createUserError) {
                    throw createUserError
                }

                console.log('🎉 Sponsor user database record created successfully!')
                console.log(`📧 Email: ${sponsorUser.email}`)
                console.log(`👤 Name: ${sponsorUser.name}`)
                console.log(`🎭 Role: ${sponsorUser.user_role}`)
                console.log(`🔑 Password: ${defaultPassword}`)
                return
            } else {
                throw authError
            }
        }

        // Create the sponsor user in our database
        const { data: sponsorUser, error: createUserError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authUser.user.id,
                name: 'Corporate Sponsor',
                email: sponsorEmail,
                user_role: 'Sponsor',
                primary_sport: 'Business',
                base_location_id: location?.id || '00000000-0000-0000-0000-000000000000',
                country_code: 'US',
                country_flag: '🇺🇸',
                team_emoji: '🏢',
                rating: 5.0,
                bio: 'Corporate sponsor looking to support talented athletes and events. We believe in investing in the future of sports and helping athletes achieve their dreams.',
                category: 'SPONSOR',
                verification_status: 'VERIFIED',
                years_experience: 10,
            })
            .select()
            .single()

        if (createUserError) {
            throw createUserError
        }

        console.log('🎉 Sponsor user created successfully!')
        console.log(`📧 Email: ${sponsorUser.email}`)
        console.log(`👤 Name: ${sponsorUser.name}`)
        console.log(`🎭 Role: ${sponsorUser.user_role}`)
        console.log(`🔑 Password: ${defaultPassword}`)

    } catch (error) {
        console.error('❌ Error creating sponsor user:', error)
    }
}

addSponsorUser()
