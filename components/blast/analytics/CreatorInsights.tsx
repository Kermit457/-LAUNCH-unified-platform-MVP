/**
 * CreatorInsights - Dashboard for creator performance metrics
 */

'use client'

import { motion } from 'framer-motion'
import {
  Target,
  Users,
  CheckCircle,
  Coins,
  TrendingUp,
  Eye,
  Loader2,
} from 'lucide-react'
import { useCreatorAnalytics } from '@/hooks/blast/useCreatorAnalytics'

export function CreatorInsights() {
  const { data: analytics, isLoading } = useCreatorAnalytics()

  if (isLoading) {
    return (
      <div className="btdemo-glass rounded-xl p-8 border border-zinc-800">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#00FF88]" />
          <p className="text-zinc-400">Loading your insights...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const stats = [
    {
      label: 'Rooms Created',
      value: analytics.roomsCreated,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      label: 'Total Applicants',
      value: analytics.totalApplicants,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      label: 'Accepted',
      value: analytics.totalAccepted,
      icon: CheckCircle,
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
      label: 'Avg Applicants/Room',
      value: analytics.avgApplicantsPerRoom.toFixed(1),
      icon: TrendingUp,
      color: 'text-[#00FF88]',
      bgColor: 'bg-[#00FF88]/20'
    },
    {
      label: 'Overall Accept Rate',
      value: `${analytics.acceptanceRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-[#00FF88]',
      bgColor: 'bg-[#00FF88]/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="btdemo-glass rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-[#00FF88]" />
          <h2 className="text-2xl font-black text-white btdemo-text-glow">
            Creator Insights
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          Your performance across all rooms
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

      {/* Performance Summary */}
      {analytics.roomsCreated > 0 && (
        <div className="btdemo-glass rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-black text-white mb-4">
            📊 Performance Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
              <span className="text-zinc-400">Quality Score</span>
              <span className="text-white font-bold">
                {analytics.acceptanceRate > 50 ? '🔥 High' : analytics.acceptanceRate > 30 ? '✅ Good' : '📈 Growing'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
              <span className="text-zinc-400">Avg Applicants per Room</span>
              <span className="text-white font-bold">
                {analytics.avgApplicantsPerRoom.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
              <span className="text-zinc-400">Total Keys Attracted</span>
              <span className="text-yellow-400 font-bold">
                {analytics.totalKeysLocked} keys
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="btdemo-glass rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-black text-white mb-4">
          💡 Tips to Improve
        </h3>
        <div className="space-y-3 text-sm text-zinc-300">
          {analytics.avgApplicantsPerRoom < 5 && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold text-white">Add more tags</span> to increase discoverability
              </div>
            </div>
          )}
          {analytics.acceptanceRate < 30 && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold text-white">Lower your min keys</span> to attract more applicants
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] mt-2 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Respond quickly</span> to applications for better Motion Score
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] mt-2 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Share your rooms</span> on social media to boost views
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
