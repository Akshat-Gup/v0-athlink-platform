"use client"

// Supabase auth is handled via hooks, no provider needed
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
