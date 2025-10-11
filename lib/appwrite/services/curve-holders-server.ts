import { ID, Query } from 'node-appwrite'
import { serverDatabases, DB_ID, COLLECTIONS } from '../server-client'
import type { CurveHolder } from '@/types/curve'

// Helper to get document ID from Appwrite document
function getDocId(doc: any): string {
  return doc.$id || doc.id
}

export class ServerCurveHolderService {
  static async upsertHolder(data: Omit<CurveHolder, 'id'>): Promise<CurveHolder> {
    try {
      // Try to find existing holder
      const existing = await this.getHolder(data.curveId, data.userId)

      if (existing) {
        // Update existing
        const updated = await serverDatabases.updateDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          getDocId(existing),
          data
        )
        return updated as unknown as CurveHolder
      } else {
        // Create new
        const created = await serverDatabases.createDocument(
          DB_ID,
          COLLECTIONS.CURVE_HOLDERS,
          ID.unique(),
          data
        )
        return created as unknown as CurveHolder
      }
    } catch (error) {
      console.error('Error upserting holder:', error)
      throw error
    }
  }

  static async getHolder(curveId: string, userId: string): Promise<CurveHolder | null> {
    try {
      const response = await serverDatabases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.equal('userId', userId),
          Query.limit(1)
        ]
      )

      if (response.documents.length === 0) {
        return null
      }

      return response.documents[0] as unknown as CurveHolder
    } catch (error) {
      console.error('Error getting holder:', error)
      return null
    }
  }

  static async getHoldersByCurve(
    curveId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<CurveHolder[]> {
    try {
      const response = await serverDatabases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_HOLDERS,
        [
          Query.equal('curveId', curveId),
          Query.orderDesc('balance'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as CurveHolder[]
    } catch (error) {
      console.error('Error getting holders:', error)
      return []
    }
  }

  static async processBuy(
    curveId: string,
    userId: string,
    keys: number,
    price: number,
    amountSpent: number
  ): Promise<CurveHolder> {
    const existing = await this.getHolder(curveId, userId)
    const now = new Date().toISOString()

    if (existing) {
      // Update existing holder
      const newBalance = existing.balance + keys
      const newTotalInvested = existing.totalInvested + amountSpent
      const newAvgPrice = newTotalInvested / newBalance

      return this.upsertHolder({
        curveId,
        userId,
        balance: newBalance,
        avgPrice: newAvgPrice,
        totalInvested: newTotalInvested,
        realizedPnl: existing.realizedPnl,
        unrealizedPnl: (newBalance * price) - newTotalInvested,
        firstBuyAt: existing.firstBuyAt,
        lastTradeAt: now
      })
    } else {
      // Create new holder
      return this.upsertHolder({
        curveId,
        userId,
        balance: keys,
        avgPrice: price,
        totalInvested: amountSpent,
        realizedPnl: 0,
        unrealizedPnl: 0,
        firstBuyAt: now,
        lastTradeAt: now
      })
    }
  }

  static async processSell(
    curveId: string,
    userId: string,
    keys: number,
    price: number,
    amountReceived: number
  ): Promise<CurveHolder | null> {
    const existing = await this.getHolder(curveId, userId)
    if (!existing) return null

    const newBalance = existing.balance - keys
    const costBasis = existing.avgPrice * keys
    const realizedPnl = amountReceived - costBasis
    const newRealizedPnl = existing.realizedPnl + realizedPnl

    if (newBalance <= 0) {
      // Holder exited completely
      return this.upsertHolder({
        curveId,
        userId,
        balance: 0,
        avgPrice: existing.avgPrice,
        totalInvested: existing.totalInvested,
        realizedPnl: newRealizedPnl,
        unrealizedPnl: 0,
        firstBuyAt: existing.firstBuyAt,
        lastTradeAt: new Date().toISOString()
      })
    } else {
      // Partial sell
      return this.upsertHolder({
        curveId,
        userId,
        balance: newBalance,
        avgPrice: existing.avgPrice, // Keep same avg price
        totalInvested: existing.totalInvested - costBasis,
        realizedPnl: newRealizedPnl,
        unrealizedPnl: (newBalance * price) - (existing.totalInvested - costBasis),
        firstBuyAt: existing.firstBuyAt,
        lastTradeAt: new Date().toISOString()
      })
    }
  }
}
