import { supabaseAdmin } from '../lib/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function createSponsorAccount() {
    try {
        console.log('Creating new sponsor account...')

        const defaultPassword = '12345678'
        const sponsorEmail = 'sponsor@example.com'

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
            throw authError
        }

        console.log(`✅ Created auth user: ${sponsorEmail}`)

        // Create user record in our database
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authUser.user.id,
                email: sponsorEmail,
                name: 'Corporate Sponsor',
                user_role: 'SPONSOR',
                category: 'Sponsor',
                verification_status: 'VERIFIED',
                is_active: true,
            })
            .select()
            .single()

        if (userError) {
            throw userError
        }

        console.log(`✅ Created user record: ${user.email} (ID: ${user.id})`)

        // Create sponsor in the sponsors table
        const { data: sponsor, error: sponsorError } = await supabaseAdmin
            .from('sponsors')
            .insert({
                user_id: user.id,
                name: 'Corporate Sponsor',
                email: sponsorEmail,
                company_name: 'TechCorp Sponsors',
                company_description: 'Leading technology company dedicated to supporting athletes and sports events. We believe in investing in the future of sports and helping athletes achieve their dreams through strategic partnerships.',
                industry: 'Technology',
                website: 'https://techcorp-sponsors.com',
                contact_name: 'Sarah Johnson',
                contact_phone: '+1 (555) 123-4567',
                budget_range: '$10K-$50K',
                preferred_sports: JSON.stringify(['Tennis', 'Basketball', 'Swimming', 'Soccer', 'Track & Field']),
                location: 'San Francisco, CA',
                verification_status: 'VERIFIED',
                is_active: true,
            })
            .select()
            .single()

        if (sponsorError) {
            throw sponsorError
        }

        console.log(`✅ Created sponsor account: ${sponsor.email} (ID: ${sponsor.id})`)
        console.log(`📧 Login credentials: ${sponsorEmail} / ${defaultPassword}`)
        console.log('✅ Sponsor account created successfully!')

    } catch (error) {
        console.error('❌ Error creating sponsor:', error)
        throw error
    }
}

createSponsorAccount()
    .catch((error) => {
        console.error('Sponsor creation failed:', error)
        process.exit(1)
    })
