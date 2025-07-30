import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
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

        // Get user from database
        const { data: dbUser, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single()

        if (userError || !dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Fetch contributions for this user (assuming userId field in sponsor_contributions table)
        const { data: contributions, error: contributionsError } = await supabaseAdmin
            .from('sponsor_contributions')
            .select(`
        *,
        user:users!sponsor_contributions_sponsor_id_fkey(name, email)
      `)
            .eq('sponsor_id', dbUser.id)
            .order('created_at', { ascending: false })

        if (contributionsError) {
            console.error('Error fetching contributions:', contributionsError)
            return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 })
        }

        const totalAmount = contributions?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0

        return NextResponse.json({
            contributions: contributions || [],
            totalAmount
        })

    } catch (error) {
        console.error('Error fetching contributions:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
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

        const body = await request.json()
        const { amount, description, recipient_id } = body

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
        }

        if (!recipient_id) {
            return NextResponse.json({ error: 'Recipient ID is required' }, { status: 400 })
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

        // Create new contribution
        const { data: contribution, error: createError } = await supabaseAdmin
            .from('sponsor_contributions')
            .insert({
                sponsor_id: dbUser.id,
                recipient_id: recipient_id,
                amount: amount,
                message: description || null,
                currency: 'USD',
                status: 'COMPLETED'
            })
            .select(`
        *,
        sponsor:users!sponsor_contributions_sponsor_id_fkey(name, email),
        recipient:users!sponsor_contributions_recipient_id_fkey(name, email)
      `)
            .single()

        if (createError) {
            console.error('Error creating contribution:', createError)
            return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            contribution
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating contribution:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
