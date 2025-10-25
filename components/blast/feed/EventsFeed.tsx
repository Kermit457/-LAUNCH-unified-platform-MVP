/**
 * EventsFeed - Live activity stream with BTDemo design
 */

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  IconRocket,
  IconCheckCircle,
  IconMotion,
  IconLightning,
  IconContributorBubble,
  IconCash,
  IconGem,
  IconComputer,
  IconNetwork,
  IconMotionScoreBadge,
  IconActivityBadge,
  IconLab
} from '@/lib/icons'

interface BlastEvent {
  id: string
  type: 'room_created' | 'application' | 'accepted' | 'motion_boost' | 'room_hot'
  userId: string
  userName: string
  userAvatar?: string
  roomId?: string
  roomTitle?: string
  roomType?: string
  metadata?: any
  timestamp: Date
}

interface EventsFeedProps {
  limit?: number
  autoRefresh?: boolean
}

export function EventsFeed({ limit = 20, autoRefresh = true }: EventsFeedProps) {
  const [events, setEvents] = useState<BlastEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock events - Replace with real API call
  useEffect(() => {
    const mockEvents: BlastEvent[] = [
      {
        id: '1',
        type: 'room_created',
        userId: 'user1',
        userName: 'Alex Chen',
        userAvatar: undefined,
        roomId: 'room1',
        roomTitle: 'Seed Round for AI Startup',
        roomType: 'funding',
        timestamp: new Date(Date.now() - 1000 * 60 * 2)
      },
      {
        id: '2',
        type: 'room_hot',
        userId: 'user2',
        userName: 'Sarah Kim',
        roomId: 'room2',
        roomTitle: '$SOL Airdrop - 1000 Winners',
        roomType: 'airdrop',
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: '3',
        type: 'accepted',
        userId: 'user3',
        userName: 'Marcus Johnson',
        roomId: 'room3',
        roomTitle: 'Senior Engineer @ Web3 Startup',
        roomType: 'job',
        timestamp: new Date(Date.now() - 1000 * 60 * 8)
      },
      {
        id: '4',
        type: 'application',
        userId: 'user4',
        userName: 'Lisa Wang',
        roomId: 'room4',
        roomTitle: 'Co-founder Search',
        roomType: 'collab',
        metadata: { keysStaked: 50 },
        timestamp: new Date(Date.now() - 1000 * 60 * 12)
      },
      {
        id: '5',
        type: 'motion_boost',
        userId: 'user5',
        userName: 'David Park',
        metadata: { newScore: 85, boost: 15 },
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
      }
    ]

    setTimeout(() => {
      setEvents(mockEvents.slice(0, limit))
      setIsLoading(false)
    }, 500)

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Add new mock event at top
        const newEvent: BlastEvent = {
          id: Date.now().toString(),
          type: ['room_created', 'application', 'accepted', 'motion_boost', 'room_hot'][Math.floor(Math.random() * 5)] as any,
          userId: `user${Math.floor(Math.random() * 100)}`,
          userName: ['Alex', 'Sarah', 'Marcus', 'Lisa', 'David'][Math.floor(Math.random() * 5)] + ' ' + ['Chen', 'Kim', 'Johnson', 'Wang', 'Park'][Math.floor(Math.random() * 5)],
          roomTitle: 'New Opportunity',
          roomType: ['deal', 'airdrop', 'job', 'collab', 'funding'][Math.floor(Math.random() * 5)],
          timestamp: new Date()
        }
        setEvents(prev => [newEvent, ...prev.slice(0, limit - 1)])
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [limit, autoRefresh])

  const getEventIcon = (event: BlastEvent) => {
    switch (event.type) {
      case 'room_created':
        return <IconRocket className="icon-primary" size={20} />
      case 'application':
        return <IconContributorBubble className="text-blue-400" size={20} />
      case 'accepted':
        return <IconCheckCircle className="text-green-400" size={20} />
      case 'motion_boost':
        return <IconMotion className="text-orange-400" size={20} />
      case 'room_hot':
        return <IconLab className="icon-primary" size={20} />
      default:
        return <IconActivityBadge className="icon-muted" size={20} />
    }
  }

  const getRoomIcon = (roomType?: string) => {
    switch (roomType) {
      case 'deal': return <IconCash size={14} />
      case 'airdrop': return <IconGem size={14} />
      case 'job': return <IconComputer size={14} />
      case 'collab': return <IconNetwork size={14} />
      case 'funding': return <IconRocket size={14} />
      default: return null
    }
  }

  const getEventText = (event: BlastEvent) => {
    switch (event.type) {
      case 'room_created':
        return (
          <>
            <span className="font-semibold text-white">{event.userName}</span>
            {' created '}
            <span className="text-primary">{event.roomTitle}</span>
          </>
        )
      case 'application':
        return (
          <>
            <span className="font-semibold text-white">{event.userName}</span>
            {' applied to '}
            <span className="text-primary">{event.roomTitle}</span>
            {event.metadata?.keysStaked && (
              <span className="text-zinc-400">
                {' with '}
                <span className="font-led-dot text-primary">{event.metadata.keysStaked}</span>
                {' keys'}
              </span>
            )}
          </>
        )
      case 'accepted':
        return (
          <>
            <span className="font-semibold text-white">{event.userName}</span>
            {' was accepted to '}
            <span className="text-primary">{event.roomTitle}</span>
          </>
        )
      case 'motion_boost':
        return (
          <>
            <span className="font-semibold text-white">{event.userName}</span>
            {' boosted Motion Score to '}
            <span className="font-led-dot text-primary">{event.metadata?.newScore}</span>
          </>
        )
      case 'room_hot':
        return (
          <>
            <span className="text-primary">{event.roomTitle}</span>
            {' is now HOT 🔥'}
          </>
        )
      default:
        return <span className="text-zinc-400">Activity</span>
    }
  }

  if (isLoading) {
    return (
      <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50">
        <div className="flex items-center gap-2 mb-4">
          <IconActivityBadge className="icon-primary" size={24} />
          <h3 className="section-heading">Live Activity</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 glass-interactive rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconActivityBadge className="icon-primary" size={24} />
          <h3 className="section-heading">Live Activity</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.03 }}
              className="list-item flex items-start gap-3 group"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getEventIcon(event)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {getEventText(event)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">
                    {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                  </span>
                  {event.roomType && (
                    <>
                      <span className="text-xs text-zinc-700">•</span>
                      <div className="badge-primary text-xs flex items-center gap-1">
                        {getRoomIcon(event.roomType)}
                        <span>{event.roomType}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Avatar */}
              {event.userAvatar ? (
                <img
                  src={event.userAvatar}
                  alt={event.userName}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">
                    {event.userName.charAt(0)}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {events.length === 0 && (
        <div className="text-center py-8">
          <IconActivityBadge className="icon-muted mx-auto mb-2" size={48} />
          <p className="text-zinc-400 text-sm">No recent activity</p>
        </div>
      )}
    </div>
  )
}
