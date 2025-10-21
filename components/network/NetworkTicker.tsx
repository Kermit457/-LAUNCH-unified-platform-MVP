"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, UserPlus, Users, Award, TrendingUp } from 'lucide-react'

type NetworkEventType =
  | 'connect_created'
  | 'invite_accepted'
  | 'collab_filled'
  | 'task_claimed'
  | 'referral_converted'

interface NetworkEvent {
  id: string
  type: NetworkEventType
  actor: string
  target?: string
  metadata?: {
    projectName?: string
    reward?: string
    role?: string
  }
}

const mockEvents: NetworkEvent[] = [
  {
    id: '1',
    type: 'collab_filled',
    actor: 'crypto_mike',
    metadata: { projectName: 'DeFi Protocol', role: 'Rust Dev' }
  },
  {
    id: '2',
    type: 'invite_accepted',
    actor: 'sarah_dev',
    target: 'alex_builder'
  },
  {
    id: '3',
    type: 'task_claimed',
    actor: 'alex_builder',
    metadata: { reward: '$2,000' }
  },
  {
    id: '4',
    type: 'connect_created',
    actor: 'meme_master',
    target: 'scout_anna'
  },
  {
    id: '5',
    type: 'referral_converted',
    actor: 'crypto_mike',
    target: 'new_builder_42'
  }
]

const eventConfig: Record<NetworkEventType, { icon: typeof Zap, color: string, format: (event: NetworkEvent) => string }> = {
  connect_created: {
    icon: Users,
    color: 'text-[#00FFFF]',
    format: (e) => `${e.actor} connected with ${e.target}`
  },
  invite_accepted: {
    icon: UserPlus,
    color: 'text-[#00FF88]',
    format: (e) => `${e.actor} accepted invite from ${e.target}`
  },
  collab_filled: {
    icon: Award,
    color: 'text-[#00FF88]',
    format: (e) => `${e.actor} filled role: ${e.metadata?.role} in ${e.metadata?.projectName}`
  },
  task_claimed: {
    icon: Zap,
    color: 'text-[#00FFFF]',
    format: (e) => `${e.actor} claimed task (${e.metadata?.reward})`
  },
  referral_converted: {
    icon: TrendingUp,
    color: 'text-[#8800FF]',
    format: (e) => `${e.actor}'s referral ${e.target} activated curve`
  }
}

export function NetworkTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showNotification, setShowNotification] = useState(true)
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockEvents.length)
      setShowNotification(true)
    }, 5000) // Show new notification every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const currentEvent = mockEvents[currentIndex]
  const config = eventConfig[currentEvent.type]
  const Icon = config.icon

  const handleDismiss = () => {
    setDismissed([...dismissed, currentEvent.id])
    setShowNotification(false)
  }

  // Don't show if dismissed
  if (dismissed.includes(currentEvent.id)) {
    return null
  }

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-24 right-4 md:right-8 z-50 max-w-sm"
        >
          <div className="p-4 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 shadow-2xl">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#00FF88]">Live</span>
                </div>
                <p className="text-sm text-white leading-relaxed">
                  {config.format(currentEvent)}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-zinc-800 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 text-zinc-500 hover:text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="mt-3 h-1 bg-[#00FF88]/30 rounded-full overflow-hidden"
            >
              <div className="h-full bg-[#00FF88]" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
