'use client'

import { useState, useEffect } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { Curve } from '@/types/curve'
import { calculateTrade } from '@/lib/curve/bonding-math'

interface SimpleBuySellModalProps {
  isOpen: boolean
  onClose: () => void
  curve: Curve
  ownerName: string
  ownerAvatar?: string
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
  userBalance,
  userKeys,
  onTrade
}: SimpleBuySellModalProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [keys, setKeys] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate trade cost
  const tradeCalc = calculateTrade(
    activeTab,
    keys,
    curve.supply,
    curve.price,
    false // keys input
  )

  const totalFee = (tradeCalc.totalCost * 0.10).toFixed(4) // 10% total fees

  useEffect(() => {
    if (isOpen) {
      setKeys(1)
      setActiveTab('buy')
    }
  }, [isOpen])

  const handleTrade = async () => {
    setIsProcessing(true)
    try {
      await onTrade(activeTab, keys)
      onClose()
    } catch (error) {
      console.error('Trade failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const incrementKeys = () => setKeys(prev => prev + 1)
  const decrementKeys = () => setKeys(prev => Math.max(1, prev - 1))

  const canBuy = activeTab === 'buy' && userBalance >= tradeCalc.totalCost
  const canSell = activeTab === 'sell' && userKeys >= keys

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl">
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {ownerName[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-white font-semibold">{ownerName}</div>
                <div className="text-sm text-gray-400">{curve.holders} Holders</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-white font-bold">
                <span className="text-orange-500">◎</span>
                {curve.price.toFixed(4)}
              </div>
              <div className="text-sm text-green-400">+{curve.change24h?.toFixed(1) || 0}%</div>
            </div>
          </div>

          {/* Your Holdings */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">YOU OWN:</span>
            <span className="text-white font-bold">{userKeys} keys</span>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">BALANCE:</span>
              <span className="text-orange-500">◎</span>
              <span className="text-white font-bold">{userBalance.toFixed(4)}</span>
            </div>
            <div className="text-gray-400">TOTAL FEE: 10%</div>
          </div>

          {/* Keys Input */}
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

          {/* Cost Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Keys Cost:</span>
              <span className="text-white">◎ {tradeCalc.totalCost.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform Fee (10%):</span>
              <span className="text-white">◎ {totalFee}</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between font-bold">
              <span className="text-white">Total Cost:</span>
              <span className="text-white">◎ {(tradeCalc.totalCost + parseFloat(totalFee)).toFixed(4)}</span>
            </div>
          </div>

          {/* Buy/Sell Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setActiveTab('buy')
                handleTrade()
              }}
              disabled={!canBuy || isProcessing}
              className={`
                py-4 rounded-2xl font-bold text-white text-lg transition-all
                ${canBuy && !isProcessing
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
                }
              `}
            >
              {isProcessing && activeTab === 'buy' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Buy <span className="text-orange-200">◎ {tradeCalc.totalCost.toFixed(4)}</span>
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('sell')
                handleTrade()
              }}
              disabled={!canSell || isProcessing}
              className={`
                py-4 rounded-2xl font-bold text-white text-lg transition-all
                ${canSell && !isProcessing
                  ? 'bg-white/10 hover:bg-white/20 border border-white/20'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
                }
              `}
            >
              {isProcessing && activeTab === 'sell' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sell <span className="text-gray-300">◎ {tradeCalc.totalCost.toFixed(4)}</span>
                </div>
              )}
            </button>
          </div>

          {/* Warnings */}
          {!canBuy && activeTab === 'buy' && (
            <div className="text-sm text-red-400 text-center">
              Insufficient balance to buy {keys} keys
            </div>
          )}
          {!canSell && activeTab === 'sell' && (
            <div className="text-sm text-red-400 text-center">
              You don't own enough keys to sell
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
