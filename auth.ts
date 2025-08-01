import { createServerComponentClient } from "@/lib/supabase-client"

// Server-side auth utilities
export async function getUser() {
  const supabase = await createServerComponentClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting user:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Error in getUser:', error)
    return null
  }
}

export async function getSession() {
  const supabase = await createServerComponentClient()

  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('Error in getSession:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}

// Get user with profile data
export async function getUserWithProfile() {
  const user = await getUser()
  if (!user) return null

  const supabase = await createServerComponentClient()

  // Get user profile from users table
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error getting user profile:', error)
    return user
  }

  return {
    ...user,
    profile
  }
}