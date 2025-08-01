// Simple test to verify Supabase connection
import { createServerComponentClient } from './lib/supabase-client.js'

async function testConnection() {
    try {
        console.log('Testing Supabase connection...')
        const supabase = await createServerComponentClient()
        console.log('Supabase client created successfully')

        const { data, error } = await supabase.from('users').select('count').limit(1)

        if (error) {
            console.error('Supabase error:', error)
        } else {
            console.log('Supabase connection successful:', data)
        }
    } catch (err) {
        console.error('Connection test failed:', err)
    }
}

testConnection()
