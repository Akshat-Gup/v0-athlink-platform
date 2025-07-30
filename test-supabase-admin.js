// Simple test to check Supabase admin connection
// Run with: node --loader tsx/esm test-supabase-admin.js

import { supabaseAdmin } from './lib/supabase.js';

async function testConnection() {
    try {
        console.log('Testing Supabase admin connection...');

        if (!supabaseAdmin) {
            console.error('❌ supabaseAdmin is null - check environment variables');
            return;
        }

        // Test 1: Simple query to check connection
        console.log('\n1. Testing basic connection...');
        const { data: connectionTest, error: connectionError } = await supabaseAdmin
            .from('users')
            .select('count(*)')
            .limit(1);

        if (connectionError) {
            console.error('❌ Connection test failed:', connectionError);
            console.error('Error code:', connectionError.code);
            console.error('Error details:', connectionError.details);
            console.error('Error hint:', connectionError.hint);
        } else {
            console.log('✅ Connection successful');
        }

        // Test 2: Check if we can access user info  
        console.log('\n2. Testing user access...');
        const { data: userTest, error: userError } = await supabaseAdmin.auth.getUser();
        console.log('Current auth user:', userTest);

        if (userError) {
            console.log('Auth error (this might be normal for service role):', userError);
        }

        // Test 3: Try a simple select with explicit table access
        console.log('\n3. Testing direct table access...');
        const { data: directTest, error: directError } = await supabaseAdmin
            .rpc('get_schema_version', {});  // This is a built-in function that should work

        if (directError) {
            console.log('Direct test error:', directError);
        } else {
            console.log('Direct test result:', directTest);
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

testConnection();
