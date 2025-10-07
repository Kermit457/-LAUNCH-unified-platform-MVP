export type Role = "viewer" | "contributor" | "reviewer" | "admin"

export type Money = {
  mint: "USDC" | "SOL"
  amount: number
}

export type Campaign = {
  id: string
  ownerId: string
  type: "clipping" | "raid" | "bounty"
  name: string
  status: "live" | "paused" | "completed"
  rate: { kind: "cpm" | "per_task"; value: number; mint: "USDC" | "SOL" }
  budget: {
    total: Money
    locked: Money
    spent: Money
  }
  rules: {
    platforms: ("x" | "youtube" | "twitch" | "tiktok")[]
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
  userId: string
  campaignId: string
  campaignName: string
  submittedAt: number
  status: "pending" | "approved" | "rejected"
  contentUrl: string
  metrics?: {
    views?: number
    likes?: number
    shares?: number
  }
  earnings?: number
  feedback?: string
}

export type Payout = {
  id: string
  userId: string
  amount: number
  currency: "USDC" | "SOL"
  status: "pending" | "processing" | "completed" | "failed"
  campaignId?: string
  campaignName?: string
  createdAt: number
  paidAt?: number
}

export type Profile = {
  id: string
  handle: string
  name: string
  roles: string[]
  verified?: boolean
  wallet?: {
    chain: string
    address: string
    primary: boolean
  }
  socials?: {
    x?: string
    youtube?: string
    twitch?: string
    tiktok?: string
  }
}

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
  status: "pending" | "accepted" | "declined" | "expired" | "sent"
  priority: number
}

export type ThreadType = "dm" | "group"

export type Thread = {
  id: string
  type: ThreadType
  name?: string
  projectId?: string
  campaignId?: string
  participantUserIds: string[]
  createdAt: number
  lastMsgAt: number
  unread: number
  pinned?: boolean
}

export type Message = {
  id: string
  threadId: string
  fromUserId: string
  fromHandle?: string
  content: string
  sentAt: number
  edited?: boolean
  reactions?: { emoji: string; userIds: string[] }[]
}