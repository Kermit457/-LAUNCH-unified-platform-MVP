/**
 * Mock Launch API - Works without database
 * POST /api/mock-launch
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      curveId = 'curve_123',
      tokenName = 'Test Token',
      tokenSymbol = 'TEST',
      description = 'Token from curve graduation',
      initialBuySOL = 0.001
    } = body

    // Mock snapshot data
    const mockHolders = [
      { userId: 'whale_1', balance: 450000, percentage: 45 },
      { userId: 'whale_2', balance: 200000, percentage: 20 },
      { userId: 'holder_3', balance: 100000, percentage: 10 },
      { userId: 'holder_4', balance: 75000, percentage: 7.5 },
      { userId: 'holder_5', balance: 50000, percentage: 5 },
      { userId: 'small_holders', balance: 125000, percentage: 12.5 }
    ]

    // Calculate distribution
    const BONDING_CURVE_TOKENS = 793_000_000
    const distribution = mockHolders.map(holder => ({
      userId: holder.userId,
      percentage: holder.percentage,
      tokenAmount: Math.floor((holder.percentage / 100) * BONDING_CURVE_TOKENS),
      curveBalance: holder.balance
    }))

    // Mock token creation
    const mockTokenMint = `${tokenSymbol}${Date.now().toString().slice(-8)}`
    const mockSignature = `sig_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    // Simulate launch delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Mock token launched successfully!',

      // Token details
      token: {
        mint: mockTokenMint,
        name: tokenName,
        symbol: tokenSymbol,
        description,
        signature: mockSignature,
        pumpFunUrl: `https://pump.fun/coin/${mockTokenMint}`
      },

      // Distribution info
      distribution: {
        totalSupply: 1_000_000_000,
        bondingCurveSupply: 793_000_000,
        liquidityPoolSupply: 207_000_000,
        holderDistributions: distribution
      },

      // Tokenomics
      tokenomics: {
        bondingCurve: {
          supply: '793,000,000 tokens (79.3%)',
          distributed: 'Proportionally to curve holders',
          graduationTarget: '84.985 SOL raised'
        },
        liquidityPool: {
          supply: '207,000,000 tokens (20.7%)',
          usage: 'Locked when graduated to PumpSwap',
          pairing: '84.985 SOL + 207M tokens'
        },
        fees: {
          bonding: '1.25% (0.30% to creator)',
          postGraduation: '0.05%-0.95% (30% to creator)'
        }
      },

      // Summary
      summary: {
        totalHolders: mockHolders.length,
        totalDistributed: BONDING_CURVE_TOKENS,
        initialBuySOL,
        estimatedValue: `$${(initialBuySOL * 150).toFixed(2)} USD`,
        status: 'Live on Pump.fun bonding curve'
      }
    })

  } catch (error: any) {
    console.error('Mock launch error:', error)
    return NextResponse.json(
      { error: error.message || 'Mock launch failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Mock Launch API',
    usage: 'POST /api/mock-launch with token details',
    example: {
      curveId: 'curve_123',
      tokenName: 'My Token',
      tokenSymbol: 'MTK',
      description: 'Optional description',
      initialBuySOL: 0.001
    }
  })
}