/**
 * BLAST Leaderboard - BTDemo design
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useLeaderboard } from '@/hooks/blast/useLeaderboard'
import {
  IconNavArrowLeft,
  IconTrophy,
  IconTopPerformer,
  IconContributorBubble,
  IconMotion,
  IconDeposit,
  IconLab,
  IconRocket,
  IconChartAnimation,
  IconMotionScoreBadge,
  IconCollabExpand
} from '@/lib/icons'

export default function LeaderboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'applications' | 'keys' | 'motion'>('motion')
  const { data: leaderboard, isLoading } = useLeaderboard()

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-[#D1FD0A]'
    if (rank === 2) return 'text-zinc-300'
    if (rank === 3) return 'text-orange-400'
    return 'text-zinc-500'
  }

  const renderLeaderboard = (data: any[], metric: string) => {
    if (!data || data.length === 0) {
      return (
        <div className="glass-premium rounded-3xl p-12 text-center border-2 border-primary/50">
          <IconMotion className="icon-primary mx-auto mb-4" size={64} />
          <h3 className="text-2xl font-black text-white mb-2">No Data Yet</h3>
          <p className="text-zinc-400">Be the first to climb the leaderboard!</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const room = item.room
          if (!room) return null
          const rank = index + 1

          return (
            <motion.div
              key={room.$id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-interactive p-4 rounded-2xl border-2 border-primary/40 hover:border-primary transition-all cursor-pointer group"
              onClick={() => router.push(`/BLAST/room/${room.$id}`)}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="relative">
                  {getRankEmoji(rank) ? (
                    <div className="text-4xl">{getRankEmoji(rank)}</div>
                  ) : (
                    <div className={`w-12 h-12 rounded-xl glass-interactive flex items-center justify-center ${getRankColor(rank)}`}>
                      <span className="font-led-dot text-2xl">{rank}</span>
                    </div>
                  )}
                  {rank <= 3 && (
                    <IconTopPerformer className="absolute -bottom-1 -right-1 icon-primary" size={20} />
                  )}
                </div>

                {/* Room Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{room.title}</h4>
                    {room.status === 'hot' && <IconLab className="icon-primary" size={14} />}
                    <div className="badge-primary text-xs">
                      {room.type.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <IconMotionScoreBadge score={room.motionScore} size={24} />
                    <div className="flex items-center gap-1">
                      <IconContributorBubble size={14} />
                      <span className="font-led-dot">{room.filledSlots}</span>
                    </div>
                  </div>
                </div>

                {/* Metric */}
                <div className="text-right">
                  <div className={`font-led-dot text-2xl ${rank <= 3 ? 'text-primary' : 'text-zinc-400'}`}>
                    {metric === 'applications' && room.filledSlots}
                    {metric === 'keys' && room.minKeysToApply}
                    {metric === 'motion' && room.motionScore}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {metric === 'applications' && 'applicants'}
                    {metric === 'keys' && 'keys'}
                    {metric === 'motion' && 'score'}
                  </div>
                </div>

                {/* Arrow */}
                <button className="icon-interactive group-hover:text-primary transition-colors">
                  <IconCollabExpand size={20} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Blob Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[325px] h-[325px] rounded-full bg-primary/20 blur-[125px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[325px] h-[325px] rounded-full bg-primary/15 blur-[125px]" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full glass-premium border-b border-zinc-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/BLAST')}
                className="icon-interactive-primary"
              >
                <IconNavArrowLeft size={24} />
              </button>

              <div className="flex items-center gap-3">
                <IconTrophy className="icon-primary" size={32} />
                <h1 className="text-3xl font-black gradient-text-launchos">Leaderboard</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('motion')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'motion'
                ? 'glass-premium border border-primary text-primary'
                : 'glass-interactive text-zinc-400 hover:text-primary'
            }`}
          >
            <IconMotion size={20} />
            <span>Top Motion Score</span>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'applications'
                ? 'glass-premium border border-primary text-primary'
                : 'glass-interactive text-zinc-400 hover:text-primary'
            }`}
          >
            <IconContributorBubble size={20} />
            <span>Most Applicants</span>
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'keys'
                ? 'glass-premium border border-primary text-primary'
                : 'glass-interactive text-zinc-400 hover:text-primary'
            }`}
          >
            <IconDeposit size={20} />
            <span>Highest Key Gate</span>
          </button>
        </div>

        {/* Leaderboard */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 glass-premium rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'motion' && renderLeaderboard(leaderboard?.byMotion || [], 'motion')}
            {activeTab === 'applications' && renderLeaderboard(leaderboard?.byApplications || [], 'applications')}
            {activeTab === 'keys' && renderLeaderboard(leaderboard?.byKeys || [], 'keys')}
          </>
        )}
      </main>
    </div>
  )
}
