// Updated script to work with Supabase instead of Prisma
// This script assigns user roles based on their category

import { supabaseAdmin } from '../lib/supabase'

async function assignUserRoles() {
  try {
    console.log('Starting user role assignment...')

    // Get all users without roles
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or('user_role.is.null,user_role.eq.')

    if (error) {
      console.error('Error fetching users:', error)
      return
    }

    console.log(`Found ${users?.length || 0} users without roles`)

    if (!users || users.length === 0) {
      console.log('No users need role assignment')
      return
    }

    for (const user of users) {
      let assignedRole = 'USER' // default role

      // Assign roles based on category
      switch (user.category) {
        case 'ATHLETE':
          assignedRole = 'ATHLETE'
          break
        case 'TEAM':
          assignedRole = 'TEAM_MANAGER'
          break
        case 'EVENT':
          assignedRole = 'EVENT_ORGANIZER'
          break
        case 'SPONSOR':
          assignedRole = 'SPONSOR'
          break
        default:
          assignedRole = 'USER'
      }

      // Update user role
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ user_role: assignedRole })
        .eq('id', user.id)

      if (updateError) {
        console.error(`Error updating user ${user.id}:`, updateError)
      } else {
        console.log(`✓ Assigned role "${assignedRole}" to user: ${user.name} (${user.email})`)
      }
    }

    // Get role statistics
    const { data: roleStats, error: statsError } = await supabaseAdmin
      .from('users')
      .select('user_role')
      .not('user_role', 'is', null)

    if (statsError) {
      console.error('Error getting role stats:', statsError)
    } else {
      const stats = roleStats?.reduce((acc: any, user) => {
        acc[user.user_role] = (acc[user.user_role] || 0) + 1
        return acc
      }, {}) || {}

      console.log('\n=== Final Role Distribution ===')
      Object.entries(stats).forEach(([role, count]) => {
        console.log(`${role}: ${count}`)
      })
    }

    console.log('\nUser role assignment completed successfully!')
  } catch (error) {
    console.error('Error in assignUserRoles:', error)
  }
}

// Run the script
assignUserRoles()
  .catch(console.error)
