'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, DollarSign, Rocket, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Curve, CurveHolder } from '@/types/curve'

interface CurveDashboardWidgetProps {
  userId: string
}

export const CurveDashboardWidget = ({ userId }: CurveDashboardWidgetProps) => {
  const [userCurve, setUserCurve] = useState<Curve | null>(null)
  const [holdings, setHoldings] = useState<Array<{ curve: Curve; holder: CurveHolder }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch user's own curve
        const curveResponse = await fetch(`/api/curve/owner?ownerType=user&ownerId=${userId}`)
        if (curveResponse.ok) {
          const data = await curveResponse.json()
          setUserCurve(data.curve)
        }

        // Fetch user's holdings (would need a new API endpoint)
        // For now, showing placeholder
      } catch (err) {
        console.error('Failed to fetch curve data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const totalPortfolioValue = holdings.reduce((sum, { curve, holder }) => {
    return sum + (holder.balance * curve.price)
  }, 0)

  const totalPnL = holdings.reduce((sum, { holder }) => {
    return sum + holder.realizedPnl + holder.unrealizedPnl
  }, 0)

  return (
    <div className="space-y-6">
      {/* Your Curve Stats */}
      {userCurve && (
        <div className="bg-gradient-to-br from-lime-500/10 to-blue-500/10 border border-lime-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Your Creator Curve</h3>
            <Link
              href={`/profile/${userId}`}
              className="text-lime-400 hover:text-lime-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Current Price</div>
              <div className="text-lg font-bold text-white">
                {(userCurve.price || 0).toFixed(6)} SOL
              </div>
            </div>
            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Holders</div>
              <div className="text-lg font-bold text-white">
                {userCurve.holders || 0}
              </div>
            </div>
            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Market Cap</div>
              <div className="text-lg font-bold text-white">
                {(userCurve.marketCap || 0).toFixed(2)} SOL
              </div>
            </div>
            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
              <div className="text-xs text-gray-400 mb-1">24h Volume</div>
              <div className="text-lg font-bold text-white">
                {(userCurve.volume24h || 0).toFixed(2)} SOL
              </div>
            </div>
          </div>

          {/* State Badge */}
          <div className="flex items-center gap-2">
            {userCurve.state === 'active' && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Active Trading
              </span>
            )}
            {userCurve.state === 'frozen' && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                Frozen - Ready to Launch
              </span>
            )}
            {userCurve.state === 'launched' && (
              <span className="px-3 py-1 bg-lime-500/20 text-lime-400 rounded-full text-xs font-medium flex items-center gap-1">
                <Rocket className="w-3 h-3" />
                Launched
              </span>
            )}
          </div>
        </div>
      )}

      {/* Portfolio Overview */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Your Keys Portfolio</h3>

        {holdings.length > 0 ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <DollarSign className="w-4 h-4" />
                  Total Value
                </div>
                <div className="text-2xl font-bold text-white">
                  {totalPortfolioValue.toFixed(4)} SOL
                </div>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  {totalPnL >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  Total P&L
                </div>
                <div className={`text-2xl font-bold ${
                  totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(4)} SOL
                </div>
              </div>
            </div>

            {/* Holdings List */}
            <div className="space-y-2">
              {holdings.slice(0, 5).map(({ curve, holder }) => (
                <Link
                  key={curve.id}
                  href={`/profile/${curve.ownerId}`}
                  className="block p-3 bg-black/20 rounded-lg border border-white/5 hover:border-lime-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {holder.balance.toFixed(2)} keys
                      </div>
                      <div className="text-xs text-gray-500">
                        @ {holder.avgPrice.toFixed(4)} SOL avg
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">
                        {(holder.balance * curve.price).toFixed(4)} SOL
                      </div>
                      <div className={`text-xs ${
                        (holder.realizedPnl + holder.unrealizedPnl) >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {(holder.realizedPnl + holder.unrealizedPnl) >= 0 ? '+' : ''}
                        {(holder.realizedPnl + holder.unrealizedPnl).toFixed(4)} SOL
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <div className="text-gray-400 mb-2">No keys held yet</div>
            <div className="text-sm text-gray-600">
              Support creators by buying their keys
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!userCurve && (
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="text-sm text-amber-400 mb-2">
            💡 Create your creator curve to let supporters buy your keys
          </div>
          <button className="text-xs text-amber-300 hover:text-amber-200 underline">
            Learn more about creator curves
          </button>
        </div>
      )}
    </div>
  )
}
