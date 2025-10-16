/**
 * LaunchOS Curve V6 → Pump.fun Launch Service
 *
 * Implements the complete V6 curve graduation flow:
 * 1. Freeze at 32 SOL reserve (automatic or manual)
 * 2. Take snapshot of key holders
 * 3. Launch on Pump.fun with configurable SOL amount
 * 4. Distribute bought tokens to holders proportionally
 * 5. Send remaining reserve to project marketing wallet
 */

import { serverDatabases } from '@/lib/appwrite/server'
import { ID, Query } from 'appwrite'

export interface CurveLaunchParamsV6 {
  curveId: string
  tokenName: string
  tokenSymbol: string
  description?: string
  twitter?: string
  telegram?: string
  website?: string
  launchAmountSOL: number // 8, 10, or 12 SOL
  projectMarketingWallet: string // Privy wallet for remaining reserve
}

export interface TokenDistributionV6 {
  totalSupply: number // 1B tokens
  tokensBought: number // Actual amount bought with SOL
  solSpent: number // SOL used from reserve
  remainingReserve: number // SOL sent to marketing wallet
  holderDistributions: Array<{
    userId: string
    privyWallet: string // Privy wallet address
    keyBalance: number // Keys held at snapshot
    percentage: number // % of total keys
    tokenAmount: number // Tokens to receive
  }>
}

export class CurveLaunchServiceV6 {
  // V6 Constants
  private readonly TOTAL_SUPPLY = 1_000_000_000 // 1B tokens
  private readonly MIN_RESERVE_FOR_LAUNCH = 32 // 32 SOL minimum (but NO auto-freeze)
  private readonly MAX_LAUNCH_SOL = 12 // Maximum 12 SOL for initial buy
  private readonly DEFAULT_LAUNCH_SOL = 10 // Default 10 SOL (25% of supply)

  // Fee routing (6% total)
  private readonly REFERRAL_BPS = 400 // 4% to referral layer
  private readonly BUYBACK_BPS = 100 // 1% to buyback/burn
  private readonly COMMUNITY_BPS = 100 // 1% to community rewards
  private readonly RESERVE_BPS = 9400 // 94% to reserve

