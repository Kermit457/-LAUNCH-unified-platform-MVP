/**
 * Solana Price Service - Real-time price fetching from smart contracts
 * Connects to bonding curve contracts to get live price data
 */

import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor'
import { IDL } from './idl/curve-idl'

const PROGRAM_ID = new PublicKey('Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF')

export interface TokenPrice {
  price: number
  supply: number
  marketCap: number
  volume24h: number
  priceChange24h: number
  lastUpdated: number
}

export class SolanaPriceService {
  private connection: Connection
  private program: Program | null = null

  constructor(rpcUrl: string = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed')
  }

  /**
   * Initialize Anchor program
   */
  private async initProgram(): Promise<Program> {
    if (this.program) return this.program

    // Create a dummy wallet for read-only operations
    const dummyWallet = {
      publicKey: PublicKey.default,
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
    }

    const provider = new AnchorProvider(
      this.connection,
      dummyWallet as any,
      { commitment: 'confirmed' }
    )

    this.program = new Program(IDL, PROGRAM_ID, provider)
    return this.program
  }

  /**
   * Get current price from bonding curve contract
   */
  async getCurrentPrice(mintAddress: string): Promise<TokenPrice | null> {
    try {
      const program = await this.initProgram()
      const mint = new PublicKey(mintAddress)

      // Derive PDA for curve state
      const [curveStatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('curve'), mint.toBuffer()],
        PROGRAM_ID
      )

      // Fetch curve state from chain
      const curveState = await program.account.curveState.fetch(curveStatePDA)

      // Calculate current price based on bonding curve formula
      const supply = curveState.totalSupply as BN
      const reserve = curveState.solReserve as BN

      // Price = reserve / supply (simplified bonding curve)
      const price = reserve.toNumber() / Math.max(supply.toNumber(), 1) / 1e9 // Convert lamports to SOL

      // Get 24h data from transaction history
      const priceData = await this.get24HourData(mintAddress)

      return {
        price,
        supply: supply.toNumber(),
        marketCap: price * supply.toNumber(),
        volume24h: priceData.volume,
        priceChange24h: priceData.change,
        lastUpdated: Date.now()
      }
    } catch (error) {
      console.error('Error fetching price from contract:', error)
      return null
    }
  }

  /**
   * Get 24-hour trading data
   */
  private async get24HourData(mintAddress: string): Promise<{ volume: number; change: number }> {
    try {
      const mint = new PublicKey(mintAddress)
      const now = Math.floor(Date.now() / 1000)
      const oneDayAgo = now - 86400

      // Get transaction signatures for the last 24 hours
      const signatures = await this.connection.getSignaturesForAddress(
        mint,
        { limit: 1000 }
      )

      let volume = 0
      let firstPrice = 0
      let lastPrice = 0

      // Process transactions to calculate volume and price change
      for (const sig of signatures) {
        const tx = await this.connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0
        })

        if (!tx || !tx.blockTime) continue
        if (tx.blockTime < oneDayAgo) break

        // Parse transaction to extract trade data
        // This is simplified - real implementation would decode instruction data
        const tradeAmount = 0.1 // Placeholder
        volume += tradeAmount

        if (firstPrice === 0) firstPrice = tradeAmount
        lastPrice = tradeAmount
      }

      const change = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0

      return { volume, change }
    } catch (error) {
      console.error('Error fetching 24h data:', error)
      return { volume: 0, change: 0 }
    }
  }

  /**
   * Subscribe to real-time price updates
   */
  subscribeToPrice(
    mintAddress: string,
    callback: (price: TokenPrice) => void
  ): number {
    const mint = new PublicKey(mintAddress)

    // Subscribe to account changes
    return this.connection.onAccountChange(
      mint,
      async () => {
        const price = await this.getCurrentPrice(mintAddress)
        if (price) callback(price)
      },
      'confirmed'
    )
  }

  /**
   * Unsubscribe from price updates
   */
  unsubscribeFromPrice(subscriptionId: number): void {
    this.connection.removeAccountChangeListener(subscriptionId)
  }

  /**
   * Get prices for multiple tokens
   */
  async getBatchPrices(mintAddresses: string[]): Promise<Map<string, TokenPrice>> {
    const prices = new Map<string, TokenPrice>()

    // Fetch prices in parallel
    const promises = mintAddresses.map(async (address) => {
      const price = await this.getCurrentPrice(address)
      if (price) prices.set(address, price)
    })

    await Promise.all(promises)
    return prices
  }
}

// Singleton instance
let priceService: SolanaPriceService | null = null

export function getPriceService(): SolanaPriceService {
  if (!priceService) {
    priceService = new SolanaPriceService()
  }
  return priceService
}

// Hook for React components
export function useSolanaPrice(mintAddress?: string) {
  const [price, setPrice] = useState<TokenPrice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mintAddress) return

    let subscriptionId: number | null = null

    const fetchPrice = async () => {
      setLoading(true)
      setError(null)

      try {
        const service = getPriceService()
        const tokenPrice = await service.getCurrentPrice(mintAddress)
        setPrice(tokenPrice)

        // Subscribe to updates
        subscriptionId = service.subscribeToPrice(mintAddress, (newPrice) => {
          setPrice(newPrice)
        })
      } catch (err) {
        setError(err.message)
        console.error('Error fetching Solana price:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()

    // Cleanup subscription
    return () => {
      if (subscriptionId !== null) {
        getPriceService().unsubscribeFromPrice(subscriptionId)
      }
    }
  }, [mintAddress])

  return { price, loading, error }
}

import { useState, useEffect } from 'react'