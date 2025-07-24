import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function assignUserRoles() {
  console.log('🎭 Assigning user roles based on profile types...')
  
  try {
    // Get all users with their profile information
    const users = await prisma.user.findMany({
      include: {
        talent_profile: true,
        team_profile: true,
        event_profile: true,
      }
    })

    console.log(`Found ${users.length} users to assign roles`)

    for (const user of users) {
      let role = 'Talent' // Default role
      
      // Determine role based on profile type
      if (user.event_profile) {
        role = 'Event Leader'
      } else if (user.team_profile) {
        role = 'Team Leader'
      } else if (user.talent_profile) {
        role = 'Talent'
      } else {
        // For users without specific profiles, check category or sport
        if (user.primary_sport === 'Content Creation') {
          role = 'Talent' // Content creators are talents
        } else {
          role = 'Talent' // Default to talent
        }
      }

      // Update user with the determined role
      await prisma.user.update({
        where: { id: user.id },
        data: { user_role: role }
      })

      console.log(`✅ Assigned role "${role}" to ${user.name} (${user.email})`)
    }

    console.log('🎉 All user roles assigned successfully!')
    
    // Show summary
    const roleCounts = await prisma.user.groupBy({
      by: ['user_role'],
      _count: {
        user_role: true
      }
    })
    
    console.log('\n📊 Role Distribution:')
    roleCounts.forEach(roleCount => {
      console.log(`   ${roleCount.user_role}: ${roleCount._count.user_role} users`)
    })
    
  } catch (error) {
    console.error('❌ Error assigning roles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignUserRoles()
