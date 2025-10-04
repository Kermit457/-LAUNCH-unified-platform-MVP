import { NextRequest, NextResponse } from 'next/server'
import { mockSocialActions } from '@/lib/mock-data'
import { hashIp, getClientIp } from '@/lib/utils'

// Simple in-memory rate limiting (30 seconds per IP per action)
const clickThrottle = new Map<string, number>()
const THROTTLE_MS = 30000 // 30 seconds

// POST /api/social/:id/click
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const action = mockSocialActions.find((a) => a.id === params.id)

    if (!action) {
      return NextResponse.json(
        { error: 'Social action not found' },
        { status: 404 }
      )
    }

    if (!action.active) {
      return NextResponse.json(
        { error: 'Social action is not active' },
        { status: 400 }
      )
    }

    const ip = getClientIp(request)
    const ipHash = hashIp(ip)

    // Throttle check
    const throttleKey = `${params.id}:${ipHash}`
    const lastClick = clickThrottle.get(throttleKey)
    const now = Date.now()

    if (lastClick && now - lastClick < THROTTLE_MS) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before clicking again.' },
        { status: 429 }
      )
    }

    // Increment counter
    action.counter += 1

    // Update throttle
    clickThrottle.set(throttleKey, now)

    return NextResponse.json({
      ok: true,
      counter: action.counter,
    })
  } catch (error) {
    console.error('Error recording click:', error)
    return NextResponse.json(
      { error: 'Failed to record click' },
      { status: 500 }
    )
  }
}
