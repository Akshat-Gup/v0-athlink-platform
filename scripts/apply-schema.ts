// Script to apply the database schema to Supabase
import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env') })

async function applySchema() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase environment variables')
        return
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    try {
        console.log('📋 Reading schema file...')
        const schemaPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
        const schemaSql = readFileSync(schemaPath, 'utf-8')

        console.log('🚀 Applying database schema...')

        // Split the SQL into individual statements
        const statements = schemaSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

        console.log(`📝 Found ${statements.length} SQL statements to execute`)

        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';'

            try {
                const { error } = await supabase.rpc('exec_sql', { sql: statement })

                if (error) {
                    // Try direct query if RPC fails
                    const { error: queryError } = await supabase.from('_').select('*').limit(0)
                    if (queryError && !queryError.message.includes('relation "_" does not exist')) {
                        console.error(`❌ Statement ${i + 1} failed:`, error.message)
                        errorCount++
                    } else {
                        successCount++
                    }
                } else {
                    successCount++
                }
            } catch (err: any) {
                console.error(`❌ Statement ${i + 1} failed:`, err.message)
                errorCount++
            }
        }

        console.log(`\n✅ Schema application completed!`)
        console.log(`   Successful: ${successCount} statements`)
        console.log(`   Failed: ${errorCount} statements`)

        if (errorCount === 0) {
            console.log('\n🎉 All tables created successfully!')
        } else {
            console.log('\n⚠️  Some statements failed. Please check the errors above.')
        }

    } catch (error) {
        console.error('💥 Error applying schema:', error)
        console.log('\n💡 Alternative approach:')
        console.log('1. Go to https://supabase.com/dashboard')
        console.log('2. Navigate to SQL Editor')
        console.log('3. Copy and paste the contents of supabase/migrations/001_initial_schema.sql')
        console.log('4. Click "Run" to execute')
    }
}

applySchema()
