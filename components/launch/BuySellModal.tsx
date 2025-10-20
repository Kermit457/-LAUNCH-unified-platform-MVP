"use client"

import { useState, useEffect } from 'react'
import { X, TrendingUp, Wallet, AlertCircle, ArrowRight, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

// Helper to format numbers consistently on client and server
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

type BuySellModalProps = {
  open: boolean
  onClose: () => void
  mode: 'buy' | 'sell' | 'manage'
  data: {
    title: string
    logoUrl?: string
    currentPrice: number
    myKeys: number
    mySharePct: number
    totalSupply: number
    priceChange24h?: number
    estLaunchTokens?: number | null
  }
  onBuy?: (amount: number) => Promise<void>
  onSell?: (amount: number) => Promise<void>
}

export function BuySellModal({ open, onClose, mode, data, onBuy, onSell }: BuySellModalProps) {
  const [amount, setAmount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate bonding curve price (simplified - adjust based on your actual curve)
  const calculatePrice = (keyAmount: number) => {
    // Simple linear increase for demo - replace with your actual bonding curve formula
    const basePrice = data.currentPrice
    const priceIncrease = basePrice * 0.01 * keyAmount // 1% increase per key
    return basePrice + priceIncrease
  }

  const totalCost = mode === 'buy'
    ? Array.from({ length: amount }, (_, i) => calculatePrice(i + 1)).reduce((a, b) => a + b, 0)
    : Array.from({ length: amount }, (_, i) => calculatePrice(-(i + 1))).reduce((a, b) => a + b, 0)

  const newKeyCount = mode === 'buy' ? data.myKeys + amount : data.myKeys - amount
  const newSharePct = (newKeyCount / (data.totalSupply + (mode === 'buy' ? amount : 0))) * 100

  // Calculate estimated launch tokens based on share percentage
  // Assuming 1 billion total token supply at launch (adjust based on your tokenomics)
  const TOTAL_LAUNCH_SUPPLY = 1_000_000_000
  const LAUNCH_DISTRIBUTION_PCT = 0.20 // 20% of tokens distributed to key holders at launch
  const estimatedNewTokens = (newSharePct / 100) * TOTAL_LAUNCH_SUPPLY * LAUNCH_DISTRIBUTION_PCT

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      if (mode === 'buy' && onBuy) {
        await onBuy(amount)
      } else if (mode === 'sell' && onSell) {
        await onSell(amount)
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      setAmount(1)
      setError(null)
    }
  }, [open])

  if (!open) return null

  const isBuy = mode === 'buy'
  const isSell = mode === 'sell'
  const isManage = mode === 'manage'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[rgba(255,255,255,0.06)] backdrop-blur-[8px] ring-1 ring-[rgba(255,255,255,0.10)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {data.logoUrl && (
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600">
                <img src={data.logoUrl} alt={data.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {isManage ? 'Manage Position' : isBuy ? 'Buy Keys' : 'Sell Keys'}
              </h2>
              <p className="text-sm text-zinc-400">{data.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Position */}
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-400">Your Position</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-green-400">{data.mySharePct.toFixed(2)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-zinc-500 mb-1">Keys Held</div>
                <div className="text-lg font-bold text-white">{formatNumber(data.myKeys)}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Current Price</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{data.currentPrice.toFixed(4)} SOL</span>
                  {data.priceChange24h !== undefined && (
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        data.priceChange24h >= 0 ? 'text-cyan-300' : 'text-orange-300'
                      )}
                    >
                      {data.priceChange24h >= 0 ? '+' : ''}
                      {data.priceChange24h.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {data.estLaunchTokens != null && (
              <div className="mt-3 pt-3 border-t border-zinc-700 space-y-2">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Est. Launch Tokens</div>
                  <div className="text-sm font-bold text-purple-400">{formatNumber(data.estLaunchTokens)}</div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <span className="text-xs text-purple-400">Per Key</span>
                  <span className="text-xs font-bold text-purple-300">
                    {data.myKeys > 0 ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(data.estLaunchTokens / data.myKeys) : '0'} tokens
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Manage Mode - Tab Selection */}
          {isManage && (
            <div className="flex gap-2 p-1 bg-zinc-800/80 rounded-xl">
              <button
                onClick={() => {}}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold"
              >
                Buy More
              </button>
              <button
                onClick={() => {}}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm font-semibold transition-colors"
              >
                Sell Keys
              </button>
            </div>
          )}

          {/* Amount Input */}
          {(isBuy || isSell) && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {isBuy ? 'Keys to Buy' : 'Keys to Sell'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={isSell ? data.myKeys : undefined}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    onClick={() => setAmount(Math.max(1, amount - 1))}
                    className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setAmount(amount + 1)}
                    className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-2">
                {[1, 5, 10, 25].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setAmount(qty)}
                    className={cn(
                      'flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all',
                      amount === qty
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    )}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transaction Summary */}
          {(isBuy || isSell) && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Total Cost</span>
                <span className="font-bold text-white">{totalCost.toFixed(4)} SOL</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">New Balance</span>
                <span className="font-bold text-white">{formatNumber(newKeyCount)} keys</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-700">
                <span className="text-zinc-400">New Share</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 line-through">{data.mySharePct.toFixed(2)}%</span>
                  <ArrowRight className="w-3 h-3 text-zinc-500" />
                  <span className="font-bold text-green-400">{newSharePct.toFixed(2)}%</span>
                </div>
              </div>

              {/* Estimated Launch Tokens */}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-700">
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400">Est. Launch Tokens</span>
                  <div className="group relative">
                    <Info className="w-3 h-3 text-zinc-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/95 border border-zinc-700 rounded-lg text-xs text-zinc-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      Based on {(LAUNCH_DISTRIBUTION_PCT * 100).toFixed(0)}% of {formatNumber(TOTAL_LAUNCH_SUPPLY)} total supply distributed to key holders
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {data.estLaunchTokens != null && (
                    <>
                      <span className="text-zinc-500 line-through">{formatNumber(Math.floor(data.estLaunchTokens))}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-500" />
                    </>
                  )}
                  <span className="font-bold text-purple-400">{formatNumber(Math.floor(estimatedNewTokens))}</span>
                </div>
              </div>

              {/* Per Key Rate */}
              <div className="mt-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-300">Per Key</span>
                  <span className="text-xs font-bold text-purple-400">
                    ≈ {formatNumber(Math.floor(estimatedNewTokens / newKeyCount))} tokens
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Price Impact Warning */}
          {amount > 10 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-400">
                Large orders may experience significant price impact due to the bonding curve.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-semibold transition-all"
            >
              Cancel
            </button>
            {!isManage && (
              <button
                onClick={handleSubmit}
                disabled={loading || (isSell && amount > data.myKeys)}
                className={cn(
                  'flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                  isBuy
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/30'
                    : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white shadow-lg shadow-red-500/30',
                  (loading || (isSell && amount > data.myKeys)) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    {isBuy ? 'Buy Keys' : 'Sell Keys'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
