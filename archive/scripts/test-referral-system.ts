import { ReferralService } from '../lib/appwrite/services/referrals'
import { ReferralRewardService } from '../lib/appwrite/services/referral-rewards'
import { RewardsPoolService } from '../lib/appwrite/services/rewards-pools'

/**
 * Test script to verify referral system is working
 */
async function testReferralSystem() {
  console.log('🧪 Testing Referral System...\n')

  try {
    // Test 1: Check if collections are accessible
    console.log('✅ Test 1: Checking collection access...')
    const mainPool = await RewardsPoolService.getMainPool()
    console.log('   Main pool:', mainPool ? '✅ Created' : '❌ Not found')

    // Test 2: Create a test referral
    console.log('\n✅ Test 2: Creating test referral...')
    const testReferral = await ReferralService.createReferral({
      referrerId: 'test_referrer_123',
      referredId: 'test_referred_456',
      action: 'profile_creation',
      grossAmount: 100,
      reserveAmount: 94,
      projectAmount: 3,
      platformAmount: 2,
      referralAmount: 1,
      timestamp: new Date().toISOString()
    })
    console.log('   Referral created:', testReferral.id)

    // Test 3: Create a test reward
    console.log('\n✅ Test 3: Creating test reward...')
    const testReward = await ReferralRewardService.createReward({
      userId: 'test_referrer_123',
      referralId: testReferral.id,
      amount: 1,
      type: 'referral_fee',
      status: 'pending'
    })
    console.log('   Reward created:', testReward.id)

    // Test 4: Get referral stats
    console.log('\n✅ Test 4: Getting referral stats...')
    const stats = await ReferralService.getReferralStats('test_referrer_123')
    console.log('   Stats:', JSON.stringify(stats, null, 2))

    // Test 5: Get rewards
    console.log('\n✅ Test 5: Getting rewards...')
    const rewards = await ReferralRewardService.getUserRewards('test_referrer_123')
    console.log('   Rewards count:', rewards.length)

    // Test 6: Add to pool
    console.log('\n✅ Test 6: Adding to rewards pool...')
    await RewardsPoolService.addToPool(mainPool.id, 1, 'test_contributor')
    console.log('   Added 1 USDC to pool')

    console.log('\n🎉 All tests passed!')
    console.log('\n📝 Summary:')
    console.log('   - Referrals collection: ✅')
    console.log('   - Referral Rewards collection: ✅')
    console.log('   - Rewards Pools collection: ✅')
    console.log('   - Services working: ✅')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

testReferralSystem()
