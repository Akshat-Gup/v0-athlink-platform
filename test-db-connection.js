import { supabaseAdmin } from './lib/supabase'

async function testDatabaseConnection() {
    console.log('Testing database connection...')

    try {
        // Test basic connection
        const { data: healthCheck, error: healthError } = await supabaseAdmin
            .from('users')
            .select('count(*)', { count: 'exact' })
            .limit(1)

        if (healthError) {
            console.error('Health check failed:', healthError)
            return
        }

        console.log('Health check passed. Total users:', healthCheck)

        // Test actual data fetch
        const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select('id, name, email, category')
            .limit(5)

        if (usersError) {
            console.error('Users query failed:', usersError)
            return
        }

        console.log('Users query successful. Sample data:', users)

    } catch (error) {
        console.error('Connection test failed:', error)
    }
}

testDatabaseConnection()
