'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity } from 'lucide-react'
import { CurveCard, TradePanel, LaunchWidget, HoldersTable } from '@/components/design-system'
import { useCurve } from '@/hooks/useCurve'

interface ProfileCurveSectionProps {
  profileUserId: string
  currentUserId?: string
  userBalance?: number
}

export const ProfileCurveSection = ({
  profileUserId,
  currentUserId,
  userBalance = 0
}: ProfileCurveSectionProps) => {
  const [curveId, setCurveId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const {
    curve,
    holder,
    holders,
    events,
    isLoading,
    error,
    buyKeys,
    sellKeys,
    freeze,
    launch
  } = useCurve(curveId, currentUserId)

  const isOwner = profileUserId === currentUserId

  // Fetch or create curve on mount
  useEffect(() => {
    const fetchOrCreateCurve = async () => {
      setIsCreating(true)
      try {
        // Try to fetch existing curve
        const response = await fetch(
          `/api/curve/owner?ownerType=user&ownerId=${profileUserId}`
        )

        if (response.ok) {
          const data = await response.json()
          setCurveId(data.curve.$id)
        } else if (response.status === 404) {
          // Create curve if it doesn't exist
          const createResponse = await fetch('/api/curve/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ownerType: 'user',
              ownerId: profileUserId
            })
          })

          if (createResponse.ok) {
            const createData = await createResponse.json()
            setCurveId(createData.curve.$id)
          }
        }
      } catch (err) {
        console.error('Failed to fetch/create curve:', err)
      } finally {
        setIsCreating(false)
      }
    }

    fetchOrCreateCurve()
  }, [profileUserId])

  if (isCreating || isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <div className="text-gray-400">Loading creator curve...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !curve) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="text-center text-red-400">
          {error || 'Failed to load curve'}
        </div>
      </div>
    )
  }

  const userKeys = holder?.balance || 0

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          Creator Keys
        </h2>
        <p className="text-zinc-400 text-sm">
          Support this creator by buying their keys. Keys give you access to exclusive content and benefits.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Curve Stats & Trade */}
        <div className="lg:col-span-2 space-y-6">
          {/* Curve Card */}
          <CurveCard curve={curve} variant="default" />

          {/* Trade Panel */}
          {curve.state === 'active' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Trade Keys</h3>
              <TradePanel
                curve={curve}
                userBalance={userBalance}
                userKeys={userKeys}
                referrerId={localStorage.getItem('referrerId') || undefined}
                onTrade={async (action, amount) => {
                  if (action === 'buy') {
                    await buyKeys(amount)
                  } else {
                    await sellKeys(amount)
                  }
                }}
              />
            </div>
          )}

          {/* Launch Widget (Owner Only) */}
          {isOwner && (
            <LaunchWidget
              curve={curve}
              isOwner={isOwner}
              onFreeze={freeze}
              onLaunch={async (tokenMint: string) => {
                await launch()
              }}
            />
          )}

          {/* Top Holders */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Top Supporters</h3>
            <HoldersTable
              holders={holders}
              currentPrice={curve.price}
              showPnL={true}
              maxRows={10}
            />
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-6">
          {/* Your Position (if holder) */}
          {holder && holder.balance > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Your Position</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Keys Held</span>
                  <span className="text-white font-bold">{holder.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Price</span>
                  <span className="text-white">{holder.avgPrice.toFixed(4)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Invested</span>
                  <span className="text-white">{holder.totalInvested.toFixed(4)} SOL</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Value</span>
                    <span className="text-white font-bold">
                      {(holder.balance * curve.price).toFixed(4)} SOL
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-400">Total P&L</span>
                    <span className={`font-bold ${
                      (holder.realizedPnl + holder.unrealizedPnl) > 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {(holder.realizedPnl + holder.unrealizedPnl) >= 0 ? '+' : ''}
                      {(holder.realizedPnl + holder.unrealizedPnl).toFixed(4)} SOL
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="space-y-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Current Price</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(curve.price || 0).toFixed(6)} SOL
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Total Holders</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {curve.holders || 0}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Market Cap</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(curve.marketCap || 0).toFixed(2)} SOL
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span className="text-gray-400 text-sm">24h Volume</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(curve.volume24h || 0).toFixed(2)} SOL
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    {event.type === 'buy' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <div className={`text-sm font-medium ${
                        event.type === 'buy' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {event.type === 'buy' ? 'Buy' : 'Sell'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white font-medium">
                      {event.keys?.toFixed(2)} keys
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.amount.toFixed(4)} SOL
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
