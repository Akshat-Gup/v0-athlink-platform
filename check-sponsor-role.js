const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkSponsorRoles() {
  try {
    console.log('🔍 Checking sponsor user roles...\n')
    
    // Find all sponsor users
    const sponsorUsers = await prisma.user.findMany({
      where: { category: 'SPONSOR' },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        user_role: true, 
        category: true 
      }
    })
    
    console.log(`Found ${sponsorUsers.length} sponsor users:`)
    sponsorUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.user_role}`)
      console.log(`   Category: ${user.category}`)
      console.log('')
    })
    
    // Check specifically for TechCorp variations
    const techcorpEmails = [
      'sponsors@techcorp.com',
      'sponsor@techcorp.com', 
      'techcorp@example.com'
    ]
    
    console.log('🔍 Checking for TechCorp specifically...')
    for (const email of techcorpEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, user_role: true, category: true }
      })
      
      if (user) {
        console.log(`✅ Found TechCorp user: ${user.name} (${user.email})`)
        console.log(`   Role: ${user.user_role}`)
        console.log(`   Category: ${user.category}`)
        break
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSponsorRoles()
