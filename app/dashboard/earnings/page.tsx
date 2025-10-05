'use client'

import { useState } from 'react'
import { Wallet, Copy, Check, ExternalLink } from 'lucide-react'
import { mockCampaigns, mockPayouts } from '@/lib/dashboardData'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { CopyButton } from '@/components/common/CopyButton'
import { cn } from '@/lib/utils'

export default function EarningsPage() {
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set())

  const walletAddress = 'FRENw...x7gH2'

  // Calculate escrow summary per campaign
  const escrowSummary = mockCampaigns.map(c => ({
    campaignName: c.name,
    locked: c.budget.locked.amount,
    available: c.budget.total.amount - c.budget.locked.amount - c.budget.spent.amount,
    spent: c.budget.spent.amount,
    mint: c.budget.total.mint
  }))

  const claimablePayouts = mockPayouts.filter(p => p.status === 'claimable')
  const paidPayouts = mockPayouts.filter(p => p.status === 'paid')

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

  const handleClaimSelected = () => {
    alert(`Claiming ${selectedPayouts.size} payouts (mock action)`)
  }

  const getMintBadge = (mint: 'USDC' | 'SOL') => (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
      mint === 'USDC' ? 'bg-green-500/20 text-green-300' : 'bg-purple-500/20 text-purple-300'
    )}>
      {mint}
    </span>
  )

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
                    <StatusBadge status={payout.status} />
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
                    <StatusBadge status={payout.status} />
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
