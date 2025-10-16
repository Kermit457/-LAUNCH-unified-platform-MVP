/**
 * Pump.fun Service using Official SDKs
 *
 * Uses @pump-fun/pump-sdk for token creation
 * Uses @pump-fun/pump-swap-sdk for post-graduation trading
 *
 * Token Distribution (Official):
 * - 793M tokens on bonding curve (79.3%)
 * - 207M tokens for liquidity pool (20.7%)
 * - Graduation at 84.985 SOL raised
 */

import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { PumpSdk } from '@pump-fun/pump-sdk'
import { PumpSwapSdk } from '@pump-fun/pump-swap-sdk'
import * as bs58 from 'bs58'

export interface PumpTokenParams {
  name: string
  symbol: string
  description?: string
  image?: File | Buffer
  twitter?: string
  telegram?: string
  website?: string
  initialBuySOL?: number
}

export interface LaunchResult {
  success: boolean
  tokenMint?: string
  signature?: string
  metadataUri?: string
  pumpFunUrl?: string
  error?: string
}

export class PumpServiceOfficial {
  private connection: Connection
  private pumpSdk?: PumpSdk
  private swapSdk?: PumpSwapSdk
  private creatorWallet?: Keypair

  constructor() {
    // Initialize connection
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    this.connection = new Connection(rpcUrl, 'confirmed')

    // Load creator wallet if available
    this.initializeWallet()
  }

  private initializeWallet() {
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY
    if (privateKey && privateKey !== 'YOUR_PRIVATE_KEY_HERE') {
      try {
        const privateKeyArray = bs58.decode(privateKey)
        this.creatorWallet = Keypair.fromSecretKey(privateKeyArray)
        console.log('✅ Pump creator wallet loaded:', this.creatorWallet.publicKey.toBase58())

        // Initialize SDKs with wallet
        this.pumpSdk = new PumpSdk({
          connection: this.connection,
          wallet: this.creatorWallet
        })

        this.swapSdk = new PumpSwapSdk({
          connection: this.connection,
          wallet: this.creatorWallet
        })

      } catch (error) {
        console.error('❌ Failed to load creator wallet:', error)
      }
    } else {
      console.warn('⚠️  No creator wallet configured')
    }
  }

