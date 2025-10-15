import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
import { calculateBuyCost, calculatePrice } from '@/lib/curve/bonding-math'
import { recordPriceSnapshot } from '@/lib/appwrite/services/price-history'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    console.log('Buy request - curveId:', params.id)
    const { keys, userId, referrerId, txSignature, solCost: clientSolCost } = await request.json()
    console.log('Buy request - body:', { keys, userId, referrerId, txSignature, clientSolCost })

    // Validation
    if (!keys || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: keys, userId' },
        { status: 400 }
      )
    }

    if (keys <= 0) {
      return NextResponse.json(
        { error: 'Keys must be greater than 0' },
        { status: 400 }
      )
    }

    // Prevent self-referral
    if (referrerId && referrerId === userId) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
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

    // Check curve state
    if (curve.state !== 'active') {
      return NextResponse.json(
        { error: `Curve is ${curve.state}, trading disabled` },
        { status: 400 }
      )
    }

    // Calculate SOL cost from keys
    const solCost = calculateBuyCost(curve.supply, keys)
    const newSupply = curve.supply + keys
    const newPrice = calculatePrice(newSupply)

    // Calculate fees (6% total: 94% reserve, 3% project, 2% platform, 1% referral)
    const fees = {
      reserve: solCost * 0.94,
      project: solCost * 0.03,
      platform: solCost * 0.02,
      referral: solCost * 0.01
    }

    // Verify Solana transaction if provided
    if (txSignature) {
      console.log('Verifying Solana transaction:', txSignature)
      try {
        // Import connection from Solana config
        const { Connection } = await import('@solana/web3.js')
        const connection = new Connection(
          process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'
        )

        // Fetch transaction details
        const tx = await connection.getTransaction(txSignature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0
        })

        if (!tx) {
          return NextResponse.json(
            { error: 'Transaction not found on blockchain' },
            { status: 400 }
          )
        }

        // Verify transaction succeeded
        if (tx.meta?.err) {
          return NextResponse.json(
            { error: 'Transaction failed on blockchain', details: tx.meta.err },
            { status: 400 }
          )
        }

        console.log('✅ Solana transaction verified:', txSignature)
      } catch (verifyError) {
        console.error('Transaction verification failed:', verifyError)
        return NextResponse.json(
          { error: 'Failed to verify Solana transaction', details: String(verifyError) },
          { status: 400 }
        )
      }
    } else {
      console.log('⚠️ No Solana transaction provided - proceeding without blockchain verification')
    }

    // Update curve state
    const newReserve = curve.reserve + fees.reserve
    const volume24h = curve.volume24h + solCost
    const volumeTotal = curve.volumeTotal + solCost
    const marketCap = newSupply * newPrice

    await ServerCurveService.updateCurve(params.id, {
      supply: newSupply,
      price: newPrice,
      reserve: newReserve,
      volume24h,
      volumeTotal,
      marketCap
    })

    // Create event
    const event = await ServerCurveEventService.createEvent({
      curveId: params.id,
      type: 'buy',
      amount: solCost,
      price: newPrice,
      keys,
      userId,
      referrerId,
      reserveFee: fees.reserve,
      projectFee: fees.project,
      platformFee: fees.platform,
      referralFee: fees.referral,
      timestamp: new Date().toISOString()
    })

    // Update holder position
    const holder = await ServerCurveHolderService.processBuy(
      params.id,
      userId,
      keys,
      newPrice,
      solCost
    )

    // Check if we need to update holder count
    if (holder.balance === keys) {
      // New holder
      await ServerCurveService.updateCurve(params.id, {
        holders: curve.holders + 1
      })
    }

    // Record price snapshot for 24h tracking
    try {
      await recordPriceSnapshot(params.id, newSupply, newPrice)
    } catch (snapshotError) {
      console.error('Failed to record price snapshot:', snapshotError)
      // Don't fail the transaction if snapshot recording fails
    }

    // Award referral credit if applicable
    if (referrerId && fees.referral) {
      try {
        // TODO: Implement first-referrer binding
        // Check if user already has a referrer
        // If not, bind this referrer (immutable)
        // Track earning in referrals table
        console.log('Referral tracking:', {
          referrerId,
          userId,
          amount: fees.referral,
          firstBinding: true // Check this in DB
        })
      } catch (err) {
        console.error('Failed to track referral:', err)
        // Don't fail the whole transaction if referral tracking fails
      }
    }

    // Return updated curve and holder data
    const updatedCurve = await ServerCurveService.getCurveById(params.id)

    return NextResponse.json({
      success: true,
      curve: updatedCurve,
      holder,
      event,
      solCost,
      fees,
      message: `Bought ${keys.toFixed(2)} keys for ${solCost.toFixed(4)} SOL`
    })

  } catch (error) {
    console.error('Buy error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process buy'
    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    )
  }
}
