'use client'

import { useState, useEffect } from 'react'
import { Wallet, Copy, Check, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { CopyButton } from '@/components/common/CopyButton'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import { getPayouts, claimPayout } from '@/lib/appwrite/services/payouts'
import { getSubmissions } from '@/lib/appwrite/services/submissions'
import type { Payout as AppwritePayout } from '@/lib/appwrite/services/payouts'

type DashboardPayout = {
  id: string
  source: string
  amount: number
  mint: 'USDC' | 'SOL'
  fee?: number
  net?: number
  status: string
  createdAt: number
  paidAt?: number
  txHash?: string
}

export default function EarningsPage() {
  const { user, userId } = useUser()
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [payouts, setPayouts] = useState<DashboardPayout[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [earningsBySource, setEarningsBySource] = useState<{ [key: string]: number }>({})

  const walletAddress = 'FRENw...x7gH2'

  // Fetch campaigns, payouts, and submissions
  useEffect(() => {
    async function fetchData() {
      if (!userId) return

      try {
        setLoading(true)
        const [campaignsData, payoutsData, submissionsData] = await Promise.all([
          getCampaigns({ createdBy: userId }),
          getPayouts({ userId: userId }),
          getSubmissions({ userId: userId, status: 'approved' })
        ])

        setCampaigns(campaignsData)

        // Calculate total earnings from approved submissions
        const total = submissionsData.reduce((sum, sub) => sum + (sub.earnings || 0), 0)
        setTotalEarnings(total)

        // Calculate earnings by source (campaign/quest)
        const bySource: { [key: string]: number } = {}
        submissionsData.forEach(sub => {
          const source = sub.campaignId || sub.questId || 'Unknown'
          bySource[source] = (bySource[source] || 0) + (sub.earnings || 0)
        })
        setEarningsBySource(bySource)

        // Convert Appwrite payouts to dashboard format
        const converted: DashboardPayout[] = payoutsData.map(p => ({
          id: p.$id,
          source: p.campaignId || p.questId || 'campaign',
          amount: p.amount,
          mint: p.currency === 'SOL' ? 'SOL' : 'USDC',
          fee: p.fee,
          net: p.net,
          status: p.status,
          createdAt: new Date(p.$createdAt).getTime(),
          paidAt: p.paidAt ? new Date(p.paidAt).getTime() : undefined,
          txHash: p.txHash
        }))
        setPayouts(converted)
      } catch (error) {
        console.error('Failed to fetch earnings data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Calculate escrow summary per campaign
  const escrowSummary = campaigns.map(c => ({
    campaignName: c.title,
    locked: 0,
    available: (c.budget || 0) - (c.budgetPaid || 0),
    spent: c.budgetPaid || 0,
    mint: 'USDC' as const
  }))

  const claimablePayouts = payouts.filter(p => p.status === 'claimable')
  const paidPayouts = payouts.filter(p => p.status === 'claimed' || p.status === 'paid')

  const totalClaimable = claimablePayouts.reduce((sum, p) => sum + (p.net || p.amount), 0)

  const togglePayout = (id: string) => {
    const next = new Set(selectedPayouts)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedPayouts(next)
  }

  const toggleAll = () => {
    if (selectedPayouts.size === claimablePayouts.length) {
      setSelectedPayouts(new Set())
    } else {
      setSelectedPayouts(new Set(claimablePayouts.map(p => p.id)))
    }
  }

  const handleClaimSelected = async () => {
    if (selectedPayouts.size === 0) return

    try {
      // Claim each selected payout
      await Promise.all(
        Array.from(selectedPayouts).map(id => claimPayout(id))
      )

      // Update local state
      setPayouts(payouts.map(p =>
        selectedPayouts.has(p.id) ? { ...p, status: 'claimed', paidAt: Date.now() } : p
      ))

      // Clear selection
      setSelectedPayouts(new Set())

      alert(`Successfully claimed ${selectedPayouts.size} payout(s)!`)
    } catch (error) {
      console.error('Failed to claim payouts:', error)
      alert('Failed to claim payouts. Please try again.')
    }
  }

  const getMintBadge = (mint: 'USDC' | 'SOL') => (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
      mint === 'USDC' ? 'bg-green-500/20 text-green-300' : 'bg-purple-500/20 text-purple-300'
    )}>
      {mint}
    </span>
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white/60">Loading earnings data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Wallet Panel */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="text-sm text-white/50">Connected Wallet (Solana)</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-white">{walletAddress}</span>
                <CopyButton text="FRENwABC123XYZ789x7gH2" />
              </div>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View on Solscan
          </button>
        </div>
      </div>

      {/* Total Earnings Summary */}
      <div className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Total Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-white/50 mb-1">Total Earned</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ${totalEarnings.toFixed(2)}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-white/50 mb-1">Claimable</div>
            <div className="text-3xl font-bold text-cyan-400">
              ${totalClaimable.toFixed(2)}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-white/50 mb-1">Total Claimed</div>
            <div className="text-3xl font-bold text-white">
              ${paidPayouts.reduce((sum, p) => sum + (p.net || p.amount), 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        {Object.keys(earningsBySource).length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white/70 mb-3">Earnings by Source</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(earningsBySource).map(([source, amount]) => (
                <div key={source} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-white/70 truncate flex-1">{source}</span>
                  <span className="text-sm font-bold text-green-400 ml-2">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Escrow Summary */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Campaign Escrow Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-white/50 pb-3">Campaign</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Locked</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Available</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Spent</th>
              </tr>
            </thead>
            <tbody>
              {escrowSummary.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-3 text-sm text-white">{row.campaignName}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-white">${row.locked.toFixed(2)}</span>
                      {getMintBadge(row.mint)}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-green-300">${row.available.toFixed(2)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm text-white/50">${row.spent.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claimable Payouts */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Claimable Payouts</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">
              Total: <span className="text-green-300 font-bold">${totalClaimable.toFixed(2)}</span>
            </span>
            <button
              onClick={handleClaimSelected}
              disabled={selectedPayouts.size === 0}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                selectedPayouts.size > 0
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              )}
            >
              Claim Selected ({selectedPayouts.size})
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="w-8 pb-3">
                  <input
                    type="checkbox"
                    checked={selectedPayouts.size === claimablePayouts.length && claimablePayouts.length > 0}
                    onChange={toggleAll}
                    className="rounded border-white/20 bg-white/5"
                  />
                </th>
                <th className="text-left text-xs font-medium text-white/50 pb-3">Source</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Amount</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Fee</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Net</th>
                <th className="text-center text-xs font-medium text-white/50 pb-3">Status</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {claimablePayouts.map((payout) => (
                <tr key={payout.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.has(payout.id)}
                      onChange={() => togglePayout(payout.id)}
                      className="rounded border-white/20 bg-white/5"
                    />
                  </td>
                  <td className="py-3 text-sm text-white capitalize">{payout.source}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-white">${payout.amount.toFixed(2)}</span>
                      {getMintBadge(payout.mint)}
                    </div>
                  </td>
                  <td className="py-3 text-right text-sm text-white/50">
                    ${payout.fee?.toFixed(2) || '0.00'}
                  </td>
                  <td className="py-3 text-right text-sm text-green-300 font-medium">
                    ${payout.net?.toFixed(2) || payout.amount.toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <StatusBadge status={payout.status as any} />
                  </td>
                  <td className="py-3 text-right text-sm text-white/50">
                    {new Date(payout.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-white/50 pb-3">Source</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Amount</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Net</th>
                <th className="text-center text-xs font-medium text-white/50 pb-3">Status</th>
                <th className="text-left text-xs font-medium text-white/50 pb-3">Transaction</th>
                <th className="text-right text-xs font-medium text-white/50 pb-3">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {paidPayouts.map((payout) => (
                <tr key={payout.id} className="border-b border-white/5">
                  <td className="py-3 text-sm text-white capitalize">{payout.source}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-white">${payout.amount.toFixed(2)}</span>
                      {getMintBadge(payout.mint)}
                    </div>
                  </td>
                  <td className="py-3 text-right text-sm text-white">
                    ${payout.net?.toFixed(2) || payout.amount.toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <StatusBadge status={payout.status as any} />
                  </td>
                  <td className="py-3">
                    {payout.txHash && (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white/50">{payout.txHash.slice(0, 8)}...</span>
                        <CopyButton text={payout.txHash} />
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-right text-sm text-white/50">
                    {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
