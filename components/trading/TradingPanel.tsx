'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react'
import { useSolanaBuyKeys } from '@/hooks/useSolanaBuyKeys'
import { useSolanaSellKeys } from '@/hooks/useSolanaSellKeys'
import { useUser } from '@/hooks/useUser'

interface TradingPanelProps {
  curveId: string
  currentPrice: number
  userBalance?: number
  symbol: string
}

export function TradingPanel({ curveId, currentPrice, userBalance = 0, symbol }: TradingPanelProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')

  const { user } = useUser()
  const { buyKeys, isBuying, error: buyError } = useSolanaBuyKeys()
  const { sellKeys, isSelling, error: sellError } = useSolanaSellKeys()

  const isLoading = isBuying || isSelling
  const error = buyError || sellError

  // Calculate total cost
  const numTokens = parseFloat(amount) || 0
  const totalCost = numTokens * currentPrice
  const fees = totalCost * 0.06 // 6% total fees
  const totalWithFees = totalCost + fees

  const handleTrade = async () => {
    if (!amount || !user) return

    try {
      if (activeTab === 'buy') {
        // useSolanaBuyKeys expects: (twitterHandle, keysAmount, referrerAddress?)
        await buyKeys(curveId, parseFloat(amount))
      } else {
        // useSolanaSellKeys expects: (twitterHandle, keysAmount)
        await sellKeys(curveId, parseFloat(amount))
      }

      // Reset form on success
      setAmount('')
    } catch (err) {
      console.error('Trade failed:', err)
    }
  }

  const canTrade = () => {
    if (!user) return false
    if (!amount || parseFloat(amount) <= 0) return false
    if (activeTab === 'sell' && parseFloat(amount) > userBalance) return false
    return true
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-zinc-900/80">
        <button
          onClick={() => setActiveTab('buy')}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'buy'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Buy
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'sell'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Sell
          </div>
        </button>
      </div>

      {/* Trading Form */}
      <div className="p-6 space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Amount ({symbol})
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              max={activeTab === 'sell' ? userBalance : undefined}
              className="w-full h-14 px-4 pr-20 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white text-lg font-medium placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
            <button
              onClick={() => activeTab === 'sell' && setAmount(userBalance.toString())}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-xs font-medium text-white transition-colors"
            >
              MAX
            </button>
          </div>
          {activeTab === 'sell' && (
            <p className="mt-1 text-xs text-zinc-500">
              Balance: {userBalance.toFixed(2)} {symbol}
            </p>
          )}
        </div>

        {/* Price Info */}
        <div className="space-y-2 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Price</span>
            <span className="text-white font-medium">${currentPrice.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">You pay</span>
            <span className="text-white font-medium">${totalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Fees (6%)</span>
            <span className="text-zinc-400">${fees.toFixed(2)}</span>
          </div>
          <div className="h-px bg-zinc-700 my-2"></div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-white">Total</span>
            <span className="text-white">${totalWithFees.toFixed(2)}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Trade Button */}
        {!user ? (
          <button
            disabled
            className="w-full h-14 rounded-xl bg-zinc-700 text-zinc-400 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet to Trade
          </button>
        ) : (
          <button
            onClick={handleTrade}
            disabled={!canTrade() || isLoading}
            className={`w-full h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'buy'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {activeTab === 'buy' ? 'Buying...' : 'Selling...'}
              </>
            ) : (
              <>
                {activeTab === 'buy' ? (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Buy {symbol}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5" />
                    Sell {symbol}
                  </>
                )}
              </>
            )}
          </button>
        )}

        {/* Trading Info */}
        <div className="pt-4 border-t border-zinc-700">
          <p className="text-xs text-zinc-500 text-center">
            Trades are executed instantly on the bonding curve
          </p>
        </div>
      </div>
    </div>
  )
}
