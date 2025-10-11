import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from '../client'
import type { CurveEvent, CurveEventType } from '@/types/curve'

export class CurveEventService {
  /**
   * Create a new curve event (buy, sell, freeze, launch)
   */
  static async createEvent(data: {
    curveId: string
    type: CurveEventType
    amount: number
    price: number
    keys?: number
    userId: string
    referrerId?: string
    reserveFee?: number
    projectFee?: number
    platformFee?: number
    referralFee?: number
    txHash?: string
  }): Promise<CurveEvent> {
    try {
      const event = {
        ...data,
        timestamp: new Date().toISOString()
      }

      const document = await databases.createDocument(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        ID.unique(),
        event
      )

      return document as unknown as CurveEvent
    } catch (error) {
      console.error('Error creating curve event:', error)
      throw error
    }
  }

  /**
   * Get events for a curve
   */
  static async getEventsByCurve(
    curveId: string,
    limit = 100,
    offset = 0
  ): Promise<CurveEvent[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.orderDesc('timestamp'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as CurveEvent[]
    } catch (error) {
      console.error('Error fetching curve events:', error)
      return []
    }
  }

  /**
   * Get events by user
   */
  static async getEventsByUser(
    userId: string,
    limit = 100
  ): Promise<CurveEvent[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('userId', userId),
          Query.orderDesc('timestamp'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as CurveEvent[]
    } catch (error) {
      console.error('Error fetching user events:', error)
      return []
    }
  }

  /**
   * Get recent trades for a curve
   */
  static async getRecentTrades(
    curveId: string,
    limit = 20
  ): Promise<CurveEvent[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.equal('type', ['buy', 'sell']),
          Query.orderDesc('timestamp'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as CurveEvent[]
    } catch (error) {
      console.error('Error fetching recent trades:', error)
      return []
    }
  }

  /**
   * Get 24h volume for a curve
   */
  static async get24hVolume(curveId: string): Promise<number> {
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.equal('type', ['buy', 'sell']),
          Query.greaterThanEqual('timestamp', yesterday.toISOString()),
          Query.limit(1000)
        ]
      )

      const events = response.documents as unknown as CurveEvent[]
      return events.reduce((sum, event) => sum + event.amount, 0)
    } catch (error) {
      console.error('Error calculating 24h volume:', error)
      return 0
    }
  }

  /**
   * Get buy events with referrers for referral tracking
   */
  static async getBuysWithReferrers(
    curveId: string,
    limit = 100
  ): Promise<CurveEvent[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.equal('type', 'buy'),
          Query.isNotNull('referrerId'),
          Query.orderDesc('timestamp'),
          Query.limit(limit)
        ]
      )
      return response.documents as unknown as CurveEvent[]
    } catch (error) {
      console.error('Error fetching buys with referrers:', error)
      return []
    }
  }

  /**
   * Get total volume for a curve
   */
  static async getTotalVolume(curveId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.equal('type', ['buy', 'sell']),
          Query.limit(5000) // High limit for historical data
        ]
      )

      const events = response.documents as unknown as CurveEvent[]
      return events.reduce((sum, event) => sum + event.amount, 0)
    } catch (error) {
      console.error('Error calculating total volume:', error)
      return 0
    }
  }

  /**
   * Get aggregated fee breakdown
   */
  static async getFeeBreakdown(curveId: string): Promise<{
    totalReserve: number
    totalProject: number
    totalPlatform: number
    totalReferral: number
  }> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.equal('type', 'buy'),
          Query.limit(5000)
        ]
      )

      const events = response.documents as unknown as CurveEvent[]

      const breakdown = events.reduce((acc, event) => ({
        totalReserve: acc.totalReserve + (event.reserveFee || 0),
        totalProject: acc.totalProject + (event.projectFee || 0),
        totalPlatform: acc.totalPlatform + (event.platformFee || 0),
        totalReferral: acc.totalReferral + (event.referralFee || 0)
      }), {
        totalReserve: 0,
        totalProject: 0,
        totalPlatform: 0,
        totalReferral: 0
      })

      return breakdown
    } catch (error) {
      console.error('Error calculating fee breakdown:', error)
      return {
        totalReserve: 0,
        totalProject: 0,
        totalPlatform: 0,
        totalReferral: 0
      }
    }
  }

  /**
   * Get chart data for price history
   */
  static async getPriceHistory(
    curveId: string,
    hours = 24
  ): Promise<{ timestamp: string; price: number; volume: number }[]> {
    try {
      const since = new Date()
      since.setHours(since.getHours() - hours)

      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.greaterThanEqual('timestamp', since.toISOString()),
          Query.orderAsc('timestamp'),
          Query.limit(1000)
        ]
      )

      const events = response.documents as unknown as CurveEvent[]

      // Group by hour
      const hourlyData = new Map<string, { price: number; volume: number; count: number }>()

      events.forEach(event => {
        const hour = new Date(event.timestamp).setMinutes(0, 0, 0)
        const key = new Date(hour).toISOString()

        const existing = hourlyData.get(key) || { price: 0, volume: 0, count: 0 }
        hourlyData.set(key, {
          price: existing.price + event.price,
          volume: existing.volume + event.amount,
          count: existing.count + 1
        })
      })

      // Calculate averages
      return Array.from(hourlyData.entries()).map(([timestamp, data]) => ({
        timestamp,
        price: data.price / data.count,
        volume: data.volume
      }))
    } catch (error) {
      console.error('Error fetching price history:', error)
      return []
    }
  }
}