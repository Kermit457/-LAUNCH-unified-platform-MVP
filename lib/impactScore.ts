import { CreatorEntry, ProjectEntry, AgencyEntry, Badge, BadgeType } from '@/types/leaderboard'

/**
 * Normalize a value to percentile rank [0-100] within a cohort
 */
export function normPercentile(values: number[], x: number): number {
  if (values.length === 0) return 0
  if (values.length === 1) return 100

  const sorted = [...values].sort((a, b) => a - b)
  const index = sorted.findIndex(v => v >= x)

  if (index === -1) return 100 // x is larger than all values
  if (index === 0 && sorted[0] === x) return 0 // x is the minimum

  const percentile = (index / (sorted.length - 1)) * 100
  return Math.min(100, Math.max(0, percentile))
}

/**
 * Apply exponential decay based on age with configurable half-life
 * @param value - The value to decay
 * @param ageDays - Age in days
 * @param halfLife - Half-life in days (default 14)
 * @returns Decayed value
 */
export function decay(value: number, ageDays: number, halfLife: number = 14): number {
  if (ageDays <= 0) return value
  const decayFactor = Math.pow(0.5, ageDays / halfLife)
  return value * decayFactor
}

/**
 * Calculate Impact Score for a Creator
 * Weights:
 * - 40% earnings (earnUsd30d)
 * - 20% views × CPM (verifiedViews30d * avgCpm30d)
 * - 15% approved submissions (approvedSubs30d)
 * - 10% live hours (liveHours30d)
 * - 10% conviction delta (convictionDelta7d)
 * - 5% boost staked (boostStakedUsd)
 */
export function impactScoreCreator(
  entry: CreatorEntry,
  allEntries: CreatorEntry[]
): number {
  const earnings = allEntries.map(e => e.stats.earnUsd30d)
  const viewsValue = allEntries.map(e => e.stats.verifiedViews30d * e.stats.avgCpm30d)
  const submissions = allEntries.map(e => e.stats.approvedSubs30d)
  const liveHours = allEntries.map(e => e.stats.liveHours30d)
  const convictionDelta = allEntries.map(e => e.stats.convictionDelta7d)
  const boostStaked = allEntries.map(e => e.stats.boostStakedUsd)

  const score =
    0.40 * normPercentile(earnings, entry.stats.earnUsd30d) +
    0.20 * normPercentile(viewsValue, entry.stats.verifiedViews30d * entry.stats.avgCpm30d) +
    0.15 * normPercentile(submissions, entry.stats.approvedSubs30d) +
    0.10 * normPercentile(liveHours, entry.stats.liveHours30d) +
    0.10 * normPercentile(convictionDelta, entry.stats.convictionDelta7d) +
    0.05 * normPercentile(boostStaked, entry.stats.boostStakedUsd)

  return Math.min(100, Math.max(0, score))
}

/**
 * Calculate Impact Score for a Project
 * Weights:
 * - 35% fees (feesUsd30d)
 * - 20% unique contributors (uniqueContributors30d)
 * - 15% campaign completion rate (completionRate30d)
 * - 10% buybacks (buybacksUsd30d)
 * - 10% conviction (convictionPct)
 * - 10% retention (retention30d)
 */
export function impactScoreProject(
  entry: ProjectEntry,
  allEntries: ProjectEntry[]
): number {
  const fees = allEntries.map(e => e.stats.feesUsd30d)
  const contributors = allEntries.map(e => e.stats.uniqueContributors30d)
  const completionRate = allEntries.map(e => e.stats.completionRate30d * 100) // Convert to 0-100
  const buybacks = allEntries.map(e => e.stats.buybacksUsd30d)
  const conviction = allEntries.map(e => e.stats.convictionPct)
  const retention = allEntries.map(e => e.stats.retention30d * 100) // Convert to 0-100

  const score =
    0.35 * normPercentile(fees, entry.stats.feesUsd30d) +
    0.20 * normPercentile(contributors, entry.stats.uniqueContributors30d) +
    0.15 * normPercentile(completionRate, entry.stats.completionRate30d * 100) +
    0.10 * normPercentile(buybacks, entry.stats.buybacksUsd30d) +
    0.10 * normPercentile(conviction, entry.stats.convictionPct) +
    0.10 * normPercentile(retention, entry.stats.retention30d * 100)

  return Math.min(100, Math.max(0, score))
}

