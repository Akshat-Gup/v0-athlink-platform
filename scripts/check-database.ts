import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('Checking database contents...')
    
    const users = await prisma.user.findMany({
      include: {
        talent_profile: true,
        team_profile: true,
        event_profile: true,
      }
    })
    
    console.log(`Found ${users.length} users:`)
    users.forEach(user => {
      const profileType = user.talent_profile ? 'Talent' : 
                         user.team_profile ? 'Team' : 
                         user.event_profile ? 'Event' : 'No Profile'
      console.log(`- ${user.email} (${user.name}) - ${profileType} - Active: ${user.is_active} - Verified: ${user.verification_status}`)
    })
    
    const sponsors = await prisma.sponsor.findMany()
    console.log(`\nFound ${sponsors.length} sponsors:`)
    sponsors.forEach(sponsor => {
      console.log(`- ${sponsor.email} (${sponsor.name}) - Active: ${sponsor.is_active}`)
    })
    
  } catch (error) {
    console.error('Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
