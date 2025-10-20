/**
 * Pump.fun Service - PRODUCTION IMPLEMENTATION
 *
 * This is the REAL implementation using pumpdotfun-sdk
 * Replace service.ts with this when ready for production
 *
 * Updated: October 2025 with Project Ascend Dynamic Fees
 */

import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { PumpFunSDK } from 'pumpdotfun-sdk'
import { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import * as bs58 from 'bs58'

export interface TokenCreateParams {
  name: string
  symbol: string
  decimals: number
  supply: number
  metadata?: {
    description?: string
    image?: string
    twitter?: string
    telegram?: string
    website?: string
    curveId?: string
  }
}

export interface LiquidityParams {
  tokenMint: string
  solAmount: number
  initialPrice: number
  slippageBps: number
}

export interface AirdropRecipient {
  userId: string
  walletAddress: string
  amount: number
  percentage: number
}

export class PumpFunProductionService {
  private connection: Connection
  private sdk: PumpFunSDK
  private creatorWallet?: Keypair

  constructor() {
    // Initialize Solana connection
    const rpcUrl = process.env.SOLANA_RPC_URL || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    this.connection = new Connection(rpcUrl, 'confirmed')

    // Initialize SDK
    this.sdk = new PumpFunSDK(this.connection)

    // Load creator wallet from environment
    if (process.env.PUMP_FUN_CREATOR_PRIVATE_KEY) {
      try {
        const privateKeyArray = bs58.decode(process.env.PUMP_FUN_CREATOR_PRIVATE_KEY)
        this.creatorWallet = Keypair.fromSecretKey(privateKeyArray)
        console.log('✅ Pump.fun creator wallet loaded:', this.creatorWallet.publicKey.toBase58())
      } catch (error) {
        console.error('❌ Failed to load creator wallet:', error)
        console.log('💡 Set PUMP_FUN_CREATOR_PRIVATE_KEY in .env.local')
      }
    } else {
      console.warn('⚠️  No creator wallet configured. Set PUMP_FUN_CREATOR_PRIVATE_KEY in .env')
    }
  }

  /**
   * Upload metadata to IPFS via pump.fun API
   */
  async uploadMetadata(params: {
    imageFile?: File | Buffer
    name: string
    symbol: string
    description?: string
    twitter?: string
    telegram?: string
    website?: string
  }): Promise<string> {
    const formData = new FormData()

    if (params.imageFile) {
      formData.append('file', params.imageFile)
    }
    formData.append('name', params.name)
    formData.append('symbol', params.symbol)
    if (params.description) formData.append('description', params.description)
    if (params.twitter) formData.append('twitter', params.twitter)
    if (params.telegram) formData.append('telegram', params.telegram)
    if (params.website) formData.append('website', params.website)
    formData.append('showName', 'true')

    const response = await fetch('https://pump.fun/api/ipfs', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.metadataUri
  }

  /**
   * Create token on Pump.fun with initial buy
   *
   * This uses the bonding curve mechanism:
   * - 1 billion token supply
   * - 800M on bonding curve
   * - Initial buy triggers bonding curve
   * - Earns 0.30% creator fee on bonding curve
   * - Auto-graduates to PumpSwap at ~$69k market cap
   */
  async createToken(params: TokenCreateParams, initialBuySOL: number = 0.01): Promise<{
    tokenMint: string
    signature: string
    metadataUri: string
  }> {
    if (!this.creatorWallet) {
      throw new Error('Creator wallet not configured. Set PUMP_FUN_CREATOR_PRIVATE_KEY in .env')
    }

    console.log('🚀 Creating token on Pump.fun...')
    console.log(`   Name: ${params.name}`)
    console.log(`   Symbol: ${params.symbol}`)
    console.log(`   Initial Buy: ${initialBuySOL} SOL`)

    // Step 1: Upload metadata to IPFS
    console.log('📤 Uploading metadata to IPFS...')
    const metadataUri = await this.uploadMetadata({
      name: params.name,
      symbol: params.symbol,
      description: params.metadata?.description,
      twitter: params.metadata?.twitter,
      telegram: params.metadata?.telegram,
      website: params.metadata?.website,
      // imageFile would come from params if provided
    })
    console.log('✅ Metadata uploaded:', metadataUri)

    // Step 2: Generate new mint keypair
    const mintKeypair = Keypair.generate()
    console.log('🔑 Token mint:', mintKeypair.publicKey.toBase58())

    // Step 3: Create token with initial buy
    console.log('💰 Creating token with initial buy...')
    const result = await this.sdk.createAndBuy(
      this.creatorWallet,
      mintKeypair,
      {
        name: params.name,
        symbol: params.symbol,
        uri: metadataUri
      },
      BigInt(initialBuySOL * LAMPORTS_PER_SOL), // Initial buy amount in lamports
      500n // 5% slippage (500 basis points)
    )

    console.log('✅ Token created successfully!')
    console.log('   Transaction:', result.signature)
    console.log('   Token Mint:', mintKeypair.publicKey.toBase58())
    console.log('')
    console.log('📊 Now live on bonding curve!')
    console.log('   Bonding curve fee: 1.25% (0.30% to you as creator)')
    console.log('   Graduation threshold: ~$69k market cap (800M tokens sold)')
    console.log('   After graduation: Dynamic fees 0.05%-0.95% based on market cap')
    console.log('')

    return {
      tokenMint: mintKeypair.publicKey.toBase58(),
      signature: result.signature,
      metadataUri
    }
  }

  /**
   * Buy tokens on bonding curve or PumpSwap
   */
  async buyTokens(
    mintAddress: string,
    buyerWallet: Keypair,
    solAmount: number,
    slippageBps: number = 500
  ): Promise<{ signature: string }> {
    console.log(`💰 Buying ${solAmount} SOL worth of tokens...`)

    const mint = new PublicKey(mintAddress)
    const result = await this.sdk.buy(
      buyerWallet,
      mint,
      BigInt(solAmount * LAMPORTS_PER_SOL),
      BigInt(slippageBps)
    )

    console.log('✅ Buy successful:', result.signature)
    return { signature: result.signature }
  }

  /**
   * Sell tokens on bonding curve or PumpSwap
   */
  async sellTokens(
    mintAddress: string,
    sellerWallet: Keypair,
    tokenAmount: number,
    slippageBps: number = 500
  ): Promise<{ signature: string }> {
    console.log(`💸 Selling ${tokenAmount} tokens...`)

    const mint = new PublicKey(mintAddress)
    const result = await this.sdk.sell(
      sellerWallet,
      mint,
      BigInt(tokenAmount),
      BigInt(slippageBps)
    )

    console.log('✅ Sell successful:', result.signature)
    return { signature: result.signature }
  }

  /**
   * Execute airdrops to all holders
   *
   * Batch sends SPL tokens to holder wallets
   * NOTE: This requires actual Solana wallet addresses, not user IDs
   */
  async executeAirdrops(params: {
    tokenMint: string
    fromWallet: Keypair
    recipients: AirdropRecipient[]
  }): Promise<string[]> {
    console.log(`🎁 Executing airdrops to ${params.recipients.length} holders...`)

    const mint = new PublicKey(params.tokenMint)
    const txHashes: string[] = []

    // Get sender's token account
    const senderTokenAccount = await getAssociatedTokenAddress(
      mint,
      params.fromWallet.publicKey
    )

    for (const recipient of params.recipients) {
      try {
        // Convert wallet address string to PublicKey
        const recipientWallet = new PublicKey(recipient.walletAddress)

        // Get or create recipient's associated token account
        const recipientTokenAccount = await getAssociatedTokenAddress(
          mint,
          recipientWallet
        )

        // Check if account exists, create if not
        const accountInfo = await this.connection.getAccountInfo(recipientTokenAccount)

        const instructions = []
        if (!accountInfo) {
          // Create associated token account
          instructions.push(
            createAssociatedTokenAccountInstruction(
              params.fromWallet.publicKey,
              recipientTokenAccount,
              recipientWallet,
              mint
            )
          )
        }

        // Add transfer instruction
        instructions.push(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            params.fromWallet.publicKey,
            BigInt(recipient.amount)
          )
        )

        // Send transaction
        const { Transaction } = await import('@solana/web3.js')
        const transaction = new Transaction().add(...instructions)
        const signature = await this.connection.sendTransaction(
          transaction,
          [params.fromWallet]
        )

        await this.connection.confirmTransaction(signature)
        txHashes.push(signature)

        console.log(`  ✅ Airdropped ${recipient.amount.toLocaleString()} tokens to ${recipient.walletAddress}`)
        console.log(`     User: ${recipient.userId} (${recipient.percentage.toFixed(2)}%)`)
        console.log(`     Tx: ${signature}`)

      } catch (error) {
        console.error(`  ❌ Failed to airdrop to ${recipient.userId}:`, error)
        // Continue with other recipients
      }

      // Small delay between transactions to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`✅ Airdrops complete! ${txHashes.length}/${params.recipients.length} successful`)
    return txHashes
  }

  /**
   * Check if token has graduated to PumpSwap
   */
  async checkGraduation(tokenMint: string): Promise<{
    graduated: boolean
    marketCap?: number
    poolAddress?: string
  }> {
    // This would use PumpSwap SDK in production
    // For now, returning structure
    console.log('Checking graduation status for:', tokenMint)

    // TODO: Implement with @pump-fun/pump-swap-sdk
    // const sdk = new PumpAmmSdk(this.connection)
    // const poolInfo = await sdk.getPoolInfo(new PublicKey(tokenMint))

    return {
      graduated: false,
      marketCap: 0
    }
  }

  /**
   * Get connection for external use
   */
  getConnection(): Connection {
    return this.connection
  }

  /**
   * Get SDK instance for advanced usage
   */
  getSDK(): PumpFunSDK {
    return this.sdk
  }
}

// Singleton instance
let productionService: PumpFunProductionService | null = null

export function getPumpFunProductionService(): PumpFunProductionService {
  if (!productionService) {
    productionService = new PumpFunProductionService()
  }
  return productionService
}
