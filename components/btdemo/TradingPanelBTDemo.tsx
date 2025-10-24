'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, AlertCircle, Zap } from 'lucide-react'
import { useSolanaBuyKeys } from '@/hooks/useSolanaBuyKeys'
import { useSolanaSellKeys } from '@/hooks/useSolanaSellKeys'
import { useUser } from '@/hooks/useUser'

interface TradingPanelBTDemoProps {
  curveId: string
  currentPrice: number
  userBalance?: number
  symbol: string
}

export function TradingPanelBTDemo({
  curveId,
  currentPrice,
  userBalance = 0,
  symbol
}: TradingPanelBTDemoProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')

  const { user } = useUser()
  const { buyKeys, loading: isBuying, error: buyError } = useSolanaBuyKeys()
  const { sellKeys, loading: isSelling, error: sellError } = useSolanaSellKeys()

  const isLoading = isBuying || isSelling
  const error = buyError || sellError

  // Calculate total cost
  const numTokens = parseFloat(amount) || 0
  const totalCost = numTokens * currentPrice
  const fees = totalCost * 0.06 // 6% total fees
  const totalWithFees = totalCost + fees

  const handleTrade = async (): Promise<void> => {
    if (!amount || !user) return

    try {
      if (activeTab === 'buy') {
        await buyKeys(curveId, parseFloat(amount))
      } else {
        await sellKeys(curveId, parseFloat(amount))
      }

      // Reset form on success
      setAmount('')
    } catch (err) {
      console.error('Trade failed:', err)
    }
  }

  const canTrade = (): boolean => {
    if (!user) return false
    if (!amount || parseFloat(amount) <= 0) return false
    if (activeTab === 'sell' && parseFloat(amount) > userBalance) return false
    return true
  }

  return (
    <div className="glass-premium backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Tab Switcher - BTDEMO */}
      <div className="grid grid-cols-2 p-1.5 bg-zinc-900/80 gap-1.5">
        <button
          onClick={() => setActiveTab('buy')}
          className={`
            relative py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200
            flex items-center justify-center gap-2
            ${activeTab === 'buy'
              ? 'bg-gradient-to-br from-[#00FF88] to-[#00CC6A] text-black shadow-lg shadow-[#00FF88]/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }
          `}
        >
          <TrendingUp className="w-4 h-4" />
          Buy
          {activeTab === 'buy' && (
            <Zap className="absolute top-1 right-1 w-3 h-3 text-black/30" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('sell')}
          className={`
            relative py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200
            flex items-center justify-center gap-2
            ${activeTab === 'sell'
              ? 'bg-gradient-to-br from-[#FF0080] to-[#CC0066] text-white shadow-lg shadow-[#FF0080]/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }
          `}
        >
          <TrendingDown className="w-4 h-4" />
          Sell
          {activeTab === 'sell' && (
            <Zap className="absolute top-1 right-1 w-3 h-3 text-white/30" />
          )}
        </button>
      </div>

      {/* Trading Form - BTDEMO */}
      <div className="p-6 space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">
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
              className="
                w-full h-14 px-4 pr-20 rounded-xl
                glass-interactive border border-zinc-700/50
                text-white text-lg font-semibold
                placeholder:text-zinc-600
                focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/30 focus:border-[#D1FD0A]/50
                transition-all
              "
            />
            <button
              onClick={() => activeTab === 'sell' && setAmount(userBalance.toString())}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                px-3 py-1.5 rounded-lg
                bg-zinc-800 hover:bg-zinc-700
                text-xs font-bold text-[#D1FD0A]
                border border-zinc-700 hover:border-[#D1FD0A]/30
                transition-all active:scale-95
              "
            >
              MAX
            </button>
          </div>
          {activeTab === 'sell' && (
            <p className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
              <span>Balance:</span>
              <span className="font-led-16 text-[#00FF88]">{userBalance.toFixed(2)}</span>
              <span>{symbol}</span>
            </p>
          )}
        </div>

        {/* Price Info - BTDEMO with LED Numerals */}
        <div className="space-y-2 p-4 rounded-xl glass-interactive border border-zinc-700/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Price</span>
            <span className="font-led-16 text-white">${currentPrice.toFixed(6)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">You pay</span>
            <span className="font-led-16 text-white">${totalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Fees (6%)</span>
            <span className="font-led-16 text-zinc-400">${fees.toFixed(2)}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-2"></div>

          <div className="flex justify-between items-center text-base font-bold">
            <span className="text-white">Total</span>
            <span className={`font-led-16 ${
              activeTab === 'buy' ? 'text-[#00FF88]' : 'text-[#FF0080]'
            }`}>
              ${totalWithFees.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Error Message - BTDEMO */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl glass-interactive border border-[#FF0080]/30 bg-[#FF0080]/5">
            <AlertCircle className="w-4 h-4 text-[#FF0080] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#FF0080]/90 font-medium">{error}</p>
          </div>
        )}

        {/* Trade Button - BTDEMO */}
        {!user ? (
          <button
            disabled
            className="
              w-full h-14 rounded-xl
              glass-interactive border border-zinc-700
              text-zinc-500 font-bold
              flex items-center justify-center gap-2
              cursor-not-allowed opacity-50
            "
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet to Trade
          </button>
        ) : (
          <button
            onClick={handleTrade}
            disabled={!canTrade() || isLoading}
            className={`
              w-full h-14 rounded-xl font-bold transition-all
              flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${activeTab === 'buy'
                ? 'bg-gradient-to-r from-[#00FF88] to-[#00CC6A] hover:from-[#00CC6A] hover:to-[#00FF88] text-black shadow-lg shadow-[#00FF88]/30 active:scale-[0.98]'
                : 'bg-gradient-to-r from-[#FF0080] to-[#CC0066] hover:from-[#CC0066] hover:to-[#FF0080] text-white shadow-lg shadow-[#FF0080]/30 active:scale-[0.98]'
              }
            `}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {activeTab === 'buy' ? 'Buying...' : 'Selling...'}
              </>
            ) : (
              <>
                {activeTab === 'buy' ? (
                  <>
                    <Zap className="w-5 h-5" />
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

        {/* Trading Info - BTDEMO */}
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center leading-relaxed">
            Trades are executed instantly on the bonding curve
          </p>
        </div>
      </div>
    </div>
  )
}
