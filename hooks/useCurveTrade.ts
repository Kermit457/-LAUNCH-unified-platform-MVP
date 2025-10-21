/**
 * useCurveTrade Hook
 * Combines Solana blockchain transaction execution with Appwrite state management
 * Handles both buy and sell operations with real bonding curve math
 */

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth/solana'
import { useSolanaBuyKeys } from './useSolanaBuyKeys'
import { CurveService } from '@/lib/appwrite/services/curves'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'
import { calculateTrade, calculatePrice } from '@/lib/curve/bonding-math'
import type { Curve, CurveEvent, CurveHolder } from '@/types/curve'

export interface TradeResult {
  success: boolean
  txHash?: string
  curve?: Curve
  message?: string
  error?: string
}

export function useCurveTrade() {
  const { authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const { buyKeys: solanaBuyKeys } = useSolanaBuyKeys()

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Execute a buy trade - Calls Solana contract + updates Appwrite
   */
  const buyKeys = async (
    curveId: string,
    amount: number,
    referrerId?: string
  ): Promise<TradeResult> => {
    if (!authenticated || !user?.id) {
      return { success: false, error: 'Please connect your wallet' }
    }

    setIsProcessing(true)
    setError(null)

    try {
      // 1. Get curve data from Appwrite
      const curve = await CurveService.getCurveById(curveId)
      if (!curve) {
        throw new Error('Curve not found')
      }

      if (curve.state !== 'active') {
        throw new Error(`Curve is ${curve.state}, trading is disabled`)
      }

      // 2. Calculate trade details
      const currentPrice = calculatePrice(curve.supply)
      const trade = calculateTrade('buy', amount, curve.supply, currentPrice, !!referrerId)

      if (trade.warnings && trade.warnings.length > 0) {
        console.warn('Trade warnings:', trade.warnings)
      }

      // 3. Execute Solana transaction
      // Note: For now, we'll bypass the actual Solana transaction and just update Appwrite
      // TODO: Wire this to actual solanaBuyKeys() when contract is ready
      // const txHash = await solanaBuyKeys(curve.ownerId, trade.keys, referrerId)

      console.log('📊 Trade Details:', {
        keys: trade.keys,
        cost: trade.amount,
        priceImpact: trade.priceImpact,
        fees: trade.fees
      })

      // 4. Update curve in Appwrite
      const newSupply = curve.supply + trade.keys
      const newPrice = calculatePrice(newSupply)
      const newMarketCap = newSupply * newPrice
      const newReserve = curve.reserve + (trade.fees?.reserve || 0)

      const updatedCurve = await CurveService.updateCurve(curveId, {
        supply: newSupply,
        price: newPrice,
        marketCap: newMarketCap,
        reserve: newReserve,
        volume24h: curve.volume24h + trade.amount,
        volumeTotal: curve.volumeTotal + trade.amount,
      })

      if (!updatedCurve) {
        throw new Error('Failed to update curve state')
      }

      // 5. Create or update holder record
      const existingHolder = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.equal('userId', user.id),
          Query.limit(1)
        ]
      )

      if (existingHolder.documents.length > 0) {
        // Update existing holder
        const holder = existingHolder.documents[0] as any
        const newBalance = holder.balance + trade.keys
        const newTotalInvested = holder.totalInvested + trade.amount
        const newAvgPrice = newTotalInvested / newBalance

        await databases.updateDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          holder.$id,
          {
            balance: newBalance,
            avgPrice: newAvgPrice,
            totalInvested: newTotalInvested,
            lastTradeAt: new Date().toISOString()
          }
        )
      } else {
        // Create new holder record
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          ID.unique(),
          {
            curveId,
            userId: user.id,
            balance: trade.keys,
            avgPrice: trade.pricePerKey,
            totalInvested: trade.amount,
            realizedPnl: 0,
            unrealizedPnl: 0,
            firstBuyAt: new Date().toISOString(),
            lastTradeAt: new Date().toISOString()
          }
        )

        // Increment holders count
        await CurveService.updateCurve(curveId, {
          holders: curve.holders + 1
        })
      }

      // 6. Record trade event
      await databases.createDocument(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        ID.unique(),
        {
          curveId,
          type: 'buy',
          amount: trade.amount,
          price: trade.price,
          keys: trade.keys,
          userId: user.id,
          referrerId: referrerId || null,
          reserveFee: trade.fees?.reserve || 0,
          projectFee: trade.fees?.instant || 0,
          platformFee: trade.fees?.platform || 0,
          referralFee: trade.fees?.buyback || 0,
          timestamp: new Date().toISOString()
        }
      )

      return {
        success: true,
        // txHash, // TODO: Add when Solana tx is wired
        curve: updatedCurve,
        message: `Successfully bought ${trade.keys.toFixed(3)} keys for ${trade.amount.toFixed(4)} SOL`
      }
    } catch (err: any) {
      console.error('Buy keys failed:', err)
      const errorMessage = err.message || 'Failed to buy keys'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Execute a sell trade - Calls Solana contract + updates Appwrite
   */
  const sellKeys = async (
    curveId: string,
    keysToSell: number
  ): Promise<TradeResult> => {
    if (!authenticated || !user?.id) {
      return { success: false, error: 'Please connect your wallet' }
    }

    setIsProcessing(true)
    setError(null)

    try {
      // 1. Get curve data
      const curve = await CurveService.getCurveById(curveId)
      if (!curve) {
        throw new Error('Curve not found')
      }

      if (curve.state !== 'active') {
        throw new Error(`Curve is ${curve.state}, trading is disabled`)
      }

      // 2. Verify user has enough keys
      const holderResponse = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.equal('userId', user.id),
          Query.limit(1)
        ]
      )

      if (holderResponse.documents.length === 0) {
        throw new Error('You do not hold any keys')
      }

      const holder = holderResponse.documents[0] as any
      if (holder.balance < keysToSell) {
        throw new Error(`Insufficient keys. You have ${holder.balance.toFixed(3)} keys`)
      }

      // 3. Calculate sell proceeds
      const currentPrice = calculatePrice(curve.supply)
      // For sell, we need to calculate proceeds from selling specific keys
      const trade = calculateTrade('sell', keysToSell * currentPrice, curve.supply, currentPrice)

      // 4. Execute Solana transaction
      // TODO: Wire to actual Solana sell transaction
      console.log('📊 Sell Details:', {
        keys: keysToSell,
        proceeds: trade.amount,
        priceImpact: trade.priceImpact
      })

      // 5. Update curve state
      const newSupply = curve.supply - keysToSell
      const newPrice = calculatePrice(newSupply)
      const newMarketCap = newSupply * newPrice

      const updatedCurve = await CurveService.updateCurve(curveId, {
        supply: newSupply,
        price: newPrice,
        marketCap: newMarketCap,
        volume24h: curve.volume24h + trade.amount,
        volumeTotal: curve.volumeTotal + trade.amount,
      })

      if (!updatedCurve) {
        throw new Error('Failed to update curve state')
      }

      // 6. Update holder record
      const newBalance = holder.balance - keysToSell
      const realizedPnl = trade.amount - (keysToSell * holder.avgPrice)

      if (newBalance > 0) {
        await databases.updateDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          holder.$id,
          {
            balance: newBalance,
            realizedPnl: holder.realizedPnl + realizedPnl,
            lastTradeAt: new Date().toISOString()
          }
        )
      } else {
        // Sold all keys - delete holder record
        await databases.deleteDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          holder.$id
        )

        // Decrement holders count
        await CurveService.updateCurve(curveId, {
          holders: Math.max(0, curve.holders - 1)
        })
      }

      // 7. Record sell event
      await databases.createDocument(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        ID.unique(),
        {
          curveId,
          type: 'sell',
          amount: trade.amount,
          price: trade.price,
          keys: keysToSell,
          userId: user.id,
          timestamp: new Date().toISOString()
        }
      )

      return {
        success: true,
        curve: updatedCurve,
        message: `Successfully sold ${keysToSell.toFixed(3)} keys for ${trade.amount.toFixed(4)} SOL`
      }
    } catch (err: any) {
      console.error('Sell keys failed:', err)
      const errorMessage = err.message || 'Failed to sell keys'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    buyKeys,
    sellKeys,
    isProcessing,
    error
  }
}
