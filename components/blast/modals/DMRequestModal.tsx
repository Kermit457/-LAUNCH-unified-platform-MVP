'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconMessage, IconLock } from '@/lib/icons'
import { useCreateDMRequest } from '@/hooks/blast/useCreateDMRequest'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { usePrivy } from '@privy-io/react-auth'

interface DMRequestModalProps {
  isOpen: boolean
  onClose: () => void
  targetUserId: string
  targetUserName: string
  targetUserAvatar?: string
  roomId?: string
  depositAmount?: number // Default: 0.02 keys
}

export function DMRequestModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  roomId,
  depositAmount = 0.02,
}: DMRequestModalProps) {
  const { user } = usePrivy()
  const { keyBalance } = useKeyGate()
  const { mutate: createDMRequest, isPending } = useCreateDMRequest()

  const [message, setMessage] = useState('')
  const [customDeposit, setCustomDeposit] = useState(depositAmount)

  const canSend = message.trim().length > 10 && keyBalance >= customDeposit

  const handleSend = () => {
    if (!canSend || !user) return

    createDMRequest({
      requesterId: user.id,
      targetId: targetUserId,
      roomId,
      message: message.trim(),
      keysOffered: customDeposit,
    }, {
      onSuccess: () => {
        setMessage('')
        onClose()
      },
    })
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
                  <IconMessage className="icon-primary" size={32} />
                  <h2 className="text-2xl font-bold text-white">Request DM</h2>
                </div>
                <p className="text-sm text-zinc-400">
                  Send a direct message request with key deposit
                </p>
              </div>

              {/* Target User */}
              <div className="glass-interactive p-4 rounded-xl mb-6 flex items-center gap-3">
                {targetUserAvatar ? (
                  <img
                    src={targetUserAvatar}
                    alt={targetUserName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-black font-bold">
                    {targetUserName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-white font-medium">{targetUserName}</div>
                  <div className="text-xs text-zinc-400">Will receive your request</div>
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and explain why you want to connect..."
                  className="w-full h-32 p-4 glass-interactive rounded-xl border-2 border-primary/50 focus:border-primary bg-transparent text-white placeholder:text-zinc-600 outline-none resize-none"
                  maxLength={300}
                />
                <div className="flex items-center justify-between mt-2 px-2">
                  <div className="text-xs text-zinc-400">
                    {message.length}/300 characters
                  </div>
                  {message.trim().length < 10 && message.length > 0 && (
                    <div className="text-xs text-[#FF6B6B]">
                      Minimum 10 characters
                    </div>
                  )}
                </div>
              </div>

              {/* Deposit Amount */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
                  <IconLock size={16} />
                  Key Deposit (refunded if accepted)
                </label>
                <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCustomDeposit(Math.max(0.01, customDeposit - 0.01))}
                      className="px-3 py-1 glass-interactive rounded-lg text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <div className="font-led-dot text-3xl text-primary">
                      {customDeposit.toFixed(2)}
                    </div>
                    <button
                      onClick={() => setCustomDeposit(Math.min(1, customDeposit + 0.01))}
                      className="px-3 py-1 glass-interactive rounded-lg text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-zinc-400">keys</span>
                  </div>
                </div>
                <div className="mt-2 px-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCustomDeposit(0.02)}
                      className="flex-1 px-3 py-2 glass-interactive rounded-lg text-xs hover:bg-white/10 transition-colors"
                    >
                      0.02 (default)
                    </button>
                    <button
                      onClick={() => setCustomDeposit(0.05)}
                      className="flex-1 px-3 py-2 glass-interactive rounded-lg text-xs hover:bg-white/10 transition-colors"
                    >
                      0.05 (priority)
                    </button>
                    <button
                      onClick={() => setCustomDeposit(0.1)}
                      className="flex-1 px-3 py-2 glass-interactive rounded-lg text-xs hover:bg-white/10 transition-colors"
                    >
                      0.10 (VIP)
                    </button>
                  </div>
                </div>
              </div>

              {/* Balance Check */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Your Balance</span>
                  <div className="font-led-dot text-xl text-primary">{keyBalance}</div>
                </div>
                {keyBalance < customDeposit && (
                  <div className="mt-3 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/50 rounded-lg">
                    <p className="text-xs text-[#FF6B6B]">
                      Insufficient keys. You need {(customDeposit - keyBalance).toFixed(2)} more keys.
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
                      <IconLock size={20} className="text-black" />
                      Send Request
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 p-3 glass-interactive rounded-xl">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-white">How it works:</strong> Your {customDeposit.toFixed(2)} keys
                  are locked. If accepted, they're refunded and DM opens. If declined or expired (48h),
                  keys are returned.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
