'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconLightning, IconRocket } from '@/lib/icons'
import { checkRaidBoost, RAID_BOOST } from '@/lib/blast/viral-mechanics'
import { usePrivy } from '@privy-io/react-auth'

interface RaidBoostButtonProps {
  roomId: string
  boosts: { userId: string; timestamp: number }[]
  onBoost: (roomId: string, userId: string) => void
}

export function RaidBoostButton({ roomId, boosts, onBoost }: RaidBoostButtonProps) {
  const { user } = usePrivy()
  const [hasBoost, setHasBoosted] = useState(false)

  const { active, count, timeRemaining } = checkRaidBoost(boosts)

  const userBoosted = boosts.some((b) => b.userId === user?.id)

  useEffect(() => {
    setHasBoosted(userBoosted)
  }, [userBoosted])

  const handleBoost = () => {
    if (!user || hasBoost) return
    onBoost(roomId, user.id)
    setHasBoosted(true)
  }

  const progress = (count / RAID_BOOST.threshold) * 100
  const needed = Math.max(0, RAID_BOOST.threshold - count)

  return (
    <div className="relative">
      {/* Raid Boost Button */}
      <motion.button
        onClick={handleBoost}
        disabled={hasBoost || active}
        className={`w-full px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
          active
            ? 'bg-gradient-to-r from-primary to-[#B8E309] text-black'
            : hasBoost
            ? 'glass-interactive text-zinc-400 cursor-not-allowed'
            : 'bg-primary hover:bg-[#B8E309] text-black'
        }`}
        whileHover={{ scale: hasBoost || active ? 1 : 1.02 }}
        whileTap={{ scale: hasBoost || active ? 1 : 0.98 }}
      >
        {active ? (
          <>
            <IconRocket size={20} className="text-black animate-pulse" />
            <span>RAID BOOSTED!</span>
          </>
        ) : hasBoost ? (
          <>
            <IconLightning size={20} />
            <span>Boosted ✓</span>
          </>
        ) : (
          <>
            <IconLightning size={20} />
            <span>Boost This Room</span>
          </>
        )}
      </motion.button>

      {/* Progress Bar */}
      {!active && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>{count}/{RAID_BOOST.threshold} boosters</span>
            {timeRemaining > 0 && (
              <span>{Math.floor(timeRemaining / 60)}:{String(Math.floor(timeRemaining % 60)).padStart(2, '0')}</span>
            )}
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-[#B8E309]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {needed > 0 && (
            <div className="text-xs text-zinc-400 mt-1 text-center">
              {needed} more {needed === 1 ? 'holder' : 'holders'} to feature on homepage!
            </div>
          )}
        </div>
      )}

      {/* Active Badge */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 glass-interactive rounded-lg border-2 border-primary"
        >
          <div className="flex items-center gap-2 justify-center">
            <IconRocket size={16} className="text-primary" />
            <span className="text-xs text-primary font-bold">
              FEATURED FOR 24H • +{RAID_BOOST.motionBonus} MOTION EACH
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
