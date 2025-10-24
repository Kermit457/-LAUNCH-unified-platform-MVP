"use client"

import { motion } from 'framer-motion'
import { Zap, UserPlus, Users, Briefcase, Award, TrendingUp } from 'lucide-react'

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
  timestamp: string
}

const mockEvents: NetworkEvent[] = [
  {
    id: '1',
    type: 'collab_filled',
    actor: 'crypto_mike',
    metadata: { projectName: 'DeFi Protocol', role: 'Rust Dev' },
    timestamp: '2m ago'
  },
  {
    id: '2',
    type: 'invite_accepted',
    actor: 'sarah_dev',
    target: 'alex_builder',
    timestamp: '5m ago'
  },
  {
    id: '3',
    type: 'task_claimed',
    actor: 'alex_builder',
    metadata: { reward: '$2,000' },
    timestamp: '12m ago'
  },
  {
    id: '4',
    type: 'connect_created',
    actor: 'meme_master',
    target: 'scout_anna',
    timestamp: '18m ago'
  },
  {
    id: '5',
    type: 'referral_converted',
    actor: 'crypto_mike',
    target: 'new_builder_42',
    timestamp: '25m ago'
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
    color: 'text-[#D1FD0A]',
    format: (e) => `${e.actor}'s referral ${e.target} activated curve`
  }
}

export function NetworkFeed() {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00FFFF]" />
          Network Moves
        </h2>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Live" />
      </div>

      <p className="text-sm text-zinc-400 mb-4">
        Real-time activity across the network.
      </p>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {mockEvents.map((event, index) => {
          const config = eventConfig[event.type]
          const Icon = config.icon

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-all"
            >
              <div className="flex items-start gap-2">
                <div className={`w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {config.format(event)}
                  </p>
                  <span className="text-[10px] text-zinc-500">{event.timestamp}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {mockEvents.length === 0 && (
        <div className="py-8 text-center">
          <Zap className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">No activity yet. Be the first to move.</p>
        </div>
      )}
    </div>
  )
}
