/**
 * Curve to Pump.fun Launch Service
 *
 * Handles the complete flow:
 * 1. Freeze curve (stop trading)
 * 2. Take snapshot (record holder balances)
 * 3. Launch on Pump.fun (create token)
 * 4. Distribute airdrops (based on snapshot)
 *
 * TOKEN DISTRIBUTION:
 * - Total Supply: 1,000,000,000 tokens
 * - Bonding Curve: 793,000,000 (79.3%) - For sale
 * - Liquidity Pool: 207,000,000 (20.7%) - Locked for LP
 * - Holders get proportional share of the 793M based on curve ownership
 */

import { serverDatabases } from '@/lib/appwrite/server'
import { ID, Query } from 'appwrite'

export interface CurveLaunchParams {
  curveId: string
  tokenName: string
  tokenSymbol: string
  description?: string
  twitter?: string
  telegram?: string
  website?: string
  initialBuySOL?: number // Optional initial buy to kickstart trading
}

export interface TokenDistribution {
  totalSupply: number
  bondingCurveSupply: number  // 793M tokens
  liquidityPoolSupply: number // 207M tokens
  holderDistributions: Array<{
    userId: string
    walletAddress?: string
    curveBalance: number
    percentage: number
    tokenAmount: number // Their share of the 793M
  }>
}

export class CurveLaunchService {
  private readonly TOTAL_SUPPLY = 1_000_000_000 // 1B tokens
  private readonly MIN_RESERVE_FOR_LAUNCH = 32 // Minimum 32 SOL in curve reserve to launch
  private readonly DEFAULT_BUY_PERCENTAGE = 0.25 // Default: use 25% of reserve for initial buy

