'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Eye, DollarSign, Download } from 'lucide-react'
import { PremiumButton } from '@/components/design-system'
import { useUser } from '@/hooks/useUser'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import { getPayouts } from '@/lib/appwrite/services/payouts'
import { getSubmissions } from '@/lib/appwrite/services/submissions'
import { getQuests } from '@/lib/appwrite/services/quests'

interface StatCardProps {
  icon: any
  label: string
  value: string | number
  subtitle?: string
  gradient: string
}

const StatCard = ({ icon: Icon, label, value, subtitle, gradient }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-xl border border-design-zinc-800 p-6`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-white/70">{label}</div>
        {subtitle && <div className="text-xs text-white/50 mt-1">{subtitle}</div>}
      </div>
    </div>
  </motion.div>
)

export default function AnalyticsPage() {
  const { user, userId } = useUser()
  const [loading, setLoading] = useState(true)
  const [earningsData, setEarningsData] = useState<Array<{ date: string; amount: number }>>([])
  const [submissionsPerDay, setSubmissionsPerDay] = useState<Array<{ date: string; count: number }>>([])
  const [topCampaigns, setTopCampaigns] = useState<Array<{ name: string; spent: number; revenue: number; roi: number }>>([])
  const [totalViews, setTotalViews] = useState(0)
  const [avgEngagementRate, setAvgEngagementRate] = useState(0)
  const [questMetrics, setQuestMetrics] = useState<{ raids: number; bounties: number; totalEarned: number }>({ raids: 0, bounties: 0, totalEarned: 0 })

  useEffect(() => {
    async function fetchAnalytics() {
      if (!userId) return

      try {
        setLoading(true)
        const [campaigns, payouts, submissions, quests] = await Promise.all([
          getCampaigns({ createdBy: userId }),
          getPayouts({ userId: userId }),
          getSubmissions({ userId: userId }),
          getQuests({ limit: 100 })
        ])

        // Calculate 30-day earnings from payouts
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
        const earningsByDay: Record<string, number> = {}

        payouts.forEach(p => {
          const paidDate = p.paidAt ? new Date(p.paidAt) : new Date(p.$createdAt)
          if (paidDate.getTime() >= thirtyDaysAgo) {
            const dateKey = paidDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            earningsByDay[dateKey] = (earningsByDay[dateKey] || 0) + p.amount
          }
        })

        const earnings = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(thirtyDaysAgo + i * 24 * 60 * 60 * 1000)
          const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          return {
            date: dateKey,
            amount: earningsByDay[dateKey] || 0
          }
        })
        setEarningsData(earnings)

        // Calculate submissions per day (last 7 days)
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        const submissionsByDay: Record<string, number> = {}

        submissions.forEach(s => {
          const subDate = new Date(s.$createdAt)
          if (subDate.getTime() >= sevenDaysAgo) {
            const dateKey = subDate.toLocaleDateString('en-US', { weekday: 'short' })
            submissionsByDay[dateKey] = (submissionsByDay[dateKey] || 0) + 1
          }
        })

        const submissionsData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
          const dateKey = date.toLocaleDateString('en-US', { weekday: 'short' })
          return {
            date: dateKey,
            count: submissionsByDay[dateKey] || 0
          }
        })
        setSubmissionsPerDay(submissionsData)

        // Calculate total views and engagement
        const views = submissions.reduce((sum, s) => sum + (s.views || 0), 0)
        setTotalViews(views)

        // Calculate engagement rate (views per submission)
        const engagementRate = submissions.length > 0 ? views / submissions.length : 0
        setAvgEngagementRate(engagementRate)

        // Calculate quest metrics
        const userQuestSubmissions = submissions.filter(s => s.questId)
        const raidSubmissions = userQuestSubmissions.filter(s => {
          const quest = quests.find(q => q.$id === s.questId)
          return quest?.type === 'raid'
        })
        const bountySubmissions = userQuestSubmissions.filter(s => {
          const quest = quests.find(q => q.$id === s.questId)
          return quest?.type === 'bounty'
        })
        const questEarnings = userQuestSubmissions.reduce((sum, s) => sum + (s.earnings || 0), 0)
        setQuestMetrics({
          raids: raidSubmissions.length,
          bounties: bountySubmissions.length,
          totalEarned: questEarnings
        })

        // Calculate top campaigns by spending
        const campaignsWithMetrics = campaigns.map(c => ({
          name: c.title,
          spent: c.budgetPaid || 0,
          revenue: c.budgetPaid || 0,
          roi: (c as any).budget > 0 ? (((c.budgetPaid || 0) / (c as any).budget) * 100) : 0
        }))
        setTopCampaigns(campaignsWithMetrics.sort((a, b) => b.spent - a.spent).slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  const maxEarnings = Math.max(...earningsData.map(d => d.amount), 1)
  const maxSubmissions = Math.max(...submissionsPerDay.map(d => d.count), 1)

  // Social growth metrics (still mock for now)
  const socialMetrics = [
    { platform: 'X (Twitter)', followers: 12450, growth: '+8.3%', color: 'from-blue-500 to-cyan-500' },
    { platform: 'YouTube', followers: 3280, growth: '+12.1%', color: 'from-red-500 to-pink-500' },
    { platform: 'Twitch', followers: 1890, growth: '+5.7%', color: 'from-purple-500 to-violet-500' },
    { platform: 'TikTok', followers: 8920, growth: '+15.4%', color: 'from-pink-500 to-rose-500' },
  ]

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-purple-500 mx-auto mb-4"></div>
        <p className="text-design-zinc-400">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-design-zinc-300">Track your performance and growth metrics</p>
          </div>
          <PremiumButton
            onClick={() => console.log('Export analytics')}
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </PremiumButton>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Eye}
          label="Total Views"
          value={totalViews.toLocaleString()}
          gradient="from-design-purple-600/20 to-design-purple-800/20"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Views/Sub"
          value={avgEngagementRate.toFixed(0)}
          gradient="from-cyan-600/20 to-blue-800/20"
        />
        <StatCard
          icon={DollarSign}
          label="Quest Earnings"
          value={`$${questMetrics.totalEarned.toFixed(2)}`}
          gradient="from-green-600/20 to-emerald-800/20"
        />
        <StatCard
          icon={Users}
          label="Quest Submissions"
          value={questMetrics.raids + questMetrics.bounties}
          subtitle={`${questMetrics.raids} raids, ${questMetrics.bounties} bounties`}
          gradient="from-orange-600/20 to-red-800/20"
        />
      </div>

      {/* 30-day Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">30-Day Earnings</h3>
            <p className="text-sm text-design-zinc-400 mt-1">Daily earnings over the last month</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              ${earningsData.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
            </div>
            <div className="text-xs text-design-zinc-500 mt-1">Total earnings</div>
          </div>
        </div>
        <div className="h-64 flex items-end gap-1">
          {earningsData.map((day, i) => (
            <div key={i} className="flex-1 group relative">
              <div
                className="bg-gradient-to-t from-green-500 to-emerald-400 rounded-t hover:opacity-80 transition-opacity"
                style={{ height: `${(day.amount / maxEarnings) * 100}%` }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-design-zinc-950/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap border border-design-zinc-800">
                  {day.date}: ${day.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-design-zinc-500">
          <span>{earningsData[0]?.date}</span>
          <span>{earningsData[earningsData.length - 1]?.date}</span>
        </div>
      </motion.div>

      {/* Submissions per Day */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">Submissions (Last 7 Days)</h3>
        <div className="h-48 flex items-end gap-4">
          {submissionsPerDay.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative group">
                <div
                  className="bg-gradient-to-t from-design-purple-500 to-design-pink-500 rounded-t hover:opacity-80 transition-opacity"
                  style={{ height: `${(day.count / maxSubmissions) * 150}px` }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-design-zinc-950/90 text-white text-xs rounded px-2 py-1 border border-design-zinc-800">
                    {day.count} submissions
                  </div>
                </div>
              </div>
              <span className="text-xs text-design-zinc-500">{day.date}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Social Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">Social Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialMetrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`bg-gradient-to-br ${metric.color} bg-opacity-10 rounded-xl p-4 border border-design-zinc-800`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-design-zinc-400">{metric.platform}</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {metric.followers.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{metric.growth}</div>
                  <div className="text-xs text-design-zinc-500">30d growth</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Campaigns by ROI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">Top Campaigns by ROI</h3>
        {topCampaigns.length === 0 ? (
          <div className="text-center py-8 text-design-zinc-500">
            No campaign data available
          </div>
        ) : (
          <div className="space-y-3">
            {topCampaigns.map((campaign, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-design-zinc-800/50 hover:bg-design-zinc-800 transition-colors border border-design-zinc-700"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">{campaign.name}</div>
                  <div className="text-xs text-design-zinc-400 mt-1">
                    Spent: ${campaign.spent.toFixed(2)} • Revenue: ${campaign.revenue.toFixed(2)}
                  </div>
                </div>
                <div className={`text-lg font-bold ${campaign.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {campaign.roi > 0 ? '+' : ''}{campaign.roi.toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
