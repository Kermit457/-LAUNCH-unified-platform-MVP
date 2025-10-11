"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, MessageSquare, ThumbsUp, Share2, Eye, Zap,
  DollarSign, Video, Network, TrendingUp, UserPlus, Target, Trophy, Crown, Medal, Award
} from 'lucide-react'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { HallOfFame } from '@/components/HallOfFame'
import { HALL_OF_FAME } from '@/lib/leaderboardData'
import { GlassCard, PremiumButton } from '@/components/design-system'

// Contribution Metrics (Enhanced UI)
const contributionMetrics = [
  {
    id: 'comment',
    title: 'Comment & Engage',
    description: 'React, reply, and discuss under projects or clips',
    impact: 'Drives retention + visibility',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'vote',
    title: 'Vote',
    description: 'Support campaigns, predictions, or featured creators',
    impact: 'Signals conviction + helps surface quality',
    icon: ThumbsUp,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'share',
    title: 'Share',
    description: 'Post links or highlights on Twitter, Telegram, Discord',
    impact: 'Expands reach outside the platform',
    icon: Share2,
    color: 'from-fuchsia-500 to-violet-500'
  },
  {
    id: 'view',
    title: 'View & Watch',
    description: 'Verified views, watch time, and stream presence',
    impact: 'Boosts algorithmic ranking + validates value',
    icon: Eye,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'boost',
    title: 'Boost',
    description: 'Stake $LAUNCH to amplify creators or campaigns',
    impact: 'Converts belief into measurable support',
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'earn',
    title: 'Earn',
    description: 'Complete bounties, clips, or tasks for rewards',
    impact: 'Turns contribution into real income',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'clip',
    title: 'Clip & Create',
    description: 'Submit short clips or edits from streams',
    impact: 'Builds discoverability and UGC momentum',
    icon: Video,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'collaborate',
    title: 'Collaborate',
    description: 'Co-create, mentor, or join team campaigns',
    impact: 'Connects talent and strengthens output',
    icon: Users,
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'network',
    title: 'Network',
    description: 'Add friends, join groups, and follow creators',
    impact: 'Expands social graph and engagement loops',
    icon: Network,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'grow',
    title: 'Grow',
    description: 'Level up through achievements and milestones',
    impact: 'Encourages consistent participation',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'referral',
    title: 'Referral',
    description: 'Bring new users, creators, or projects',
    impact: 'Drives viral growth and platform expansion',
    icon: UserPlus,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'contribute',
    title: 'Contribute',
    description: 'Support via staking, quests, or governance',
    impact: 'Directly advances community progress',
    icon: Target,
    color: 'from-red-500 to-pink-500'
  }
]

// Sample quest data using existing ActionCard-compatible format
const FEATURED_QUESTS = [
  {
    id: '1',
    group: 'quest' as const,
    title: 'Stream 10 Hours',
    subtitle: 'Go live and stream for a total of 10 hours this week',
    image: '/quest-stream.jpg',
    reward: { type: 'impact' as const, value: 50, label: 'Impact Score' },
    budget: { spent: 0, total: 10 },
    progress: { completed: 0, total: 10 },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    verified: true
  },
  {
    id: '2',
    group: 'quest' as const,
    title: 'Submit 5 Approved Clips',
    subtitle: 'Create and get 5 clips approved across any campaigns',
    image: '/quest-clips.jpg',
    reward: { type: 'impact' as const, value: 30, label: 'Impact Score' },
    budget: { spent: 0, total: 5 },
    progress: { completed: 0, total: 5 },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    verified: true
  },
  {
    id: '3',
    group: 'quest' as const,
    title: 'Stake 1000 $LAUNCH',
    subtitle: 'Boost your profile visibility by staking $LAUNCH tokens',
    image: '/quest-stake.jpg',
    reward: { type: 'impact' as const, value: 20, label: 'Impact Score' },
    budget: { spent: 0, total: 1000 },
    progress: { completed: 0, total: 1000 },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    verified: true
  }
]

