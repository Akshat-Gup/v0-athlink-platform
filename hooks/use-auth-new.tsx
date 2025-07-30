"use client"

import { useContext } from "react"
import { createContext } from "react"
import { User, Session } from "@supabase/supabase-js"

interface UserProfile {
    category: string
    isAthlete: boolean
    isTeam: boolean
    isEvent: boolean
}

interface ExtendedUser {
    id: string
    name: string
    email: string
    user_role: string | null
    primary_sport: string
    category: string
    bio: string
    rating: number
    years_experience: number
    verification_status: string
    is_active: boolean
    created_at: string
    updated_at: string
}

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    extendedUser: ExtendedUser | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

// This context is provided by AuthProvider
const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
