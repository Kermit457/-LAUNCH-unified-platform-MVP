'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconNetwork, IconLightning, IconMotion, IconAim } from '@/lib/icons'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { usePrivy } from '@privy-io/react-auth'

interface IntroModalProps {
  isOpen: boolean
  onClose: () => void
  targetUserId: string
  targetUserName: string
  targetUserAvatar?: string
  targetUserMotionScore?: number
  roomId?: string
  matchScore?: number // AI matching score (0-100)
}

export function IntroModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  targetUserMotionScore = 0,
  roomId,
  matchScore = 0,
}: IntroModalProps) {
  const { user } = usePrivy()
  const { keyBalance } = useKeyGate()

  const [message, setMessage] = useState('')
  const [context, setContext] = useState('')
  const [depositAmount] = useState(0.1) // Fixed intro deposit
  const [isPending, setIsPending] = useState(false)

  const canSend = message.trim().length > 20 && context.trim().length > 10 && keyBalance >= depositAmount

  const handleSend = async () => {
    if (!canSend || !user) return

    setIsPending(true)
    // TODO: Integrate with intro request mutation
    setTimeout(() => {
      setIsPending(false)
      onClose()
    }, 1000)
  }

  const getMatchQuality = (score: number) => {
    if (score >= 80) return { label: 'Excellent Match', color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10' }
    if (score >= 60) return { label: 'Good Match', color: 'text-primary', bg: 'bg-primary/10' }
    if (score >= 40) return { label: 'Fair Match', color: 'text-[#FFA500]', bg: 'bg-[#FFA500]/10' }
    return { label: 'Low Match', color: 'text-zinc-400', bg: 'bg-zinc-400/10' }
  }

  const matchQuality = getMatchQuality(matchScore)

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
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
                  <IconNetwork className="icon-primary" size={32} />
                  <h2 className="text-2xl font-bold text-white">Request Intro</h2>
                </div>
                <p className="text-sm text-zinc-400">
                  Get connected through mutual interests
                </p>
              </div>

              {/* Target User */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="flex items-center gap-4">
                  {targetUserAvatar ? (
                    <img
                      src={targetUserAvatar}
                      alt={targetUserName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-black font-bold text-2xl">
                      {targetUserName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-white font-medium text-lg">{targetUserName}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <IconMotion size={16} className="text-primary" />
                        <span className="font-led-dot text-sm text-primary">{targetUserMotionScore}</span>
                      </div>
                      {matchScore > 0 && (
                        <div className={`text-xs px-2 py-1 rounded-lg ${matchQuality.bg} ${matchQuality.color} font-medium`}>
                          <div className="flex items-center gap-1">
                            <IconAim size={12} />
                            {matchScore}% Match
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Breakdown (if available) */}
              {matchScore > 0 && (
                <div className="glass-interactive p-4 rounded-xl mb-6">
                  <div className="text-xs font-bold text-zinc-400 mb-3">MATCH ANALYSIS</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Common Tags</span>
                      <span className="text-white">DeFi, Solana</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Shared Rooms</span>
                      <span className="text-white">3 rooms</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Timezone</span>
                      <span className="text-primary">Same (UTC-5)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Context Input */}
              <div className="mb-4">
                <label className="block text-sm text-zinc-400 mb-2">
                  What do you want help with?
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Seed round fundraising, NFT marketplace launch..."
                  className="w-full p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white placeholder:text-zinc-600 outline-none"
                  maxLength={100}
                />
                <div className="text-xs text-zinc-400 mt-1 px-2">
                  {context.length}/100 characters
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Why are you a good fit?
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain why this intro would be valuable for both parties..."
                  className="w-full h-32 p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white placeholder:text-zinc-600 outline-none resize-none"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2 px-2">
                  <div className="text-xs text-zinc-400">
                    {message.length}/500 characters
                  </div>
                  {message.trim().length < 20 && message.length > 0 && (
                    <div className="text-xs text-[#FF6B6B]">
                      Minimum 20 characters
                    </div>
                  )}
                </div>
              </div>

              {/* Deposit Info */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Intro Deposit</span>
                  <div className="font-led-dot text-2xl text-primary">{depositAmount}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Your Balance</span>
                  <div className="font-led-dot text-xl text-white">{keyBalance}</div>
                </div>
                {keyBalance < depositAmount && (
                  <div className="mt-3 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/50 rounded-lg">
                    <p className="text-xs text-[#FF6B6B]">
                      Insufficient keys. You need {(depositAmount - keyBalance).toFixed(2)} more keys.
                    </p>
                  </div>
                )}
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
                  onClick={handleSend}
                  disabled={!canSend || isPending}
                  className="flex-1 px-6 py-4 bg-[#D1FD0A] hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <IconLightning size={20} className="text-black" />
                      Request Intro
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 p-3 glass-interactive rounded-xl">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-white">How it works:</strong> Your {depositAmount} keys
                  are locked. If intro is made, keys are refunded. If declined, keys are returned after 48h.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
