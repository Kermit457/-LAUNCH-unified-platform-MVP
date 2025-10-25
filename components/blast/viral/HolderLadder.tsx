'use client'

import { motion } from 'framer-motion'
import { IconLock, IconStar, IconCrown } from '@/lib/icons'
import { useState } from 'react'

type TierLevel = 'viewer' | 'contributor' | 'curator' | 'partner'

interface TierConfig {
  name: string
  keysRequired: number
  color: string
  bgColor: string
  icon: any
  powers: string[]
  emoji: string
}

const TIERS: Record<TierLevel, TierConfig> = {
  viewer: {
    name: 'Viewer',
    keysRequired: 0,
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    icon: IconLock,
    powers: ['Browse rooms', 'Witness mode', 'View leaderboard'],
    emoji: '👀',
  },
  contributor: {
    name: 'Contributor',
    keysRequired: 1,
    color: '#D1FD0A',
    bgColor: 'rgba(209, 253, 10, 0.1)',
    icon: IconStar,
    powers: ['Post & Apply', 'Create posts', 'Send DMs (deposit)'],
    emoji: '✨',
  },
  curator: {
    name: 'Curator',
    keysRequired: 5,
    color: '#B8E309',
    bgColor: 'rgba(184, 227, 9, 0.1)',
    icon: IconStar,
    powers: ['Curate & Tag', 'Rank applicants', 'Earn curator rewards', 'Draft power (top 3)'],
    emoji: '🎯',
  },
  partner: {
    name: 'Partner',
    keysRequired: 25,
    color: '#FFD700',
    bgColor: 'rgba(255, 215, 0, 0.1)',
    icon: IconCrown,
    powers: ['Open Rooms', 'Create 72h Deal Rooms', 'Accept applicants', 'Full platform access'],
    emoji: '👑',
  },
}

interface HolderLadderProps {
  currentKeys: number
  onBuyKeys?: () => void
  className?: string
}

export function HolderLadder({ currentKeys, onBuyKeys, className }: HolderLadderProps) {
  const [expandedTier, setExpandedTier] = useState<TierLevel | null>(null)

  // Determine current tier
  const getCurrentTier = (): TierLevel => {
    if (currentKeys >= 25) return 'partner'
    if (currentKeys >= 5) return 'curator'
    if (currentKeys >= 1) return 'contributor'
    return 'viewer'
  }

  const currentTier = getCurrentTier()
  const tierOrder: TierLevel[] = ['viewer', 'contributor', 'curator', 'partner']

  // Calculate progress to next tier
  const getProgressToNext = (tier: TierLevel): number => {
    const tierIndex = tierOrder.indexOf(tier)
    if (tierIndex === tierOrder.length - 1) return 100 // Max tier

    const currentTierKeys = TIERS[tier].keysRequired
    const nextTierKeys = TIERS[tierOrder[tierIndex + 1]].keysRequired

    if (currentKeys < currentTierKeys) return 0
    if (currentKeys >= nextTierKeys) return 100

    return ((currentKeys - currentTierKeys) / (nextTierKeys - currentTierKeys)) * 100
  }

  return (
    <div className={`glass-premium p-6 rounded-3xl border border-zinc-700 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-white font-bold text-xl mb-1 flex items-center gap-2">
          🔑 Holder Ladder
        </h3>
        <p className="text-sm text-zinc-400">
          Your tier: <span className="font-bold" style={{ color: TIERS[currentTier].color }}>
            {TIERS[currentTier].emoji} {TIERS[currentTier].name}
          </span>
        </p>
      </div>

      {/* Current Keys Badge */}
      <div className="glass-interactive p-4 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-400 mb-1">Your Keys</div>
            <div className="font-led-dot text-3xl" style={{ color: TIERS[currentTier].color }}>
              {currentKeys}
            </div>
          </div>

          {onBuyKeys && currentTier !== 'partner' && (
            <button
              onClick={onBuyKeys}
              className="px-4 py-2 bg-primary hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all"
            >
              Buy Keys
            </button>
          )}
        </div>
      </div>

      {/* Tier Ladder */}
      <div className="space-y-3">
        {tierOrder.map((tier, index) => {
          const config = TIERS[tier]
          const isUnlocked = currentKeys >= config.keysRequired
          const isCurrent = tier === currentTier
          const isExpanded = expandedTier === tier
          const progress = getProgressToNext(tier)

          const Icon = config.icon

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => setExpandedTier(isExpanded ? null : tier)}
                className={`w-full glass-interactive rounded-xl p-4 transition-all relative overflow-hidden ${
                  isCurrent ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: isUnlocked ? config.bgColor : 'rgba(0, 0, 0, 0.2)',
                  ringColor: isCurrent ? config.color : 'transparent',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Glow */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${config.color}20, transparent)`,
                    }}
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                <div className="relative flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isUnlocked ? config.color + '20' : 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Icon
                      size={24}
                      className={isUnlocked ? '' : 'opacity-30'}
                      style={{ color: isUnlocked ? config.color : '#6B7280' }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className="font-bold text-base"
                        style={{ color: isUnlocked ? config.color : '#6B7280' }}
                      >
                        {config.emoji} {config.name}
                      </h4>

                      {isCurrent && (
                        <div className="badge-success text-xs px-2 py-0.5 rounded">
                          ACTIVE
                        </div>
                      )}

                      {isUnlocked && !isCurrent && (
                        <div className="text-xs text-zinc-500">✓ Unlocked</div>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400 mb-2">
                      {config.keysRequired === 0 ? 'Free' : `${config.keysRequired} keys required`}
                    </div>

                    {/* Progress Bar */}
                    {isCurrent && tier !== 'partner' && (
                      <div className="mb-2">
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${config.color}, ${TIERS[tierOrder[index + 1]].color})`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
                          <span>{currentKeys} keys</span>
                          <span>
                            {TIERS[tierOrder[index + 1]].keysRequired - currentKeys} more to{' '}
                            {TIERS[tierOrder[index + 1]].name}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Powers (Expanded) */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 border-t border-zinc-700 mt-2 space-y-1">
                        {config.powers.map((power, i) => (
                          <div
                            key={i}
                            className="text-xs flex items-start gap-1.5"
                            style={{ color: isUnlocked ? config.color : '#6B7280' }}
                          >
                            <span className="mt-0.5">•</span>
                            <span>{power}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Expand Arrow */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-zinc-400"
                  >
                    ▼
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Next Milestone */}
      {currentTier !== 'partner' && (
        <div className="mt-6 p-4 glass-interactive rounded-xl border border-primary/30">
          <div className="text-xs text-zinc-400 mb-1">🎯 Next Milestone</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold">
                {TIERS[tierOrder[tierOrder.indexOf(currentTier) + 1]].emoji}{' '}
                {TIERS[tierOrder[tierOrder.indexOf(currentTier) + 1]].name}
              </div>
              <div className="text-xs text-zinc-500">
                {TIERS[tierOrder[tierOrder.indexOf(currentTier) + 1]].keysRequired} keys needed
              </div>
            </div>
            <div className="font-led-dot text-2xl text-primary">
              {TIERS[tierOrder[tierOrder.indexOf(currentTier) + 1]].keysRequired - currentKeys}
            </div>
          </div>
        </div>
      )}

      {/* Max Tier Celebration */}
      {currentTier === 'partner' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-[#FFD700]/20 to-transparent rounded-xl border border-[#FFD700]"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-white font-bold mb-1">Max Tier Unlocked!</div>
            <div className="text-xs text-zinc-400">You have full platform access</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
