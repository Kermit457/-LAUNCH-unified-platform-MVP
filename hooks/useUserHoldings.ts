import { useState, useEffect } from 'react'

export type HoldingData = {
  curveId: string
  userId: string
  balance: number // Number of keys held
  avgPrice: number
  totalInvested: number
  realizedPnl?: number
  unrealizedPnl?: number
}

/**
 * Fetch user's key holdings for a specific curve
 * Used to show ownership indicators on launch cards
 */
export function useUserHoldings(curveId: string | undefined, userId: string | undefined) {
  const [holdings, setHoldings] = useState<HoldingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!curveId || !userId) {
      setHoldings(null)
      return
    }

    const fetchHoldings = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/curve/${curveId}/holdings?userId=${userId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch holdings: ${response.statusText}`)
        }

        const data = await response.json()
        setHoldings(data)
      } catch (err: any) {
        console.error('Error fetching holdings:', err)
        setError(err.message || 'Failed to fetch holdings')
        // Set zero holdings on error
        setHoldings({
          curveId,
          userId,
          balance: 0,
          avgPrice: 0,
          totalInvested: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHoldings()
  }, [curveId, userId])

  return {
    holdings,
    loading,
    error,
    hasKeys: (holdings?.balance ?? 0) > 0,
    keyCount: holdings?.balance ?? 0,
  }
}

/**
 * Fetch user holdings for multiple curves at once
 * More efficient for the discover page with many cards
 */
export function useBatchUserHoldings(curveIds: string[], userId: string | undefined) {
  const [holdingsMap, setHoldingsMap] = useState<Record<string, HoldingData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || curveIds.length === 0) {
      setHoldingsMap({})
      return
    }

    const fetchAllHoldings = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch all holdings in parallel
        const promises = curveIds.map(async (curveId) => {
          try {
            const response = await fetch(`/api/curve/${curveId}/holdings?userId=${userId}`)
            if (response.ok) {
              const data = await response.json()
              return { curveId, data }
            }
            return {
              curveId,
              data: { curveId, userId, balance: 0, avgPrice: 0, totalInvested: 0 },
            }
          } catch {
            return {
              curveId,
              data: { curveId, userId, balance: 0, avgPrice: 0, totalInvested: 0 },
            }
          }
        })

        const results = await Promise.all(promises)

        // Build map of curveId -> holdings
        const map: Record<string, HoldingData> = {}
        results.forEach(({ curveId, data }) => {
          map[curveId] = data
        })

        setHoldingsMap(map)
      } catch (err: any) {
        console.error('Error fetching batch holdings:', err)
        setError(err.message || 'Failed to fetch holdings')
      } finally {
        setLoading(false)
      }
    }

    fetchAllHoldings()
  }, [curveIds.join(','), userId]) // Re-fetch if curve list or user changes

  return {
    holdingsMap,
    loading,
    error,
    getHoldings: (curveId: string) => holdingsMap[curveId] ?? null,
    hasKeys: (curveId: string) => (holdingsMap[curveId]?.balance ?? 0) > 0,
    getKeyCount: (curveId: string) => holdingsMap[curveId]?.balance ?? 0,
  }
}
