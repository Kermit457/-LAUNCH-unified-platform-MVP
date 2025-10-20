import { NextRequest, NextResponse } from 'next/server'
import { ReferralRewardService } from '@/lib/appwrite/services/referral-rewards'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') as 'pending' | 'claimed' | 'expired' | undefined

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const rewards = await ReferralRewardService.getUserRewards(userId, status)
    const stats = await ReferralRewardService.getRewardStats(userId)

    return NextResponse.json({
      rewards,
      stats
    })
  } catch (error) {
    console.error('Error fetching rewards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, rewardId, walletAddress } = body

    if (action === 'claim') {
      if (!rewardId || !walletAddress) {
        return NextResponse.json(
          { error: 'rewardId and walletAddress are required' },
          { status: 400 }
        )
      }

      const claimedReward = await ReferralRewardService.claimReward(
        rewardId,
        walletAddress
      )

      if (!claimedReward) {
        return NextResponse.json(
          { error: 'Failed to claim reward' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        reward: claimedReward
      })
    } else if (action === 'batch-claim') {
      if (!userId || !walletAddress) {
        return NextResponse.json(
          { error: 'userId and walletAddress are required' },
          { status: 400 }
        )
      }

      const result = await ReferralRewardService.batchClaimRewards(
        userId,
        walletAddress
      )

      return NextResponse.json({
        success: true,
        ...result
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing reward action:', error)
    return NextResponse.json(
      { error: 'Failed to process reward action' },
      { status: 500 }
    )
  }
}