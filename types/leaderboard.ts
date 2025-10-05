export type CreatorEntry = {
  id: string
  handle: string
  name: string
  roles: string[]
  verified?: boolean
  isLive?: boolean
  stats: {
    earnUsd30d: number
    verifiedViews30d: number
    avgCpm30d: number
    approvedSubs30d: number
    liveHours30d: number
    convictionPct: number
    convictionDelta7d: number
    boostStakedUsd: number
  }
  social?: {
    twitter?: string
    twitch?: string
    youtube?: string
  }
  avatar?: string
}

export type ProjectEntry = {
  id: string
  symbol: string
  name: string
  chain: "SOL" | "BASE" | "ETH"
  isLive?: boolean
  verified?: boolean
  stats: {
    feesUsd30d: number
    uniqueContributors30d: number
    completionRate30d: number // 0..1
    buybacksUsd30d: number
    convictionPct: number
    retention30d: number // returning contributors / total
  }
  social?: {
    twitter?: string
    website?: string
    discord?: string
  }
  logo?: string
}

export type AgencyEntry = {
  id: string
  name: string
  verified?: boolean
  stats: {
    totalCampaigns30d: number
    avgCampaignSuccessRate: number // 0..1
    totalSpendUsd30d: number
    activeCreators30d: number
    convictionPct: number
    convictionDelta7d: number
  }
  social?: {
    twitter?: string
    website?: string
  }
  logo?: string
}

export type BadgeType =
  | "top10" // Top 10% (Gold)
  | "rising" // Fastest Δ
  | "workhorse" // ≥30 live hrs/30d
  | "cleanOps" // ≥98% payout success
  | "signalCaller" // prediction PnL > 0, N≥20

export type Badge = {
  type: BadgeType
  label: string
  color: string
  icon?: string
}

export type SeasonInfo = {
  number: number
  name: string
  startDate: string
  endDate: string
  prizePoolUsd: number
  rulesUrl: string
}

export type HallOfFameEntry = {
  rank: number
  handle: string
  name: string
  finalScore: number
  avatar?: string
}

export type TimeFilter = "7d" | "30d" | "all"
export type TabType = "creators" | "projects" | "agencies"