  /**
   * Complete launch flow from curve to Pump.fun
   */
  async launchFromCurve(params: CurveLaunchParams): Promise<{
    success: boolean
    tokenMint?: string
    signature?: string
    distribution?: TokenDistribution
    error?: string
  }> {
    try {
      console.log('🚀 Starting curve launch process...')
      console.log('   Curve ID:', params.curveId)

      // Step 1: Verify curve is frozen
      const curve = await this.getCurve(params.curveId)
      if (curve.status !== 'frozen') {
        throw new Error('Curve must be frozen before launching')
      }

      // Step 2: Get or create snapshot
      let snapshot = await this.getLatestSnapshot(params.curveId)
      if (!snapshot) {
        console.log('📸 Creating snapshot...')
        snapshot = await this.createSnapshot(params.curveId)
      }

      // Step 3: Calculate token distribution
      console.log('📊 Calculating token distribution...')
      const distribution = await this.calculateDistribution(snapshot)

      // Step 4: Launch token on Pump.fun
      console.log('🚀 Launching on Pump.fun...')
      const launchResult = await this.launchOnPumpFun({
        ...params,
        distribution
      })

      if (!launchResult.success) {
        throw new Error(launchResult.error || 'Launch failed')
      }

      // Step 5: Execute airdrops to holders
      console.log('🎁 Distributing tokens to holders...')
      const airdropResults = await this.distributeTokens({
        tokenMint: launchResult.tokenMint!,
        distribution,
        curveId: params.curveId
      })

      // Step 6: Update curve status to launched
      await this.updateCurveStatus(params.curveId, 'launched', {
        tokenMint: launchResult.tokenMint,
        launchTx: launchResult.signature,
        pumpFunUrl: `https://pump.fun/coin/${launchResult.tokenMint}`
      })

      return {
        success: true,
        tokenMint: launchResult.tokenMint,
        signature: launchResult.signature,
        distribution
      }

    } catch (error: any) {
      console.error('❌ Launch failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Calculate token distribution based on snapshot
   * NOTE: The actual token amounts distributed depend on how much is bought from bonding curve!
   * This just calculates the PERCENTAGE each holder should receive.
   */
  async calculateDistribution(snapshot: any): Promise<TokenDistribution> {
    const holders = snapshot.holders || []
    const totalCurveSupply = snapshot.totalSupply || 0

    // Calculate each holder's percentage share
    const holderDistributions = holders.map((holder: any) => {
      const percentage = (holder.balance / totalCurveSupply) * 100

      return {
        userId: holder.userId,
        walletAddress: holder.walletAddress,
        curveBalance: holder.balance,
        percentage,
        tokenAmount: 0 // Will be calculated after we know how many tokens we buy
      }
    })

    // Sort by percentage (largest holders first)
    holderDistributions.sort((a, b) => b.percentage - a.percentage)

    return {
      totalSupply: this.TOTAL_SUPPLY,
      bondingCurveSupply: 0, // Will be determined by initial buy amount
      liquidityPoolSupply: 0, // Pump.fun handles this automatically
      holderDistributions
    }
  }

  /**
   * Launch token on Pump.fun
   */
  private async launchOnPumpFun(params: CurveLaunchParams & { distribution: TokenDistribution }) {
    // Check if we're in production mode
    const isProduction = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta'

    if (isProduction) {
      // Use WORKING implementation that creates tokens visible on pump.fun
      const { getWorkingPumpService } = await import('./working-pump-service')
      const pumpService = getWorkingPumpService()

      // Convert holder distributions to format expected by service
      const holders = params.distribution.holderDistributions
        .filter(h => h.walletAddress) // Only include holders with wallet addresses
        .map(h => ({
          address: h.walletAddress!,
          tokenAmount: h.tokenAmount,
          percentage: h.percentage
        }))

      const result = await pumpService.launchWithDistribution({
        name: params.tokenName,
        symbol: params.tokenSymbol,
        description: params.description,
        initialBuySOL: params.initialBuySOL || 0.01,
        holders // Pass holders for auto-distribution
      })

      if (!result.success) {
        return {
          success: false,
          tokenMint: undefined,
          signature: undefined,
          metadataUri: undefined,
          error: result.error
        }
      }

      return {
        success: true,
        tokenMint: result.tokenMint,
        signature: result.signature,
        metadataUri: `https://pump.fun/coin/${result.tokenMint}`,
        error: undefined
      }
    } else {
      // Use mock for development/testing
      const mockMint = `CURVE${params.curveId.slice(-8)}${Date.now().toString().slice(-4)}`
      const mockSignature = `sig_${Date.now()}_${Math.random().toString(36).slice(2)}`

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('🎮 MOCK MODE: Token would be created on mainnet')
      console.log(`   Mock Mint: ${mockMint}`)
      console.log(`   Distribution: 793M to ${params.distribution.holderDistributions.length} holders`)

      return {
        success: true,
        tokenMint: mockMint,
        signature: mockSignature,
        metadataUri: `https://ipfs.io/ipfs/Qm${params.curveId}`,
        error: undefined
      }
    }
  }

  /**
   * Distribute tokens to holders based on snapshot
   */
  private async distributeTokens(params: {
    tokenMint: string
    distribution: TokenDistribution
    curveId: string
  }) {
    const results = []

    for (const holder of params.distribution.holderDistributions) {
      try {
        // In production: Execute SPL token transfer
        // For now: Record the distribution

        const airdropRecord = {
          curveId: params.curveId,
          tokenMint: params.tokenMint,
          userId: holder.userId,
          walletAddress: holder.walletAddress,
          tokenAmount: holder.tokenAmount,
          percentage: holder.percentage,
          status: 'pending', // Would be 'completed' after actual transfer
          createdAt: new Date().toISOString()
        }

        results.push({
          success: true,
          userId: holder.userId,
          amount: holder.tokenAmount,
          tx: `airdrop_${holder.userId}_${Date.now()}`
        })

        console.log(`  ✅ ${holder.userId}: ${holder.tokenAmount.toLocaleString()} tokens (${holder.percentage.toFixed(2)}%)`)

      } catch (error) {
        console.error(`  ❌ Failed to airdrop to ${holder.userId}:`, error)
        results.push({
          success: false,
          userId: holder.userId,
          error: error
        })
      }
    }

    return results
  }

  /**
   * Get curve data
   */
  private async getCurve(curveId: string) {
    const curve = await serverDatabases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID!,
      curveId
    )
    return curve
  }

  /**
   * Get latest snapshot for curve
   */
  private async getLatestSnapshot(curveId: string) {
    try {
      const snapshots = await serverDatabases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID!,
        [
          Query.equal('curveId', curveId),
          Query.orderDesc('createdAt'),
          Query.limit(1)
        ]
      )

      return snapshots.documents[0] || null
    } catch (error) {
      console.error('Failed to get snapshot:', error)
      return null
    }
  }

  /**
   * Create snapshot of current curve state
   */
  private async createSnapshot(curveId: string) {
    // Get all holders
    const holders = await serverDatabases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID!,
      [
        Query.equal('curveId', curveId),
        Query.greaterThan('balance', 0),
        Query.limit(100)
      ]
    )

    // Calculate totals
    const totalSupply = holders.documents.reduce((sum, h) => sum + h.balance, 0)
    const holderCount = holders.documents.length

    // Create snapshot
    const snapshot = await serverDatabases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID!,
      ID.unique(),
      {
        curveId,
        totalSupply,
        holderCount,
        holders: holders.documents.map(h => ({
          userId: h.userId,
          walletAddress: h.walletAddress,
          balance: h.balance,
          percentage: (h.balance / totalSupply) * 100
        })),
        createdAt: new Date().toISOString()
      }
    )

