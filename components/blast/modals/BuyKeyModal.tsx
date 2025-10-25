'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconLightning, IconNavArrowRight } from '@/lib/icons'

interface BuyKeyModalProps {
  isOpen: boolean
  onClose: () => void
  minKeys?: number
  currentKeys: number
  curvePda?: string
}

export function BuyKeyModal({
  isOpen,
  onClose,
  minKeys = 1,
  currentKeys,
  curvePda,
}: BuyKeyModalProps) {
  const [amount, setAmount] = useState(minKeys)
  const keysNeeded = Math.max(0, minKeys - currentKeys)

  // Mock price calculation (replace with actual bonding curve math)
  const pricePerKey = 0.05 // SOL
  const totalCost = (amount * pricePerKey).toFixed(3)

  const handleBuy = () => {
    // TODO: Integrate with bonding curve purchase flow
    // This should redirect to the buy page or trigger the buy transaction
    if (curvePda) {
      window.location.href = `/trade/${curvePda}?amount=${amount}`
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-premium p-8 rounded-3xl border-2 border-primary/50 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <IconClose size={24} className="text-zinc-400" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <IconLightning className="icon-primary" size={32} />
                  <h2 className="text-2xl font-bold text-white">Buy Keys</h2>
                </div>
                <p className="text-sm text-zinc-400">
                  Unlock access by purchasing Motion keys
                </p>
              </div>

              {/* Current Status */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-zinc-400">Current Keys</span>
                  <div className="font-led-dot text-2xl text-primary">
                    {currentKeys}
                  </div>
                </div>
                {keysNeeded > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Keys Needed</span>
                    <div className="font-led-dot text-2xl text-[#FF6B6B]">
                      {keysNeeded}
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Amount to Buy
                </label>
                <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50 focus-within:border-primary transition-colors">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-transparent text-white font-led-dot text-4xl text-center outline-none"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 px-2">
                  <button
                    onClick={() => setAmount(Math.max(1, amount - 1))}
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    - 1
                  </button>
                  <button
                    onClick={() => setAmount(keysNeeded)}
                    disabled={keysNeeded === 0}
                    className="text-primary hover:text-[#B8E309] transition-colors text-sm disabled:opacity-50"
                  >
                    Buy minimum needed
                  </button>
                  <button
                    onClick={() => setAmount(amount + 1)}
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    + 1
                  </button>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Price per key</span>
                  <span className="text-white font-mono">{pricePerKey} SOL</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Quantity</span>
                  <span className="text-white font-led-dot">{amount}</span>
                </div>
                <div className="h-px bg-zinc-700 my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Total Cost</span>
                  <span className="text-primary font-led-dot text-2xl">{totalCost} SOL</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 glass-interactive rounded-xl font-bold text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuy}
                  className="flex-1 px-6 py-4 bg-[#D1FD0A] hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Buy Keys</span>
                  <IconNavArrowRight
                    size={20}
                    className="text-black group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 p-3 glass-interactive rounded-xl">
                <p className="text-xs text-zinc-400 text-center">
                  Keys are purchased from the bonding curve. Transaction will open in new tab.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
