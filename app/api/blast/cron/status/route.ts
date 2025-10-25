/**
 * BLAST Cron Health Check Endpoint
 * Check pending background jobs
 */

import { NextResponse } from 'next/server'
import { BlastBackgroundService } from '@/lib/appwrite/services/blast-background'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stats = await BlastBackgroundService.getJobStats()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats,
      healthy: stats.expiredRooms === 0 // No expired rooms means jobs are running
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
