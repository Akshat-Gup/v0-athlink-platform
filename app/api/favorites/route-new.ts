import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: favorites, error } = await supabaseAdmin
            .from('favorites')
            .select(`
        *,
        favorited_user:users!profile_id(
          id,
          name,
          primary_sport,
          profile_image_id,
          country_flag,
          bio,
          category,
          rating,
          years_experience,
          verification_status
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching favorites:', error)
            return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
        }

        return NextResponse.json({ favorites })
    } catch (error) {
        console.error('Error in favorites GET:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { profile_id, profile_type } = body

        if (!profile_id || !profile_type) {
            return NextResponse.json({
                error: 'Missing required fields: profile_id, profile_type'
            }, { status: 400 })
        }

        // Check if already favorited
        const { data: existing } = await supabaseAdmin
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('profile_id', profile_id)
            .single()

        if (existing) {
            return NextResponse.json({
                error: 'Profile is already in favorites'
            }, { status: 400 })
        }

        // Add to favorites
        const { data: favorite, error } = await supabaseAdmin
            .from('favorites')
            .insert({
                user_id: user.id,
                profile_id,
                profile_type
            })
            .select(`
        *,
        favorited_user:users!profile_id(
          id,
          name,
          primary_sport,
          profile_image_id,
          country_flag,
          bio,
          category
        )
      `)
            .single()

        if (error) {
            console.error('Error adding to favorites:', error)
            return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 })
        }

        return NextResponse.json({ favorite }, { status: 201 })
    } catch (error) {
        console.error('Error in favorites POST:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { profile_id } = body

        if (!profile_id) {
            return NextResponse.json({
                error: 'Missing required field: profile_id'
            }, { status: 400 })
        }

        const { error } = await supabaseAdmin
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('profile_id', profile_id)

        if (error) {
            console.error('Error removing from favorites:', error)
            return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in favorites DELETE:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
