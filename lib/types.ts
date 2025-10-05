export type Mint = "USDC" | "SOL"
export type Money = { mint: Mint; amount: number } // human units

export type Wallet = { chain: "SOL"; address: string; primary?: true }

export type Profile = {
  id: string
  handle: string
  name: string
  roles: string[]
  verified?: boolean
  wallet: Wallet
  socials?: {
    x?: string
    youtube?: string
    twitch?: string
    discord?: string
  }
}

export type CampaignType = "clipping" | "raid" | "bounty"

export type Campaign = {
  id: string
  ownerId: string
  type: CampaignType
  name: string
  status: "live" | "paused" | "ended"
  rate: { kind: "cpm" | "per_task"; value: number; mint: Mint } // default USDC
  budget: { total: Money; locked: Money; spent: Money }
  rules: {
    platforms: ("x" | "youtube" | "tiktok" | "twitch")[]
    minDurationSec?: number
    requiredTags?: string[]
    requireWatermark?: boolean
  }
  startsAt: number
  endsAt?: number
  isLive?: boolean
}

export type Submission = {
  id: string
  campaignId: string
  userId: string
  platform: "x" | "youtube" | "tiktok" | "twitch"
  link: string
  viewsVerified: number
  reward: Money
  status: "pending" | "approved" | "rejected" | "needs_fix"
  checks: {
    linkOk: boolean
    dup: false | { of: string }
    tagOk: boolean
    durationOk: boolean
    watermarkOk?: boolean
    banned?: boolean
  }
  notes?: string
  createdAt: number
  decidedAt?: number
}

export type Payout = {
  id: string
  userId: string
  source: "campaign" | "bounty" | "raid" | "prediction" | "ad"
  mint: Mint
  amount: number
  fee?: number
  net?: number
  status: "claimable" | "paid"
  txHash?: string
  createdAt: number
  paidAt?: number
}

// Network & Messaging Types
export type Role = "viewer" | "contributor" | "reviewer" | "admin"

export type Connection = {
  userId: string
  handle: string
  name: string
  roles: string[]
  verified?: boolean
  mutuals: number
  lastActive: number
  unread: number
  pinned?: boolean
  muted?: boolean
}

export type Invite = {
  id: string
  fromUserId: string
  fromHandle: string
  mutuals: number
  project?: { id: string; name: string }
  role?: Role
  offer?: string
  note?: string
  sentAt: number
  status: "pending" | "accepted" | "declined" | "expired"
  priority: number // computed ranking score
}

export type ThreadType = "dm" | "group"

export type Thread = {
  id: string
  type: ThreadType
  name?: string // for group chats
  projectId?: string
  campaignId?: string
  participantUserIds: string[]
  createdAt: number
  lastMsgAt: number
  unread: number
  pinned?: boolean
}
