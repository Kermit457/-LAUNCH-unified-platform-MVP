'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, DollarSign } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import { getPayouts } from '@/lib/appwrite/services/payouts'
import { getSubmissions } from '@/lib/appwrite/services/submissions'

export default function AnalyticsPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [earningsData, setEarningsData] = useState<Array<{ date: string; amount: number }>>([])
  const [submissionsPerDay, setSubmissionsPerDay] = useState<Array<{ date: string; count: number }>>([])
  const [topCampaigns, setTopCampaigns] = useState<Array<{ name: string; spent: number; revenue: number; roi: number }>>([])

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return

      try {
        setLoading(true)
        const [campaigns, payouts, submissions] = await Promise.all([
          getCampaigns({ createdBy: user.$id }),
          getPayouts({ userId: user.$id }),
          getSubmissions({ userId: user.$id })
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

        // Calculate top campaigns by spending
        const campaignsWithMetrics = campaigns.map(c => ({
          name: c.title,
          spent: c.budgetPaid || 0,
          revenue: c.budgetPaid || 0,
          roi: c.budget > 0 ? ((c.budgetPaid / c.budget) * 100) : 0
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white/60">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-white/50 mt-1">Track your performance and growth metrics</p>
      </div>

      {/* 30-day Earnings Chart */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">30-Day Earnings</h3>
            <p className="text-sm text-white/50 mt-1">Daily earnings over the last month</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-300">
              ${earningsData.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
            </div>
            <div className="text-xs text-white/50 mt-1">Total earnings</div>
          </div>
        </div>
        <div className="h-64 flex items-end gap-1">
          {earningsData.map((day, i) => (
            <div key={i} className="flex-1 group relative">
              <div
                className="bg-gradient-to-t from-green-500 to-emerald-500 rounded-t hover:opacity-80 transition-opacity"
                style={{ height: `${(day.amount / maxEarnings) * 100}%` }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                <div className="bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {day.date}: ${day.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/50">
          <span>{earningsData[0].date}</span>
          <span>{earningsData[earningsData.length - 1].date}</span>
        </div>
      </div>

      {/* Submissions per Day */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Submissions (Last 7 Days)</h3>
        <div className="h-48 flex items-end gap-4">
          {submissionsPerDay.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative group">
                <div
                  className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t hover:opacity-80 transition-opacity"
                  style={{ height: `${(day.count / maxSubmissions) * 150}px` }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 text-white text-xs rounded px-2 py-1">
                    {day.count} submissions
                  </div>
                </div>
              </div>
              <span className="text-xs text-white/50">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Growth */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Social Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialMetrics.map((metric, i) => (
            <div key={i} className={`bg-gradient-to-br ${metric.color} bg-opacity-10 rounded-xl p-4 border border-white/10`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/70">{metric.platform}</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {metric.followers.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-300">{metric.growth}</div>
                  <div className="text-xs text-white/50">30d growth</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Campaigns by ROI */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Top Campaigns by ROI</h3>
        <div className="space-y-3">
          {topCampaigns.map((campaign, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-white">{campaign.name}</div>
                <div className="text-xs text-white/50 mt-1">
                  Spent: ${campaign.spent.toFixed(2)} • Revenue: ${campaign.revenue.toFixed(2)}
                </div>
              </div>
              <div className={`text-lg font-bold ${campaign.roi > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {campaign.roi > 0 ? '+' : ''}{campaign.roi}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}