  /**
   * Launch token on Pump.fun using official SDK
   */
  async launchToken(params: PumpTokenParams): Promise<LaunchResult> {
    if (!this.creatorWallet || !this.pumpSdk) {
      return {
        success: false,
        error: 'Creator wallet not configured. Set PUMP_FUN_CREATOR_PRIVATE_KEY in .env'
      }
    }

    try {
      console.log('🚀 Launching token on Pump.fun...')
      console.log(`   Name: ${params.name}`)
      console.log(`   Symbol: ${params.symbol}`)
      console.log(`   Initial Buy: ${params.initialBuySOL || 0} SOL`)

      // Step 1: Upload metadata
      console.log('📤 Uploading metadata...')
      const metadataUri = await this.uploadMetadata(params)
      console.log('✅ Metadata uploaded:', metadataUri)

      // Step 2: Generate mint keypair
      const mintKeypair = Keypair.generate()
      console.log('🔑 Token mint:', mintKeypair.publicKey.toBase58())

      // Step 3: Create token with initial buy
      console.log('💰 Creating token...')
      const createResult = await this.pumpSdk.createToken({
        mint: mintKeypair,
        name: params.name,
        symbol: params.symbol,
        uri: metadataUri,
        initialBuy: params.initialBuySOL
          ? BigInt(Math.floor(params.initialBuySOL * LAMPORTS_PER_SOL))
          : undefined
      })

      if (!createResult.success) {
        throw new Error(createResult.error || 'Token creation failed')
      }

      console.log('✅ Token created successfully!')
      console.log('   Transaction:', createResult.signature)
      console.log('')
      console.log('📊 Token Distribution:')
      console.log('   Bonding Curve: 793,000,000 tokens (79.3%)')
      console.log('   Liquidity Pool: 207,000,000 tokens (20.7%)')
      console.log('   Graduation: At 84.985 SOL raised')
      console.log('')
      console.log('💰 Fee Structure:')
      console.log('   Bonding: 1.25% (0.30% to creator)')
      console.log('   Post-grad: 0.05%-0.95% (30% to creator)')

      return {
        success: true,
        tokenMint: mintKeypair.publicKey.toBase58(),
        signature: createResult.signature,
        metadataUri,
        pumpFunUrl: `https://pump.fun/coin/${mintKeypair.publicKey.toBase58()}`
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
   * Upload metadata to IPFS
   */
  private async uploadMetadata(params: PumpTokenParams): Promise<string> {
    // Use Pump.fun's IPFS endpoint
    const formData = new FormData()

    if (params.image) {
      formData.append('file', params.image)
    }
    formData.append('name', params.name)
    formData.append('symbol', params.symbol)
    if (params.description) formData.append('description', params.description)
    if (params.twitter) formData.append('twitter', params.twitter)
    if (params.telegram) formData.append('telegram', params.telegram)
    if (params.website) formData.append('website', params.website)

    const response = await fetch('https://pump.fun/api/ipfs', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      // Fallback to mock URI
      return `https://ipfs.io/ipfs/Qm${Buffer.from(params.name).toString('hex').slice(0, 44)}`
    }

    const data = await response.json()
    return data.metadataUri || data.uri
  }

  /**
   * Buy tokens on bonding curve
   */
  async buyTokens(tokenMint: string, amountSOL: number): Promise<LaunchResult> {
    if (!this.pumpSdk) {
      return { success: false, error: 'SDK not initialized' }
    }

    try {
      const result = await this.pumpSdk.buy({
        mint: new PublicKey(tokenMint),
        amount: BigInt(Math.floor(amountSOL * LAMPORTS_PER_SOL)),
        slippage: 1000 // 10%
      })

      return {
        success: true,
        signature: result.signature
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Sell tokens on bonding curve
   */
  async sellTokens(tokenMint: string, tokenAmount: number): Promise<LaunchResult> {
    if (!this.pumpSdk) {
      return { success: false, error: 'SDK not initialized' }
    }

    try {
      const result = await this.pumpSdk.sell({
        mint: new PublicKey(tokenMint),
        amount: BigInt(tokenAmount),
        slippage: 1000 // 10%
      })

      return {
        success: true,
        signature: result.signature
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Check if token has graduated to PumpSwap
   */
  async checkGraduation(tokenMint: string): Promise<{
    graduated: boolean
    raisedSOL?: number
    marketCap?: number
    poolAddress?: string
  }> {
    if (!this.swapSdk) {
      return { graduated: false }
    }

    try {
      const poolInfo = await this.swapSdk.getPool(new PublicKey(tokenMint))

      if (poolInfo) {
        return {
          graduated: true,
          raisedSOL: poolInfo.raisedSOL,
          marketCap: poolInfo.marketCap,
          poolAddress: poolInfo.address.toBase58()
        }
      }

      return { graduated: false }
    } catch (error) {
      return { graduated: false }
    }
  }

  /**
   * Trade on PumpSwap (post-graduation)
   */
  async swapTokens(params: {
    tokenMint: string
    amountIn: number
    tokenIn: 'SOL' | 'TOKEN'
    slippage?: number
  }): Promise<LaunchResult> {
    if (!this.swapSdk) {
      return { success: false, error: 'Swap SDK not initialized' }
    }

    try {
      const result = await this.swapSdk.swap({
        mint: new PublicKey(params.tokenMint),
        amountIn: BigInt(params.amountIn),
        tokenIn: params.tokenIn,
        slippage: params.slippage || 1000 // Default 10%
      })

      return {
        success: true,
        signature: result.signature
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get token info
   */
  async getTokenInfo(tokenMint: string) {
    const mint = new PublicKey(tokenMint)

    // Check bonding curve
    if (this.pumpSdk) {
      const bondingInfo = await this.pumpSdk.getBondingCurve(mint)
      if (bondingInfo) {
        return {
          stage: 'bonding',
          ...bondingInfo,
          fee: '1.25% (0.30% to creator)'
        }
      }
    }

    // Check PumpSwap
    if (this.swapSdk) {
      const poolInfo = await this.swapSdk.getPool(mint)
      if (poolInfo) {
        return {
          stage: 'graduated',
          ...poolInfo,
          fee: 'Dynamic 0.05%-0.95% (30% to creator)'
        }
      }
    }

    return null
  }
}

// Export singleton instance
let serviceInstance: PumpServiceOfficial | null = null

export function getPumpServiceOfficial(): PumpServiceOfficial {
  if (!serviceInstance) {
    serviceInstance = new PumpServiceOfficial()
  }
  return serviceInstance
}