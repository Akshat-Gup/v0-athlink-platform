import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`Missing required environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : ''} ${!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
// This should ONLY be used in API routes or server-side code
export const supabaseAdmin = (() => {
    // Only initialize on server side
    if (typeof window === 'undefined') {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!serviceRoleKey) {
            throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations')
        }

        return createClient(
            supabaseUrl,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                },
                db: {
                    schema: 'public'
                },
                global: {
                    headers: {
                        'apikey': serviceRoleKey
                    }
                }
            }
        )
    }

    // Return null on client side - this should never be used in client components
    return null as any
})()

// Types for our database tables
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    user_role: string | null
                    primary_sport: string
                    base_location_id: number
                    country_code: string
                    country_flag: string
                    team_emoji: string
                    rating: number
                    rating_source: string | null
                    rating_last_updated: string | null
                    bio: string
                    profile_image_id: number | null
                    cover_image_id: number | null
                    category: string
                    talent_type_id: number | null
                    verification_status: string
                    years_experience: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    user_role?: string | null
                    primary_sport: string
                    base_location_id: number
                    country_code: string
                    country_flag: string
                    team_emoji: string
                    rating: number
                    rating_source?: string | null
                    rating_last_updated?: string | null
                    bio: string
                    profile_image_id?: number | null
                    cover_image_id?: number | null
                    category: string
                    talent_type_id?: number | null
                    verification_status?: string
                    years_experience: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    user_role?: string | null
                    primary_sport?: string
                    base_location_id?: number
                    country_code?: string
                    country_flag?: string
                    team_emoji?: string
                    rating?: number
                    rating_source?: string | null
                    rating_last_updated?: string | null
                    bio?: string
                    profile_image_id?: number | null
                    cover_image_id?: number | null
                    category?: string
                    talent_type_id?: number | null
                    verification_status?: string
                    years_experience?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            // Add other table types as needed
        }
    }
}
