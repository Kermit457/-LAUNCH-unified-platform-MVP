import { useState, useEffect } from 'react'

export type TokenData = {
  priceUsd?: number
  mcapUsd?: number
  vol24hUsd?: number
  liqUsd?: number
  holders?: number
  change1h?: number // %
  change24h?: number // %
  change5m?: number // %
  txns24h?: {
    buys: number
    sells: number
  }
  createdAt?: number // epoch ms
  dexUrl?: string
  solscanUrl?: string
  spark?: Array<{ ts: number; price: number }>
}

/**
 * Fetch token data from DexScreener API
 * Solana tokens only
 */
export async function fetchTokenData(mint: string): Promise<TokenData> {
  try {
    // Try DexScreener first
    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`, {
      next: { revalidate: 15 }, // Cache for 15s
    })

    if (r.ok) {
      const j = await r.json()
      const pair = j.pairs?.[0]

      if (pair) {
        return {
          priceUsd: pair.priceUsd ? Number(pair.priceUsd) : undefined,
          mcapUsd: pair.fdv ? Number(pair.fdv) : undefined,
          vol24hUsd: pair.volume?.h24 ? Number(pair.volume.h24) : undefined,
          liqUsd: pair.liquidity?.usd ? Number(pair.liquidity.usd) : undefined,
          holders: pair.txns?.h24?.buys && pair.txns?.h24?.sells
            ? pair.txns.h24.buys + pair.txns.h24.sells
            : undefined,
          change1h: pair.priceChange?.h1 ? Number(pair.priceChange.h1) : undefined,
          change24h: pair.priceChange?.h24 ? Number(pair.priceChange.h24) : undefined,
          change5m: pair.priceChange?.m5 ? Number(pair.priceChange.m5) : undefined,
          txns24h: pair.txns?.h24 ? {
            buys: Number(pair.txns.h24.buys) || 0,
            sells: Number(pair.txns.h24.sells) || 0,
          } : undefined,
          createdAt: pair.pairCreatedAt ? Number(pair.pairCreatedAt) : undefined,
          dexUrl: pair.url,
          solscanUrl: `https://solscan.io/token/${mint}`,
          // spark: optional - would need historical data
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch token data:', err)
  }

  // Fallback: show links only
  return {
    solscanUrl: `https://solscan.io/token/${mint}`,
  }
}

/**
 * Hook to fetch and poll token data every N milliseconds
 * @param mint - Solana token mint address
 * @param pollMs - Polling interval in milliseconds (default 15000 = 15s)
 */
export function useTokenData(mint?: string, pollMs = 15000) {
  const [data, setData] = useState<TokenData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mint) {
      setData({})
      setLoading(false)
      setError(null)
      return
    }

    let alive = true
    let intervalId: NodeJS.Timeout | null = null

    async function tick() {
      try {
        setLoading(true)
        setError(null)
        const d = await fetchTokenData(mint!)
        if (alive) {
          setData(d)
          setLoading(false)
        }
      } catch (err) {
        if (alive) {
          setError('Failed to load token data')
          setLoading(false)
        }
      }
    }

    // Initial fetch
    tick()

    // Set up polling
    intervalId = setInterval(tick, pollMs)

    return () => {
      alive = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [mint, pollMs])

  return { data, loading, error }
}
