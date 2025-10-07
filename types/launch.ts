export type LaunchStatus = "LIVE" | "UPCOMING"
export type Scope = "ICM" | "CCM"

export type Contributor = {
  id: string
  name: string
  twitter?: string
  avatar: string
}

export type LaunchCardData = {
  id: string
  title: string
  subtitle?: string
  logoUrl?: string
  scope: Scope
  status: LaunchStatus
  convictionPct: number
  commentsCount: number
  upvotes: number
  contributionPoolPct?: number // Percentage of total supply for contribution pool (e.g., 2 for 2%)
  feesSharePct?: number // Percentage of fees shared with contributors (e.g., 10 for 10%)
  tgeAt?: number // for UPCOMING (epoch ms)
  mint?: string // base58 (LIVE + ICM)
  dexPairId?: string // Dexscreener pair ID for chart embed (e.g. "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU")
  contributors?: Contributor[] // Optional project contributors/team
  createdBy?: string // User ID of the project creator
  creatorName?: string // Display name of the project creator
  creatorAvatar?: string // Avatar URL of the project creator
}

export type LaunchTimeseriesPoint = {
  ts: number                    // epoch ms
  fees_usd: number              // daily fees
  boosts_usd: number            // staked boosts
  buybacks_usd: number          // executed buybacks
  contributors: number          // unique contributors
  views: number                 // verified views
  network_mentions: number      // social interactions (likes, retweets, comments)
  live_hours: number            // hours live
  chat_msgs: number             // chat messages count
  upvotes: number               // community upvotes
  dms: number                   // direct messages
  collaborations: number        // partnership/collab count
  campaigns: number             // active campaigns
  social_score: number          // overall social media score (0-100)
  event?: "live" | "tge" | "milestone"
}

// Candles from /api/dex/candles proxy (5m or 1m bins)
export type Candle = {
  t: number  // unix seconds
  o: number  // open
  h: number  // high
  l: number  // low
  c: number  // close
}

// Time-binned platform signals, same bins as candles
export type ActivityBin = {
  t: number
  conviction?: number        // 0..100
  contributions?: number     // counts
  chats?: number
  collabs?: number
  dms?: number
  network?: number
  campaigns?: number
  social?: number
  // optional notable events rendered as markers
  events?: { kind: string; text: string }[]
}

// Enhanced activity point for Insights chart
export type ActivityPoint = {
  t: number                  // unix seconds (same as Candle.t)
  conviction: number         // 0-100 platform conviction score
  activityScore: number      // sum of all platform actions
  comments: number           // comment count
  upvotes: number            // upvote count
  collabs: number            // collaboration count
  contributions: number      // contribution count
  campaigns: number          // campaign count
  raids: number              // raid/bounty count
  boosts: number             // boost execution count
  chats: number              // chat activity count
  dms: number                // DM activity count
  social: number             // social media interactions (network activity)
  views: number              // view count
  contributors?: { avatar: string; name: string }[] // contributors at this timestamp
  notable?: { kind: string; label: string }[] // notable events for markers
}

export type SubmitLaunchInput = {
  title: string
  subtitle: string
  logoFile: File              // Required logo file (PNG/JPG, ≤5MB, 1:1 recommended)
  scope: "ICM" | "CCM"
  status: "Live" | "Upcoming"
  description: string
  platforms: ("twitter" | "discord" | "telegram" | "youtube" | "twitch" | "tiktok" | "obs")[]
  economics?: {
    poolUsd?: number
    contributionPoolPct?: number
    feesSharePct?: number
    endAt?: number
  }
  creator?: string
  existingToken?: {
    mint: string            // SPL mint
    treasury: string        // Solana wallet address
  } // present only if scope=ICM and toggle on
}