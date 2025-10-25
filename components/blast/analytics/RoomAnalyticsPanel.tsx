/**
 * RoomAnalyticsPanel - Display room performance metrics
 */

'use client'

import { motion } from 'framer-motion'
import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Coins,
  Eye,
  Clock,
  BarChart3,
  Loader2,
} from 'lucide-react'
import { useRoomAnalytics } from '@/hooks/blast/useRoomAnalytics'

interface RoomAnalyticsPanelProps {
  roomId: string
}

export function RoomAnalyticsPanel({ roomId }: RoomAnalyticsPanelProps) {
  const { data: analytics, isLoading } = useRoomAnalytics(roomId)

  if (isLoading) {
    return (
      <div className="btdemo-glass rounded-xl p-12 border border-zinc-800">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#00FF88]" />
          <p className="text-zinc-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const stats = [
    {
      label: 'Total Applicants',
      value: analytics.applicants,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      label: 'Accepted',
      value: analytics.accepted,
      icon: CheckCircle,
      color: 'text-[#00FF88]',
      bgColor: 'bg-[#00FF88]/20'
    },
    {
      label: 'Acceptance Rate',
      value: `${analytics.acceptanceRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-[#00FF88]',
      bgColor: 'bg-[#00FF88]/20'
    },
    {
      label: 'Total Keys Locked',
      value: analytics.totalKeysLocked,
      icon: Coins,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    {
      label: 'Avg Keys/Applicant',
      value: analytics.avgKeysPerApplicant.toFixed(1),
      icon: Coins,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    {
      label: 'Peak Motion Score',
      value: analytics.motionScorePeak,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="btdemo-glass rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-[#00FF88]" />
          <h2 className="text-2xl font-black text-white btdemo-text-glow">
            Room Analytics
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          Real-time performance metrics for this room
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="btdemo-glass rounded-xl p-6 border border-zinc-800"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-zinc-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      {analytics.applicants > 0 && (
        <div className="btdemo-glass rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-black text-white mb-4">
            💡 Insights
          </h3>
          <div className="space-y-3 text-sm">
            {analytics.acceptanceRate > 70 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#00FF88]/5 border border-[#00FF88]/20">
                <TrendingUp className="w-4 h-4 text-[#00FF88] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[#00FF88] mb-1">
                    High Acceptance Rate
                  </div>
                  <div className="text-zinc-300">
                    You're accepting {analytics.acceptanceRate.toFixed(0)}% of applicants. Your room is very active!
                  </div>
                </div>
              </div>
            )}

            {analytics.avgKeysPerApplicant > 10 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                <Coins className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-yellow-400 mb-1">
                    High-Value Applicants
                  </div>
                  <div className="text-zinc-300">
                    Applicants are staking {analytics.avgKeysPerApplicant.toFixed(1)} keys on average. Quality signals!
                  </div>
                </div>
              </div>
            )}

            {analytics.motionScorePeak > 50 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-400/5 border border-purple-400/20">
                <TrendingUp className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-purple-400 mb-1">
                    Trending Room
                  </div>
                  <div className="text-zinc-300">
                    Motion Score peaked at {analytics.motionScorePeak}. Your room is getting noticed!
                  </div>
                </div>
              </div>
            )}

            {analytics.applicants < 3 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-400/5 border border-blue-400/20">
                <Users className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-blue-400 mb-1">
                    Build Momentum
                  </div>
                  <div className="text-zinc-300">
                    Share your room to attract more applicants. Try adding more relevant tags.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