// Mock fallback leaderboard data
const mockLeaderboardData = [
  { rank: 1, name: 'sarah_crypto', points: 12847, avatar: 'S', tier: 'Diamond', change: '+2' },
  { rank: 2, name: 'crypto_king', points: 11923, avatar: 'C', tier: 'Diamond', change: '0' },
  { rank: 3, name: 'mike_trader', points: 10456, avatar: 'M', tier: 'Platinum', change: '+1' },
  { rank: 4, name: 'alex_dev', points: 9834, avatar: 'A', tier: 'Platinum', change: '-1' },
  { rank: 5, name: 'emma_nft', points: 8721, avatar: 'E', tier: 'Gold', change: '+3' },
  { rank: 6, name: 'john_degen', points: 7890, avatar: 'J', tier: 'Gold', change: '0' },
  { rank: 7, name: 'lisa_streams', points: 7234, avatar: 'L', tier: 'Gold', change: '+2' },
  { rank: 8, name: 'tom_clips', points: 6543, avatar: 'T', tier: 'Silver', change: '-1' }
]

// Contribution Metric Card
const MetricCard = ({ metric, index }: { metric: any; index: number }) => {
  const Icon = metric.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${metric.color} rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity`} />

      <GlassCard className="relative p-3 h-full">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Icon */}
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-4 h-4 text-white" />
          </div>

          {/* Content */}
          <div>
            <h3 className="text-xs font-bold text-white mb-0.5">{metric.title}</h3>
            <p className="text-[10px] text-design-zinc-400 leading-tight">{metric.description}</p>
            <p className="text-[9px] text-design-zinc-500 italic mt-1">{metric.impact}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Enhanced Leaderboard Row
const LeaderboardRow = ({ user, index }: { user: any; index: number }) => {
  const getRankIcon = () => {
    if (user.rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />
    if (user.rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (user.rank === 3) return <Award className="w-5 h-5 text-orange-400" />
    return <span className="text-design-zinc-500 font-bold">#{user.rank}</span>
  }

  const getTierColor = () => {
    switch (user.tier) {
      case 'Diamond': return 'from-cyan-400 to-blue-400'
      case 'Platinum': return 'from-gray-300 to-gray-500'
      case 'Gold': return 'from-yellow-400 to-orange-400'
      case 'Silver': return 'from-zinc-400 to-zinc-500'
      default: return 'from-zinc-500 to-zinc-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer"
    >
      <div className="flex items-center gap-4 p-4 rounded-xl bg-design-zinc-900/60 backdrop-blur-xl border border-design-zinc-800 hover:border-design-violet-500/30 transition-all">
        {/* Rank */}
        <div className="w-12 flex items-center justify-center">
          {getRankIcon()}
        </div>

        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTierColor()} flex items-center justify-center text-white font-bold shadow-lg`}>
          {user.avatar}
        </div>

        {/* Name & Tier */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white">{user.name}</div>
          <div className={`text-xs bg-gradient-to-r ${getTierColor()} bg-clip-text text-transparent font-semibold`}>
            {user.tier}
          </div>
        </div>

        {/* Points */}
        <div className="text-right">
          <div className="text-lg font-bold text-white">{user.points.toLocaleString()}</div>
          <div className="text-xs text-design-zinc-500">points</div>
        </div>

        {/* Change */}
        <div className={`w-12 text-center text-sm font-bold ${
          user.change.startsWith('+') ? 'text-green-400' :
          user.change.startsWith('-') ? 'text-red-400' :
          'text-design-zinc-500'
        }`}>
          {user.change !== '0' && user.change}
        </div>
      </div>
    </motion.div>
  )
}

