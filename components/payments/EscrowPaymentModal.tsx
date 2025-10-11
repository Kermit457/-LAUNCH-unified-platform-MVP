'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, DollarSign, Users, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react'

interface EscrowPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  campaignTitle: string
  campaignImage?: string
  totalBudget: number
  expectedParticipants?: number
  onFundEscrow: (amount: number) => Promise<{ success: boolean; escrowId?: string; error?: string }>
}

export function EscrowPaymentModal({
  isOpen,
  onClose,
  campaignTitle,
  campaignImage,
  totalBudget,
  expectedParticipants = 1,
  onFundEscrow
}: EscrowPaymentModalProps) {
  const [amount, setAmount] = useState(totalBudget)
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [escrowId, setEscrowId] = useState<string>()

  // Calculate fee breakdown
  const platformFee = amount * 0.02 // 2% platform fee
  const totalCost = amount + platformFee
  const perParticipant = expectedParticipants > 0 ? amount / expectedParticipants : amount

  useEffect(() => {
    if (isOpen) {
      setAmount(totalBudget)
      setSuccess(false)
      setError('')
      setEscrowId(undefined)
    }
  }, [isOpen, totalBudget])

  const handleFund = async () => {
    if (amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const result = await onFundEscrow(amount)

      if (result.success) {
        setSuccess(true)
        setEscrowId(result.escrowId)
        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setError(result.error || 'Failed to create escrow')
      }
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
                <Lock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Fund Campaign Escrow</h2>
                <p className="text-xs text-zinc-500">Secure payment for creators</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 hover:bg-white/5 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign Info */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              {campaignImage && (
                <img
                  src={campaignImage}
                  alt={campaignTitle}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{campaignTitle}</p>
                <p className="text-xs text-zinc-500">Clipping Campaign</p>
              </div>
            </div>

            {/* Participants Info */}
            {expectedParticipants > 0 && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Users className="w-4 h-4" />
                <span>Expected participants: {expectedParticipants}</span>
              </div>
            )}
          </div>

          {/* Success State */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-400 mb-1">
                      Escrow Created Successfully!
                    </p>
                    <p className="text-xs text-green-400/70 mb-2">
                      {amount.toFixed(2)} SOL secured in escrow
                    </p>
                    {escrowId && (
                      <a
                        href={`https://explorer.solana.com/address/${escrowId}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                      >
                        <span>View on Explorer</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-1">Transaction Failed</p>
                    <p className="text-xs text-red-400/70">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <>
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Escrow Amount (SOL)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    ◎
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="0"
                    disabled={isProcessing}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  ≈ ${(amount * 140).toFixed(2)} USD (estimated)
                </p>
              </div>

              {/* Payment Breakdown */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Payment Breakdown
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-300">
                    <span>Creator Rewards</span>
                    <span className="font-mono">◎{amount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-zinc-500 text-xs">
                    <span>Per Participant</span>
                    <span className="font-mono">◎{perParticipant.toFixed(4)}</span>
                  </div>

                  <div className="h-px bg-white/10 my-2" />

                  <div className="flex justify-between text-zinc-400 text-xs">
                    <span>Platform Fee (2%)</span>
                    <span className="font-mono">◎{platformFee.toFixed(4)}</span>
                  </div>

                  <div className="h-px bg-white/10 my-2" />

                  <div className="flex justify-between text-white font-semibold">
                    <span>Total Cost</span>
                    <span className="font-mono">◎{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* How Escrow Works */}
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-400/90 space-y-1">
                    <p className="font-semibold">How Escrow Works:</p>
                    <p>1. Funds are locked in secure smart contract</p>
                    <p>2. Creators submit their clips</p>
                    <p>3. You approve submissions</p>
                    <p>4. Payment released automatically</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFund}
                  disabled={isProcessing || amount <= 0}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Fund Escrow</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
