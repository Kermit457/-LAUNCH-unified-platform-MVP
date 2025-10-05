import { Campaign, Submission, Payout, Profile } from './types'

export const MOCK_PROFILE: Profile = {
  id: "user_1",
  handle: "@cryptoking",
  name: "CryptoKing",
  roles: ["Streamer", "Creator"],
  verified: true,
  wallet: {
    chain: "SOL",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    primary: true
  },
  socials: {
    x: "https://twitter.com/cryptoking",
    youtube: "https://youtube.com/@cryptoking",
    twitch: "https://twitch.tv/cryptoking"
  }
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_1",
    ownerId: "user_1",
    type: "clipping",
    name: "Solana Summer Clips",
    status: "live",
    rate: { kind: "cpm", value: 12.5, mint: "USDC" },
    budget: {
      total: { mint: "USDC", amount: 5000 },
      locked: { mint: "USDC", amount: 1200 },
      spent: { mint: "USDC", amount: 2300 }
    },
    rules: {
      platforms: ["x", "youtube", "tiktok"],
      minDurationSec: 30,
      requiredTags: ["#Solana", "@project"],
      requireWatermark: true
    },
    startsAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 15 * 24 * 60 * 60 * 1000,
    isLive: true
  },
  {
    id: "camp_2",
    ownerId: "user_1",
    type: "raid",
    name: "Pump.fun Raid Campaign",
    status: "live",
    rate: { kind: "per_task", value: 5, mint: "USDC" },
    budget: {
      total: { mint: "USDC", amount: 2000 },
      locked: { mint: "USDC", amount: 450 },
      spent: { mint: "USDC", amount: 800 }
    },
    rules: {
      platforms: ["x", "twitch"],
      requiredTags: ["#pumpfun"]
    },
    startsAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 20 * 24 * 60 * 60 * 1000,
    isLive: true
  },
  {
    id: "camp_3",
    ownerId: "user_1",
    type: "bounty",
    name: "Tutorial Bounty",
    status: "paused",
    rate: { kind: "per_task", value: 50, mint: "USDC" },
    budget: {
      total: { mint: "USDC", amount: 1000 },
      locked: { mint: "USDC", amount: 200 },
      spent: { mint: "USDC", amount: 350 }
    },
    rules: {
      platforms: ["youtube"],
      minDurationSec: 180,
      requiredTags: ["#Tutorial"]
    },
    startsAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  },
  {
    id: "camp_4",
    ownerId: "user_1",
    type: "clipping",
    name: "NFT Launch Clips",
    status: "live",
    rate: { kind: "cpm", value: 8, mint: "SOL" },
    budget: {
      total: { mint: "SOL", amount: 50 },
      locked: { mint: "SOL", amount: 12 },
      spent: { mint: "SOL", amount: 18 }
    },
    rules: {
      platforms: ["x", "youtube"],
      minDurationSec: 20,
      requireWatermark: true
    },
    startsAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 23 * 24 * 60 * 60 * 1000,
    isLive: true
  },
  {
    id: "camp_5",
    ownerId: "user_1",
    type: "raid",
    name: "Discord Raid",
    status: "live",
    rate: { kind: "per_task", value: 3, mint: "USDC" },
    budget: {
      total: { mint: "USDC", amount: 1500 },
      locked: { mint: "USDC", amount: 300 },
      spent: { mint: "USDC", amount: 600 }
    },
    rules: {
      platforms: ["x", "twitch"]
    },
    startsAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 10 * 24 * 60 * 60 * 1000,
    isLive: true
  },
  {
    id: "camp_6",
    ownerId: "user_1",
    type: "bounty",
    name: "Meme Contest",
    status: "ended",
    rate: { kind: "per_task", value: 25, mint: "USDC" },
    budget: {
      total: { mint: "USDC", amount: 500 },
      locked: { mint: "USDC", amount: 0 },
      spent: { mint: "USDC", amount: 500 }
    },
    rules: {
      platforms: ["x", "tiktok"]
    },
    startsAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() - 30 * 24 * 60 * 60 * 1000
  }
]

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub_1",
    campaignId: "camp_1",
    userId: "user_2",
    platform: "youtube",
    link: "https://youtube.com/watch?v=abc123",
    viewsVerified: 15400,
    reward: { mint: "USDC", amount: 192.5 },
    status: "pending",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: true,
      durationOk: true,
      watermarkOk: true,
      banned: false
    },
    createdAt: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: "sub_2",
    campaignId: "camp_1",
    userId: "user_3",
    platform: "x",
    link: "https://x.com/user/status/123456",
    viewsVerified: 8200,
    reward: { mint: "USDC", amount: 102.5 },
    status: "pending",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: true,
      durationOk: true,
      watermarkOk: false,
      banned: false
    },
    createdAt: Date.now() - 5 * 60 * 60 * 1000
  },
  {
    id: "sub_3",
    campaignId: "camp_2",
    userId: "user_4",
    platform: "twitch",
    link: "https://twitch.tv/videos/987654",
    viewsVerified: 3400,
    reward: { mint: "USDC", amount: 5 },
    status: "approved",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: true,
      durationOk: true,
      banned: false
    },
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    decidedAt: Date.now() - 20 * 60 * 60 * 1000
  },
  {
    id: "sub_4",
    campaignId: "camp_1",
    userId: "user_5",
    platform: "tiktok",
    link: "https://tiktok.com/@user/video/111222",
    viewsVerified: 45000,
    reward: { mint: "USDC", amount: 562.5 },
    status: "pending",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: false,
      durationOk: true,
      watermarkOk: true,
      banned: false
    },
    createdAt: Date.now() - 8 * 60 * 60 * 1000
  },
  {
    id: "sub_5",
    campaignId: "camp_4",
    userId: "user_6",
    platform: "youtube",
    link: "https://youtube.com/watch?v=xyz789",
    viewsVerified: 12000,
    reward: { mint: "SOL", amount: 0.96 },
    status: "rejected",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: true,
      durationOk: false,
      watermarkOk: true,
      banned: false
    },
    notes: "Video duration too short (15s, required 20s min)",
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    decidedAt: Date.now() - 10 * 60 * 60 * 1000
  },
  {
    id: "sub_6",
    campaignId: "camp_2",
    userId: "user_7",
    platform: "x",
    link: "https://x.com/user/status/789456",
    viewsVerified: 1200,
    reward: { mint: "USDC", amount: 5 },
    status: "needs_fix",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: true,
      durationOk: true,
      banned: false
    },
    notes: "Please add required hashtag #pumpfun",
    createdAt: Date.now() - 16 * 60 * 60 * 1000
  },
  {
    id: "sub_7",
    campaignId: "camp_1",
    userId: "user_8",
    platform: "youtube",
    link: "https://youtube.com/watch?v=def456",
    viewsVerified: 23000,
    reward: { mint: "USDC", amount: 287.5 },
    status: "approved",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: true,
      durationOk: true,
      watermarkOk: true,
      banned: false
    },
    createdAt: Date.now() - 36 * 60 * 60 * 1000,
    decidedAt: Date.now() - 32 * 60 * 60 * 1000
  },
  {
    id: "sub_8",
    campaignId: "camp_5",
    userId: "user_9",
    platform: "twitch",
    link: "https://twitch.tv/videos/456123",
    viewsVerified: 890,
    reward: { mint: "USDC", amount: 3 },
    status: "pending",
    checks: {
      linkOk: true,
      dup: false,
      tagOk: true,
      durationOk: true,
      banned: false
    },
    createdAt: Date.now() - 1 * 60 * 60 * 1000
  }
]

