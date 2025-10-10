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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Earnings</h1>
            <p className="text-design-zinc-400">Track your payments and claim rewards</p>
          </div>
          <PremiumButton variant="primary">
            <Wallet size={16} />
            Connect Wallet
          </PremiumButton>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">Total Earnings</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">${totalEarnings.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-sm text-green-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>All-time</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-design-purple-500/10 border border-design-purple-500/20">
              <TrendingUp className="w-5 h-5 text-design-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Claimable</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">${claimable.toLocaleString()}</div>
          <PremiumButton variant="ghost" className="mt-2" size="sm">
            Claim Now
          </PremiumButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Wallet className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white">Pending</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">${pending.toLocaleString()}</div>
          <p className="text-sm text-design-zinc-500">Under review</p>
        </motion.div>
      </div>

      {/* Payouts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 overflow-hidden"
      >
        <div className="p-6 border-b border-design-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Payouts</h2>
          <PremiumButton variant="ghost" size="sm">
            <Download size={16} />
            Export
          </PremiumButton>
        </div>

        {payouts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-design-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-design-zinc-600" />
            </div>
            <p className="text-design-zinc-400 mb-2">No payouts yet</p>
            <p className="text-sm text-design-zinc-600">Complete tasks to earn rewards</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
        )}
      </motion.div>
    </div>
  )
}
