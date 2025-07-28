import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
  baseLocationId: number
}) {
  try {
    console.log(`Creating new sponsor: ${sponsorData.name}...`)
    
    // Create sponsor user in User table
    const sponsorUser = await prisma.user.create({
      data: {
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
      },
    })

    // Create sponsor entry in Sponsor table
    const sponsor = await prisma.sponsor.create({
      data: {
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
      }
    })
    
    console.log(`✅ Created sponsor: ${sponsor.company_name} (User ID: ${sponsorUser.id}, Sponsor ID: ${sponsor.id})`)
    return { sponsorUser, sponsor }
    
  } catch (error) {
    console.error(`❌ Error creating sponsor ${sponsorData.name}:`, error)
    throw error
  }
}

// Example usage - uncomment to create a new sponsor
// async function addExampleSponsor() {
//   const locations = await prisma.location.findMany()
//   const newYorkLocation = locations.find(loc => loc.city === 'New York')
  
//   if (!newYorkLocation) {
//     console.error('❌ New York location not found')
//     return
//   }

//   await createNewSponsor({
//     name: 'FitnessPro Gear',
//     email: 'partnerships@fitnesspro.com',
//     companyName: 'FitnessPro Gear',
//     companyDescription: 'Premium fitness equipment and sportswear company supporting athletes worldwide.',
//     industry: 'Fitness Equipment',
//     website: 'https://fitnesspro.com',
//     contactName: 'Jennifer Smith',
//     contactPhone: '+1 (555) 234-5678',
//     budgetRange: '$3K-$20K',
//     preferredSports: ['Gymnastics', 'Track & Field', 'Swimming'],
//     location: 'New York, NY',
//     baseLocationId: newYorkLocation.id,
//   })
// }

// addExampleSponsor()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect())

export { createNewSponsor }
