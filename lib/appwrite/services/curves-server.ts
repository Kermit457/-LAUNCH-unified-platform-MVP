import { ID, Query } from 'node-appwrite'
import { serverDatabases, DB_ID, COLLECTIONS } from '../server-client'
import type { Curve, CurveOwnerType, CurveState } from '@/types/curve'

/**
 * Helper to map Appwrite document to Curve type
 */
function mapDocumentToCurve(doc: any): Curve {
  return {
    ...doc,
    id: doc.$id || doc.id
  } as Curve
}

/**
 * Server-side Curve Service with API Key authentication
 * Use this in API routes to bypass permission checks
 */
export class ServerCurveService {
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

      const document = await serverDatabases.createDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        ID.unique(),
        curve
      )

      return mapDocumentToCurve(document)
    } catch (error) {
      console.error('Error creating curve:', error)
      throw error
    }
  }

  static async getCurveById(curveId: string): Promise<Curve | null> {
    try {
      const document = await serverDatabases.getDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        curveId
      )
      return mapDocumentToCurve(document)
    } catch (error) {
      return null
    }
  }

  static async getCurveByOwner(
    ownerType: CurveOwnerType,
    ownerId: string
  ): Promise<Curve | null> {
    try {
      const response = await serverDatabases.listDocuments(
        DB_ID,
        COLLECTIONS.CURVES,
        [
          Query.equal('ownerType', ownerType),
          Query.equal('ownerId', ownerId),
          Query.limit(1)
        ]
      )

      if (response.documents.length === 0) {
        return null
      }

      return mapDocumentToCurve(response.documents[0])
    } catch (error) {
      console.error('Error getting curve by owner:', error)
      return null
    }
  }

  static async updateCurve(
    curveId: string,
    updates: Partial<Curve>
  ): Promise<Curve | null> {
    try {
      const document = await serverDatabases.updateDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        curveId,
        updates
      )
      return mapDocumentToCurve(document)
    } catch (error) {
      console.error('Error updating curve:', error)
      return null
    }
  }

  static async updateCurveState(
    curveId: string,
    state: CurveState
  ): Promise<Curve | null> {
    return this.updateCurve(curveId, { state })
  }

  static async freezeCurve(curveId: string): Promise<Curve | null> {
    return this.updateCurveState(curveId, 'frozen')
  }

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
}
