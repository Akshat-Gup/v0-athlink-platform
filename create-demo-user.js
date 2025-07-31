const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createDemoUser() {
  try {
    // Hash password for demo user
    const hashedPassword = await bcrypt.hash('demo123', 12)
    
    // Create demo user
    const user = await prisma.user.create({
      data: {
        email: 'demo@athlink.com',
        password: hashedPassword,
        name: 'Demo User',
        user_role: 'ATHLETE',
        primary_sport: 'Soccer',
        category: 'talent',
        verification_status: 'VERIFIED',
        is_active: true,
        bio: 'Demo user for testing favorites functionality',
        rating: 4.5,
        years_experience: 5
      }
    })
    
    console.log('Demo user created successfully!')
    console.log('Email: demo@athlink.com')
    console.log('Password: demo123')
    console.log('User ID:', user.id)
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Demo user already exists!')
      const user = await prisma.user.findUnique({
        where: { email: 'demo@athlink.com' }
      })
      console.log('User ID:', user?.id)
    } else {
      console.error('Error creating demo user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUser()
