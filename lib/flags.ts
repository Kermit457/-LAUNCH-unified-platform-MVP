/**
 * Feature Flags
 * Centralized feature toggle system
 */

import { ENV } from './env'

/**
 * Feature flag configuration
 * Use these to gate features during development and rollout
 */
export const FLAGS = {
  /** Enable Live streaming features */
  ENABLE_LIVE: ENV.features.enableLive,

  /** Enable Earn/rewards features */
  ENABLE_EARN: ENV.features.enableEarn,

  /** Enable Network/social features */
  ENABLE_NETWORK: ENV.features.enableNetwork,

  /** Enable Chat features */
  ENABLE_CHAT: true,

  /** Enable trading features */
  ENABLE_TRADING: true,

  /** Enable curve creation */
  ENABLE_CURVE_CREATION: true,

  /** Enable referral system */
  ENABLE_REFERRALS: true,

  /** Enable notifications */
  ENABLE_NOTIFICATIONS: true,

  /** Enable analytics */
  ENABLE_ANALYTICS: true,

  /** Dev-only features */
  DEV_TOOLS: ENV.IS_DEVELOPMENT,
} as const

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: keyof typeof FLAGS): boolean {
  return FLAGS[flag]
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): Array<keyof typeof FLAGS> {
  return Object.entries(FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([flag]) => flag as keyof typeof FLAGS)
}

/** Type-safe flags access */
export type FeatureFlags = typeof FLAGS
