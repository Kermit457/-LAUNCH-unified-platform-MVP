'use client'

import { DollarSign, Rocket, ArrowUp, MessageSquare, Trophy, Video, TrendingDown, Users, Star, TrendingUp, UserPlus, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ActivityType = 'buy' | 'sell' | 'launch' | 'vote' | 'comment' | 'milestone' | 'clip' | 'collab' | 'network' | 'curator' | 'motion' | 'holders' | 'dm'

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
      sell: TrendingDown,
      launch: Rocket,
      vote: ArrowUp,
      comment: MessageSquare,
      milestone: Trophy,
      clip: Video,
      collab: Users,
      network: UserPlus,
      curator: Star,
      motion: TrendingUp,
      holders: Users,
      dm: Mail
    }
    return icons[type]
  }

  const getActivityColor = (type: ActivityType): string => {
    const colors = {
      buy: 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/30',
      sell: 'text-red-400 bg-red-400/10 border-red-400/30',
      launch: 'text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/30',
      vote: 'text-[#00FFFF] bg-[#00FFFF]/10 border-[#00FFFF]/30',
      comment: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      milestone: 'text-[#D1FD0A] bg-[#D1FD0A]/10 border-[#D1FD0A]/30',
      clip: 'text-pink-400 bg-pink-400/10 border-pink-400/30',
      collab: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
      network: 'text-[#D1FD0A] bg-[#D1FD0A]/10 border-[#D1FD0A]/30',
      curator: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
      motion: 'text-[#D1FD0A] bg-[#D1FD0A]/10 border-[#D1FD0A]/30',
      holders: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      dm: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30'
    }
    return colors[type]
  }

  const getActivityText = (activity: Activity): JSX.Element => {
    switch (activity.type) {
      case 'buy':
        return (
          <>
            bought{' '}
            <span className="font-bold font-led-dot text-[#00FF88]">
              ◎{activity.amount?.toFixed(1)}
            </span>{' '}
            of <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'sell':
        return (
          <>
            sold{' '}
            <span className="font-bold font-led-dot text-red-400">
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
      case 'collab':
        return (
          <>
            started collaborating on <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'network':
        return (
          <>
            joined the network
          </>
        )
      case 'curator':
        return (
          <>
            became a curator
          </>
        )
      case 'motion':
        return (
          <>
            <span className="font-bold">{activity.project?.name}</span> motion score increased
          </>
        )
      case 'holders':
        return (
          <>
            <span className="font-bold">{activity.project?.name}</span> reached {activity.amount} holders
          </>
        )
      case 'dm':
        return (
          <>
            sent you a message
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
              className="glass-premium p-2 rounded-lg border border-zinc-800 hover:border-[#D1FD0A]/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {/* Activity Icon */}
                <div className={`w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-4 h-4 rounded-full flex-shrink-0"
                  />
                  <span className="text-xs font-medium text-white truncate">
                    {activity.user.name}
                  </span>
                  <p className="text-xs text-zinc-400 truncate">
                    {getActivityText(activity)}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-zinc-600 whitespace-nowrap flex-shrink-0 font-led-dot">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
