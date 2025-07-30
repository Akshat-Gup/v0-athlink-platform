import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Get auth header
        const authHeader = request.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError || !user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 })
        }

        const body = await request.json()
        const { status } = body

        if (!status || !['COMPLETED', 'FAILED'].includes(status)) {
            return NextResponse.json({ error: 'Valid status is required (COMPLETED or FAILED)' }, { status: 400 })
        }

        // Get user from database
        const { data: dbUser, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single()

        if (userError || !dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get the contribution request and verify the user is the recipient
        const { data: contributionRequest, error: requestError } = await supabaseAdmin
            .from('sponsor_contributions')
            .select('*')
            .eq('id', id)
            .eq('recipient_id', dbUser.id)
            .eq('status', 'PENDING')
            .single()

        if (requestError || !contributionRequest) {
            return NextResponse.json({ error: 'Contribution request not found or already processed' }, { status: 404 })
        }

        // Update the request status
        const { data: updatedRequest, error: updateError } = await supabaseAdmin
            .from('sponsor_contributions')
            .update({
                status: status, // COMPLETED = accepted, FAILED = rejected
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select(`
        *,
        sponsor:users!sponsor_contributions_sponsor_id_fkey(id, name, email),
        recipient:users!sponsor_contributions_recipient_id_fkey(id, name, email)
      `)
            .single()

        if (updateError) {
            console.error('Error updating contribution request:', updateError)
            return NextResponse.json({ error: 'Failed to update contribution request' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            contribution_request: updatedRequest
        })

    } catch (error) {
        console.error('Error updating contribution request:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
