import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function addSponsorUser() {
  console.log('👤 Adding sponsor user...')
  
  try {
    // Check if sponsor user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'sponsor@example.com' }
    })

    if (existingUser) {
      console.log('✅ Sponsor user already exists!')
      console.log(`📧 Email: ${existingUser.email}`)
      console.log(`👤 Name: ${existingUser.name}`)
      console.log(`🎭 Role: ${existingUser.user_role}`)
      return
    }

    // Hash the password
    const password = '12345678'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Get a location (we'll use Los Angeles)
    const location = await prisma.location.findFirst({
      where: { city: 'Los Angeles' }
    })

    if (!location) {
      console.error('❌ No location found. Please run the seed script first.')
      return
    }

    // Create the sponsor user
    const sponsorUser = await prisma.user.create({
      data: {
        name: 'Corporate Sponsor',
        email: 'sponsor@example.com',
        password: hashedPassword,
        user_role: 'Sponsor',
        primary_sport: 'Business',
        base_location_id: location.id,
        country_code: 'US',
        country_flag: '🇺🇸',
        team_emoji: '🏢',
        rating: 5.0,
        bio: 'Corporate sponsor looking to support talented athletes and events. We believe in investing in the future of sports and helping athletes achieve their dreams.',
        category: 'SPONSOR',
        verification_status: 'VERIFIED',
        years_experience: 10,
      }
    })

    console.log('🎉 Sponsor user created successfully!')
    console.log(`📧 Email: ${sponsorUser.email}`)
    console.log(`👤 Name: ${sponsorUser.name}`)
    console.log(`🎭 Role: ${sponsorUser.user_role}`)
    console.log(`🔑 Password: ${password}`)
    
  } catch (error) {
    console.error('❌ Error creating sponsor user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSponsorUser()