/**
 * Calculate Impact Score for an Agency
 * Simplified scoring based on campaign success
 */
export function impactScoreAgency(
  entry: AgencyEntry,
  allEntries: AgencyEntry[]
): number {
  const campaigns = allEntries.map(e => e.stats.totalCampaigns30d)
  const successRate = allEntries.map(e => e.stats.avgCampaignSuccessRate * 100)
  const spend = allEntries.map(e => e.stats.totalSpendUsd30d)
  const creators = allEntries.map(e => e.stats.activeCreators30d)
  const conviction = allEntries.map(e => e.stats.convictionPct)

  const score =
    0.30 * normPercentile(campaigns, entry.stats.totalCampaigns30d) +
    0.25 * normPercentile(successRate, entry.stats.avgCampaignSuccessRate * 100) +
    0.20 * normPercentile(spend, entry.stats.totalSpendUsd30d) +
    0.15 * normPercentile(creators, entry.stats.activeCreators30d) +
    0.10 * normPercentile(conviction, entry.stats.convictionPct)

  return Math.min(100, Math.max(0, score))
}

/**
 * Determine badges for a creator based on stats and score
 */
export function getCreatorBadges(
  entry: CreatorEntry,
  score: number,
  allScores: number[],
  allEntries: CreatorEntry[]
): Badge[] {
  const badges: Badge[] = []

  // Top 10% badge
  const top10Threshold = allScores.sort((a, b) => b - a)[Math.floor(allScores.length * 0.1)]
  if (score >= top10Threshold) {
    badges.push({
      type: 'top10',
      label: 'Top 10%',
      color: 'from-yellow-400 to-yellow-600'
    })
  }

  // Rising badge (fastest conviction delta)
  const allDeltas = allEntries.map(e => e.stats.convictionDelta7d)
  const maxDelta = Math.max(...allDeltas)
  if (entry.stats.convictionDelta7d === maxDelta && maxDelta > 10) {
    badges.push({
      type: 'rising',
      label: 'Rising',
      color: 'from-blue-400 to-cyan-500'
    })
  }

  // Workhorse badge (≥30 live hrs/30d)
  if (entry.stats.liveHours30d >= 30) {
    badges.push({
      type: 'workhorse',
      label: 'Workhorse',
      color: 'from-green-400 to-emerald-600'
    })
  }

  return badges
}

/**
 * Determine badges for a project based on stats and score
 */
export function getProjectBadges(
  entry: ProjectEntry,
  score: number,
  allScores: number[]
): Badge[] {
  const badges: Badge[] = []

  // Top 10% badge
  const top10Threshold = allScores.sort((a, b) => b - a)[Math.floor(allScores.length * 0.1)]
  if (score >= top10Threshold) {
    badges.push({
      type: 'top10',
      label: 'Top 10%',
      color: 'from-yellow-400 to-yellow-600'
    })
  }

  // Clean Ops badge (≥98% completion rate)
  if (entry.stats.completionRate30d >= 0.98) {
    badges.push({
      type: 'cleanOps',
      label: 'Clean Ops',
      color: 'from-lime-400 to-lime-600'
    })
  }

  return badges
}

/**
 * Determine badges for an agency based on stats and score
 */
export function getAgencyBadges(
  entry: AgencyEntry,
  score: number,
  allScores: number[]
): Badge[] {
  const badges: Badge[] = []

  // Top 10% badge
  const top10Threshold = allScores.sort((a, b) => b - a)[Math.floor(allScores.length * 0.1)]
  if (score >= top10Threshold) {
    badges.push({
      type: 'top10',
      label: 'Top 10%',
      color: 'from-yellow-400 to-yellow-600'
    })
  }

  // Clean Ops badge (≥98% success rate)
  if (entry.stats.avgCampaignSuccessRate >= 0.98) {
    badges.push({
      type: 'cleanOps',
      label: 'Clean Ops',
      color: 'from-lime-400 to-lime-600'
    })
  }

  return badges
}
