'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, TrendingUp, TrendingDown, Info, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/design-system'
import { calculateBuyCost, calculateSellProceeds, calculatePrice } from '@/lib/curve/bonding-math'
import type { Curve } from '@/types/curve'

interface TradeModalProps {
  curve: Curve
  mode: 'buy' | 'sell'
  userKeys: number
  userBalance: number
  referrerId?: string
  onClose: () => void
  onTrade: (keys: number) => Promise<void>
}

export const TradeModal = ({
  curve,
  mode,
  userKeys,
  userBalance,
  referrerId,
  onClose,
  onTrade
}: TradeModalProps) => {
  const [keys, setKeys] = useState<string>('1')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate trade preview
  const preview = useMemo(() => {
    const keysNum = parseFloat(keys)
    if (!keys || isNaN(keysNum) || keysNum <= 0) return null

    if (mode === 'buy') {
      const cost = calculateBuyCost(curve.supply, keysNum)
      const newSupply = curve.supply + keysNum
      const newPrice = calculatePrice(newSupply)

      // Fee breakdown (6% total: 94% reserve, 3% project, 2% platform, 1% referral)
      const fees = {
        reserve: cost * 0.94,
        project: cost * 0.03,
        platform: cost * 0.02,
        referral: cost * 0.01
      }

      return {
        keys: keysNum,
        estCost: cost,
        avgPrice: cost / keysNum,
        priceAfter: newPrice,
        fees
      }
    } else {
      // Sell
      if (keysNum > userKeys) {
        return null
      }

      const proceeds = calculateSellProceeds(curve.supply, keysNum)
      const newSupply = curve.supply - keysNum
      const newPrice = calculatePrice(newSupply)
      const sellTax = proceeds * 0.05 / 0.95 // 5% tax

      return {
        keys: keysNum,
        estCost: proceeds,
        avgPrice: proceeds / keysNum,
        priceAfter: newPrice,
        sellTax
      }
    }
  }, [keys, mode, curve.supply, curve.price, userKeys])

  // Validation
  const validationError = useMemo(() => {
    if (!preview) return null

    if (mode === 'buy') {
      if (preview.estCost > userBalance) {
        return `Insufficient balance. Need ${preview.estCost.toFixed(4)} SOL`
      }
    } else {
      if (preview.keys > userKeys) {
        return `Insufficient keys. You have ${userKeys.toFixed(2)} keys`
      }
    }

    return null
  }, [mode, preview, userBalance, userKeys])

  const canTrade = !isLoading && !validationError && preview && curve.state === 'active'

  // Stepper functions
  const adjustKeys = (delta: number) => {
    const current = parseFloat(keys) || 0
    const newValue = Math.max(0.01, current + delta)
    setKeys(newValue.toFixed(2))
  }

  const handleTrade = async () => {
    if (!canTrade || !preview) return

    setIsLoading(true)
    setError(null)

    try {
      await onTrade(preview.keys)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-gradient-to-br from-lime-900/90 via-black/90 to-black/90 rounded-2xl border border-lime-500/30 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              {mode === 'buy' ? (
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
              ) : (
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
              )}
              <h2 className="text-xl font-bold text-white">
                {mode === 'buy' ? 'Buy Keys' : 'Sell Keys'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Your Position */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You own:</span>
              <span className="text-white font-medium">{userKeys.toFixed(2)} keys</span>
            </div>

            {/* Keys Input with Stepper */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {mode === 'buy' ? 'Keys to buy' : 'Keys to sell'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustKeys(-1)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                  disabled={isLoading}
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={keys}
                    onChange={(e) => setKeys(e.target.value)}
                    placeholder="0"
                    step="0.01"
                    min="0.01"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white text-lg font-medium text-center focus:outline-none focus:border-lime-500/50 disabled:opacity-50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    KEYS
                  </div>
                </div>

                <button
                  onClick={() => adjustKeys(1)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2">
                {[5, 10, 25, mode === 'sell' ? userKeys : 50].map((amount, i) => (
                  <button
                    key={i}
                    onClick={() => setKeys(amount.toFixed(2))}
                    className="flex-1 px-3 py-1.5 text-xs bg-white/5 hover:bg-lime-500/20 border border-white/10 hover:border-lime-500/30 rounded-lg text-gray-400 hover:text-lime-400 transition-colors"
                    disabled={isLoading}
                  >
                    {i === 3 && mode === 'sell' ? 'MAX' : amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-3"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Est. {mode === 'buy' ? 'cost' : 'proceeds'}:</span>
                  <span className="text-white font-bold">{preview.estCost.toFixed(4)} SOL</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg price per key:</span>
                  <span className="text-white">{preview.avgPrice.toFixed(6)} SOL</span>
                </div>

                {mode === 'buy' && preview.fees && (
                  <>
                    <div className="border-t border-white/10 pt-3">
                      <div className="text-xs text-gray-500 mb-2">Fee breakdown (6%):</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Reserve (94%):</span>
                          <span className="text-gray-400">{preview.fees.reserve.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Project (3%):</span>
                          <span className="text-gray-400">{preview.fees.project.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Platform (2%):</span>
                          <span className="text-gray-400">{preview.fees.platform.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={referrerId ? 'text-lime-400' : 'text-gray-500'}>
                            {referrerId ? 'Referral (1%)' : 'Rewards (1%)'}:
                          </span>
                          <span className={referrerId ? 'text-lime-400' : 'text-gray-400'}>
                            {preview.fees.referral.toFixed(4)}
                            {referrerId && <Sparkles className="inline w-3 h-3 ml-1" />}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {mode === 'sell' && preview.sellTax && (
                  <div className="flex justify-between text-xs text-amber-400">
                    <span>Sell tax (5%):</span>
                    <span>-{preview.sellTax.toFixed(6)} SOL</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error Display */}
            {(error || validationError) && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error || validationError}</span>
              </div>
            )}

            {/* Trade Button */}
            <Button
              onClick={handleTrade}
              disabled={!canTrade}
              variant="primary"
              className={`w-full py-4 font-bold text-lg ${
                mode === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === 'buy' ? 'Buy' : 'Sell'} {preview ? preview.keys.toFixed(2) : '0'} Keys
                </>
              )}
            </Button>

            {/* Footer Info */}
            <div className="text-xs text-center text-gray-500">
              {mode === 'buy'
                ? '94% reserve • 3% project • 2% platform • 1% referral'
                : 'Sell tax: 5% • Funds withdrawn from reserve'
              }
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
