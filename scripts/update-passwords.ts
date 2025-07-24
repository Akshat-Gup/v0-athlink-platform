import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updateUserPasswords() {
  console.log('🔐 Updating user passwords...')
  
  try {
    // Get all users without passwords
    const users = await prisma.user.findMany({
      where: {
        password: null
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    console.log(`Found ${users.length} users without passwords`)

    // Default password for all users
    const defaultPassword = '12345678'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Update each user with the hashed password
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      console.log(`✅ Updated password for ${user.name} (${user.email})`)
    }

    console.log('🎉 All user passwords updated successfully!')
    console.log(`📧 Users can now login with their email and password: ${defaultPassword}`)
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserPasswords()
