'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  TrendingUp, DollarSign, Zap, Target, Award, Users, Rocket, Video,
  Trophy, LayoutGrid, Activity, ArrowUpRight, ChevronRight,
  MessageSquare, Star, Eye, TrendingDown
} from 'lucide-react'
import { PremiumButton } from '@/components/design-system'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface StatCardProps {
  icon: any
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  color: string
  onClick?: () => void
}

const StatCard = ({ icon: Icon, label, value, change, trend, color, onClick }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    onClick={onClick}
    className={`relative overflow-hidden bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-4 ${onClick ? 'cursor-pointer' : ''} transition-all hover:border-${color}-500/50`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-design-zinc-400">{label}</div>
  </motion.div>
)

interface QuickLinkProps {
  icon: any
  label: string
  href: string
  count?: number
  gradient: string
}

const QuickLink = ({ icon: Icon, label, href, count, gradient }: QuickLinkProps) => {
  const router = useRouter()

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className={`relative overflow-hidden rounded-xl p-4 text-left group border border-design-zinc-800 hover:border-design-purple-500/50 transition-all`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-white" />
          <span className="text-white font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="text-sm text-design-zinc-400">{count}</span>
          )}
          <ChevronRight className="w-4 h-4 text-design-zinc-600 group-hover:text-design-purple-400 transition-colors" />
        </div>
      </div>
    </motion.button>
  )
}

export default function UnifiedDashboard() {
  const router = useRouter()
  const [stats] = useState({
    totalEarnings: 5432.50,
    activeProjects: 12,
    networkSize: 248,
    conviction: 87,
    pendingReviews: 7,
    liveStreams: 3,
    activeCampaigns: 8,
    completedBounties: 15,
    totalViews: 125400,
    engagement: 89
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
            <p className="text-design-zinc-400 mb-6">Here's what's happening across your LaunchOS ecosystem</p>

            <div className="flex flex-wrap gap-3">
              <PremiumButton variant="primary" onClick={() => router.push('/launches/new')}>
                <Rocket size={16} />
                Create Launch
              </PremiumButton>
              <PremiumButton variant="secondary" onClick={() => router.push('/campaigns/new')}>
                <Video size={16} />
                New Campaign
              </PremiumButton>
              <PremiumButton variant="ghost" onClick={() => router.push('/profile')}>
                View Profile
              </PremiumButton>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            icon={DollarSign}
            label="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            change="+12.5%"
            trend="up"
            color="green"
            onClick={() => router.push('/earnings')}
          />
          <StatCard
            icon={Rocket}
            label="Active Projects"
            value={stats.activeProjects.toString()}
            change="+3"
            trend="up"
            color="purple"
            onClick={() => router.push('/discover')}
          />
          <StatCard
            icon={Users}
            label="Network Size"
            value={stats.networkSize.toString()}
            change="+24"
            trend="up"
            color="pink"
            onClick={() => router.push('/network')}
          />
          <StatCard
            icon={Award}
            label="Conviction"
            value={`${stats.conviction}%`}
            color="violet"
          />
          <StatCard
            icon={Zap}
            label="Pending Reviews"
            value={stats.pendingReviews.toString()}
            color="orange"
          />
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard
            icon={Activity}
            label="Live Streams"
            value={stats.liveStreams.toString()}
            color="red"
            onClick={() => router.push('/live')}
          />
          <StatCard
            icon={Video}
            label="Active Campaigns"
            value={stats.activeCampaigns.toString()}
            color="blue"
            onClick={() => router.push('/earn')}
          />
          <StatCard
            icon={Trophy}
            label="Completed Bounties"
            value={stats.completedBounties.toString()}
            change="+5"
            trend="up"
            color="yellow"
          />
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-design-purple-400" />
                Engagement
              </h3>
              <span className="text-2xl font-bold text-white">{stats.engagement}%</span>
            </div>
            <div className="h-2 bg-design-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-design-purple-500 to-design-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.engagement}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-design-zinc-400 mt-2">Average across all platforms</p>
          </div>

          <div className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Total Views
              </h3>
              <span className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>+15.8% from last month</span>
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <QuickLink
              icon={LayoutGrid}
              label="Discover"
              href="/discover"
              count={142}
              gradient="from-purple-500 to-pink-500"
            />
            <QuickLink
              icon={Zap}
              label="Live Streams"
              href="/live"
              count={stats.liveStreams}
              gradient="from-red-500 to-orange-500"
            />
            <QuickLink
              icon={Trophy}
              label="Earn"
              href="/earn"
              count={stats.activeCampaigns}
              gradient="from-yellow-500 to-orange-500"
            />
            <QuickLink
              icon={Users}
              label="Network"
              href="/network"
              count={stats.networkSize}
              gradient="from-cyan-500 to-blue-500"
            />
            <QuickLink
              icon={MessageSquare}
              label="Community"
              href="/community"
              gradient="from-green-500 to-emerald-500"
            />
            <QuickLink
              icon={Target}
              label="Tools"
              href="/tools"
              gradient="from-violet-500 to-purple-500"
            />
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {[
              { icon: Rocket, text: 'New launch: $MEME Token', time: '2h ago', color: 'purple' },
              { icon: Video, text: 'Campaign completed: Clip Contest', time: '5h ago', color: 'pink' },
              { icon: Trophy, text: 'Bounty claimed: $500 USDC', time: '8h ago', color: 'green' },
              { icon: Users, text: '3 new network connections', time: '12h ago', color: 'blue' },
              { icon: Star, text: 'Achievement unlocked: Early Adopter', time: '1d ago', color: 'yellow' }
            ].map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-design-zinc-800/50 hover:bg-design-zinc-800 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-${activity.color}-500/10`}>
                  <activity.icon className={`w-4 h-4 text-${activity.color}-400`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.text}</p>
                  <p className="text-xs text-design-zinc-500">{activity.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-design-zinc-600" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
