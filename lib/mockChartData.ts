import type { Candle, ActivityPoint } from "@/types/launch"

/**
 * Generate mock candle data for chart visualization
 * @param count Number of candles to generate
 * @param basePrice Starting price
 * @param interval Interval in seconds (default: 300 = 5min)
 */
export function generateMockCandles(
  count: number = 100,
  basePrice: number = 0.00015,
  interval: number = 300
): Candle[] {
  const now = Math.floor(Date.now() / 1000)
  const candles: Candle[] = []

  let price = basePrice

  for (let i = 0; i < count; i++) {
    const t = now - (count - i) * interval

    // Add some randomness and trend
    const trend = Math.sin(i / 10) * 0.00002
    const volatility = (Math.random() - 0.5) * 0.00001
    price = Math.max(basePrice * 0.5, price + trend + volatility)

    const o = price
    const c = price + (Math.random() - 0.5) * 0.00001
    const h = Math.max(o, c) * (1 + Math.random() * 0.02)
    const l = Math.min(o, c) * (1 - Math.random() * 0.02)

    candles.push({ t, o, h, l, c })
  }

  return candles
}

/**
 * Generate mock platform activity data correlated with price movements
 * @param candles Candle data to correlate with
 */
export function generateMockActivity(candles: Candle[]): ActivityPoint[] {
  const activity: ActivityPoint[] = []

  const eventKinds = [
    { kind: 'collab', label: 'Collaboration with @' },
    { kind: 'campaign', label: 'Campaign started' },
    { kind: 'raid', label: 'Raid launched' },
    { kind: 'boost', label: 'Boost executed' },
    { kind: 'buyback', label: 'Token buyback' },
    { kind: 'chat', label: 'Chat surge' },
  ]

  const contributorNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']

  candles.forEach((candle, i) => {
    // Base conviction (trending up over time with noise)
    const baseConviction = 40 + (i / candles.length) * 30
    const convictionNoise = (Math.random() - 0.5) * 20
    const conviction = Math.max(0, Math.min(100, baseConviction + convictionNoise))

    // Activity varies with conviction and price movement
    const priceChange = i > 0 ? (candle.c - candles[i - 1].c) / candles[i - 1].c : 0
    const activityMultiplier = 1 + Math.abs(priceChange) * 100

    const comments = Math.floor(Math.random() * 25 * activityMultiplier)
    const upvotes = Math.floor(Math.random() * 40 * activityMultiplier)
    const collabs = Math.floor(Math.random() * 3 * activityMultiplier)
    const contributions = Math.floor(Math.random() * 15 * activityMultiplier)
    const campaigns = Math.floor(Math.random() * 2 * activityMultiplier)
    const raids = Math.floor(Math.random() * 2 * activityMultiplier)
    const boosts = Math.floor(Math.random() * 5 * activityMultiplier)
    const chats = Math.floor(Math.random() * 50 * activityMultiplier)
    const dms = Math.floor(Math.random() * 20 * activityMultiplier)
    const social = Math.floor(Math.random() * 30 * activityMultiplier)
    const views = Math.floor(Math.random() * 100 * activityMultiplier)

    const activityScore = comments + upvotes + collabs + contributions + campaigns + raids + boosts + chats + dms + social + views

    // Add notable events randomly (5% chance per candle)
    const notable: { kind: string; label: string }[] = []
    if (Math.random() < 0.05 && i > candles.length * 0.1) {
      const event = eventKinds[Math.floor(Math.random() * eventKinds.length)]
      const partners = ['ClipFi', 'SolanaFM', 'Jupiter', 'Marinade', 'Raydium', 'Orca']
      const partner = partners[Math.floor(Math.random() * partners.length)]

      if (event.kind === 'collab') {
        notable.push({ kind: event.kind, label: `${event.label}${partner}` })
      } else if (event.kind === 'campaign') {
        notable.push({ kind: event.kind, label: `${event.label} #${i}` })
      } else {
        notable.push({ kind: event.kind, label: event.label })
      }
    }

    // Add contributors at activity peaks (10% chance)
    let contributors: { avatar: string; name: string }[] | undefined
    if (Math.random() < 0.1 && activityScore > 100) {
      const numContributors = Math.floor(Math.random() * 5) + 1
      contributors = Array.from({ length: numContributors }, (_, idx) => {
        const name = contributorNames[Math.floor(Math.random() * contributorNames.length)]
        return {
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}-${i}-${idx}`,
        }
      })
    }

    activity.push({
      t: candle.t,
      conviction,
      activityScore,
      comments,
      upvotes,
      collabs,
      contributions,
      campaigns,
      raids,
      boosts,
      chats,
      dms,
      social,
      views,
      contributors,
      notable: notable.length > 0 ? notable : undefined,
    })
  })

  return activity
}

/**
 * Placeholder for real Dexscreener API fetch
 * In production, this will call /api/dex/candles?pairId=...&interval=5m
 */
export async function fetchRealCandles(
  pairId: string,
  interval: '1m' | '5m' | '15m' | '1h' = '5m'
): Promise<Candle[]> {
  try {
    const response = await fetch(`/api/dex/candles?pairId=${pairId}&interval=${interval}`)
    if (!response.ok) throw new Error('Failed to fetch candles')
    return await response.json()
  } catch (error) {
    console.warn('Failed to fetch real candles, using mock data:', error)
    return generateMockCandles()
  }
}

/**
 * Placeholder for real Appwrite activity aggregation
 * In production, this will query:
 * - /collections/collabs
 * - /collections/campaigns
 * - /collections/raids
 * - /collections/boosts
 * - /collections/chats
 * And aggregate by time bins matching candle timestamps
 */
export async function fetchRealActivity(
  launchId: string,
  timeRange: { start: number; end: number }
): Promise<ActivityPoint[]> {
  try {
    // TODO: Replace with real Appwrite aggregation
    // const { databases } = await createSessionClient()
    // const collabs = await databases.listDocuments('launches', 'collabs', [
    //   Query.equal('launchId', launchId),
    //   Query.greaterThanEqual('createdAt', timeRange.start),
    //   Query.lessThanEqual('createdAt', timeRange.end),
    // ])
    // ... aggregate per time bin

    console.warn('Using mock activity data - Appwrite integration pending')
    const mockCandles = generateMockCandles()
    return generateMockActivity(mockCandles)
  } catch (error) {
    console.error('Failed to fetch activity data:', error)
    return []
  }
}
