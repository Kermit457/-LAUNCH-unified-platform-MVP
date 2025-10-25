'use client'

import { motion } from 'framer-motion'
import { IconTrophy, IconLightning } from '@/lib/icons'
import { checkKeyStreak, KEY_STREAK } from '@/lib/blast/viral-mechanics'

interface StreakVaultBadgeProps {
  activityDates: Date[]
  className?: string
}

export function StreakVaultBadge({ activityDates, className }: StreakVaultBadgeProps) {
  const { hasStreak, currentStreak, bonusEligible } = checkKeyStreak(activityDates)

  if (!hasStreak) return null

  const progress = (currentStreak / KEY_STREAK.days) * 100
  const daysRemaining = Math.max(0, KEY_STREAK.days - currentStreak)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-premium p-4 rounded-2xl border-2 ${
        bonusEligible ? 'border-primary' : 'border-primary/50'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-xl ${bonusEligible ? 'bg-primary/20' : 'glass-interactive'}`}>
          {bonusEligible ? (
            <IconTrophy size={24} className="text-primary" />
          ) : (
            <IconLightning size={24} className="text-primary" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-white font-bold text-sm">
              {bonusEligible ? '🔥 Streak Vault Active!' : 'Daily Streak'}
            </h3>
            <div className="font-led-dot text-2xl text-primary">{currentStreak}</div>
          </div>

          <p className="text-xs text-zinc-400 mb-3">
            {bonusEligible
              ? `Earn ${(KEY_STREAK.bonusRefund * 100).toFixed(0)}% bonus on all refunds!`
              : `${daysRemaining} more ${daysRemaining === 1 ? 'day' : 'days'} to unlock bonus`}
          </p>

          {/* Progress Bar */}
          {!bonusEligible && (
            <div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-[#B8E309]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Day {currentStreak}</span>
                <span>Day {KEY_STREAK.days}</span>
              </div>
            </div>
          )}

          {/* Bonus Info */}
          {bonusEligible && (
            <div className="p-2 glass-interactive rounded-lg">
              <div className="text-xs text-primary font-medium text-center">
                Keep your streak alive for continued bonuses!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Streak Days */}
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: KEY_STREAK.days }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                i < currentStreak
                  ? 'bg-primary text-black'
                  : 'glass-interactive text-zinc-600'
              }`}
            >
              {i < currentStreak ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
