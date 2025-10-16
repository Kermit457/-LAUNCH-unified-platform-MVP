/**
 * Test API Route for Launch System
 * GET /api/test-launch
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test basic functionality
    const searchParams = request.nextUrl.searchParams
    const curveId = searchParams.get('curveId') || 'test-curve-1'

    // Mock response to test if API is working
    const mockResponse = {
      success: true,
      message: 'Launch API is working!',
      curveId,
      tokenDistribution: {
        totalSupply: 1_000_000_000,
        bondingCurve: 793_000_000,
        liquidityPool: 207_000_000,
        description: '793M tokens distributed to holders, 207M locked for LP'
      },
      mockHolders: [
        { userId: 'user1', percentage: 45, tokens: 356_850_000 },
        { userId: 'user2', percentage: 30, tokens: 237_900_000 },
        { userId: 'user3', percentage: 15, tokens: 118_950_000 },
        { userId: 'user4', percentage: 10, tokens: 79_300_000 }
      ],
      nextSteps: [
        'Freeze the curve',
        'Take snapshot of holders',
        'Launch on Pump.fun',
        'Distribute tokens'
      ]
    }

    return NextResponse.json(mockResponse)

  } catch (error: any) {
    console.error('Test launch error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Test endpoint error',
        stack: error.stack
      },
      { status: 500 }
    )
  }
}