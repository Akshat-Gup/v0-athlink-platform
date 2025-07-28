const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixSponsorRoles() {
  try {
    console.log('🔧 Fixing sponsor role capitalization...\n')
    
    // Update all sponsor users to have "Sponsor" with capital S
    const result = await prisma.user.updateMany({
      where: { 
        category: 'SPONSOR',
        user_role: 'sponsor'  // lowercase
      },
      data: {
        user_role: 'Sponsor'  // capital S
      }
    })
    
    console.log(`✅ Updated ${result.count} sponsor users to have "Sponsor" role`)
    
    // Verify the changes
    const sponsorUsers = await prisma.user.findMany({
      where: { category: 'SPONSOR' },
      select: { name: true, email: true, user_role: true }
    })
    
    console.log('\n📋 Updated sponsor users:')
    sponsorUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - Role: ${user.user_role}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSponsorRoles()
