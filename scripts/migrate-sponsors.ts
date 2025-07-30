import { supabaseAdmin } from '../lib/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function migrateSponsorUsers() {
    try {
        console.log('Starting sponsor migration...')

        // Find all users with SPONSOR role
        const { data: sponsorUsers, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('user_role', 'SPONSOR')

        if (error) {
            throw error
        }

        console.log(`Found ${sponsorUsers?.length || 0} sponsor users to migrate`)

        if (!sponsorUsers || sponsorUsers.length === 0) {
            console.log('No sponsor users found to migrate.')
            return
        }

        for (const user of sponsorUsers) {
            try {
                // Create corresponding record in Sponsor table
                const { data: sponsor, error: sponsorError } = await supabaseAdmin
                    .from('sponsors')
                    .insert({
                        name: user.name,
                        email: user.email,
                        company_name: user.name.includes('Corporate') ? user.name : null,
                        company_description: user.bio,
                        contact_name: user.name,
                        verification_status: user.verification_status,
                        is_active: user.is_active,
                        created_at: user.created_at,
                        updated_at: user.updated_at,
                    })
                    .select()
                    .single()

                if (sponsorError) {
                    console.error(`❌ Error creating sponsor for ${user.email}:`, sponsorError)
                    continue
                }

                console.log(`✅ Migrated user ${user.email} to sponsor ID ${sponsor.id}`)

                // Update any existing sponsorship requests to reference the new sponsor
                const { error: updateError } = await supabaseAdmin
                    .from('sponsorship_requests')
                    .update({
                        sponsor_entity_id: sponsor.id,
                        sponsor_id: null  // Remove reference to user table
                    })
                    .eq('sponsor_id', user.id)

                if (updateError) {
                    console.error(`❌ Error updating sponsorship requests for ${user.email}:`, updateError)
                }

                // Mark user as inactive for safety
                const { error: deactivateError } = await supabaseAdmin
                    .from('users')
                    .update({ is_active: false })
                    .eq('id', user.id)

                if (deactivateError) {
                    console.error(`❌ Error deactivating user ${user.email}:`, deactivateError)
                } else {
                    console.log(`✅ Updated sponsorship requests and deactivated user ${user.email}`)
                }

            } catch (userError) {
                console.error(`❌ Error processing user ${user.email}:`, userError)
            }
        }

        console.log('✅ Sponsor migration completed successfully!')

    } catch (error) {
        console.error('❌ Error migrating sponsors:', error)
        throw error
    }
}

migrateSponsorUsers()
    .catch((error) => {
        console.error('Migration failed:', error)
        process.exit(1)
    })
