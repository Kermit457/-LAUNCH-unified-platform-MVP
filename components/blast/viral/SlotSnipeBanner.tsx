'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconLightning, IconTarget } from '@/lib/icons'
import { checkSlotSnipe, SLOT_SNIPE } from '@/lib/blast/viral-mechanics'

interface SlotSnipeBannerProps {
  filledSlots: number
  totalSlots: number
  roomEndTime: Date
  className?: string
}

export function SlotSnipeBanner({
  filledSlots,
  totalSlots,
  roomEndTime,
  className,
}: SlotSnipeBannerProps) {
  const [timeLeft, setTimeLeft] = useState(0)

  const { active, timeRemaining } = checkSlotSnipe(filledSlots, totalSlots, roomEndTime)

  useEffect(() => {
    if (!active) return

    setTimeLeft(timeRemaining)

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [active, timeRemaining])

  if (!active) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`glass-premium p-4 rounded-2xl border-2 border-primary relative overflow-hidden ${className}`}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '200% 100%' }}
        />

        {/* Content */}
        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0">
            <motion.div
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <IconTarget size={24} className="text-primary" />
            </motion.div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <IconLightning size={16} className="text-primary" />
                SLOT SNIPE ACTIVE!
              </h3>
            </div>

            <p className="text-xs text-zinc-300 mb-2">
              Last slot available • <strong className="text-primary">2x Motion Score</strong> for final applicant
            </p>

            {/* Countdown */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-zinc-400">Final Call:</div>
              <div className="font-led-dot text-lg text-primary">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Multiplier Badge */}
          <div className="shrink-0">
            <div className="px-4 py-2 bg-gradient-to-br from-primary to-[#B8E309] rounded-xl">
              <div className="text-xs text-black font-bold text-center">
                {SLOT_SNIPE.motionMultiplier}x
              </div>
              <div className="text-xs text-black/70 font-medium">
                MOTION
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-3">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-[#B8E309]"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / SLOT_SNIPE.finalCallWindow) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
          animate={{
            opacity: [0.3, 0, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
