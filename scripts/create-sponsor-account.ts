import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSponsorAccount() {
  try {
    console.log('Creating new sponsor account...')
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('12345678', 10)
    
    // Create sponsor in the new Sponsor table
    const sponsor = await prisma.sponsor.create({
      data: {
        name: 'Corporate Sponsor',
        email: 'sponsor@example.com',
        password: hashedPassword,
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
      }
    })
    
    console.log(`✅ Created sponsor account: ${sponsor.email} (ID: ${sponsor.id})`)
    console.log('✅ Sponsor account created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating sponsor:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createSponsorAccount()
  .catch((error) => {
    console.error('Sponsor creation failed:', error)
    process.exit(1)
  })
