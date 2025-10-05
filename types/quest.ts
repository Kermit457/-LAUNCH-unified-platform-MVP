export type CampaignType = "raid" | "bounty"
export type Mint = "USDC" | "SOL"
export type Platform = "x" | "youtube" | "twitch" | "tiktok"
export type Evidence = "link" | "video" | "screenshot"
export type MissionType = "mission" | "takeover" | "support"

export interface CreateQuestInput {
  type: CampaignType
  targetUrl: string
  mission?: MissionType // raid only
  title: string
  logoFile?: File
  rules: {
    platforms: Platform[]
    requiredTags?: string[]
    minDurationSec?: number
    evidence: Evidence
    maxParticipants?: number
    perUserLimit?: number
    reviewerSlaHrs?: number
    autoApprove?: boolean
  }
  funding: {
    kind: "free" | "paid"
    mint?: Mint
    model?: {
      kind: "pool" | "per_task" // raid=pool, bounty=per_task
      amount: number
      cap?: number // bounty budget cap
    }
  }
  schedule: {
    startAt?: number // Unix timestamp
    endAt?: number
  }
}