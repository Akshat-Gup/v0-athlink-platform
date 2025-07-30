import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select(`
        *,
        talent_profile:talent_profiles(*),
        team_profile:team_profiles(*),
        event_profile:event_profiles(*)
      `)
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }
            console.error("Error fetching user profile:", error)
            return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
        }

        return NextResponse.json(user)

    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json(
            { error: "Failed to fetch user profile" },
            { status: 500 }
        )
    }
}
