/**
 * API Route: Launch Curve Token on Pump.fun
 *
 * POST /api/curve/launch
 *
 * Executes the complete launch flow:
 * 1. Freeze curve
 * 2. Take snapshot
 * 3. Launch on Pump.fun
 * 4. Distribute airdrops (793M tokens to holders)
 *
 * Updated Token Distribution (per Pump.fun docs):
 * - Bonding Curve: 793M tokens (79.3%) - Available for trading/holders
 * - Liquidity Pool: 207M tokens (20.7%) - Locked when graduated
 * - Total: 1B tokens
 * - Graduation: At 84.985 SOL raised
 */

import { NextRequest, NextResponse } from 'next/server'
import { curveLaunchService } from '@/lib/pump-fun/curve-launch-service'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const {
      curveId,
      tokenName,
      tokenSymbol,
      description,
      twitter,
      telegram,
      website,
      initialBuySOL = 0.001
    } = body

    // Validate required fields
    if (!curveId) {
      return NextResponse.json(
        { error: 'Curve ID is required' },
        { status: 400 }
      )
    }

    if (!tokenName || !tokenSymbol) {
      return NextResponse.json(
        { error: 'Token name and symbol are required' },
        { status: 400 }
      )
    }

    // Validate symbol length
    if (tokenSymbol.length < 3 || tokenSymbol.length > 10) {
      return NextResponse.json(
        { error: 'Token symbol must be 3-10 characters' },
        { status: 400 }
      )
    }

    console.log(`🚀 Launching token from curve ${curveId}`)
    console.log(`   Name: ${tokenName}`)
    console.log(`   Symbol: ${tokenSymbol}`)

    // Launch the token
    const result = await curveLaunchService.launchFromCurve({
      curveId,
      tokenName,
      tokenSymbol,
      description,
      twitter,
      telegram,
      website,
      initialBuySOL
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Launch failed' },
        { status: 500 }
      )
    }

    // Return success response with distribution details
    return NextResponse.json({
      success: true,
      tokenMint: result.tokenMint,
      signature: result.signature,
      distribution: result.distribution,
      pumpFunUrl: `https://pump.fun/coin/${result.tokenMint}`,
      tokenomics: {
        totalSupply: '1,000,000,000',
        bondingCurve: '793,000,000 (79.3%)',
        liquidityPool: '207,000,000 (20.7%)',
        graduationTarget: '84.985 SOL'
      },
      message: 'Token launched successfully on Pump.fun!'
    })

  } catch (error: any) {
    console.error('Launch error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/curve/launch?curveId=xxx
 *
 * Get launch readiness and distribution preview
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const curveId = searchParams.get('curveId')

    if (!curveId) {
      return NextResponse.json(
        { error: 'Curve ID is required' },
        { status: 400 }
      )
    }

    // Get launch readiness from service
    const readiness = await curveLaunchService.getLaunchReadiness(curveId)

    return NextResponse.json({
      curveId,
      ...readiness,
      tokenomics: {
        info: 'Based on Pump.fun bonding curve mechanics',
        totalSupply: '1,000,000,000 tokens',
        distribution: {
          bondingCurve: '793,000,000 (79.3%) - Distributed to curve holders',
          liquidityPool: '207,000,000 (20.7%) - Locked at graduation',
        },
        graduation: {
          target: '84.985 SOL raised from selling 793M tokens',
          marketCap: '~$69,000',
          outcome: '84.985 SOL + 207M tokens → PumpSwap LP'
        },
        fees: {
          bonding: '1.25% trading fee (0.30% to creator)',
          postGraduation: '0.05%-0.95% dynamic fees (30% to creator)'
        }
      }
    })

  } catch (error: any) {
    console.error('Error checking launch status:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}