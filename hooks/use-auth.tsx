"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import type { User, Session } from "@supabase/supabase-js"

interface UserProfile {
    category: string
    isAthlete: boolean
    isTeam: boolean
    isEvent: boolean
}

interface DatabaseUser {
    id: string
    name: string
    email: string
    user_role: string | null
    primary_sport: string
    category: string
    // Add other user fields as needed
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [databaseUser, setDatabaseUser] = useState<DatabaseUser | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.error('Error getting initial session:', error)
            }
            setSession(session)
            setUser(session?.user || null)

            if (session?.user) {
                await fetchUserProfile(session.user.id)
            } else {
                setLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, !!session)
                setSession(session)
                setUser(session?.user || null)

                if (session?.user) {
                    await fetchUserProfile(session.user.id)
                } else {
                    setDatabaseUser(null)
                    setProfile(null)
                    setLoading(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching user profile:', error)
                return
            }

            setDatabaseUser(userData)

            // Determine profile type based on category
            const profile: UserProfile = {
                category: userData.category || 'TALENT',
                isAthlete: userData.category === 'TALENT',
                isTeam: userData.category === 'TEAM',
                isEvent: userData.category === 'EVENT',
            }

            setProfile(profile)
        } catch (error) {
            console.error("Error fetching user profile:", error)
        } finally {
            setLoading(false)
        }
    }

    // Auth actions
    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        if (error) {
            console.error('Error signing in with Google:', error)
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            console.error('Error signing in with email:', error)
            return { error: error.message }
        }
        return { error: null }
    }

    const signUpWithEmail = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        })
        if (error) {
            console.error('Error signing up with email:', error)
            return { error: error.message }
        }
        return { error: null }
    }

    return {
        session,
        user,
        databaseUser,
        profile,
        loading,
        isAuthenticated: !!session,
        userRole: databaseUser?.user_role || null,
        isAthlete: profile?.isAthlete || false,
        isTeam: profile?.isTeam || false,
        isEvent: profile?.isEvent || false,
        signOut,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
    }
}
