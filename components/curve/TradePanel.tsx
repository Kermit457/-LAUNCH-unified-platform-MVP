'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Info, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/design-system'
import { calculateTrade } from '@/lib/curve/bonding-math'
import type { Curve, TradeCalculation } from '@/types/curve'

interface TradePanelProps {
  curve: Curve
  userBalance?: number
  userKeys?: number
  referrerId?: string
  onTrade: (action: 'buy' | 'sell', amount: number) => Promise<void>
}

export const TradePanel = ({
  curve,
  userBalance = 0,
  userKeys = 0,
  referrerId,
  onTrade
}: TradePanelProps) => {
  const [action, setAction] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate trade details whenever amount or action changes
  const tradeCalc: TradeCalculation | null = useMemo(() => {
    const parsedAmount = parseFloat(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) return null

    try {
      return calculateTrade(
        action,
        parsedAmount,
        curve.supply,
        curve.price,
        !!referrerId
      )
    } catch (err) {
      return null
    }
  }, [amount, action, curve.supply, curve.price, referrerId])

  // Validation
  const validationError = useMemo(() => {
    if (!amount || !tradeCalc) return null

    if (action === 'buy') {
      if (tradeCalc.totalCost > userBalance) {
        return `Insufficient balance. Need ${tradeCalc.totalCost.toFixed(4)} SOL`
      }
    } else {
      if (tradeCalc.keys > userKeys) {
        return `Insufficient keys. You have ${userKeys.toFixed(2)} keys`
      }
    }

    return null
  }, [action, amount, tradeCalc, userBalance, userKeys])

  const canTrade = !isLoading && !validationError && tradeCalc && curve.state === 'active'

  const handleTrade = async () => {
    if (!canTrade || !tradeCalc) return

    setIsLoading(true)
    setError(null)

    try {
      await onTrade(action, parseFloat(amount))
      setAmount('') // Clear on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaxClick = () => {
    if (action === 'buy') {
      // Use 95% of balance to account for fees
      setAmount((userBalance * 0.95).toFixed(4))
    } else {
      // Calculate proceeds from selling all keys
      const calc = calculateTrade('sell', userKeys, curve.supply, curve.price, false)
      setAmount(calc.totalCost.toFixed(4))
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Tabs */}
      <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
        <button
          onClick={() => setAction('buy')}
          className={`
            flex-1 py-3 rounded-lg font-medium transition-all
            ${action === 'buy'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          <TrendingUp className="inline w-4 h-4 mr-2" />
          Buy Keys
        </button>
        <button
          onClick={() => setAction('sell')}
          className={`
            flex-1 py-3 rounded-lg font-medium transition-all
            ${action === 'sell'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          <TrendingDown className="inline w-4 h-4 mr-2" />
          Sell Keys
        </button>
      </div>

      {/* Curve State Warning */}
      {curve.state !== 'active' && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
          <Info className="inline w-4 h-4 mr-2" />
          This curve is {curve.state}. Trading is disabled.
        </div>
      )}

      {/* Amount Input */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="text-gray-400">
            {action === 'buy' ? 'Amount (SOL)' : 'Keys to Sell'}
          </label>
          <button
            onClick={handleMaxClick}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            MAX
          </button>
        </div>

        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={isLoading || curve.state !== 'active'}
            className="
              w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl
              text-white text-lg font-medium
              placeholder:text-gray-600
              focus:outline-none focus:border-purple-500/50
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          {action === 'buy' && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              SOL
            </div>
          )}
        </div>

        {/* Balance Display */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Balance: {userBalance.toFixed(4)} SOL</span>
          <span>Holdings: {userKeys.toFixed(2)} keys</span>
        </div>
      </div>

      {/* Trade Calculation Display */}
      <AnimatePresence mode="wait">
        {tradeCalc && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2 p-4 bg-black/20 rounded-xl border border-white/5"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You {action === 'buy' ? 'receive' : 'sell'}</span>
              <span className="text-white font-medium">
                {tradeCalc.keys.toFixed(4)} keys
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price per key</span>
              <span className="text-white font-medium">
                {tradeCalc.pricePerKey.toFixed(6)} SOL
              </span>
            </div>

            {action === 'buy' && (
              <>
                <div className="border-t border-white/5 my-2" />

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Reserve (94%)</span>
                    <span>{tradeCalc.fees.reserve.toFixed(6)} SOL</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Project (3%)</span>
                    <span>{tradeCalc.fees.project.toFixed(6)} SOL</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Platform (2%)</span>
                    <span>{tradeCalc.fees.platform.toFixed(6)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={referrerId ? 'text-purple-400' : 'text-gray-500'}>
                      {referrerId ? 'Referral (1%)' : 'Rewards Pool (1%)'}
                    </span>
                    <span className={referrerId ? 'text-purple-400 font-medium' : 'text-gray-500'}>
                      {tradeCalc.fees.referral.toFixed(6)} SOL
                      {referrerId && <Sparkles className="inline w-3 h-3 ml-1" />}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/5 my-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Cost</span>
                  <span className="text-white font-bold">
                    {tradeCalc.totalCost.toFixed(4)} SOL
                  </span>
                </div>
              </>
            )}

            {action === 'sell' && (
              <>
                <div className="border-t border-white/5 my-2" />

                <div className="flex justify-between text-xs text-amber-400">
                  <span>Sell tax (5%)</span>
                  <span>-{(tradeCalc.totalCost * 0.05).toFixed(6)} SOL</span>
                </div>

                <div className="border-t border-white/5 my-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You receive</span>
                  <span className="text-white font-bold">
                    {tradeCalc.totalCost.toFixed(4)} SOL
                  </span>
                </div>
              </>
            )}

            {/* Slippage Warning */}
            {tradeCalc.slippage > 5 && (
              <div className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-400">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>High slippage: {tradeCalc.slippage.toFixed(2)}%. Price will move significantly.</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {(error || validationError) && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error || validationError}
        </div>
      )}

      {/* Trade Button */}
      <Button
        onClick={handleTrade}
        disabled={!canTrade}
        variant="primary"
        className={`
          w-full py-4 font-bold text-lg
          ${action === 'buy'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="inline w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {action === 'buy' ? 'Buy Keys' : 'Sell Keys'}
            {tradeCalc && ` (${tradeCalc.keys.toFixed(2)})`}
          </>
        )}
      </Button>

      {/* Info Footer */}
      <div className="text-xs text-gray-500 text-center">
        {action === 'buy'
          ? '94% goes to reserve, 3% to project, 2% to platform, 1% to referral'
          : 'Sell tax: 5% | Funds withdrawn from reserve'
        }
      </div>
    </div>
  )
}
