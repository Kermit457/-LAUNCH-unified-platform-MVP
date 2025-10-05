export type CreateClipCampaignInput = {
  title: string
  image?: File
  prizePoolUsd: number        // USDC
  payoutPerKUsd: number       // USDC per 1k views
  endAt: number               // epoch ms
  driveLink?: string
  socialLinks: string[]       // at least 1
  description?: string
  conditions?: string
  minViewsRequired?: number   // optional
  autoApprove: boolean
}