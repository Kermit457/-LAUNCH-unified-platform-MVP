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
    endAt?: number
  }
  creator?: string
  existingToken?: {
    mint: string            // SPL mint
    treasury: string        // Solana wallet address
  } // present only if scope=ICM and toggle on
}