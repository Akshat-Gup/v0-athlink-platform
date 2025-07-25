import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function migrateSponsorUsers() {
  try {
    console.log('Starting sponsor migration...')
    
    // Find all users with SPONSOR role
    const sponsorUsers = await prisma.user.findMany({
      where: {
        user_role: 'SPONSOR'
      }
    })
    
    console.log(`Found ${sponsorUsers.length} sponsor users to migrate`)
    
    for (const user of sponsorUsers) {
      // Create corresponding record in Sponsor table
      const sponsor = await prisma.sponsor.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          company_name: user.name.includes('Corporate') ? user.name : undefined,
          company_description: user.bio,
          contact_name: user.name,
          verification_status: user.verification_status,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at,
        }
      })
      
      console.log(`✅ Migrated user ${user.email} to sponsor ID ${sponsor.id}`)
      
      // Update any existing sponsorship requests to reference the new sponsor
      await prisma.sponsorshipRequest.updateMany({
        where: {
          sponsor_id: user.id
        },
        data: {
          sponsor_entity_id: sponsor.id,
          sponsor_id: null  // Remove reference to user table
        }
      })
      
      // Optionally, you can delete the user record or mark it as inactive
      // For safety, let's just mark it as inactive
      await prisma.user.update({
        where: { id: user.id },
        data: { is_active: false }
      })
      
      console.log(`✅ Updated sponsorship requests and deactivated user ${user.email}`)
    }
    
    console.log('✅ Sponsor migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Error migrating sponsors:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateSponsorUsers()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
