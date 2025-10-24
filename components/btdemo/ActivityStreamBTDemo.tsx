'use client'

import { DollarSign, Rocket, ArrowUp, MessageSquare, Trophy, Video } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ActivityType = 'buy' | 'launch' | 'vote' | 'comment' | 'milestone' | 'clip'

interface Activity {
  id: string
  type: ActivityType
  user: { name: string; avatar: string }
  project?: { name: string; ticker: string }
  amount?: number
  timestamp: number
  value?: number
}

interface ActivityStreamBTDemoProps {
  activities: Activity[]
}

export function ActivityStreamBTDemo({ activities }: ActivityStreamBTDemoProps): JSX.Element {
  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getActivityIcon = (type: ActivityType) => {
    const icons = {
      buy: DollarSign,
      launch: Rocket,
      vote: ArrowUp,
      comment: MessageSquare,
      milestone: Trophy,
      clip: Video
    }
    return icons[type]
  }

  const getActivityColor = (type: ActivityType): string => {
    const colors = {
      buy: 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/30',
      launch: 'text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/30',
      vote: 'text-[#00FFFF] bg-[#00FFFF]/10 border-[#00FFFF]/30',
      comment: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      milestone: 'text-[#D1FD0A] bg-[#D1FD0A]/10 border-[#D1FD0A]/30',
      clip: 'text-pink-400 bg-pink-400/10 border-pink-400/30'
    }
    return colors[type]
  }

  const getActivityText = (activity: Activity): JSX.Element => {
    switch (activity.type) {
      case 'buy':
        return (
          <>
            bought{' '}
            <span className="font-bold font-led-16 text-[#00FF88]">
              ◎{activity.amount?.toFixed(1)}
            </span>{' '}
            of <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'launch':
        return (
          <>
            launched <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'milestone':
        return (
          <>
            <span className="font-bold">{activity.project?.name}</span> reached milestone
          </>
        )
      case 'clip':
        return (
          <>
            created clip for <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'vote':
        return (
          <>
            upvoted <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'comment':
        return (
          <>
            commented on <span className="font-bold">{activity.project?.name}</span>
          </>
        )
    }
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
      <AnimatePresence>
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const colorClass = getActivityColor(activity.type)

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="glass-premium p-3 rounded-xl border border-zinc-800 hover:border-opacity-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Activity Icon */}
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-white truncate">
                      {activity.user.name}
                    </span>
                    <span className="text-xs text-zinc-500 whitespace-nowrap ml-auto font-led-16">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300">
                    {getActivityText(activity)}
                  </p>

                  {activity.project && activity.value && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                        ${activity.project.ticker}
                      </span>
                      <span className="text-xs text-zinc-500 font-led-16">
                        ~${activity.value.toLocaleString('en-US')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Live indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
        <span className="text-xs text-zinc-500 font-medium">Live updates</span>
      </div>
    </div>
  )
}
