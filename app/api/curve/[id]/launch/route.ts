import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
import { getPumpFunService } from '@/lib/pump-fun/service'
import { ID } from 'node-appwrite'

// Thresholds for launch
const MIN_SUPPLY = 100
const MIN_HOLDERS = 4
const MIN_RESERVE = 10

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const idempotencyKey = `launch-${params.id}-${Date.now()}`

  try {
    const { userId, p0 } = await request.json()

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    if (p0 && (isNaN(p0) || p0 <= 0)) {
      return NextResponse.json(
        { error: 'Invalid p0 price' },
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

    // Verify user is the owner
    if (curve.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Only the owner can launch their curve' },
        { status: 403 }
      )
    }

    // Check curve state - must be active
    if (curve.state !== 'active') {
      return NextResponse.json(
        { error: `Curve must be active to launch. Current state: ${curve.state}` },
        { status: 400 }
      )
    }

    // Check thresholds
    if (curve.supply < MIN_SUPPLY) {
      return NextResponse.json(
        { error: `Insufficient supply. Need ${MIN_SUPPLY}, have ${curve.supply.toFixed(0)}` },
        { status: 400 }
      )
    }

    if (curve.holders < MIN_HOLDERS) {
      return NextResponse.json(
        { error: `Insufficient holders. Need ${MIN_HOLDERS}, have ${curve.holders}` },
        { status: 400 }
      )
    }

    if (curve.reserve < MIN_RESERVE) {
      return NextResponse.json(
        { error: `Insufficient reserve. Need ${MIN_RESERVE} SOL, have ${curve.reserve.toFixed(2)} SOL` },
        { status: 400 }
      )
    }

    console.log(`🚀 Starting launch for curve ${params.id}...`)

    try {
      // STEP 1: Freeze curve
      console.log('Step 1/6: Freezing curve...')
      await ServerCurveService.updateCurve(params.id, {
        state: 'frozen'
      })

      // STEP 2: Snapshot holders
      console.log('Step 2/6: Creating holder snapshot...')
      const holders = await ServerCurveHolderService.getHoldersByCurve(params.id)

      const holdersData = holders.map(h => ({
        address: h.userId,
        balance: h.balance,
        percentage: (h.balance / curve.supply) * 100
      }))

      // Create snapshot document
      const { serverDatabases, DB_ID } = await import('@/lib/appwrite/server-client')
      const snapshotsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID || 'snapshots'

      const snapshot = await serverDatabases.createDocument(
        DB_ID,
        snapshotsCollectionId,
        ID.unique(),
        {
          curveId: params.id,
          merkleRoot: 'pending', // Will update after airdrop creation
          holdersData: JSON.stringify(holdersData),
          totalSupply: curve.supply,
          totalHolders: holders.length,
          createdAt: new Date().toISOString()
        }
      )

      // STEP 3: Create token
      console.log('Step 3/6: Creating SPL token...')
      const pumpFun = getPumpFunService()

      const tokenMint = await pumpFun.createToken({
        name: `${curve.ownerType === 'user' ? 'Creator' : 'Project'} Token`,
        symbol: generateTokenSymbol(curve.ownerId),
        decimals: 9,
        supply: curve.supply * 1_000_000, // 1M tokens per key
        metadata: {
          description: `Token launched from bonding curve`,
          curveId: params.id
        }
      })

      // STEP 4: Seed liquidity pool
      console.log('Step 4/6: Seeding liquidity pool...')
      const initialPrice = p0 || curve.price

      const lpTxHash = await pumpFun.addLiquidity({
        tokenMint,
        solAmount: curve.reserve,
        initialPrice,
        slippageBps: 100 // Fixed 1% for internal operations only
      })

      // STEP 5: Automatically airdrop tokens to all holders
      console.log('Step 5/6: Airdropping tokens to holders...')
      const tokensPerKey = 1_000_000 // 1M tokens per key

      // Get holder wallet addresses
      const holdersWithWallets = await Promise.all(
        holders.map(async (h) => {
          // TODO: In production, fetch actual wallet address from user profile
          // For now, use a mock wallet address
          const walletAddress = `wallet-${h.userId}`
          return {
            userId: h.userId,
            walletAddress,
            amount: h.balance * tokensPerKey,
            percentage: (h.balance / curve.supply) * 100
          }
        })
      )

      // Execute airdrops to all holders automatically
      const airdropTxHashes = await pumpFun.executeAirdrops({
        tokenMint,
        recipients: holdersWithWallets
      })

      console.log(`✅ Airdropped tokens to ${holders.length} holders`)

      // Update snapshot with airdrop completion status
      // Note: In production, store the actual merkle root hash (max 255 chars)
      // For now, we just mark it as completed with a reference
      const airdropReference = `completed-${holders.length}-holders-${Date.now()}`
      await serverDatabases.updateDocument(
        DB_ID,
        snapshotsCollectionId,
        snapshot.$id,
        {
          merkleRoot: airdropReference.substring(0, 255) // Ensure it fits
        }
      )

      // STEP 6: Update curve to launched state
      console.log('Step 6/6: Finalizing launch...')
      const launchedCurve = await ServerCurveService.updateCurve(params.id, {
        state: 'launched',
        tokenMint,
        reserve: 0, // Reserve moved to LP
        launchedAt: new Date().toISOString()
      })

      // Create launch event
      await ServerCurveEventService.createEvent({
        curveId: params.id,
        type: 'launch',
        amount: curve.reserve,
        price: initialPrice,
        userId,
        txHash: lpTxHash,
        timestamp: new Date().toISOString()
      })

      console.log('✅ Launch complete!')

      return NextResponse.json({
        success: true,
        curve: launchedCurve,
        tokenMint,
        lpTxHash,
        airdropTxHashes,
        snapshot: {
          id: snapshot.$id,
          totalHolders: holders.length,
          totalSupply: curve.supply
        },
        message: `Token launched successfully! Tokens automatically airdropped to ${holders.length} holders.`
      })

    } catch (error) {
      // ROLLBACK: Unfreeze curve on failure
      console.error('Launch failed, rolling back...', error)

      try {
        await ServerCurveService.updateCurve(params.id, {
          state: 'active'
        })
        console.log('Curve unfrozen (rollback complete)')
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError)
      }

      throw error
    }

  } catch (error) {
    console.error('Launch error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to launch curve',
        idempotencyKey
      },
      { status: 500 }
    )
  }
}

// Helper: Generate token symbol from owner ID
function generateTokenSymbol(ownerId: string): string {
  const prefix = ownerId.substring(0, 3).toUpperCase()
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}${suffix}`
}
