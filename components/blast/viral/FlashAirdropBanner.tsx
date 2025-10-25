'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconGem, IconLightning } from '@/lib/icons'
import { checkFlashAirdrop, FLASH_AIRDROP } from '@/lib/blast/viral-mechanics'

interface FlashAirdropBannerProps {
  roomMotionScore: number
  entrantCount: number
  alreadyTriggered: boolean
  onTrigger: () => void
  className?: string
}

export function FlashAirdropBanner({
  roomMotionScore,
  entrantCount,
  alreadyTriggered,
  onTrigger,
  className,
}: FlashAirdropBannerProps) {
  const [showFireworks, setShowFireworks] = useState(false)
  const { shouldTrigger, rewardPerEntrant } = checkFlashAirdrop(
    roomMotionScore,
    alreadyTriggered
  )

  useEffect(() => {
    if (shouldTrigger && !alreadyTriggered) {
      setShowFireworks(true)
      onTrigger()

      // Hide fireworks after 5 seconds
      const timer = setTimeout(() => {
        setShowFireworks(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [shouldTrigger, alreadyTriggered, onTrigger])

  if (!shouldTrigger && !showFireworks) return null

  const totalReward = rewardPerEntrant * entrantCount

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -50 }}
        className={`glass-premium p-6 rounded-3xl border-2 border-[#B8E309] relative overflow-hidden ${className}`}
      >
        {/* Fireworks Background Effect */}
        {showFireworks && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/30 via-[#B8E309]/20 to-transparent"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Particle Effects */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: `${50 + Math.cos((i / 12) * 2 * Math.PI) * 100}%`,
                  y: `${50 + Math.sin((i / 12) * 2 * Math.PI) * 100}%`,
                  opacity: 0,
                  scale: 1.5,
                }}
                transition={{
                  duration: 1.5,
                  repeat: 2,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}

        {/* Content */}
        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#B8E309] flex items-center justify-center"
              animate={{
                rotate: showFireworks ? [0, 360] : 0,
                scale: showFireworks ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: showFireworks ? Infinity : 0,
              }}
            >
              <IconGem size={32} className="text-black" />
            </motion.div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <IconLightning size={20} className="text-primary" />
                {showFireworks ? '🎉 FLASH AIRDROP TRIGGERED!' : '⚡ FLASH AIRDROP READY'}
              </h3>
            </div>

            <p className="text-sm text-zinc-300 mb-3">
              Room hit Motion <strong className="text-primary">{FLASH_AIRDROP.motionThreshold}</strong>!{' '}
              <strong className="text-[#B8E309]">{totalReward.toFixed(2)} keys</strong> will be
              distributed to all <strong>{entrantCount}</strong> entrants.
            </p>

            {/* Reward Breakdown */}
            <div className="flex items-center gap-3">
              <div className="glass-interactive px-3 py-2 rounded-xl">
                <div className="text-xs text-zinc-400 mb-0.5">Per Entrant</div>
                <div className="font-led-dot text-lg text-primary">
                  {rewardPerEntrant.toFixed(2)} keys
                </div>
              </div>

              <div className="glass-interactive px-3 py-2 rounded-xl">
                <div className="text-xs text-zinc-400 mb-0.5">Total Pool</div>
                <div className="font-led-dot text-lg text-[#B8E309]">
                  {totalReward.toFixed(2)} keys
                </div>
              </div>

              <div className="glass-interactive px-3 py-2 rounded-xl">
                <div className="text-xs text-zinc-400 mb-0.5">Room Motion</div>
                <div className="font-led-dot text-lg text-white">
                  {roomMotionScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar (for approaching threshold) */}
        {!showFireworks && roomMotionScore < FLASH_AIRDROP.motionThreshold && (
          <div className="relative mt-4">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-[#B8E309]"
                initial={{ width: 0 }}
                animate={{
                  width: `${(roomMotionScore / FLASH_AIRDROP.motionThreshold) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
              <span>Current: {roomMotionScore}</span>
              <span>Target: {FLASH_AIRDROP.motionThreshold}</span>
            </div>
          </div>
        )}

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 border-2 border-[#B8E309] rounded-3xl pointer-events-none"
          animate={{
            opacity: showFireworks ? [0.5, 0, 0.5] : [0.2, 0, 0.2],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: showFireworks ? 1 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
