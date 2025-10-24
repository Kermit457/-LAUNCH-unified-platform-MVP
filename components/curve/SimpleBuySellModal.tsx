'use client'

import { useState, useEffect } from 'react'
import { X, Minus, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { Curve } from '@/types/curve'
import { calculateBuyCost, calculateSellProceeds, calculatePrice } from '@/lib/curve/bonding-math'
import { BuyKeysButton } from '@/components/BuyKeysButton'
import { SellKeysButton } from '@/components/SellKeysButton'
import { usePrivy } from '@privy-io/react-auth'

interface SimpleBuySellModalProps {
  isOpen: boolean
  onClose: () => void
  curve: Curve
  ownerName: string
  ownerAvatar?: string
  twitterHandle: string
  userBalance: number
  userKeys: number
  onTrade: (type: 'buy' | 'sell', keys: number) => Promise<void>
}

export function SimpleBuySellModal({
  isOpen,
  onClose,
  curve,
  ownerName,
  ownerAvatar,
  twitterHandle,
  userBalance,
  userKeys,
  onTrade
}: SimpleBuySellModalProps) {
  const { user } = usePrivy()
  const [keys, setKeys] = useState(5)
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null)
  const [loadingPriceChange, setLoadingPriceChange] = useState(false)

  // Calculate current price at current supply
  const currentPrice = calculatePrice(curve.supply)

  // Calculate SOL cost for buying keys
  const solCost = calculateBuyCost(curve.supply, keys)

  // Calculate SOL received for selling keys
  const solReceived = calculateSellProceeds(curve.supply, keys)

  // V4 Fee structure: 6% total (4% instant, 1% platform, 1% buyback)
  const totalFee = (solCost * 0.06).toFixed(4)

  // Fetch 24h price change when modal opens
  useEffect(() => {
    if (isOpen && curve.id) {
      setKeys(5)

      // Fetch price change
      setLoadingPriceChange(true)
      fetch(`/api/curve/${curve.id}/price-change`)
        .then(res => res.json())
        .then(data => {
          setPriceChange24h(data.priceChange24h)
        })
        .catch(error => {
          console.error('Failed to fetch price change:', error)
          setPriceChange24h(null)
        })
        .finally(() => {
          setLoadingPriceChange(false)
        })
    }
  }, [isOpen, curve.id])

  const incrementKeys = () => setKeys(prev => prev + 1)
  const decrementKeys = () => setKeys(prev => Math.max(1, prev - 1))

  // Calculate supply share based on ACTUAL curve supply
  const currentTotalSupply = curve.supply || 1 // Total keys in circulation NOW
  const newKeyCount = userKeys + keys
  const newTotalSupply = currentTotalSupply + keys // Total supply after purchase

  const currentSharePct = currentTotalSupply > 0 ? (userKeys / currentTotalSupply) * 100 : 0
  const newSharePct = (newKeyCount / newTotalSupply) * 100

  // Check if user owns nearly all keys (>95% means they shouldn't buy more)
  const ownsNearlyAll = currentSharePct >= 95

  const canBuy = userBalance >= solCost && !ownsNearlyAll
  const canSell = userKeys >= keys

  // Debug logging
  console.log('📊 Sell calculation:', {
    curveSupply: curve.supply,
    keysToSell: keys,
    userKeys,
    solReceived,
    currentSharePct
  })

  // V6 Token launch calculations
  // Based on curve-launch-service-v6.ts logic:
  // - 1 billion total token supply
  // - Tokens bought at launch = (launchAmountSOL / 40) * 1B
  // - Each holder gets: (keyBalance / totalKeys) * tokensBought
  const TOTAL_SUPPLY = 1_000_000_000
  const DEFAULT_LAUNCH_SOL = 10 // Default 10 SOL launch amount

  // Estimate tokens that will be bought at launch (V6 formula)
  const estimatedTokensBought = Math.floor((DEFAULT_LAUNCH_SOL / 40) * TOTAL_SUPPLY)

  // User's share of those tokens based on key percentage
  const currentEstTokens = Math.floor((userKeys / currentTotalSupply) * estimatedTokensBought)
  const newEstTokens = Math.floor((newKeyCount / newTotalSupply) * estimatedTokensBought)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[rgba(255,255,255,0.06)] backdrop-blur-[8px] rounded-3xl ring-1 ring-[rgba(255,255,255,0.10)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Buy Keys</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Owner Info */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              {ownerAvatar ? (
                <img src={ownerAvatar} alt={ownerName} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {ownerName[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-white font-semibold">{ownerName}</div>
                <div className="text-sm text-gray-400">{curve.holders || 0} Holders</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-white font-bold mb-1">
                <span className="text-orange-500">◎</span>
                {currentPrice.toFixed(4)}
              </div>

              {/* 24h Price Change - Always show below price */}
              {loadingPriceChange ? (
                <div className="text-xs text-gray-400">Loading...</div>
              ) : priceChange24h !== null && priceChange24h !== undefined && typeof priceChange24h === 'number' ? (
                <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${
                  priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {priceChange24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%</span>
                  <span className="text-gray-500 ml-0.5">24h</span>
                </div>
              ) : (
                <div className="text-xs text-gray-400">--</div>
              )}
            </div>
          </div>

          {/* Your Holdings */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">YOU OWN:</span>
            <span className="text-white font-bold">{userKeys} keys ({currentSharePct.toFixed(2)}%)</span>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">BALANCE:</span>
              <span className="text-orange-500">◎</span>
              <span className="text-white font-bold">{userBalance.toFixed(4)}</span>
            </div>
            <div className="text-gray-400">TOTAL FEE: 6%</div>
          </div>

          {/* Keys Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
              <button
                onClick={decrementKeys}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
                disabled={keys <= 1}
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="text-3xl font-bold text-white">{keys.toFixed(2)}</div>

              <button
                onClick={incrementKeys}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex items-center justify-center gap-2">
              {[1, 5, 10, 20].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setKeys(amount)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    keys === amount
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Cost:</span>
              <span className="text-white font-bold text-xl">◎ {solCost.toFixed(4)}</span>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center">
              <span className="text-gray-400">New Balance:</span>
              <span className="text-white font-bold">{newKeyCount} keys</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">New Share:</span>
              <div className="flex items-center gap-2">
                {userKeys > 0 && currentSharePct > 0 && (
                  <span className="text-gray-500 line-through text-sm">{currentSharePct.toFixed(2)}%</span>
                )}
                <span className="text-white font-bold">{newSharePct.toFixed(2)}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Per Key Rate:</span>
              <span className="text-gray-300">
                ≈ {new Intl.NumberFormat('en-US').format(Math.floor(newEstTokens / newKeyCount))} tokens
              </span>
            </div>
          </div>

          {/* Warning if user owns nearly all keys */}
          {ownsNearlyAll && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <p className="text-sm text-orange-300 text-center">
                ⚠️ You own {currentSharePct.toFixed(1)}% of the supply. You can only sell at this point.
              </p>
            </div>
          )}

          {/* Buy/Sell Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <BuyKeysButton
              curveId={curve.id}
              twitterHandle={twitterHandle}
              keys={keys}
              solCost={solCost}
              userId={user?.id || ''}
              onSuccess={() => {
                onClose()
              }}
              onError={(error) => {
                console.error('Buy failed:', error)
              }}
              className={`
                py-4 rounded-2xl font-bold text-white text-lg transition-all
                ${canBuy
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
                }
              `}
              disabled={!canBuy}
              hideExtras={true}
            >
              <div className="flex items-center justify-center gap-2">
                Buy <span className="text-orange-200">◎ {solCost.toFixed(4)}</span>
              </div>
            </BuyKeysButton>

            <SellKeysButton
              curveId={curve.id}
              twitterHandle={twitterHandle}
              keys={keys}
              solReceived={solReceived}
              userId={user?.id || ''}
              onSuccess={() => {
                // Close modal and trigger page refresh
                onClose()
                // Reload the page to show updated balances
                window.location.reload()
              }}
              onError={(error) => {
                console.error('Sell failed:', error)
              }}
              className={`
                py-4 rounded-2xl font-bold text-white text-lg transition-all
                ${canSell
                  ? 'bg-white/10 hover:bg-white/20 border border-white/20'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
                }
              `}
              disabled={!canSell}
              hideExtras={true}
            >
              <div className="flex items-center justify-center gap-2">
                Sell <span className="text-gray-300">◎ {solReceived.toFixed(4)}</span>
              </div>
            </SellKeysButton>
          </div>

          {/* Warnings - removed as buttons show their own states */}
        </div>
      </div>
    </div>
  )
}
