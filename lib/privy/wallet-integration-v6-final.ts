/**
 * Privy Wallet Integration for V6 Curve - FINAL
 *
 * Implements the finalized fee routing structure:
 * - 3% referral (flexible)
 * - 1% project (guaranteed)
 * - 1% buyback/burn
 * - 1% community rewards
 * - 94% reserve
 */

export interface FeeRoutingV6Final {
  reserve: number      // 94% always
  referral: number     // 3% to referrer OR project OR split
  project: number      // 1% guaranteed to project
  buybackBurn: number  // 1% to buyback/burn wallet
  community: number    // 1% to community rewards
}

export interface FeeTransfers {
  to: string
  amount: number
  type: 'reserve' | 'referral' | 'project' | 'buyback' | 'community'
}

export class PrivyWalletServiceV6Final {
  // V6 FINAL Fee Constants (in basis points)
  private readonly RESERVE_BPS = 9400     // 94%
  private readonly REFERRAL_BPS = 300     // 3%
  private readonly PROJECT_BPS = 100      // 1%
  private readonly BUYBACK_BPS = 100      // 1%
  private readonly COMMUNITY_BPS = 100    // 1%
  private readonly BPS_DENOMINATOR = 10000

  // System wallets (from environment)
  private readonly BUYBACK_BURN_WALLET = process.env.BUYBACK_BURN_WALLET!
  private readonly COMMUNITY_REWARDS_WALLET = process.env.COMMUNITY_REWARDS_WALLET!

  /**
   * Calculate V6 FINAL fee distribution
   */
  calculateFeesV6(tradeAmount: number): FeeRoutingV6Final {
    return {
      reserve: (tradeAmount * this.RESERVE_BPS) / this.BPS_DENOMINATOR,
      referral: (tradeAmount * this.REFERRAL_BPS) / this.BPS_DENOMINATOR,
      project: (tradeAmount * this.PROJECT_BPS) / this.BPS_DENOMINATOR,
      buybackBurn: (tradeAmount * this.BUYBACK_BPS) / this.BPS_DENOMINATOR,
      community: (tradeAmount * this.COMMUNITY_BPS) / this.BPS_DENOMINATOR
    }
  }

  /**
   * Route fees according to V6 FINAL logic
   */
  async routeFeesV6Final(params: {
    tradeAmount: number
    refCode?: string
    refType?: 'user' | 'project'
    projectWallet: string
    buyerWallet: string
  }): Promise<FeeTransfers[]> {
    const fees = this.calculateFeesV6(params.tradeAmount)
    const transfers: FeeTransfers[] = []

    // 1. Reserve always gets 94%
    transfers.push({
      to: 'reserve_vault',
      amount: fees.reserve,
      type: 'reserve'
    })

    // 2. Referral routing logic (3% flexible)
    if (params.refCode && params.refType === 'user') {
      // User referral: User gets 3%
      const referrerWallet = await this.getReferrerWallet(params.refCode)
      if (referrerWallet) {
        transfers.push({
          to: referrerWallet,
          amount: fees.referral,
          type: 'referral'
        })
      }
    } else if (params.refCode && params.refType === 'project') {
      // Project self-referral: Project gets 3% + 1% = 4% total
      transfers.push({
        to: params.projectWallet,
        amount: fees.referral + fees.project, // 3% + 1% = 4%
        type: 'project'
      })
      // Skip the separate project transfer since it's combined
      fees.project = 0
    } else {
      // No referral: Split 2% project + 2% community
      transfers.push({
        to: params.projectWallet,
        amount: (params.tradeAmount * 0.02), // 2%
        type: 'project'
      })
      transfers.push({
        to: this.COMMUNITY_REWARDS_WALLET,
        amount: (params.tradeAmount * 0.02), // 2%
        type: 'community'
      })
      // Skip the normal 3% referral and 1% project since we handled them
      fees.project = 0
    }

    // 3. Project gets guaranteed 1% (unless already included above)
    if (fees.project > 0) {
      transfers.push({
        to: params.projectWallet,
        amount: fees.project,
        type: 'project'
      })
    }

    // 4. Buyback/Burn always gets 1%
    transfers.push({
      to: this.BUYBACK_BURN_WALLET,
      amount: fees.buybackBurn,
      type: 'buyback'
    })

    // 5. Community Rewards always gets 1%
    if (!(params.refCode === undefined)) {
      // Only add if not already added in no-ref scenario
      transfers.push({
        to: this.COMMUNITY_REWARDS_WALLET,
        amount: fees.community,
        type: 'community'
      })
    }

    return transfers
  }

  /**
   * Get summary of fee distribution for display
   */
  getFeeSummary(refCode?: string, refType?: 'user' | 'project'): string[] {
    const summary: string[] = []

    summary.push('📊 V6 Fee Distribution (6% total):')
    summary.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (refCode && refType === 'user') {
      summary.push('• 94% → Reserve (liquidity)')
      summary.push('• 3% → Referrer (user/influencer)')
      summary.push('• 1% → Project (guaranteed)')
      summary.push('• 1% → Buyback & Burn')
      summary.push('• 1% → Community Rewards')
    } else if (refCode && refType === 'project') {
      summary.push('• 94% → Reserve (liquidity)')
      summary.push('• 4% → Project (3% ref + 1% guaranteed)')
      summary.push('• 1% → Buyback & Burn')
      summary.push('• 1% → Community Rewards')
    } else {
      summary.push('• 94% → Reserve (liquidity)')
      summary.push('• 2% → Project (no-ref bonus)')
      summary.push('• 2% → Community (no-ref bonus)')
      summary.push('• 1% → Buyback & Burn')
      summary.push('• 1% → Community Rewards (base)')
    }

    return summary
  }

  /**
   * Simplified fee calculation for UI display
   */
  calculateQuickFees(tradeAmountSOL: number): {
    toReserve: number
    toReferral: number
    toProject: number
    toBuyback: number
    toCommunity: number
    totalFees: number
    netToReserve: number
  } {
    const total = tradeAmountSOL

    return {
      toReserve: total * 0.94,
      toReferral: total * 0.03,
      toProject: total * 0.01,
      toBuyback: total * 0.01,
      toCommunity: total * 0.01,
      totalFees: total * 0.06,
      netToReserve: total * 0.94
    }
  }

  /**
   * Get referrer wallet (mock - replace with actual Privy lookup)
   */
  private async getReferrerWallet(refCode: string): Promise<string | null> {
    // This would query your Privy registry
    const mockRegistry: Record<string, string> = {
      'USER_123': 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP',
      'KOL_ALPHA': 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT',
      // Add more as needed
    }

    return mockRegistry[refCode] || null
  }
}

// Export singleton
let serviceV6Final: PrivyWalletServiceV6Final | null = null

export function getPrivyWalletServiceV6Final(): PrivyWalletServiceV6Final {
  if (!serviceV6Final) {
    serviceV6Final = new PrivyWalletServiceV6Final()
  }
  return serviceV6Final
}