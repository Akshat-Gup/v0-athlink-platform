// Test script to verify Supabase connection and basic operations
import { supabase, supabaseAdmin } from '../lib/supabase'

async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase Connection...\n')

    try {
        // Test 1: Basic connection
        console.log('1. Testing basic connection...')
        const { data, error } = await supabaseAdmin.from('users').select('count(*)', { count: 'exact' })

        if (error) {
            console.error('❌ Connection failed:', error.message)
            if (error.message.includes('relation "users" does not exist')) {
                console.log('💡 Hint: You need to run the database schema first')
                console.log('   Go to Supabase Dashboard > SQL Editor and run supabase/apply-schema.sql')
            }
            return
        }

        console.log('✅ Connection successful!')
        console.log(`   Found ${data?.[0]?.count || 0} users in database\n`)

        // Test 2: Create a test user (with auth)
        console.log('2. Testing user creation...')
        const testEmail = `test-${Date.now()}@example.com`
        const testPassword = 'TestPassword123!'

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    name: 'Test User'
                }
            }
        })

        if (authError) {
            console.error('❌ Auth signup failed:', authError.message)
        } else {
            console.log('✅ Test user created successfully!')
            console.log(`   User ID: ${authData.user?.id}`)
            console.log(`   Email: ${authData.user?.email}\n`)

            // Clean up test user
            if (authData.user) {
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
                console.log('🧹 Test user cleaned up\n')
            }
        }

        // Test 3: Check RLS policies
        console.log('3. Testing Row Level Security...')
        const { data: rlsData, error: rlsError } = await supabase.from('users').select('*').limit(1)

        if (rlsError) {
            console.log('⚠️  RLS is working (access denied without auth)')
            console.log(`   Error: ${rlsError.message}\n`)
        } else {
            console.log('⚠️  RLS might not be properly configured')
            console.log('   Public access to users table is allowed\n')
        }

        // Test 4: Admin access
        console.log('4. Testing admin access...')
        const { data: adminData, error: adminError } = await supabaseAdmin
            .from('users')
            .select('id, name, email, category')
            .limit(5)

        if (adminError) {
            console.error('❌ Admin access failed:', adminError.message)
        } else {
            console.log('✅ Admin access working!')
            console.log(`   Retrieved ${adminData?.length || 0} user records\n`)
        }

        // Test 5: Check environment variables
        console.log('5. Checking environment variables...')
        const requiredEnvVars = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'SUPABASE_SERVICE_ROLE_KEY'
        ]

        let envCheck = true
        requiredEnvVars.forEach(envVar => {
            if (!process.env[envVar]) {
                console.error(`❌ Missing environment variable: ${envVar}`)
                envCheck = false
            } else {
                console.log(`✅ ${envVar} is set`)
            }
        })

        if (envCheck) {
            console.log('✅ All environment variables are configured\n')
        } else {
            console.log('❌ Some environment variables are missing\n')
        }

        console.log('🎉 Supabase test completed!')

    } catch (error) {
        console.error('💥 Unexpected error:', error)
    }
}

// Export for use in other scripts
export { testSupabaseConnection }

// Run if called directly
if (require.main === module) {
    testSupabaseConnection()
}
