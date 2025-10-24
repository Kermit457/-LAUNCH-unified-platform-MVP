'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Zap, TrendingUp, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    name: string
    ticker: string
    logo: string
    motionScore: number
  }
  mode: 'buy' | 'sell'
}

export function TradeModal({ isOpen, onClose, project, mode }: TradeModalProps): JSX.Element {
  const [amount, setAmount] = useState('')
  const [activeMode, setActiveMode] = useState<'buy' | 'sell'>(mode)
  const amountInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus amount input on mount
  useEffect(() => {
    if (isOpen && amountInputRef.current) {
      setTimeout(() => {
        amountInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Calculate values
  const numericAmount = parseFloat(amount) || 0
  const pricePerKey = 0.08
  const platformFee = numericAmount * 0.01
  const total = numericAmount + platformFee
  const keysReceived = (numericAmount / pricePerKey).toFixed(1)

  const handleTrade = (): void => {
    console.log(`${activeMode} ${keysReceived} keys for ◎${total}`)
    onClose()
  }

  const handleBackdropClick = (): void => {
    onClose()
  }

  const handleContentClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md glass-premium rounded-3xl border border-zinc-800 p-6"
              onClick={handleContentClick}
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-xl" />
                  <div>
                    <h3 id="modal-title" className="font-bold text-lg">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-led-16 text-[#00FF88]">{project.motionScore}</span>
                      <span className="text-xs text-zinc-500">${project.ticker}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="icon-interactive p-2 rounded-xl hover:bg-zinc-800"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Buy/Sell Toggle */}
              <div className="flex gap-2 p-1 glass-interactive rounded-xl mb-6" role="tablist">
                <button
                  onClick={() => setActiveMode('buy')}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all ${
                    activeMode === 'buy'
                      ? 'bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  role="tab"
                  aria-selected={activeMode === 'buy'}
                  aria-controls="trade-panel"
                >
                  Buy Keys
                </button>
                <button
                  onClick={() => setActiveMode('sell')}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all ${
                    activeMode === 'sell'
                      ? 'bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  role="tab"
                  aria-selected={activeMode === 'sell'}
                  aria-controls="trade-panel"
                >
                  Sell Keys
                </button>
              </div>

              {/* Amount Input */}
              <div className="mb-6" id="trade-panel" role="tabpanel">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="amount-input" className="text-sm font-medium">Amount (SOL)</label>
                  <span className="text-xs text-zinc-500">Balance: <span className="font-led-16">12.5</span></span>
                </div>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D1FD0A]" />
                  <input
                    id="amount-input"
                    ref={amountInputRef}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    className="w-full pl-11 pr-20 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-right font-led-32 text-white"
                    aria-describedby="amount-hint"
                  />
                  <button
                    onClick={() => setAmount('12.5')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#D1FD0A]/10 border border-[#D1FD0A]/30 text-[#D1FD0A] rounded-lg text-xs font-bold hover:bg-[#D1FD0A]/20 transition-colors"
                    type="button"
                  >
                    MAX
                  </button>
                </div>

                {/* Quick amounts */}
                <div className="flex gap-2 mt-3" role="group" aria-label="Quick amount selection">
                  {[0.1, 0.5, 1, 5].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className="flex-1 px-3 py-2 bg-zinc-900/50 border border-zinc-800 hover:border-[#D1FD0A] rounded-lg text-sm font-bold transition-colors"
                      type="button"
                    >
                      <span className="font-led-16">◎{amt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trade Details */}
              <div className="glass-interactive p-4 rounded-xl mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">You'll receive</span>
                  <div className="flex items-center gap-2">
                    <span className="font-led-16 text-white">{keysReceived}</span>
                    <span className="text-xs text-zinc-400">keys</span>
                    <Info className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Price per key</span>
                  <span className="font-led-16 text-white">◎{pricePerKey}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Platform fee (1%)</span>
                  <span className="font-led-16 text-zinc-400">◎{platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-800 pt-2 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-led-16 text-[#00FF88] text-lg">◎{total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleTrade}
                disabled={!amount || numericAmount <= 0}
                className="w-full px-4 py-4 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                {activeMode === 'buy' ? 'Buy Keys' : 'Sell Keys'}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