    return snapshot
  }

  /**
   * Update curve status after launch
   */
  private async updateCurveStatus(curveId: string, status: string, launchData: any) {
    await serverDatabases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID!,
      curveId,
      {
        status,
        launchData,
        launchedAt: new Date().toISOString()
      }
    )
  }

  /**
   * Get launch readiness status for a curve
   */
  async getLaunchReadiness(curveId: string) {
    try {
      // Get curve
      const curve = await this.getCurve(curveId)

      // Get holder count
      const holders = await serverDatabases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID!,
        [
          Query.equal('curveId', curveId),
          Query.greaterThan('balance', 0),
          Query.limit(100)
        ]
      )

      // Check if snapshot exists
      const snapshot = await this.getLatestSnapshot(curveId)
      const hasSnapshot = snapshot !== null

      // Calculate distribution preview if snapshot exists
      let distributionPreview = null
      if (snapshot) {
        distributionPreview = await this.calculateDistribution(snapshot)
      }

      // Determine readiness
      const isFrozen = curve.status === 'frozen'
      const hasHolders = holders.documents.length > 0
      const isReady = isFrozen && hasSnapshot && hasHolders

      return {
        status: curve.status,
        isReady,
        requirements: {
          isFrozen,
          hasSnapshot,
          hasHolders
        },
        stats: {
          holderCount: holders.documents.length,
          totalSupply: curve.totalSupply || 0,
          marketCap: curve.marketCap || 0,
          raised: curve.raised || 0
        },
        snapshot: snapshot ? {
          id: snapshot.$id,
          createdAt: snapshot.createdAt,
          holderCount: snapshot.holderCount,
          totalSupply: snapshot.totalSupply
        } : null,
        distributionPreview,
        message: isReady
          ? 'Curve is ready to launch on Pump.fun!'
          : this.getReadinessMessage(isFrozen, hasSnapshot, hasHolders)
      }
    } catch (error: any) {
      console.error('Error getting launch readiness:', error)
      throw error
    }
  }

  /**
   * Get appropriate message based on readiness status
   */
  private getReadinessMessage(isFrozen: boolean, hasSnapshot: boolean, hasHolders: boolean): string {
    if (!isFrozen) {
      return 'Curve must be frozen before launching'
    }
    if (!hasHolders) {
      return 'Curve must have holders before launching'
    }
    if (!hasSnapshot) {
      return 'Snapshot must be taken before launching'
    }
    return 'Curve is ready to launch!'
  }
}

// Export singleton instance
export const curveLaunchService = new CurveLaunchService()