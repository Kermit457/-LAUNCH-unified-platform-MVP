/**
 * BLAST Network Hub - Zod Validation Schemas
 * Type-safe validation for all forms and API inputs
 */

import { z } from 'zod'
import { ROOM_TYPES, ROOM_DURATIONS, UI } from '@/lib/constants/blast'

// ============================================================================
// ROOM CREATION SCHEMAS
// ============================================================================

// Base room schema (common fields)
const BaseRoomSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(UI.MIN_DESCRIPTION_LENGTH, `Description must be at least ${UI.MIN_DESCRIPTION_LENGTH} characters`)
    .max(UI.MAX_DESCRIPTION_LENGTH, `Description must be less than ${UI.MAX_DESCRIPTION_LENGTH} characters`),
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(UI.MAX_TAGS_PER_ROOM, `Maximum ${UI.MAX_TAGS_PER_ROOM} tags allowed`),
  totalSlots: z.number()
    .int('Slots must be a whole number')
    .min(1, 'At least 1 slot required')
    .max(50, 'Maximum 50 slots allowed'),
  minKeysToApply: z.number()
    .int('Keys must be a whole number')
    .min(1, 'Minimum 1 key required'),
  entryDeposit: z.number()
    .min(0, 'Deposit cannot be negative')
    .default(1),
  duration: z.enum(['24h', '48h', '72h']),
})

// Deal-specific schema
export const DealRoomSchema = BaseRoomSchema.extend({
  type: z.literal('deal'),
  metadata: z.object({
    fundingStage: z.string().optional(),
    ticketSize: z.string().optional(),
    region: z.string().optional(),
    investorType: z.array(z.string()).optional(),
  }).optional(),
})

// Airdrop-specific schema
export const AirdropRoomSchema = BaseRoomSchema.extend({
  type: z.literal('airdrop'),
  metadata: z.object({
    totalSupply: z.number().int().positive(),
    perSlotReward: z.number().int().positive(),
    tasks: z.array(z.object({
      type: z.string(),
      description: z.string(),
      points: z.number().int().positive(),
    })).min(1, 'At least one task required'),
    antiBot: z.object({
      minWalletAge: z.string().optional(),
      socialVerify: z.boolean().optional(),
      quiz: z.boolean().optional(),
    }).optional(),
  }),
})

// Job-specific schema
export const JobRoomSchema = BaseRoomSchema.extend({
  type: z.literal('job'),
  metadata: z.object({
    budget: z.number().positive('Budget must be positive'),
    currency: z.enum(['USDC', 'SOL', 'keys']),
    skills: z.array(z.string()).min(1, 'At least one skill required'),
    milestones: z.array(z.object({
      description: z.string().min(10),
      amount: z.number().positive(),
      deadline: z.string().optional(),
    })).min(1, 'At least one milestone required'),
    escrowEnabled: z.boolean().default(true),
    disputeEnabled: z.boolean().default(true),
  }),
})

// Collab-specific schema
export const CollabRoomSchema = BaseRoomSchema.extend({
  type: z.literal('collab'),
  metadata: z.object({
    roles: z.array(z.string()).min(1, 'At least one role required'),
    schedule: z.string().optional(),
    voiceEnabled: z.boolean().optional().default(false),
  }),
})

// Funding-specific schema
export const FundingRoomSchema = BaseRoomSchema.extend({
  type: z.literal('funding'),
  metadata: z.object({
    amount: z.string().min(1, 'Funding amount required'),
    stage: z.string().min(1, 'Stage required'),
    raised: z.string().optional(),
    investors: z.number().int().nonnegative().optional(),
    minKeysToView: z.number().int().optional(),
    minKeysToIntro: z.number().int().optional(),
    pitchDeck: z.string().url().optional(),
    metrics: z.object({
      revenue: z.string().optional(),
      growth: z.string().optional(),
      users: z.string().optional(),
    }).optional(),
  }),
})

// Union of all room types
export const RoomSchema = z.discriminatedUnion('type', [
  DealRoomSchema,
  AirdropRoomSchema,
  JobRoomSchema,
  CollabRoomSchema,
  FundingRoomSchema,
])

export type RoomInput = z.infer<typeof RoomSchema>

// ============================================================================
// APPLICATION SCHEMA
// ============================================================================

