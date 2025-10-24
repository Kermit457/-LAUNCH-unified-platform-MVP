'use client'

import { motion } from 'framer-motion'
import { Trophy, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'
import type { CurveHolder } from '@/types/curve'

interface HoldersTableProps {
  holders: CurveHolder[]
  currentPrice: number
  showPnL?: boolean
  maxRows?: number
}

export const HoldersTable = ({
  holders,
  currentPrice,
  showPnL = true,
  maxRows = 10
}: HoldersTableProps) => {
  const displayHolders = holders.slice(0, maxRows)

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-4 h-4 text-yellow-400" />
    if (index === 1) return <Trophy className="w-4 h-4 text-gray-300" />
    if (index === 2) return <Trophy className="w-4 h-4 text-amber-600" />
    return <span className="text-gray-500 text-sm">#{index + 1}</span>
  }

  const getPnLDisplay = (holder: CurveHolder) => {
    const totalPnl = holder.realizedPnl + holder.unrealizedPnl
    const pnlPercent = holder.totalInvested > 0
      ? (totalPnl / holder.totalInvested) * 100
      : 0

    return { totalPnl, pnlPercent }
  }

  if (holders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-2">No holders yet</div>
        <div className="text-sm text-gray-600">Be the first to buy keys!</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Holder
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Keys
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Avg Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Value
            </th>
            {showPnL && (
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                P&L
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {displayHolders.map((holder, index) => {
            const { totalPnl, pnlPercent } = getPnLDisplay(holder)
            const currentValue = holder.balance * currentPrice

            return (
              <motion.tr
                key={holder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors"
              >
                {/* Rank */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index)}
                  </div>
                </td>

                {/* Holder Address */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-white font-mono">
                      {holder.userId.slice(0, 6)}...{holder.userId.slice(-4)}
                    </code>
                    <a
                      href={`/u/${holder.userId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-lime-400 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </td>

                {/* Keys Balance */}
                <td className="px-4 py-4 text-right">
                  <div className="text-white font-medium">
                    {holder.balance.toFixed(2)}
                  </div>
                </td>

                {/* Average Price */}
                <td className="px-4 py-4 text-right">
                  <div className="text-gray-400 text-sm">
                    {holder.avgPrice.toFixed(4)} SOL
                  </div>
                </td>

                {/* Current Value */}
                <td className="px-4 py-4 text-right">
                  <div className="text-white font-medium">
                    {currentValue.toFixed(4)} SOL
                  </div>
                  <div className="text-xs text-gray-500">
                    Invested: {holder.totalInvested.toFixed(4)}
                  </div>
                </td>

                {/* P&L */}
                {showPnL && (
                  <td className="px-4 py-4 text-right">
                    <div className={`
                      flex items-center justify-end gap-1 font-medium
                      ${totalPnl > 0 ? 'text-green-400' : totalPnl < 0 ? 'text-red-400' : 'text-gray-400'}
                    `}>
                      {totalPnl > 0 && <TrendingUp className="w-3 h-3" />}
                      {totalPnl < 0 && <TrendingDown className="w-3 h-3" />}
                      {totalPnl === 0 && <Minus className="w-3 h-3" />}
                      <span>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(4)}</span>
                    </div>
                    <div className={`
                      text-xs
                      ${pnlPercent > 0 ? 'text-green-400' : pnlPercent < 0 ? 'text-red-400' : 'text-gray-500'}
                    `}>
                      {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                    </div>
                  </td>
                )}
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {holders.length > maxRows && (
        <div className="px-4 py-3 text-center text-sm text-gray-500 border-t border-white/5">
          Showing top {maxRows} of {holders.length} holders
        </div>
      )}
    </div>
  )
}
