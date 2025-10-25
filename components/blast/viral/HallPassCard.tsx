'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconVerified, IconMessage } from '@/lib/icons'
import { checkHallPass, HALL_PASS } from '@/lib/blast/viral-mechanics'

interface HallPassCardProps {
  acceptedDMCount: number
  lastAcceptedDMTime: number // timestamp in seconds
  className?: string
}

export function HallPassCard({
  acceptedDMCount,
  lastAcceptedDMTime,
  className,
}: HallPassCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { hasPass, dmsRemaining } = checkHallPass(acceptedDMCount, lastAcceptedDMTime)

  useEffect(() => {
    if (!hasPass) return

    const calculateTimeRemaining = () => {
      const now = Date.now() / 1000
      const passExpiry = lastAcceptedDMTime + HALL_PASS.passDuration
      const remaining = Math.max(0, passExpiry - now)
      setTimeRemaining(remaining)
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [hasPass, lastAcceptedDMTime])

  // Show progress towards Hall Pass
  if (!hasPass && acceptedDMCount > 0) {
    const progress = (acceptedDMCount / HALL_PASS.acceptedDMs) * 100

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-interactive p-4 rounded-2xl border border-zinc-700 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 glass-interactive rounded-xl">
            <IconMessage size={20} className="text-zinc-400" />
          </div>

          <div className="flex-1">
            <h3 className="text-white font-medium text-sm mb-1">
              Hall Pass Progress
            </h3>
            <p className="text-xs text-zinc-400 mb-3">
              Get <strong className="text-white">{dmsRemaining}</strong> more DMs accepted
              to unlock <strong className="text-primary">24h free DM access</strong>
            </p>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-zinc-500 to-zinc-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
                <span>{acceptedDMCount} accepted</span>
                <span>{HALL_PASS.acceptedDMs} needed</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Show active Hall Pass
  if (hasPass) {
    const hours = Math.floor(timeRemaining / 3600)
    const minutes = Math.floor((timeRemaining % 3600) / 60)
    const seconds = Math.floor(timeRemaining % 60)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-premium p-4 rounded-2xl border-2 border-primary relative overflow-hidden ${className}`}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0">
            <motion.div
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <IconVerified size={24} className="text-primary" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                🎫 Hall Pass Active!
              </h3>
              <div className="badge-success text-xs px-2 py-0.5 rounded-lg">
                VIP
              </div>
            </div>

            <p className="text-xs text-zinc-300 mb-3">
              Send DM requests <strong className="text-primary">without deposit</strong> for the
              next <strong>{hours}h {minutes}m</strong>
            </p>

            {/* Stats */}
            <div className="flex items-center gap-2 mb-3">
              <div className="glass-interactive px-3 py-1.5 rounded-lg flex-1">
                <div className="text-xs text-zinc-400 mb-0.5">DMs Accepted</div>
                <div className="font-led-dot text-lg text-primary">
                  {acceptedDMCount}
                </div>
              </div>

              <div className="glass-interactive px-3 py-1.5 rounded-lg flex-1">
                <div className="text-xs text-zinc-400 mb-0.5">Time Left</div>
                <div className="font-led-dot text-sm text-white">
                  {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
                  {String(seconds).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-[#B8E309]"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining / HALL_PASS.passDuration) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
          animate={{
            opacity: [0.3, 0, 0.3],
            scale: [1, 1.01, 1],
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

  return null
}
