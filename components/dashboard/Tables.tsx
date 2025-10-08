"use client"

import { Campaign, Submission, Payout } from '@/lib/types'
import { fmtMoney } from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import { ProgressBar } from './ProgressBar'
import { CopyButton } from '../common/CopyButton'
import { ExternalLink, Pause, Play, Edit, DollarSign, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

// Campaign Table
interface CampaignTableProps {
  campaigns: Campaign[]
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onEdit?: (campaign: Campaign) => void
  onTopUp?: (id: string, amount: number) => void
  onReview?: (id: string) => void
}

export function CampaignTable({ campaigns, onPause, onResume, onEdit, onTopUp, onReview }: CampaignTableProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="rounded-2xl bg-neutral-900/70 border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Type</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Budget</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Rate</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Ends</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const spent = campaign.budget.spent.amount
              const total = campaign.budget.total.amount

              return (
                <tr key={campaign.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-medium text-white">{campaign.name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-white/70 capitalize">{campaign.type}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2 min-w-[200px]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">
                          {fmtMoney(campaign.budget.spent)} / {fmtMoney(campaign.budget.total)}
                        </span>
                      </div>
                      <ProgressBar value={spent} max={total} showPercentage={false} />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-white">
                      {campaign.rate.kind === 'cpm'
                        ? `$${campaign.rate.value} CPM`
                        : `$${campaign.rate.value}/task`}
                    </div>
                    <div className="text-xs text-white/50">{campaign.rate.mint}</div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={campaign.status as any} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-white/70">
                      {campaign.endsAt ? formatDate(campaign.endsAt) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {onReview && (
                        <button
                          onClick={() => onReview(campaign.id)}
                          className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 transition-all"
                          aria-label="Review Submissions"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                      {campaign.status === 'live' && onPause && (
                        <button
                          onClick={() => onPause(campaign.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                          aria-label="Pause"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {campaign.status === 'paused' && onResume && (
                        <button
                          onClick={() => onResume(campaign.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                          aria-label="Resume"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {(campaign.status as any) !== 'ended' && onEdit && (
                        <button
                          onClick={() => onEdit(campaign)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {(campaign.status as any) !== 'ended' && onTopUp && (
                        <button
                          onClick={() => {
                            const amount = prompt('Enter top-up amount in USDC:')
                            if (amount) onTopUp(campaign.id, parseFloat(amount))
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-all"
                        >
                          Top-up
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Submission Table
interface SubmissionTableProps {
  submissions: Submission[]
  onRowClick?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onNeedsFix?: (id: string) => void
  selectedIds?: string[]
  onSelectChange?: (ids: string[]) => void
}

export function SubmissionTable({
  submissions,
  onRowClick,
  onApprove,
  onReject,
  onNeedsFix,
  selectedIds = [],
  onSelectChange
}: SubmissionTableProps) {
  const handleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      onSelectChange?.([])
    } else {
      onSelectChange?.(submissions.map(s => s.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectChange?.(selectedIds.filter(sid => sid !== id))
    } else {
      onSelectChange?.([...selectedIds, id])
    }
  }

  const getCheckBadge = (pass: boolean, label: string) => (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
      pass ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
    )}>
      {pass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  )

  return (
    <div className="rounded-2xl bg-neutral-900/70 border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === submissions.length && submissions.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-white/20 bg-white/5"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">User</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Campaign</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Platform</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Link</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Auto-checks</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Views</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Reward</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Status</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(sub.id)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(sub.id)}
                    onChange={() => handleSelectOne(sub.id)}
                    className="rounded border-white/20 bg-white/5"
                  />
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white">{sub.userId}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white/70">{sub.campaignId || (sub as any).questId || 'N/A'}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white/70 capitalize">-</span>
                </td>
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={(sub as any).mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </a>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-white/50">N/A</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white font-medium">{((sub as any).views || 0).toLocaleString('en-US')}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-white font-medium">${(sub.earnings || 0).toFixed(2)}</div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={sub.status} />
                </td>
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  {sub.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      {onApprove && (
                        <button
                          onClick={() => onApprove(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-all"
                        >
                          Approve
                        </button>
                      )}
                      {onNeedsFix && (
                        <button
                          onClick={() => onNeedsFix(sub.id)}
                          className="p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 transition-all"
                          aria-label="Needs fix"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={() => onReject(sub.id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all"
                          aria-label="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Payout Table
interface PayoutTableProps {
  payouts: Payout[]
  selectedIds?: string[]
  onSelectChange?: (ids: string[]) => void
}

export function PayoutTable({ payouts, selectedIds = [], onSelectChange }: PayoutTableProps) {
  const handleSelectAll = () => {
    const claimable = payouts.filter(p => (p.status as any) === 'claimable')
    if (selectedIds.length === claimable.length) {
      onSelectChange?.([])
    } else {
      onSelectChange?.(claimable.map(p => p.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectChange?.(selectedIds.filter(pid => pid !== id))
    } else {
      onSelectChange?.([...selectedIds, id])
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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
    <div className="rounded-2xl bg-neutral-900/70 border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === payouts.filter(p => (p.status as any) === 'claimable').length}
                  onChange={handleSelectAll}
                  className="rounded border-white/20 bg-white/5"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Source</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Fee</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Net</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Tx</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white/70">Date</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-4">
                  {(payout.status as any) === 'claimable' && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(payout.id)}
                      onChange={() => handleSelectOne(payout.id)}
                      className="rounded border-white/20 bg-white/5"
                    />
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white capitalize">{(payout as any).source}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">
                      {(payout as any).mint === 'USDC' ? `$${payout.amount.toFixed(2)}` : `${payout.amount.toFixed(3)} SOL`}
                    </span>
                    {getMintBadge((payout as any).mint)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white/60">
                    {(payout as any).fee ? ((payout as any).mint === 'USDC' ? `$${(payout as any).fee.toFixed(2)}` : `${(payout as any).fee.toFixed(3)} SOL`) : '—'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white font-medium">
                    {(payout as any).net ? ((payout as any).mint === 'USDC' ? `$${(payout as any).net.toFixed(2)}` : `${(payout as any).net.toFixed(3)} SOL`) : '—'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={payout.status as any} />
                </td>
                <td className="px-4 py-4">
                  {(payout as any).txHash ? (
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-white/70 font-mono">
                        {(payout as any).txHash.slice(0, 4)}...{(payout as any).txHash.slice(-4)}
                      </code>
                      <CopyButton text={(payout as any).txHash} />
                    </div>
                  ) : (
                    <span className="text-sm text-white/40">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-white/60">
                    {formatDate(payout.paidAt || payout.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