export const MOCK_PAYOUTS: Payout[] = [
  {
    id: "pay_1",
    userId: "user_1",
    source: "campaign",
    mint: "USDC",
    amount: 287.5,
    fee: 5.75,
    net: 281.75,
    status: "claimable",
    createdAt: Date.now() - 32 * 60 * 60 * 1000
  },
  {
    id: "pay_2",
    userId: "user_1",
    source: "raid",
    mint: "USDC",
    amount: 5,
    fee: 0.1,
    net: 4.9,
    status: "claimable",
    createdAt: Date.now() - 20 * 60 * 60 * 1000
  },
  {
    id: "pay_3",
    userId: "user_1",
    source: "bounty",
    mint: "USDC",
    amount: 50,
    fee: 1,
    net: 49,
    status: "paid",
    txHash: "2ZE7R5J3k9P8mWv4N1Q6x8T3yF7nH2kL9mP4wS6vR1tX",
    createdAt: Date.now() - 72 * 60 * 60 * 1000,
    paidAt: Date.now() - 60 * 60 * 60 * 1000
  },
  {
    id: "pay_4",
    userId: "user_1",
    source: "campaign",
    mint: "SOL",
    amount: 1.5,
    fee: 0.03,
    net: 1.47,
    status: "paid",
    txHash: "4mX9nP3kF7L2wR5tV8jQ1yH6zN4pS2kM8xT3vF9wR2tY",
    createdAt: Date.now() - 96 * 60 * 60 * 1000,
    paidAt: Date.now() - 84 * 60 * 60 * 1000
  },
  {
    id: "pay_5",
    userId: "user_1",
    source: "campaign",
    mint: "USDC",
    amount: 125,
    fee: 2.5,
    net: 122.5,
    status: "paid",
    txHash: "7kL3wR9mX2vF4nP8tY5jQ6zH1pS7kM4xT8vF2wR9tX3",
    createdAt: Date.now() - 120 * 60 * 60 * 1000,
    paidAt: Date.now() - 108 * 60 * 60 * 1000
  },
  {
    id: "pay_6",
    userId: "user_1",
    source: "raid",
    mint: "USDC",
    amount: 3,
    fee: 0.06,
    net: 2.94,
    status: "claimable",
    createdAt: Date.now() - 6 * 60 * 60 * 1000
  },
  {
    id: "pay_7",
    userId: "user_1",
    source: "campaign",
    mint: "USDC",
    amount: 180,
    fee: 3.6,
    net: 176.4,
    status: "paid",
    txHash: "9pS2kM7xT3vF8wR1nX4jQ5zH6yL2kP9mX7vF3wR8tY4",
    createdAt: Date.now() - 168 * 60 * 60 * 1000,
    paidAt: Date.now() - 156 * 60 * 60 * 1000
  }
]

// Lowercase exports for convenience
export const mockCampaigns = MOCK_CAMPAIGNS
export const mockSubmissions = MOCK_SUBMISSIONS
export const mockPayouts = MOCK_PAYOUTS