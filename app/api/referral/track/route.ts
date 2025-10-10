import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/appwrite/services/referrals'
import { ReferralRewardService } from '@/lib/appwrite/services/referral-rewards'
import { RewardsPoolService } from '@/lib/appwrite/services/rewards-pools'
import { computeSplit } from '@/lib/referral'
import type { ReferralAction } from '@/types/referral'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      referrerId,
      referredId,
      action,
      grossAmount,
      projectId,
      projectName,
      metadata
    } = body

    // Validate required fields
    if (!referredId || !action || grossAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user has already been referred (for profile_creation action)
    if (action === 'profile_creation') {
      const hasBeenReferred = await ReferralService.hasBeenReferred(referredId)
      if (hasBeenReferred) {
        return NextResponse.json(
          { error: 'User has already been referred' },
          { status: 409 }
        )
      }
    }

    // Compute the split
    const hasReferrer = !!referrerId
    const split = computeSplit(grossAmount, hasReferrer)

    // Create referral record
    const referral = await ReferralService.createReferral({
      referrerId,
      referredId,
      action: action as ReferralAction,
      grossAmount,
      reserveAmount: split.reserve,
      projectAmount: split.project,
      platformAmount: split.platform,
      referralAmount: split.referral,
      projectId,
      metadata,
      timestamp: new Date().toISOString()
    })

    // If there's a referrer, create a reward for them
    if (referrerId && split.referral > 0) {
      await ReferralRewardService.createReward({
        userId: referrerId,
        referralId: referral.id,
        amount: split.referral,
        type: 'referral_fee',
        status: 'pending',
        metadata: {
          referredUserId: referredId,
          action,
          projectId,
          projectName
        }
      })
    } else if (!referrerId && split.referral > 0) {
      // Add unclaimed referral fee to rewards pool
      const mainPool = await RewardsPoolService.getMainPool()
      await RewardsPoolService.addToPool(
        mainPool.id,
        split.referral,
        referredId
      )
    }

    // If there's a project, handle project-specific pool
    if (projectId && split.project > 0) {
      const projectPool = await RewardsPoolService.getOrCreateProjectPool(
        projectId,
        projectName
      )
      await RewardsPoolService.addToPool(
        projectPool.id,
        split.project,
        referredId
      )
    }

    return NextResponse.json({
      success: true,
      referral,
      split
    })
  } catch (error) {
    console.error('Error tracking referral:', error)
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'referrer' or 'referred'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    let referrals
    if (type === 'referred') {
      referrals = await ReferralService.getReferralsByReferred(userId)
    } else {
      referrals = await ReferralService.getReferralsByReferrer(userId)
    }

    const stats = await ReferralService.getReferralStats(userId)

    return NextResponse.json({
      referrals,
      stats
    })
  } catch (error) {
    console.error('Error fetching referrals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    )
  }
}