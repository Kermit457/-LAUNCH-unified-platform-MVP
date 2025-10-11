import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from '../client'
import type { Curve, CurveOwnerType, CurveState } from '@/types/curve'

export class CurveService {
  /**
   * Create a new curve for a user or project
   */
  static async createCurve(data: {
    ownerType: CurveOwnerType
    ownerId: string
    basePrice?: number
  }): Promise<Curve> {
    try {
      const basePrice = data.basePrice || 0.01

      const curve = {
        ownerType: data.ownerType,
        ownerId: data.ownerId,
        state: 'active' as CurveState,
        price: basePrice,
        reserve: 0,
        supply: 0,
        holders: 0,
        createdAt: new Date().toISOString()
      }

      const document = await databases.createDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        ID.unique(),
        curve
      )

      return document as unknown as Curve
    } catch (error) {
      console.error('Error creating curve:', error)
      throw error
    }
  }

  /**
   * Get curve by ID
   */
  static async getCurveById(curveId: string): Promise<Curve | null> {
    try {
      const document = await databases.getDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        curveId
      )
      return document as unknown as Curve
    } catch (error) {
      console.error('Error fetching curve:', error)
      return null
    }
  }

  /**
   * Get curve by owner (user or project)
   */
  static async getCurveByOwner(
    ownerType: CurveOwnerType,
    ownerId: string
  ): Promise<Curve | null> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVES,
        [
          Query.equal('ownerType', ownerType),
          Query.equal('ownerId', ownerId),
          Query.limit(1)
        ]
      )

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as Curve
      }

      return null
    } catch (error) {
      console.error('Error fetching curve by owner:', error)
      return null
    }
  }

  /**
   * Update curve data
   */
  static async updateCurve(
    curveId: string,
    updates: Partial<Curve>
  ): Promise<Curve | null> {
    try {
      const document = await databases.updateDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        curveId,
        updates
      )
      return document as unknown as Curve
    } catch (error) {
      console.error('Error updating curve:', error)
      return null
    }
  }

  /**
   * Update curve state (active, frozen, launched, utility)
   */
  static async updateCurveState(
    curveId: string,
    state: CurveState
  ): Promise<Curve | null> {
    return this.updateCurve(curveId, { state })
  }

  /**
   * Get all active curves
   */
  static async getActiveCurves(
    limit = 50,
    offset = 0
  ): Promise<Curve[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVES,
        [
          Query.equal('state', 'active'),
          Query.orderDesc('volume24h'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as Curve[]
    } catch (error) {
      console.error('Error fetching active curves:', error)
      return []
    }
  }

  /**
   * Get trending curves (by volume)
   */
  static async getTrendingCurves(limit = 10): Promise<Curve[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVES,
        [
          Query.equal('state', 'active'),
          Query.greaterThan('volume24h', 0),
          Query.orderDesc('volume24h'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as Curve[]
    } catch (error) {
      console.error('Error fetching trending curves:', error)
      return []
    }
  }

  /**
   * Get curves by state
   */
  static async getCurvesByState(
    state: CurveState,
    limit = 50
  ): Promise<Curve[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVES,
        [
          Query.equal('state', state),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as Curve[]
    } catch (error) {
      console.error('Error fetching curves by state:', error)
      return []
    }
  }

  /**
   * Get curves by owner type (all user curves or all project curves)
   */
  static async getCurvesByType(
    ownerType: CurveOwnerType,
    limit = 50
  ): Promise<Curve[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVES,
        [
          Query.equal('ownerType', ownerType),
          Query.equal('state', 'active'),
          Query.orderDesc('marketCap'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as Curve[]
    } catch (error) {
      console.error('Error fetching curves by type:', error)
      return []
    }
  }

  /**
   * Search curves
   */
  static async searchCurves(
    searchQuery: string,
    limit = 20
  ): Promise<Curve[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVES,
        [
          Query.search('ownerId', searchQuery),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as Curve[]
    } catch (error) {
      console.error('Error searching curves:', error)
      return []
    }
  }

  /**
   * Freeze curve (stop trading before launch)
   */
  static async freezeCurve(curveId: string): Promise<Curve | null> {
    return this.updateCurveState(curveId, 'frozen')
  }

  /**
   * Mark curve as launched
   */
  static async launchCurve(
    curveId: string,
    tokenMint: string
  ): Promise<Curve | null> {
    return this.updateCurve(curveId, {
      state: 'launched',
      tokenMint,
      launchedAt: new Date().toISOString()
    })
  }

  /**
   * Get curve statistics
   */
  static async getCurveStats(curveId: string): Promise<{
    totalVolume: number
    volume24h: number
    uniqueTraders: number
    avgTradeSize: number
  } | null> {
    try {
      const curve = await this.getCurveById(curveId)
      if (!curve) return null

      // Get events from last 24h
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const eventsResponse = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.greaterThanEqual('timestamp', yesterday.toISOString()),
          Query.limit(1000)
        ]
      )

      const events = eventsResponse.documents as any[]
      const uniqueTraders = new Set(events.map(e => e.userId)).size
      const avgTradeSize = events.length > 0
        ? events.reduce((sum, e) => sum + (e.amount || 0), 0) / events.length
        : 0

      return {
        totalVolume: curve.volumeTotal,
        volume24h: curve.volume24h,
        uniqueTraders,
        avgTradeSize
      }
    } catch (error) {
      console.error('Error fetching curve stats:', error)
      return null
    }
  }

  /**
   * Delete curve (admin only)
   */
  static async deleteCurve(curveId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        curveId
      )
      return true
    } catch (error) {
      console.error('Error deleting curve:', error)
      return false
    }
  }
}