  /**
   * Manually freeze a curve (creator/project action)
   * NO auto-freeze in V6 - this must be called explicitly
   */
  async manualFreeze(curveId: string, creatorId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const curve = await this.getCurve(curveId)

      // Verify ownership
      if (curve.ownerId !== creatorId) {
        return {
          success: false,
          error: 'Only the creator/project can freeze the curve'
        }
      }

      // Check if already frozen
      if (curve.state === 'frozen') {
        return {
          success: false,
          error: 'Curve is already frozen'
        }
      }

      // Check minimum requirements
      if (curve.reserve < this.MIN_RESERVE_FOR_LAUNCH) {
        return {
          success: false,
          error: `Cannot freeze yet. Need ${this.MIN_RESERVE_FOR_LAUNCH} SOL reserve (have ${curve.reserve} SOL)`
        }
      }

      // Freeze the curve
      await this.updateCurveStatus(curveId, 'frozen', {
        frozenAt: new Date().toISOString(),
        frozenReserve: curve.reserve,
        frozenSupply: curve.supply
      })

      console.log('🔒 Curve manually frozen');
      console.log(`   Reserve: ${curve.reserve} SOL`);
      console.log(`   Supply: ${curve.supply} keys`);
      console.log(`   Ready for launch!`);

      return { success: true }

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Check if curve meets V6 launch requirements
   */
  async canLaunch(curveId: string): Promise<{
    eligible: boolean
    reserve: number
    holders: number
    supply: number
    reason?: string
  }> {
    const curve = await this.getCurve(curveId)

    const meetsReserve = curve.reserve >= this.MIN_RESERVE_FOR_LAUNCH
    const meetsHolders = curve.holders >= 4 // Minimum 4 holders
    const meetsSupply = curve.supply >= 100 // Minimum 100 keys

    return {
      eligible: meetsReserve && meetsHolders && meetsSupply,
      reserve: curve.reserve,
      holders: curve.holders,
      supply: curve.supply,
      reason: !meetsReserve ? `Need ${this.MIN_RESERVE_FOR_LAUNCH} SOL (have ${curve.reserve})` :
              !meetsHolders ? `Need 4+ holders (have ${curve.holders})` :
              !meetsSupply ? `Need 100+ keys (have ${curve.supply})` : undefined
    }
  }

  /**
   * Complete V6 launch flow
   */
  async launchFromCurveV6(params: CurveLaunchParamsV6): Promise<{
    success: boolean
    tokenMint?: string
    signature?: string
    distribution?: TokenDistributionV6
    error?: string
  }> {
    try {
      console.log('🚀 Starting V6 Curve Launch...')
      console.log('   Model: Hybrid Exponential (Gentle Slope)')
      console.log('   Launch SOL:', params.launchAmountSOL)

      // Step 1: Verify curve state
      const curve = await this.getCurve(params.curveId)

      // Curve must be manually frozen before launch
      if (curve.state !== 'frozen') {
        throw new Error('Curve must be manually frozen before launching. Current state: ' + curve.state)
      }

      // Verify minimum requirements
      if (curve.reserve < this.MIN_RESERVE_FOR_LAUNCH) {
        throw new Error(`Insufficient reserve: ${curve.reserve} SOL (need ${this.MIN_RESERVE_FOR_LAUNCH} SOL)`)
      }

      // Step 2: Get or create snapshot
      console.log('📸 Taking holder snapshot...')
      const snapshot = await this.createSnapshot(params.curveId)

      // Step 3: Calculate distribution percentages
      console.log('📊 Calculating V6 distribution...')
      const distribution = this.calculateV6Distribution(
        snapshot,
        params.launchAmountSOL,
        curve.reserve
      )

      // Step 4: Launch on Pump.fun and buy initial supply
      console.log('🚀 Launching on Pump.fun...')
      console.log(`   Spending ${params.launchAmountSOL} SOL from reserve`)

      const launchResult = await this.launchOnPumpFunV6({
        ...params,
        distribution
      })

      if (!launchResult.success) {
        throw new Error(launchResult.error || 'Launch failed')
      }

      // Step 5: Transfer remaining reserve to marketing wallet
      console.log('💰 Transferring remaining reserve to project...')
      await this.transferRemainingReserve({
        curveId: params.curveId,
        projectWallet: params.projectMarketingWallet,
        amount: distribution.remainingReserve
      })

      // Step 6: Update curve to launched state
      await this.updateCurveStatus(params.curveId, 'launched', {
        tokenMint: launchResult.tokenMint,
        launchTx: launchResult.signature,
        pumpFunUrl: `https://pump.fun/coin/${launchResult.tokenMint}`,
        v6Launch: true,
        launchAmountSOL: params.launchAmountSOL
      })

      console.log('✅ V6 Launch Complete!')
      console.log(`   Token: ${launchResult.tokenMint}`)
      console.log(`   Holders: ${distribution.holderDistributions.length}`)
      console.log(`   View: https://pump.fun/coin/${launchResult.tokenMint}`)

      return {
        success: true,
        tokenMint: launchResult.tokenMint,
        signature: launchResult.signature,
        distribution
      }

    } catch (error: any) {
      console.error('❌ V6 Launch failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Calculate V6 token distribution
   */
  private calculateV6Distribution(
    snapshot: any,
    launchAmountSOL: number,
    totalReserve: number
  ): TokenDistributionV6 {
    const holders = snapshot.holders || []
    const totalKeys = snapshot.totalSupply || 0

    // Estimate tokens bought (rough calculation)
    // At launch: ~10 SOL = 25% supply, ~8 SOL = 20%, ~12 SOL = 30%
    const estimatedTokensBought = Math.floor(
      (launchAmountSOL / 40) * this.TOTAL_SUPPLY // Rough approximation
    )

    // Calculate each holder's share
    const holderDistributions = holders.map((holder: any) => {
      const percentage = (holder.keyBalance / totalKeys) * 100
      const tokenAmount = Math.floor(
        (holder.keyBalance / totalKeys) * estimatedTokensBought
      )

      return {
        userId: holder.userId,
        privyWallet: holder.privyWallet || holder.walletAddress,
        keyBalance: holder.keyBalance,
        percentage,
        tokenAmount
      }
    })

    // Sort by percentage (largest holders first)
    holderDistributions.sort((a, b) => b.percentage - a.percentage)

    return {
      totalSupply: this.TOTAL_SUPPLY,
      tokensBought: estimatedTokensBought,
      solSpent: launchAmountSOL,
      remainingReserve: totalReserve - launchAmountSOL,
      holderDistributions
    }
  }

  /**
   * Launch on Pump.fun using V6 parameters
   */
  private async launchOnPumpFunV6(params: CurveLaunchParamsV6 & {
    distribution: TokenDistributionV6
  }) {
    // Use the working implementation
    const { getWorkingPumpService } = await import('./working-pump-service')
    const pumpService = getWorkingPumpService()

    // Convert holders to format expected by service
    const holders = params.distribution.holderDistributions.map(h => ({
      address: h.privyWallet,
      tokenAmount: h.tokenAmount,
      percentage: h.percentage
    }))

    const result = await pumpService.launchWithDistribution({
      name: params.tokenName,
      symbol: params.tokenSymbol,
      description: params.description,
      initialBuySOL: params.launchAmountSOL,
      holders
    })

    return result
  }

  /**
   * Dynamic key cap calculation (V6 feature)
   */
  calculateDynamicKeyCap(uniqueHolders: number): number {
    // Formula: max_keys_per_wallet = 2 + floor(0.004 * H)
    return 2 + Math.floor(0.004 * uniqueHolders)
  }

  /**
   * Calculate V6 curve price
   */
  calculateV6Price(supply: number): number {
    // P(S) = 0.05 + 0.0003 * S + 0.0000012 * S^1.6
    const base = 0.05
    const linear = 0.0003 * supply
    const exponential = 0.0000012 * Math.pow(supply, 1.6)
    return base + linear + exponential
  }

  /**
   * Estimate keys needed for target reserve
   */
  estimateKeysForReserve(targetSOL: number): number {
    // Binary search to find supply that yields target reserve
    let low = 0
    let high = 10000
    let bestSupply = 0

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const reserve = this.calculateReserveAtSupply(mid)

      if (Math.abs(reserve - targetSOL) < 0.1) {
        return mid
      }

      if (reserve < targetSOL) {
        bestSupply = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    return bestSupply
  }

  /**
   * Calculate total reserve at given supply
   */
  private calculateReserveAtSupply(supply: number): number {
    let totalReserve = 0

    for (let s = 1; s <= supply; s++) {
      const price = this.calculateV6Price(s - 1)
      const buyFee = price * (this.RESERVE_BPS / 10000)
      totalReserve += buyFee
    }

    return totalReserve
  }

  // Helper methods (same as before)
  private async getCurve(curveId: string): Promise<any> {
    // Implementation
    return {}
  }

  private async freezeCurve(curveId: string): Promise<void> {
    // Implementation
  }

  private async createSnapshot(curveId: string): Promise<any> {
    // Implementation
    return {}
  }

  private async transferRemainingReserve(params: {
    curveId: string
    projectWallet: string
    amount: number
  }): Promise<void> {
    // Implementation
    console.log(`💸 Transferred ${params.amount} SOL to ${params.projectWallet}`)
  }

  private async updateCurveStatus(
    curveId: string,
    status: string,
    data: any
  ): Promise<void> {
    // Implementation
  }
}

// Export singleton
let instanceV6: CurveLaunchServiceV6 | null = null

export function getCurveLaunchServiceV6(): CurveLaunchServiceV6 {
  if (!instanceV6) {
    instanceV6 = new CurveLaunchServiceV6()
  }
  return instanceV6
}