export const ApplicationSchema = z.object({
  roomId: z.string().min(1, 'Room ID required'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
  keysToStake: z.number()
    .int('Keys must be a whole number')
    .min(1, 'Must stake at least 1 key')
    .max(25, 'Maximum 25 keys can be staked'),
  attachments: z.array(z.string().url())
    .max(UI.MAX_ATTACHMENTS, `Maximum ${UI.MAX_ATTACHMENTS} attachments allowed`)
    .optional(),
})

export type ApplicationInput = z.infer<typeof ApplicationSchema>

// ============================================================================
// DM REQUEST SCHEMA
// ============================================================================

export const DMRequestSchema = z.object({
  toUserId: z.string().min(1, 'Recipient required'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(200, 'Message must be less than 200 characters'),
  depositAmount: z.number()
    .positive('Deposit must be positive')
    .default(0.02),
})

export type DMRequestInput = z.infer<typeof DMRequestSchema>

// ============================================================================
// INTRO REQUEST SCHEMA
// ============================================================================

export const IntroRequestSchema = z.object({
  targetAId: z.string().min(1, 'First person required'),
  targetBId: z.string().min(1, 'Second person required'),
  reason: z.string()
    .min(20, 'Reason must be at least 20 characters')
    .max(300, 'Reason must be less than 300 characters'),
  tags: z.array(z.string()).optional(),
  context: z.string().optional(),
})

export type IntroRequestInput = z.infer<typeof IntroRequestSchema>

// ============================================================================
// CURATOR REVIEW SCHEMA
// ============================================================================

export const CuratorReviewSchema = z.object({
  roomId: z.string().min(1),
  decision: z.enum(['approve', 'reject', 'needs_work']),
  scores: z.object({
    legitimacy: z.number().int().min(1).max(5),
    innovation: z.number().int().min(1).max(5),
    execution: z.number().int().min(1).max(5),
    community: z.number().int().min(1).max(5),
    marketFit: z.number().int().min(1).max(5),
  }),
  feedback: z.string()
    .min(20, 'Feedback must be at least 20 characters')
    .max(500, 'Feedback must be less than 500 characters'),
  internalNotes: z.string().optional(),
  timeSpentSeconds: z.number().int().positive(),
})

export type CuratorReviewInput = z.infer<typeof CuratorReviewSchema>

// ============================================================================
// ESCROW SCHEMA
// ============================================================================

export const EscrowMilestoneSchema = z.object({
  description: z.string().min(10),
  amount: z.number().positive(),
  deadline: z.string().optional(),
})

export const CreateEscrowSchema = z.object({
  roomId: z.string().min(1),
  contributorId: z.string().min(1),
  totalAmount: z.number().positive(),
  currency: z.enum(['USDC', 'SOL', 'keys']),
  milestones: z.array(EscrowMilestoneSchema).min(1),
})

export type CreateEscrowInput = z.infer<typeof CreateEscrowSchema>

// ============================================================================
// FILTERS SCHEMA
// ============================================================================

export const RoomFiltersSchema = z.object({
  type: z.enum(['deal', 'airdrop', 'job', 'collab', 'funding']).optional(),
  tags: z.array(z.string()).optional(),
  minMotionScore: z.number().int().min(0).max(100).optional(),
  status: z.enum(['open', 'hot', 'closing', 'closed']).optional(),
  tier: z.enum(['viewer', 'contributor', 'curator', 'partner']).optional(),
  deadline: z.enum(['today', '7d', '30d']).optional(),
  budget: z.object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
  }).optional(),
})

export type RoomFiltersInput = z.infer<typeof RoomFiltersSchema>

// ============================================================================
// PROFILE SCHEMA
// ============================================================================

export const ProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).max(10).optional(),
  timezone: z.string().optional(),
  twitter: z.string().optional(),
  discord: z.string().optional(),
  telegram: z.string().optional(),
  website: z.string().url().optional(),
})

export type ProfileInput = z.infer<typeof ProfileSchema>

// ============================================================================
// MOTION EVENT SCHEMA
// ============================================================================

export const MotionEventSchema = z.object({
  type: z.string(),
  actorId: z.string(),
  roomId: z.string().optional(),
  targetId: z.string().optional(),
  weight: z.number().positive(),
  metadata: z.record(z.any()).optional(),
})

export type MotionEventInput = z.infer<typeof MotionEventSchema>

// ============================================================================
// HELPER VALIDATORS
// ============================================================================

export function validateRoomType(type: string): type is 'deal' | 'airdrop' | 'job' | 'collab' | 'funding' {
  return type in ROOM_TYPES
}

export function validateDuration(duration: string): duration is '24h' | '48h' | '72h' {
  return duration in ROOM_DURATIONS
}

export function validateSolanaAddress(address: string): boolean {
  // Basic Solana address validation (base58, 32-44 chars)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return base58Regex.test(address)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ============================================================================
// PARSE HELPERS (with error messages)
// ============================================================================

export function parseRoomInput(data: unknown): RoomInput {
  return RoomSchema.parse(data)
}

export function parseApplicationInput(data: unknown): ApplicationInput {
  return ApplicationSchema.parse(data)
}

export function parseDMRequestInput(data: unknown): DMRequestInput {
  return DMRequestSchema.parse(data)
}

export function parseIntroRequestInput(data: unknown): IntroRequestInput {
  return IntroRequestSchema.parse(data)
}

export function parseRoomFilters(data: unknown): z.infer<typeof RoomFiltersSchema> {
  return RoomFiltersSchema.parse(data)
}

// Safe parse (returns success/error)
export function safeParseRoomInput(data: unknown) {
  return RoomSchema.safeParse(data)
}

export function safeParseApplicationInput(data: unknown) {
  return ApplicationSchema.safeParse(data)
}
