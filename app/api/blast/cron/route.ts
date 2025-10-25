/**
 * BLAST Background Jobs Cron Endpoint
 *
 * Setup with Vercel Cron - add to vercel.json:
 * crons: [{ path: "/api/blast/cron", schedule: "every 5 minutes" }]
 *
 * Or hit this endpoint from external cron service every 5 minutes
 */

import { NextResponse } from 'next/server'
import { BlastBackgroundService } from '@/lib/appwrite/services/blast-background'

// Disable body parser for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Optional: Add authorization header check
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Run all background jobs
    const results = await BlastBackgroundService.runAll()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also support POST method
export async function POST(request: Request) {
  return GET(request)
}
