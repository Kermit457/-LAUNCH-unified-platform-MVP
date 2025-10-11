import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
import { getPumpFunService } from '@/lib/pump-fun/service'

/**
 * POST /api/curve/[id]/airdrop/claim
 *
 * Claim airdrop tokens from a launched curve
 *
 * Flow:
 * 1. Verify curve is launched
 * 2. Get holder's position at snapshot
 * 3. Generate merkle proof
 * 4. Submit claim transaction to Pump.fun
 * 5. Mark as claimed
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { userId, walletAddress } = await request.json()

    // Validation
    if (!userId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, walletAddress' },
        { status: 400 }
      )
    }

    // Get curve
    const curve = await ServerCurveService.getCurveById(params.id)
    if (!curve) {
      return NextResponse.json(
        { error: 'Curve not found' },
        { status: 404 }
      )
    }

    // Check curve is launched
    if (curve.state !== 'launched') {
      return NextResponse.json(
        { error: 'Curve has not been launched yet' },
        { status: 400 }
      )
    }

    if (!curve.tokenMint) {
      return NextResponse.json(
        { error: 'Token mint not available' },
        { status: 400 }
      )
    }

    // Get holder position
    const holder = await ServerCurveHolderService.getHolder(params.id, userId)
    if (!holder || holder.balance === 0) {
      return NextResponse.json(
        { error: 'No tokens to claim. You were not a holder at launch.' },
        { status: 400 }
      )
    }

    // Check if already claimed
    // TODO: Add claimed tracking to holder record
    // if (holder.airdropClaimed) {
    //   return NextResponse.json(
    //     { error: 'Airdrop already claimed' },
    //     { status: 400 }
    //   )
    // }

    // Calculate tokens to claim
    // 1M tokens per key held at snapshot
    const tokensPerKey = 1_000_000
    const tokensToClaim = holder.balance * tokensPerKey

    console.log(`Claiming airdrop for ${userId}:`)
    console.log(`  • Keys held: ${holder.balance}`)
    console.log(`  • Tokens to claim: ${tokensToClaim.toLocaleString()}`)

    // Get Pump.fun service
    const pumpFun = getPumpFunService()

    // TODO: Get merkle proof from snapshot
    // For now, we'll simulate the claim
    const merkleProof = ['0x...'] // Mock proof

    // Submit claim transaction
    const claimTx = await pumpFun.claimAirdrop({
      tokenMint: curve.tokenMint,
      recipient: walletAddress,
      amount: tokensToClaim,
      merkleProof
    })

    // Update holder record to mark as claimed
    // TODO: Add airdropClaimed field to CurveHolder type
    // await ServerCurveHolderService.upsertHolder({
    //   ...holder,
    //   airdropClaimed: true,
    //   airdropClaimedAt: new Date().toISOString()
    // })

    console.log(`✅ Airdrop claimed successfully!`)
    console.log(`   Transaction: ${claimTx}`)

    return NextResponse.json({
      success: true,
      tokensClaimed: tokensToClaim,
      tokenMint: curve.tokenMint,
      txHash: claimTx,
      message: `Successfully claimed ${tokensToClaim.toLocaleString()} tokens!`
    })

  } catch (error) {
    console.error('Airdrop claim error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to claim airdrop'
    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/curve/[id]/airdrop/claim?userId=xxx
 *
 * Check if user has tokens to claim and if already claimed
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    // Get curve
    const curve = await ServerCurveService.getCurveById(params.id)
    if (!curve) {
      return NextResponse.json(
        { error: 'Curve not found' },
        { status: 404 }
      )
    }

    // Get holder position
    const holder = await ServerCurveHolderService.getHolder(params.id, userId)

    if (!holder || holder.balance === 0) {
      return NextResponse.json({
        eligible: false,
        reason: 'Not a holder at launch',
        tokensToClaim: 0
      })
    }

    const tokensPerKey = 1_000_000
    const tokensToClaim = holder.balance * tokensPerKey

    return NextResponse.json({
      eligible: true,
      claimed: false, // TODO: Check holder.airdropClaimed
      tokensToClaim,
      keysHeld: holder.balance,
      tokenMint: curve.tokenMint
    })

  } catch (error) {
    console.error('Airdrop check error:', error)
    return NextResponse.json(
      { error: 'Failed to check airdrop eligibility' },
      { status: 500 }
    )
  }
}
