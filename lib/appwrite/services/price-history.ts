import { ID, Query } from 'appwrite'
import { serverDatabases, DB_ID, COLLECTIONS } from '../server'

export interface PriceSnapshot {
  $id?: string
  curveId: string
  supply: number
  price: number
  timestamp: string
  $createdAt?: string
}

/**
 * Records a price snapshot for a curve
 */
export async function recordPriceSnapshot(
  curveId: string,
  supply: number,
  price: number
): Promise<PriceSnapshot> {
  try {
    const snapshot = await serverDatabases.createDocument(
      DB_ID,
      COLLECTIONS.PRICE_HISTORY,
      ID.unique(),
      {
        curveId,
        supply,
        price,
        timestamp: new Date().toISOString(),
      }
    )

    return snapshot as unknown as PriceSnapshot
  } catch (error) {
    console.error('Failed to record price snapshot:', error)
    throw error
  }
}

/**
 * Gets the price snapshot from 24 hours ago (or closest available)
 */
export async function getPriceSnapshot24hAgo(
  curveId: string
): Promise<PriceSnapshot | null> {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Get the closest snapshot to 24h ago
    const snapshots = await serverDatabases.listDocuments(
      DB_ID,
      COLLECTIONS.PRICE_HISTORY,
      [
        Query.equal('curveId', curveId),
        Query.lessThanEqual('timestamp', twentyFourHoursAgo),
        Query.orderDesc('timestamp'),
        Query.limit(1),
      ]
    )

    if (snapshots.documents.length === 0) {
      return null
    }

    return snapshots.documents[0] as unknown as PriceSnapshot
  } catch (error) {
    console.error('Failed to get 24h ago price snapshot:', error)
    return null
  }
}

/**
 * Calculates 24h price change percentage
 */
export async function calculate24hPriceChange(
  curveId: string,
  currentPrice: number
): Promise<number | null> {
  try {
    const oldSnapshot = await getPriceSnapshot24hAgo(curveId)

    if (!oldSnapshot || oldSnapshot.price === 0) {
      return null
    }

    const priceChange = ((currentPrice - oldSnapshot.price) / oldSnapshot.price) * 100
    return priceChange
  } catch (error) {
    console.error('Failed to calculate 24h price change:', error)
    return null
  }
}

/**
 * Gets recent price history for charting
 */
export async function getRecentPriceHistory(
  curveId: string,
  limit: number = 100
): Promise<PriceSnapshot[]> {
  try {
    const snapshots = await serverDatabases.listDocuments(
      DB_ID,
      COLLECTIONS.PRICE_HISTORY,
      [
        Query.equal('curveId', curveId),
        Query.orderDesc('timestamp'),
        Query.limit(limit),
      ]
    )

    return snapshots.documents as unknown as PriceSnapshot[]
  } catch (error) {
    console.error('Failed to get price history:', error)
    return []
  }
}
