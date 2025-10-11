import { ID, Query } from 'node-appwrite'
import { serverDatabases, DB_ID, COLLECTIONS } from '../server-client'
import type { CurveEvent } from '@/types/curve'

export class ServerCurveEventService {
  static async createEvent(data: Omit<CurveEvent, 'id'>): Promise<CurveEvent> {
    try {
      const document = await serverDatabases.createDocument(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        ID.unique(),
        data
      )
      return document as unknown as CurveEvent
    } catch (error) {
      console.error('Error creating curve event:', error)
      throw error
    }
  }

  static async getEventsByCurve(
    curveId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<CurveEvent[]> {
    try {
      const response = await serverDatabases.listDocuments(
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
      console.error('Error getting events by curve:', error)
      return []
    }
  }

  static async get24hVolume(curveId: string): Promise<number> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

      const response = await serverDatabases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.equal('type', ['buy', 'sell']),
          Query.greaterThan('timestamp', oneDayAgo)
        ]
      )

      const events = response.documents as unknown as CurveEvent[]
      return events.reduce((sum, event) => sum + event.amount, 0)
    } catch (error) {
      console.error('Error calculating 24h volume:', error)
      return 0
    }
  }

  static async getFeeBreakdown(curveId: string): Promise<{
    totalReserve: number
    totalProject: number
    totalPlatform: number
    totalReferral: number
  }> {
    try {
      const response = await serverDatabases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVE_EVENTS,
        [
          Query.equal('curveId', curveId),
          Query.equal('type', 'buy')
        ]
      )

      const events = response.documents as unknown as CurveEvent[]

      return events.reduce((acc, event) => ({
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
}