// Quest Card Component
function QuestCard({ quest }: { quest: typeof FEATURED_QUESTS[0] }) {
  const progress = (quest.progress.completed / quest.progress.total) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      <GlassCard className="overflow-hidden group hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all">
        {/* Image Placeholder */}
        <div className="relative h-40 bg-gradient-to-br from-design-violet-600 via-design-pink-600 to-design-orange-600 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
          <div className="relative text-6xl">🎯</div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-white text-lg mb-2">{quest.title}</h3>
          <p className="text-sm text-design-zinc-400 mb-4">{quest.subtitle}</p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-design-zinc-500 mb-2">
              <span>Progress</span>
              <span>{quest.progress.completed} / {quest.progress.total}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-design-fuchsia-500 via-design-purple-500 to-design-cyan-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Reward */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">+{quest.reward.value} Impact</span>
            </div>
            <PremiumButton
              size="sm"
              variant="primary"
            >
              Start Quest
            </PremiumButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default function CommunityPage() {
  const [timeFilter, setTimeFilter] = useState('30 days')
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        const response = await fetch('/api/leaderboard?limit=50')
        const data = await response.json()

        if (data.leaderboard && data.leaderboard.length > 0) {
          // Convert API data to component format
          const formatted = data.leaderboard.map((user: any, index: number) => ({
            rank: user.rank,
            name: user.name || `User ${user.userId.slice(0, 8)}`,
            points: user.totalEarnings || 0,
            avatar: user.name ? user.name.charAt(0).toUpperCase() : 'U',
            tier: user.totalEarnings > 10000 ? 'Diamond' : user.totalEarnings > 5000 ? 'Platinum' : user.totalEarnings > 2000 ? 'Gold' : 'Silver',
            change: index < 3 ? '+1' : '0'
          }))
          setLeaderboardData(formatted)
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
        // Keep using mock data on error
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-design-purple-900/40 via-design-fuchsia-900/40 to-design-purple-900/40 blur-3xl" />
        <div className="absolute top-40 right-40 w-96 h-96 bg-design-violet-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-design-pink-500/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Hero Section - Enhanced Season Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12 overflow-hidden rounded-3xl"
      >
        <GlassCard className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Impact Season
              </h1>
              <p className="text-design-zinc-400 text-lg max-w-2xl">
                Earn points from earnings, verified views, approved submissions, live hours, conviction gains, and boosts.
              </p>
            </div>

            {/* Status Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-design-purple-500/20 to-design-fuchsia-500/20 blur-2xl" />
              <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-design-purple-500/10 to-design-fuchsia-500/10 border border-design-purple-500/30">
                <div className="text-design-purple-400 text-sm font-bold mb-1">🚀 STATUS</div>
                <div className="text-3xl font-bold text-white">Coming Soon</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Community Power Index */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Community Power Index
          </h2>
          <p className="text-design-zinc-400 text-sm max-w-2xl mx-auto">
            Every action fuels growth. The more you contribute, the higher you rise.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {contributionMetrics.map((metric, index) => (
            <MetricCard key={metric.id} metric={metric} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Enhanced Leaderboard Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        {/* Time Filter */}
        <div className="flex justify-end mb-6">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-design-zinc-900 border border-design-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-design-purple-500"
          >
            <option value="7 days">Last 7 days</option>
            <option value="30 days">Last 30 days</option>
            <option value="all time">All Time</option>
          </select>
        </div>

        {/* Two Column Leaderboards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Contributors */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-design-purple-400 to-design-fuchsia-400 bg-clip-text text-transparent mb-1">
                Top Contributors
              </h2>
              <p className="text-design-zinc-400 text-sm">Top contributors this season</p>
            </div>
            <div className="space-y-3">
              {leaderboardData.map((user, index) => (
                <LeaderboardRow key={user.rank} user={user} index={index} />
              ))}
            </div>
          </div>

          {/* Cult Leaders */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-design-orange-400 to-design-red-400 bg-clip-text text-transparent mb-1">
                Cult Leaders
              </h2>
              <p className="text-design-zinc-400 text-sm">Most influential creators</p>
            </div>
            <div className="space-y-3">
              {leaderboardData.map((user, index) => (
                <LeaderboardRow key={`cult-${user.rank}`} user={user} index={index} />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Hall of Fame */}
      <HallOfFame entries={HALL_OF_FAME} />

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <GlassCard className="p-8">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Start Contributing Today
          </h3>
          <p className="text-design-zinc-400 mb-6 max-w-xl mx-auto">
            Every action increases your rank and moves the Community Bar forward. Join thousands of creators building the future.
          </p>
          <div className="flex items-center justify-center gap-4">
            <PremiumButton variant="primary" className="px-8 py-3">
              Join Community
            </PremiumButton>
            <PremiumButton variant="secondary" className="px-8 py-3">
              Learn More
            </PremiumButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}