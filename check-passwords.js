const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkUserPasswords() {
  try {
    console.log('🔍 Checking user passwords...\n')
    
    // Check all users
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true, 
        password: true, 
        category: true, 
        user_role: true 
      },
      orderBy: { category: 'asc' }
    })

    console.log('👥 All Users:')
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`)
      console.log(`    Category: ${user.category}, Role: ${user.user_role}`)
      console.log(`    Password set: ${user.password ? 'YES' : 'NO'}`)
      console.log()
    })

    // Check if any user has a password
    const usersWithPasswords = users.filter(u => u.password)
    const usersWithoutPasswords = users.filter(u => !u.password)

    console.log(`📊 Summary:`)
    console.log(`   • Total users: ${users.length}`)
    console.log(`   • Users with passwords: ${usersWithPasswords.length}`)
    console.log(`   • Users without passwords: ${usersWithoutPasswords.length}`)

    if (usersWithoutPasswords.length > 0) {
      console.log('\n🔧 Users need passwords:')
      usersWithoutPasswords.forEach(user => {
        console.log(`   - ${user.email}`)
      })
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserPasswords()
