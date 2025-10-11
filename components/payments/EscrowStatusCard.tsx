'use client'

import { motion } from 'framer-motion'
import { Lock, CheckCircle, Clock, XCircle, Users, DollarSign, ExternalLink, AlertTriangle } from 'lucide-react'

export type EscrowStatus = 'funded' | 'pending' | 'released' | 'cancelled' | 'partial'

interface EscrowStatusCardProps {
  escrowId?: string
  status: EscrowStatus
  totalAmount: number
  releasedAmount?: number
  participantsTotal: number
  participantsPaid?: number
  deadline?: string
  onRelease?: () => void
  onCancel?: () => void
  compact?: boolean
}

export function EscrowStatusCard({
  escrowId,
  status,
  totalAmount,
  releasedAmount = 0,
  participantsTotal,
  participantsPaid = 0,
  deadline,
  onRelease,
  onCancel,
  compact = false
}: EscrowStatusCardProps) {
  // Status configurations
  const statusConfig = {
    funded: {
      icon: Lock,
      label: 'Escrowed',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      description: 'Funds secured and ready for distribution'
    },
    pending: {
      icon: Clock,
      label: 'Pending',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      description: 'Awaiting escrow funding'
    },
    released: {
      icon: CheckCircle,
      label: 'Paid Out',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      description: 'All payments completed'
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelled',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      description: 'Escrow cancelled and refunded'
    },
    partial: {
      icon: AlertTriangle,
      label: 'Partially Paid',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      description: 'Some payments completed'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon
  const remaining = totalAmount - releasedAmount
  const percentPaid = totalAmount > 0 ? (releasedAmount / totalAmount) * 100 : 0

  // Compact version for campaign cards
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
        <span className="text-xs text-zinc-400">◎{totalAmount.toFixed(2)}</span>
      </div>
    )
  }

  // Full version
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 ${config.bgColor} opacity-20 blur-xl rounded-2xl`} />

      <div className={`relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border ${config.borderColor}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{config.label}</h3>
                {escrowId && (
                  <a
                    href={`https://explorer.solana.com/address/${escrowId}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-white/5 rounded transition-colors"
                    title="View on Solana Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-400" />
                  </a>
                )}
              </div>
              <p className="text-sm text-zinc-500">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Amount Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Total Escrow</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">◎{totalAmount.toFixed(2)}</p>
            <p className="text-xs text-zinc-500 mt-1">≈ ${(totalAmount * 140).toFixed(2)} USD</p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Participants</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {participantsPaid}/{participantsTotal}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {participantsTotal > 0
                ? `${((participantsPaid / participantsTotal) * 100).toFixed(0)}% paid`
                : 'Awaiting submissions'
              }
            </p>
          </div>
        </div>

        {/* Progress Bar (if partial release) */}
        {status === 'partial' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500">Payment Progress</span>
              <span className="text-xs font-semibold text-white">{percentPaid.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentPaid}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-green-400">Released: ◎{releasedAmount.toFixed(2)}</span>
              <span className="text-xs text-zinc-500">Remaining: ◎{remaining.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Deadline */}
        {deadline && status !== 'released' && status !== 'cancelled' && (
          <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-400">
                Deadline: {new Date(deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {status === 'funded' && (onRelease || onCancel) && (
          <div className="flex gap-3 pt-4 border-t border-white/10">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-all text-sm font-semibold"
              >
                Cancel & Refund
              </button>
            )}
            {onRelease && (
              <button
                onClick={onRelease}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all text-sm"
              >
                Release Payment
              </button>
            )}
          </div>
        )}

        {/* Escrow ID (small print) */}
        {escrowId && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-zinc-600 font-mono break-all">
              Escrow: {escrowId}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
