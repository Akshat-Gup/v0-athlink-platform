const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function addPasswordsToUsers() {
  try {
    console.log('🔐 Adding passwords to all users...\n')
    
    // Hash the password "12345678"
    const hashedPassword = await bcrypt.hash('12345678', 10)
    console.log('✅ Password hashed successfully')
    
    // Update all users to have the same password
    const result = await prisma.user.updateMany({
      data: {
        password: hashedPassword
      }
    })
    
    console.log(`✅ Updated ${result.count} users with password "12345678"`)
    
    // Verify the update
    const usersWithPasswords = await prisma.user.count({
      where: {
        password: {
          not: null
        }
      }
    })
    
    console.log(`✅ Verified: ${usersWithPasswords} users now have passwords`)
    
    // List all users for confirmation
    const users = await prisma.user.findMany({
      select: { 
        name: true, 
        email: true, 
        category: true, 
        user_role: true 
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    })

    console.log('\n📋 All users can now log in with password "12345678":')
    
    const sponsors = users.filter(u => u.category === 'SPONSOR')
    const talents = users.filter(u => u.category === 'TALENT')
    
    console.log('\n🏢 SPONSORS:')
    sponsors.forEach(user => {
      console.log(`  • ${user.email} (${user.name})`)
    })
    
    console.log('\n👥 TALENTS:')
    talents.forEach(user => {
      console.log(`  • ${user.email} (${user.name} - ${user.user_role})`)
    })
    
  } catch (error) {
    console.error('❌ Error adding passwords:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addPasswordsToUsers()
