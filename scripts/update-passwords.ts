import { supabaseAdmin } from '../lib/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function updateUserPasswords() {
    console.log('🔐 Creating Supabase Auth accounts for users...')

    try {
        // Get all users from our database
        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select('id, email, name')

        if (error) {
            throw error
        }

        console.log(`Found ${users?.length || 0} users to process`)

        if (!users || users.length === 0) {
            console.log('No users found.')
            return
        }

        // Default password for all users
        const defaultPassword = '12345678'

        // Create auth accounts for each user
        for (const user of users) {
            try {
                // Check if auth user already exists
                const { data: existingAuth } = await supabaseAdmin.auth.admin.getUserById(user.id)

                if (existingAuth.user) {
                    console.log(`✅ Auth account already exists for ${user.name} (${user.email})`)
                    continue
                }

                // Create new auth user
                const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                    email: user.email,
                    password: defaultPassword,
                    email_confirm: true,
                    user_metadata: {
                        name: user.name
                    }
                })

                if (authError) {
                    console.error(`❌ Error creating auth account for ${user.name}:`, authError.message)
                } else {
                    console.log(`✅ Created auth account for ${user.name} (${user.email})`)
                }
            } catch (err) {
                console.error(`❌ Error processing ${user.name}:`, err)
            }
        }

        console.log('🎉 User auth accounts processed successfully!')
        console.log(`📧 Users can now login with their email and password: ${defaultPassword}`)

    } catch (error) {
        console.error('❌ Error processing users:', error)
    }
}

updateUserPasswords()
