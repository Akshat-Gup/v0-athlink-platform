import { supabaseAdmin } from '../lib/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function createNewSponsor(sponsorData: {
    name: string
    email: string
    companyName: string
    companyDescription: string
    industry: string
    website?: string
    contactName: string
    contactPhone: string
    budgetRange: string
    preferredSports: string[]
    location: string
    baseLocationId: string
}) {
    try {
        console.log(`Creating new sponsor: ${sponsorData.name}...`)

        const defaultPassword = '12345678'

        // First create the Supabase Auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: sponsorData.email,
            password: defaultPassword,
            email_confirm: true,
            user_metadata: {
                name: sponsorData.name
            }
        })

        if (authError) {
            throw authError
        }

        // Create sponsor user in User table
        const { data: sponsorUser, error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authUser.user.id,
                name: sponsorData.name,
                email: sponsorData.email,
                primary_sport: 'Multi-Sport',
                base_location_id: sponsorData.baseLocationId,
                country_code: 'US',
                country_flag: '🇺🇸',
                team_emoji: '🏢',
                rating: 4.8,
                bio: sponsorData.companyDescription,
                category: 'SPONSOR',
                user_role: 'sponsor',
                verification_status: 'VERIFIED',
                years_experience: 5,
            })
            .select()
            .single()

        if (userError) {
            throw userError
        }

        // Create sponsor entry in Sponsor table
        const { data: sponsor, error: sponsorError } = await supabaseAdmin
            .from('sponsors')
            .insert({
                user_id: sponsorUser.id,
                name: sponsorData.name,
                email: sponsorData.email,
                company_name: sponsorData.companyName,
                company_description: sponsorData.companyDescription,
                industry: sponsorData.industry,
                website: sponsorData.website,
                contact_name: sponsorData.contactName,
                contact_phone: sponsorData.contactPhone,
                budget_range: sponsorData.budgetRange,
                preferred_sports: JSON.stringify(sponsorData.preferredSports),
                location: sponsorData.location,
                verification_status: 'VERIFIED',
                is_active: true,
            })
            .select()
            .single()

        if (sponsorError) {
            throw sponsorError
        }

        console.log(`✅ Created sponsor: ${sponsor.company_name} (User ID: ${sponsorUser.id}, Sponsor ID: ${sponsor.id})`)
        console.log(`📧 Login credentials: ${sponsorData.email} / ${defaultPassword}`)
        return { sponsorUser, sponsor }

    } catch (error) {
        console.error(`❌ Error creating sponsor ${sponsorData.name}:`, error)
        throw error
    }
}

// Example usage - uncomment to create a new sponsor
async function addExampleSponsor() {
    try {
        const { data: locations, error: locError } = await supabaseAdmin
            .from('locations')
            .select('*')

        if (locError) {
            throw locError
        }

        const newYorkLocation = locations?.find(loc => loc.city === 'New York')

        if (!newYorkLocation) {
            console.error('❌ New York location not found')
            return
        }

        await createNewSponsor({
            name: 'FitnessPro Gear',
            email: 'partnerships@fitnesspro.com',
            companyName: 'FitnessPro Gear',
            companyDescription: 'Premium fitness equipment and sportswear company supporting athletes worldwide.',
            industry: 'Fitness Equipment',
            website: 'https://fitnesspro.com',
            contactName: 'Jennifer Smith',
            contactPhone: '+1 (555) 234-5678',
            budgetRange: '$3K-$20K',
            preferredSports: ['Gymnastics', 'Track & Field', 'Swimming'],
            location: 'New York, NY',
            baseLocationId: newYorkLocation.id,
        })
    } catch (error) {
        console.error('❌ Error in addExampleSponsor:', error)
    }
}

// Uncomment to run example
// addExampleSponsor()

export { createNewSponsor }
