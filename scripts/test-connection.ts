// Test script with explicit environment loading
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') })

// Now import Supabase after env vars are loaded
import { createClient } from '@supabase/supabase-js'

async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase Connection...\n')

    try {
        // Check environment variables first
        console.log('1. Checking environment variables...')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl) {
            console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set')
            return
        }
        if (!supabaseAnonKey) {
            console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
            return
        }
        if (!supabaseServiceKey) {
            console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set')
            return
        }

        console.log('✅ All environment variables are set')
        console.log(`   URL: ${supabaseUrl}`)
        console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...`)
        console.log(`   Service Key: ${supabaseServiceKey.substring(0, 20)}...\n`)

        // Create Supabase clients
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // Test 2: Basic connection test
        console.log('2. Testing basic connection...')

        // Try to query a simple system table first
        const { data: healthData, error: healthError } = await supabaseAdmin
            .from('pg_stat_activity')
            .select('datname')
            .limit(1)

        if (healthError) {
            console.log('⚠️  Direct system table access failed (this is normal)')
            console.log(`   Error: ${healthError.message}`)
        } else {
            console.log('✅ Database connection successful!')
        }

        // Test 3: Check if users table exists
        console.log('\n3. Testing users table...')
        const { data: usersData, error: usersError } = await supabaseAdmin
            .from('users')
            .select('count(*)', { count: 'exact' })
            .limit(1)

        if (usersError) {
            console.error('❌ Users table access failed:', usersError.message)
            if (usersError.message.includes('relation "users" does not exist')) {
                console.log('\n💡 NEXT STEPS:')
                console.log('   1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
                console.log('   2. Navigate to SQL Editor')
                console.log('   3. Copy and paste the contents of supabase/apply-schema.sql')
                console.log('   4. Click "Run" to create the database schema')
                console.log('   5. Run this test again')
            }
            return
        }

        console.log('✅ Users table exists and is accessible!')
        console.log(`   Current user count: ${usersData?.length || 0}\n`)

        // Test 4: Authentication test
        console.log('4. Testing authentication...')
        const testEmail = `test-${Date.now()}@example.com`
        const testPassword = 'TestPassword123!'

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword
        })

        if (signUpError) {
            console.error('❌ Authentication test failed:', signUpError.message)
        } else {
            console.log('✅ Authentication is working!')
            console.log(`   Test user created: ${signUpData.user?.email}`)

            // Clean up
            if (signUpData.user) {
                await supabaseAdmin.auth.admin.deleteUser(signUpData.user.id)
                console.log('🧹 Test user cleaned up')
            }
        }

        console.log('\n🎉 Supabase setup test completed!')
        console.log('\n📋 SUMMARY:')
        console.log('✅ Environment variables configured')
        console.log('✅ Supabase connection established')
        console.log(usersError ? '❌ Database schema needs to be created' : '✅ Database schema exists')
        console.log(signUpError ? '❌ Authentication needs configuration' : '✅ Authentication working')

    } catch (error) {
        console.error('💥 Unexpected error:', error)
    }
}

// Run the test
testSupabaseConnection()
