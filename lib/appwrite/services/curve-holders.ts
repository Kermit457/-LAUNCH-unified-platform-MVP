import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from '../client'
import type { CurveHolder } from '@/types/curve'

export class CurveHolderService {
  /**
   * Create or update holder record
   */
  static async upsertHolder(data: {
    curveId: string
    userId: string
    balance: number
    avgPrice: number
    totalInvested: number
    realizedPnl?: number
    unrealizedPnl?: number
  }): Promise<CurveHolder> {
    try {
      // Check if holder exists
      const existing = await this.getHolder(data.curveId, data.userId)

      if (existing) {
        // Update existing holder
        const updated = await databases.updateDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          existing.id,
          {
            balance: data.balance,
            avgPrice: data.avgPrice,
            totalInvested: data.totalInvested,
            realizedPnl: data.realizedPnl || existing.realizedPnl,
            unrealizedPnl: data.unrealizedPnl || existing.unrealizedPnl,
            lastTradeAt: new Date().toISOString()
          }
        )
        return updated as unknown as CurveHolder
      } else {
        // Create new holder
        const holder = {
          curveId: data.curveId,
          userId: data.userId,
          balance: data.balance,
          avgPrice: data.avgPrice,
          totalInvested: data.totalInvested,
          realizedPnl: data.realizedPnl || 0,
          unrealizedPnl: data.unrealizedPnl || 0,
          firstBuyAt: new Date().toISOString(),
          lastTradeAt: new Date().toISOString()
        }

        const document = await databases.createDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          ID.unique(),
          holder
        )

        return document as unknown as CurveHolder
      }
    } catch (error) {
      console.error('Error upserting holder:', error)
      throw error
    }
  }

  /**
   * Get holder by curve and user
   */
  static async getHolder(
    curveId: string,
    userId: string
  ): Promise<CurveHolder | null> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.equal('userId', userId),
          Query.limit(1)
        ]
      )

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as CurveHolder
      }

      return null
    } catch (error) {
      console.error('Error fetching holder:', error)
      return null
    }
  }

  /**
   * Get all holders for a curve
   */
  static async getHoldersByCurve(
    curveId: string,
    limit = 100,
    offset = 0
  ): Promise<CurveHolder[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.greaterThan('balance', 0),
          Query.orderDesc('balance'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as CurveHolder[]
    } catch (error) {
      console.error('Error fetching holders:', error)
      return []
    }
  }

  /**
   * Get holdings for a user across all curves
   */
  static async getHoldingsByUser(
    userId: string,
    limit = 100
  ): Promise<CurveHolder[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('userId', userId),
          Query.greaterThan('balance', 0),
          Query.orderDesc('totalInvested'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as CurveHolder[]
    } catch (error) {
      console.error('Error fetching user holdings:', error)
      return []
    }
  }

  /**
   * Get top holders for a curve
   */
  static async getTopHolders(
    curveId: string,
    limit = 10
  ): Promise<CurveHolder[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.greaterThan('balance', 0),
          Query.orderDesc('balance'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as CurveHolder[]
    } catch (error) {
      console.error('Error fetching top holders:', error)
      return []
    }
  }

  /**
   * Get holder count for a curve
   */
  static async getHolderCount(curveId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.greaterThan('balance', 0),
          Query.limit(1000)
        ]
      )
      return response.documents.length
    } catch (error) {
      console.error('Error counting holders:', error)
      return 0
    }
  }

  /**
   * Check if user holds keys in a curve
   */
  static async userHoldsKeys(
    curveId: string,
    userId: string,
    minKeys = 1
  ): Promise<boolean> {
    try {
      const holder = await this.getHolder(curveId, userId)
      return holder ? holder.balance >= minKeys : false
    } catch (error) {
      console.error('Error checking if user holds keys:', error)
      return false
    }
  }

  /**
   * Update holder P&L
   */
  static async updatePnL(
    curveId: string,
    userId: string,
    currentPrice: number
  ): Promise<CurveHolder | null> {
    try {
      const holder = await this.getHolder(curveId, userId)
      if (!holder) return null

      const unrealizedPnl = (currentPrice - holder.avgPrice) * holder.balance

      const updated = await databases.updateDocument(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        holder.id,
        { unrealizedPnl }
      )

      return updated as unknown as CurveHolder
    } catch (error) {
      console.error('Error updating PnL:', error)
      return null
    }
  }

  /**
   * Process buy transaction
   */
  static async processBuy(
    curveId: string,
    userId: string,
    keys: number,
    price: number,
    amountSpent: number
  ): Promise<CurveHolder> {
    try {
      const existing = await this.getHolder(curveId, userId)

      if (existing) {
        // Update existing position
        const newBalance = existing.balance + keys
        const newTotalInvested = existing.totalInvested + amountSpent
        const newAvgPrice = newTotalInvested / newBalance

        return await this.upsertHolder({
          curveId,
          userId,
          balance: newBalance,
          avgPrice: newAvgPrice,
          totalInvested: newTotalInvested,
          realizedPnl: existing.realizedPnl,
          unrealizedPnl: (price - newAvgPrice) * newBalance
        })
      } else {
        // Create new position
        return await this.upsertHolder({
          curveId,
          userId,
          balance: keys,
          avgPrice: price,
          totalInvested: amountSpent,
          realizedPnl: 0,
          unrealizedPnl: 0
        })
      }
    } catch (error) {
      console.error('Error processing buy:', error)
      throw error
    }
  }

  /**
   * Process sell transaction
   */
  static async processSell(
    curveId: string,
    userId: string,
    keys: number,
    price: number,
    amountReceived: number
  ): Promise<CurveHolder | null> {
    try {
      const existing = await this.getHolder(curveId, userId)
      if (!existing || existing.balance < keys) {
        throw new Error('Insufficient balance to sell')
      }

      const newBalance = existing.balance - keys
      const sellCost = existing.avgPrice * keys
      const pnl = amountReceived - sellCost

      return await this.upsertHolder({
        curveId,
        userId,
        balance: newBalance,
        avgPrice: existing.avgPrice, // Average doesn't change on sell
        totalInvested: existing.totalInvested - sellCost,
        realizedPnl: existing.realizedPnl + pnl,
        unrealizedPnl: newBalance > 0 ? (price - existing.avgPrice) * newBalance : 0
      })
    } catch (error) {
      console.error('Error processing sell:', error)
      throw error
    }
  }

  /**
   * Get holder portfolio value
   */
  static async getPortfolioValue(
    userId: string,
    currentPrices: Map<string, number>
  ): Promise<number> {
    try {
      const holdings = await this.getHoldingsByUser(userId)

      return holdings.reduce((total, holding) => {
        const currentPrice = currentPrices.get(holding.curveId) || holding.avgPrice
        return total + (holding.balance * currentPrice)
      }, 0)
    } catch (error) {
      console.error('Error calculating portfolio value:', error)
      return 0
    }
  }
}