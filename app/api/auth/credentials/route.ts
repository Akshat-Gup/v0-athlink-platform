import { NextRequest, NextResponse } from 'next/server'
import { signInWithCredentials, signUp } from '@/auth'

export async function POST(request: NextRequest) {
    try {
        const { email, password, action, name } = await request.json()

        if (action === 'signin') {
            const data = await signInWithCredentials(email, password)
            return NextResponse.json({ success: true, data })
        } else if (action === 'signup') {
            const data = await signUp(email, password, name)
            return NextResponse.json({ success: true, data })
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }
    } catch (error) {
        console.error('Auth error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Authentication failed' },
            { status: 401 }
        )
    }
}
