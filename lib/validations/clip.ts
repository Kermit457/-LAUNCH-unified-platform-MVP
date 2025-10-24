import { z } from 'zod'

/**
 * Platform enum for validation
 */
export const platformSchema = z.enum([
  'twitter', 'tiktok', 'youtube', 'twitch', 'instagram',
  'linkedin', 'facebook', 'reddit', 'vimeo', 'rumble', 'kick'
])

/**
 * Zod Schema for Clip data from Appwrite
 */
export const clipSchema = z.object({
  $id: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  clipId: z.string(),
  submittedBy: z.string(),
  campaignId: z.string().optional(),
  platform: platformSchema,
  embedUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  title: z.string().optional(),
  projectName: z.string().optional(),
  badge: z.enum(['LIVE', 'FROZEN', 'LAUNCHED']).optional(),
  views: z.number().int().nonnegative(),
  likes: z.number().int().nonnegative(),
  comments: z.number().int().nonnegative(),
  shares: z.number().int().nonnegative(),
  engagement: z.number().nonnegative(),
  clicks: z.number().int().nonnegative(),
  referralCode: z.string().optional(),
  status: z.enum(['active', 'pending', 'rejected', 'removed']),
  ownerType: z.enum(['user', 'project']).optional(),
  ownerId: z.string().optional(),
  approved: z.boolean(),
  metadata: z.string().optional(),
  creatorAvatar: z.string().url().optional(),
  creatorUsername: z.string().optional(),
  projectLogo: z.string().url().optional(),
  projectId: z.string().optional(),
})

/**
 * Zod Schema for Campaign Form Data
 */
export const campaignFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  type: z.enum(['clipping', 'bounty', 'airdrop']),
  budget: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a valid number'),
  ratePerThousand: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  duration: z.string().min(1, 'Duration is required'),
  description: z.string().max(500).optional(),
  platforms: z.array(z.string()).min(1, 'At least one platform required'),
  requirements: z.array(z.string()).optional(),
})

/**
 * Zod Schema for Submit Clip Form
 */
export const submitClipFormSchema = z.object({
  embedUrl: z.string().url('Must be a valid URL'),
  title: z.string().optional(),
  projectName: z.string().optional(),
  projectId: z.string().optional(),
  projectLogo: z.string().url().optional(),
  campaignId: z.string().optional(),
})

/**
 * TypeScript Types inferred from Zod Schemas
 */
export type Clip = z.infer<typeof clipSchema>
export type CampaignFormData = z.infer<typeof campaignFormSchema>
export type SubmitClipFormData = z.infer<typeof submitClipFormSchema>
