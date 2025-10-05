/**
 * Launch Health Value Model
 * Computes conviction score from economic and engagement metrics
 */

export type HealthPoint = {
  ts: number
  fees_usd: number
  boosts_usd: number
  buybacks_usd: number
  contributors: number
  views: number
  network_mentions: number
  live_hours: number
  chat_msgs: number
  upvotes: number
  dms: number
  collaborations: number
  campaigns: number
  social_score: number
  event?: "live" | "tge" | "milestone"
}

// Natural log dampening to handle spikes
export function logn(x: number): number {
  return Math.log1p(Math.max(0, x))
}

// Exponential decay over time
export function decay(x: number, days: number, halflife: number = 7): number {
  return x * Math.pow(0.5, days / halflife)
}

// 95th percentile calculation
export function p95(arr: number[]): number {
  if (arr.length === 0) return 1
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.floor(sorted.length * 0.95)
  return sorted[idx] || 1
}

// Exponential moving average
export function ema(arr: number[], alpha: number = 0.3): number[] {
  if (arr.length === 0) return []
  const result = [arr[0]]
  for (let i = 1; i < arr.length; i++) {
    result.push(alpha * arr[i] + (1 - alpha) * result[i - 1])
  }
  return result
}

// Convert all engagement metrics to estimated USD value
export function econValue(p: HealthPoint, CPM_EST: number = 5): number {
  const view_val = (p.views / 1000) * CPM_EST
  const contrib_val = p.contributors * 3
  const mention_val = p.network_mentions * 0.5
  const chat_val = p.chat_msgs * 0.01
  const live_val = p.live_hours * 8
  const upvote_val = p.upvotes * 0.02
  const dm_val = p.dms * 0.05
  const collab_val = p.collaborations * 50
  const campaign_val = p.campaigns * 100
  const social_val = p.social_score * 2

  return (
    p.fees_usd +
    p.boosts_usd +
    0.8 * p.buybacks_usd +
    view_val +
    contrib_val +
    mention_val +
    chat_val +
    live_val +
    upvote_val +
    dm_val +
    collab_val +
    campaign_val +
    social_val
  )
}

// Normalize value to 0-100 scale using 95th percentile over window
function normalize(values: number[], window: number = 30): number[] {
  const p95Val = p95(values.slice(Math.max(0, values.length - window)))
  return values.map(v => Math.min(100, (v / p95Val) * 100))
}

// Clamp daily changes to max ±8 points
function clampDailyChanges(arr: number[], maxDelta: number = 8): number[] {
  if (arr.length === 0) return []
  const result = [arr[0]]
  for (let i = 1; i < arr.length; i++) {
    const delta = arr[i] - result[i - 1]
    const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, delta))
    result.push(result[i - 1] + clampedDelta)
  }
  return result.map(v => Math.max(0, Math.min(100, v)))
}

// Compute conviction score series from health points
export function convictionSeries(points: HealthPoint[]): number[] {
  if (points.length === 0) return []

  // Extract and transform metrics
  const econValues = points.map(p => econValue(p))
  const contribValues = points.map(p => p.contributors)
  const viewValues = points.map(p => p.views)
  const boostValues = points.map(p => p.boosts_usd)
  const buybackValues = points.map(p => p.buybacks_usd)
  const networkValues = points.map(p => p.network_mentions)
  const dmsValues = points.map(p => p.dms)
  const collabValues = points.map(p => p.collaborations)
  const campaignValues = points.map(p => p.campaigns)
  const socialValues = points.map(p => p.social_score)

  // Apply log normalization
  const econLog = econValues.map(logn)
  const contribLog = contribValues.map(logn)
  const viewLog = viewValues.map(logn)
  const boostLog = boostValues.map(logn)
  const buybackLog = buybackValues.map(logn)
  const networkLog = networkValues.map(logn)
  const dmsLog = dmsValues.map(logn)
  const collabLog = collabValues.map(logn)
  const campaignLog = campaignValues.map(logn)
  const socialLog = socialValues.map(logn)

  // Normalize each to 0-100
  const econNorm = normalize(econLog)
  const contribNorm = normalize(contribLog)
  const viewNorm = normalize(viewLog)
  const boostNorm = normalize(boostLog)
  const buybackNorm = normalize(buybackLog)
  const networkNorm = normalize(networkLog)
  const dmsNorm = normalize(dmsLog)
  const collabNorm = normalize(collabLog)
  const campaignNorm = normalize(campaignLog)
  const socialNorm = normalize(socialLog)

  // Weighted combination (rebalanced to 100%)
  const raw = points.map((_, i) => {
    return (
      0.30 * econNorm[i] +
      0.15 * contribNorm[i] +
      0.10 * viewNorm[i] +
      0.08 * boostNorm[i] +
      0.08 * buybackNorm[i] +
      0.05 * networkNorm[i] +
      0.08 * dmsNorm[i] +
      0.06 * collabNorm[i] +
      0.05 * campaignNorm[i] +
      0.05 * socialNorm[i]
    )
  })

  // Apply EMA smoothing
  const smoothed = ema(raw, 0.3)

  // Clamp daily changes
  return clampDailyChanges(smoothed, 8)
}

// Compute activity USD (non-economic engagement value)
export function activityUSD(p: HealthPoint, CPM_EST: number = 5): number {
  const view_val = (p.views / 1000) * CPM_EST
  const contrib_val = p.contributors * 3
  const mention_val = p.network_mentions * 0.5
  const chat_val = p.chat_msgs * 0.01
  const live_val = p.live_hours * 8
  const upvote_val = p.upvotes * 0.02
  const dm_val = p.dms * 0.05
  const collab_val = p.collaborations * 50
  const campaign_val = p.campaigns * 100
  const social_val = p.social_score * 2

  return view_val + contrib_val + mention_val + chat_val + live_val + upvote_val + dm_val + collab_val + campaign_val + social_val
}
