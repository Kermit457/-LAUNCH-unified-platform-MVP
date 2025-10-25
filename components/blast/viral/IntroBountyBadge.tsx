'use client'

import { motion } from 'framer-motion'
import { IconTrophy, IconTarget } from '@/lib/icons'
import { INTRO_BOUNTY } from '@/lib/blast/viral-mechanics'

interface IntroBountyBadgeProps {
  isWinner: boolean
  winnerName?: string
  winnerAvatar?: string
  timestamp?: Date
  className?: string
}

export function IntroBountyBadge({
  isWinner,
  winnerName,
  winnerAvatar,
  timestamp,
  className,
}: IntroBountyBadgeProps) {
  if (!isWinner) return null

  const timeAgo = timestamp
    ? getTimeAgo(timestamp)
    : 'just now'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-premium p-4 rounded-2xl border-2 border-[#FFD700] relative overflow-hidden ${className}`}
    >
      {/* Gold Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#FFA500]/10 pointer-events-none" />

      <div className="relative flex items-start gap-3">
        {/* Trophy Icon */}
        <div className="shrink-0">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center"
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <IconTrophy size={24} className="text-black" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold text-sm">
              🏆 First Intro Bounty
            </h3>
            <div className="badge-primary text-xs px-2 py-0.5 rounded-lg">
              WINNER
            </div>
          </div>

          <p className="text-xs text-zinc-300 mb-3">
            <strong className="text-[#FFD700]">{winnerName || 'Someone'}</strong> claimed
            the first accepted intro in this room!
          </p>

          {/* Details */}
          <div className="flex items-center gap-3">
            <div className="glass-interactive px-3 py-1.5 rounded-lg">
              <div className="text-xs text-zinc-400">Bounty</div>
              <div className="font-led-dot text-sm text-[#FFD700]">
                {INTRO_BOUNTY.depositAmount} key
              </div>
            </div>

            <div className="glass-interactive px-3 py-1.5 rounded-lg">
              <div className="text-xs text-zinc-400">Badge</div>
              <div className="text-xs text-white font-medium">
                {INTRO_BOUNTY.winnerBadge.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              {timeAgo}
            </div>
          </div>
        </div>

        {/* Winner Avatar (if provided) */}
        {winnerAvatar && (
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full border-2 border-[#FFD700] overflow-hidden">
              <img
                src={winnerAvatar}
                alt={winnerName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Glow Border */}
      <motion.div
        className="absolute inset-0 border-2 border-[#FFD700] rounded-2xl pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

// Helper function
function getTimeAgo(timestamp: Date): string {
  const now = new Date().getTime()
  const time = new Date(timestamp).getTime()
  const diff = Math.floor((now - time) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
