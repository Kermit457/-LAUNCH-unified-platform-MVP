'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, Download, Check } from 'lucide-react'
import { PremiumButton } from '@/components/design-system'
import { useUser } from '@/hooks/useUser'
import { getPayouts } from '@/lib/appwrite/services/payouts'
import { getSubmissions } from '@/lib/appwrite/services/submissions'
import { motion } from 'framer-motion'

type DashboardPayout = {
  id: string
  source: string
  amount: number
  status: string
  createdAt: number
}

export default function EarningsPage() {
  const { userId } = useUser()
  const [loading, setLoading] = useState(true)
  const [payouts, setPayouts] = useState<DashboardPayout[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [claimable, setClaimable] = useState(0)
  const [pending, setPending] = useState(0)

  useEffect(() => {
    async function fetchData() {
      if (!userId) return

      try {
        setLoading(true)
        const [payoutsData, submissionsData] = await Promise.all([
          getPayouts({ userId: userId }),
          getSubmissions({ userId: userId, status: 'approved' })
        ])

        const total = submissionsData.reduce((sum, sub) => sum + (sub.earnings || 0), 0)
        setTotalEarnings(total)

        const claimableAmount = payoutsData
          .filter(p => p.status === 'claimable')
          .reduce((sum, p) => sum + (p.net || p.amount), 0)
        setClaimable(claimableAmount)

        const pendingAmount = submissionsData
          .filter(s => s.status === 'approved')
          .reduce((sum, s) => sum + (s.earnings || 0), 0)
        setPending(pendingAmount)

        const converted: DashboardPayout[] = payoutsData.map(p => ({
          id: p.$id,
          source: p.campaignId || p.questId || 'campaign',
          amount: p.net || p.amount,
          status: p.status,
          createdAt: new Date(p.$createdAt).getTime(),
        }))
        setPayouts(converted)
      } catch (error) {
        console.error('Failed to fetch earnings data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-purple-500 mx-auto mb-4"></div>
          <p className="text-design-zinc-400">Loading earnings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-xl md:rounded-2xl border border-design-zinc-800 p-4 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Earnings</h1>
            <p className="text-sm md:text-base text-design-zinc-400">Track your payments and claim rewards</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-design-purple-600 hover:bg-design-purple-700 text-white font-medium transition-colors flex items-center justify-center gap-2">
            <Wallet size={16} />
            <span>Connect Wallet</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid - Compact on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-4 md:p-6"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            </div>
            <h3 className="text-sm md:text-base font-semibold text-white">Total Earnings</h3>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">${totalEarnings.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs md:text-sm text-green-400">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            <span>All-time</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-4 md:p-6"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-design-purple-500/10 border border-design-purple-500/20">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-design-purple-400" />
            </div>
            <h3 className="text-sm md:text-base font-semibold text-white">Claimable</h3>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">${claimable.toLocaleString()}</div>
          <button className="mt-2 px-3 py-1.5 text-xs md:text-sm rounded-lg bg-design-zinc-800 hover:bg-design-zinc-700 text-white font-medium transition-colors">
            Claim Now
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-4 md:p-6 sm:col-span-2 md:col-span-1"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
            </div>
            <h3 className="text-sm md:text-base font-semibold text-white">Pending</h3>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">${pending.toLocaleString()}</div>
          <p className="text-xs md:text-sm text-design-zinc-500">Under review</p>
        </motion.div>
      </div>

      {/* Payouts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-design-zinc-800 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-white">Recent Payouts</h2>
          <button className="px-3 py-1.5 text-xs md:text-sm rounded-lg bg-design-zinc-800 hover:bg-design-zinc-700 text-white font-medium transition-colors flex items-center gap-2">
            <Download size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {payouts.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-design-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-design-zinc-600" />
            </div>
            <p className="text-sm md:text-base text-design-zinc-400 mb-2">No payouts yet</p>
            <p className="text-xs md:text-sm text-design-zinc-600">Complete tasks to earn rewards</p>
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            <div className="md:hidden">
              {payouts.map((payout, i) => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 border-b border-design-zinc-800/50 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-white mb-1">{payout.source}</div>
                      <div className="text-xs text-design-zinc-400">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400 mb-1">
                        ${payout.amount.toLocaleString()}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        payout.status === 'paid' || payout.status === 'claimed'
                          ? 'bg-green-500/20 text-green-400'
                          : payout.status === 'claimable'
                          ? 'bg-design-purple-500/20 text-design-purple-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {(payout.status === 'paid' || payout.status === 'claimed') && <Check className="w-3 h-3" />}
                        {payout.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-design-zinc-800">
                    <th className="text-left p-4 text-sm font-medium text-design-zinc-400">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-design-zinc-400">Source</th>
                    <th className="text-right p-4 text-sm font-medium text-design-zinc-400">Amount</th>
                    <th className="text-right p-4 text-sm font-medium text-design-zinc-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout, i) => (
                    <motion.tr
                      key={payout.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-design-zinc-800/50 hover:bg-design-zinc-800/30 transition-colors"
                    >
                      <td className="p-4 text-sm text-design-zinc-300">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-white font-medium">{payout.source}</td>
                      <td className="p-4 text-right text-sm font-bold text-green-400">
                        ${payout.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          payout.status === 'paid' || payout.status === 'claimed'
                            ? 'bg-green-500/20 text-green-400'
                            : payout.status === 'claimable'
                            ? 'bg-design-purple-500/20 text-design-purple-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {(payout.status === 'paid' || payout.status === 'claimed') && <Check className="w-3 h-3" />}
                          {payout.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
