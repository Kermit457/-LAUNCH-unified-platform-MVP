'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ShoppingCart } from 'lucide-react'
import { CurveCard, TradeModal, LaunchOneClick, HoldersTable, CurveStatsBadge, Button } from '@/components/design-system'
import { useCurve } from '@/hooks/useCurve'

interface EntityCurveSectionProps {
  ownerType: 'user' | 'project'
  ownerId: string
  ownerName?: string
  currentUserId?: string
  userBalance?: number
}

export const EntityCurveSection = ({
  ownerType,
  ownerId,
  ownerName,
  currentUserId,
  userBalance = 0
}: EntityCurveSectionProps) => {
  const [curveId, setCurveId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy')

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

  const isOwner = (ownerType === 'user' && ownerId === currentUserId)

  // Fetch or create curve on mount
  useEffect(() => {
    const fetchOrCreateCurve = async () => {
      setIsCreating(true)
      try {
        // Try to fetch existing curve
        const response = await fetch(
          `/api/curve/owner?ownerType=${ownerType}&ownerId=${ownerId}`
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
              ownerType,
              ownerId
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
  }, [ownerType, ownerId])

  if (isCreating || isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin mx-auto mb-4" />
            <div className="text-gray-400">
              Loading {ownerType === 'user' ? 'creator' : 'project'} curve...
            </div>
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

  const handleBuyKeys = async (keys: number) => {
    await buyKeys(keys)
  }

  const handleSellKeys = async (keys: number) => {
    await sellKeys(keys)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            {ownerType === 'user' ? 'Creator Keys' : 'Project Keys'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {ownerType === 'user'
              ? 'Support this creator by buying their keys. Keys give you access to exclusive content and benefits.'
              : 'Back this project by buying keys. Early supporters get the best prices and exclusive perks.'
            }
          </p>
        </div>

        {/* Primary CTA - Buy Keys */}
        {curve.state === 'active' && (
          <Button
            onClick={() => {
              setTradeMode('buy')
              setShowTradeModal(true)
            }}
            variant="primary"
            className="bg-gradient-to-r from-lime-500 to-pink-600 hover:from-lime-600 hover:to-pink-700 px-6 py-3"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buy Keys
          </Button>
        )}
      </div>

      {/* Curve Stats Badges */}
      <div className="flex flex-wrap gap-3">
        <CurveStatsBadge
          icon={TrendingUp}
          label="Price"
          value={`${(curve.price || 0).toFixed(6)} SOL`}
        />
        <CurveStatsBadge
          icon={Users}
          label="Holders"
          value={curve.holders || 0}
        />
        <CurveStatsBadge
          icon={DollarSign}
          label="Reserve"
          value={`${(curve.reserve || 0).toFixed(2)} SOL`}
        />
        <CurveStatsBadge
          icon={Activity}
          label="24h Vol"
          value={`${(curve.volume24h || 0).toFixed(2)} SOL`}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Curve Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Curve Card */}
          <CurveCard curve={curve} variant="default" />

          {/* Launch Widget (Owner Only) */}
          {isOwner && (
            <LaunchOneClick
              curve={curve}
              isOwner={isOwner}
              userId={currentUserId}
              onLaunch={async (p0) => {
                await launch(p0)
              }}
            />
          )}

          {/* Top Holders */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Top Supporters</h3>
            {holders.length > 0 ? (
              <HoldersTable
                holders={holders}
                currentPrice={curve.price}
                showPnL={true}
                maxRows={10}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No holders yet. Be the first to buy keys!
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-6">
          {/* Your Position (if holder) */}
          {holder && holder.balance > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-lime-500/10 to-blue-500/10 border border-lime-500/30 rounded-2xl p-6"
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

              {/* Quick Sell Button */}
              {curve.state === 'active' && (
                <Button
                  onClick={() => {
                    setTradeMode('sell')
                    setShowTradeModal(true)
                  }}
                  variant="secondary"
                  className="w-full mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sell Keys
                </Button>
              )}
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="space-y-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-lime-400" />
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
                {curve.holders}
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
            {events.length > 0 ? (
              <div className="space-y-2">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      {event.type === 'buy' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : event.type === 'sell' ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-lime-400" />
                      )}
                      <div>
                        <div className={`text-sm font-medium ${
                          event.type === 'buy' ? 'text-green-400' :
                          event.type === 'sell' ? 'text-red-400' : 'text-lime-400'
                        }`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {event.keys && (
                        <div className="text-sm text-white font-medium">
                          {event.keys.toFixed(2)} keys
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {event.amount.toFixed(4)} SOL
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No activity yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <TradeModal
          curve={curve}
          mode={tradeMode}
          userKeys={userKeys}
          userBalance={userBalance}
          referrerId={typeof window !== 'undefined' ? localStorage.getItem('referrerId') || undefined : undefined}
          onClose={() => setShowTradeModal(false)}
          onTrade={tradeMode === 'buy' ? handleBuyKeys : handleSellKeys}
        />
      )}
    </div>
  )
}
