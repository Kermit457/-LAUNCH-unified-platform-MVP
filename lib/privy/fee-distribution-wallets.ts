/**
 * V6 Fee Distribution - Direct Wallet Transfers
 *
 * All fees go DIRECTLY to wallets, no holding in smart contract
 * Uses Privy embedded wallets for users/projects
 * Platform fees go to LaunchOS main wallet
 */

export interface FeeWallets {
  // User/Project wallets (Privy embedded wallets)
  userWallet?: string           // User's Privy embedded wallet (for referral fees)
  projectWallet: string          // Project's Privy embedded wallet (for project fees)

  // Platform wallets (LaunchOS controlled)
  platformMainWallet: string     // LaunchOS main wallet (for buyback/burn)
  communityRewardsWallet: string // Community rewards wallet

  // The curve reserve (only place funds are held)
  curveReserveVault: string     // 94% stays here for liquidity/sells
}

export class DirectFeeDistribution {
  // LaunchOS platform wallets (from environment)
  private readonly LAUNCHOS_MAIN_WALLET = process.env.LAUNCHOS_MAIN_WALLET!
  private readonly COMMUNITY_REWARDS_WALLET = process.env.COMMUNITY_REWARDS_WALLET!

  /**
   * Get fee distribution instructions for a buy transaction
   * All transfers happen INSTANTLY, no holding in contract
   */
  getFeeTransfers(params: {
    buyAmount: number
    refCode?: string
    refType?: 'user' | 'project'
    buyerPrivyWallet: string      // Buyer's Privy embedded wallet
    projectPrivyWallet: string     // Project's Privy embedded wallet
    referrerPrivyWallet?: string   // Referrer's Privy embedded wallet (if applicable)
  }): {
    transfers: Array<{
      from: string
      to: string
      amount: number
      description: string
    }>
  } {
    const amount = params.buyAmount
    const transfers = []

    // Calculate fee amounts
    const toReserve = amount * 0.94
    const referralFee = amount * 0.03
    const projectFee = amount * 0.01
    const buybackFee = amount * 0.01
    const communityFee = amount * 0.01

    // 1. ALWAYS: 94% to curve reserve (for liquidity/sells)
    transfers.push({
      from: params.buyerPrivyWallet,
      to: 'CURVE_RESERVE_VAULT',
      amount: toReserve,
      description: '94% to curve reserve for liquidity'
    })

    // 2. Referral routing (3% flexible)
    if (params.refCode && params.refType === 'user' && params.referrerPrivyWallet) {
      // User referral: 3% direct to referrer's Privy wallet
      transfers.push({
        from: params.buyerPrivyWallet,
        to: params.referrerPrivyWallet,
        amount: referralFee,
        description: '3% referral fee to user'
      })

      // Project still gets 1%
      transfers.push({
        from: params.buyerPrivyWallet,
        to: params.projectPrivyWallet,
        amount: projectFee,
        description: '1% to project (guaranteed minimum)'
      })

    } else if (params.refCode && params.refType === 'project') {
      // Project self-referral: 4% total direct to project's Privy wallet
      transfers.push({
        from: params.buyerPrivyWallet,
        to: params.projectPrivyWallet,
        amount: referralFee + projectFee, // 3% + 1% = 4%
        description: '4% to project (self-referral)'
      })

    } else {
      // No referral: Split 2% project + 2% community
      transfers.push({
        from: params.buyerPrivyWallet,
        to: params.projectPrivyWallet,
        amount: amount * 0.02,
        description: '2% to project (no-ref bonus)'
      })

      transfers.push({
        from: params.buyerPrivyWallet,
        to: this.COMMUNITY_REWARDS_WALLET,
        amount: amount * 0.02,
        description: '2% to community (no-ref bonus)'
      })
    }

    // 3. ALWAYS: 1% to LaunchOS main wallet (for buyback/burn)
    transfers.push({
      from: params.buyerPrivyWallet,
      to: this.LAUNCHOS_MAIN_WALLET,
      amount: buybackFee,
      description: '1% to LaunchOS for buyback/burn'
    })

    // 4. ALWAYS: 1% to community rewards wallet
    transfers.push({
      from: params.buyerPrivyWallet,
      to: this.COMMUNITY_REWARDS_WALLET,
      amount: communityFee,
      description: '1% to community rewards'
    })

    return { transfers }
  }

  /**
   * Example: Show where fees go for a 100 SOL purchase
   */
  showFeeExample(refScenario: 'user' | 'project' | 'none'): void {
    console.log('\n' + '='.repeat(60))
    console.log(`FEE DISTRIBUTION EXAMPLE: ${refScenario.toUpperCase()} REFERRAL`)
    console.log('='.repeat(60))
    console.log('\nFor a 100 SOL purchase:')
    console.log('')

    const transfers = this.getFeeTransfers({
      buyAmount: 100,
      refCode: refScenario === 'none' ? undefined : 'REF123',
      refType: refScenario === 'none' ? undefined : refScenario,
      buyerPrivyWallet: '0xBuyer...Privy',
      projectPrivyWallet: '0xProject...Privy',
      referrerPrivyWallet: refScenario === 'user' ? '0xReferrer...Privy' : undefined
    })

    console.log('Direct Wallet Transfers:')
    console.log('------------------------')

    transfers.transfers.forEach(t => {
      const toWallet = t.to === 'CURVE_RESERVE_VAULT' ? 'Curve Reserve (on-chain)' :
                      t.to === this.LAUNCHOS_MAIN_WALLET ? 'LaunchOS Main Wallet' :
                      t.to === this.COMMUNITY_REWARDS_WALLET ? 'Community Rewards Wallet' :
                      t.to.includes('Project') ? "Project's Privy Wallet" :
                      t.to.includes('Referrer') ? "Referrer's Privy Wallet" :
                      t.to

      console.log(`  ${t.amount} SOL → ${toWallet}`)
      console.log(`       (${t.description})`)
      console.log('')
    })

    console.log('Summary:')
    console.log('  • NO funds held in smart contract')
    console.log('  • All fees transfer INSTANTLY to wallets')
    console.log('  • Users/Projects use Privy embedded wallets')
    console.log('  • LaunchOS fees go to main platform wallet')
    console.log('')
  }
}

// Usage example
export function demonstrateFeeFlow(): void {
  const distributor = new DirectFeeDistribution()

  console.log('\n' + '🔷'.repeat(30))
  console.log('V6 FEE DISTRIBUTION - DIRECT TO WALLETS')
  console.log('🔷'.repeat(30))

  // Show all three scenarios
  distributor.showFeeExample('user')
  distributor.showFeeExample('project')
  distributor.showFeeExample('none')

  console.log('='.repeat(60))
  console.log('KEY POINTS:')
  console.log('='.repeat(60))
  console.log('')
  console.log('1. Fees go DIRECTLY to wallets:')
  console.log('   • User/Project → Privy embedded wallets')
  console.log('   • Platform fees → LaunchOS main wallet')
  console.log('   • Community → Community rewards wallet')
  console.log('')
  console.log('2. Only the 94% reserve stays on-chain')
  console.log('   • Needed for sell liquidity')
  console.log('   • Needed for eventual token launch')
  console.log('')
  console.log('3. No intermediate holding:')
  console.log('   • No PDAs')
  console.log('   • No contract vaults (except reserve)')
  console.log('   • Instant settlement to final destination')
  console.log('')
}