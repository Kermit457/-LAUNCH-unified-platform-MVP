/**
 * RequestDMModal - Send DM request to user
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Coins, Loader2, AlertCircle } from 'lucide-react'
import { useCreateDMRequest } from '@/hooks/blast/useCreateDMRequest'
import { useKeyGate } from '@/hooks/blast/useKeyGate'

interface RequestDMModalProps {
  isOpen: boolean
  onClose: () => void
  toUserId: string
  toUserName: string
  toUserAvatar?: string
  roomId?: string
}

export function RequestDMModal({
  isOpen,
  onClose,
  toUserId,
  toUserName,
  toUserAvatar,
  roomId
}: RequestDMModalProps) {
  const createDMRequest = useCreateDMRequest()
  const { keyBalance } = useKeyGate()

  const [message, setMessage] = useState('')
  const [keysOffered, setKeysOffered] = useState(5)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      return
    }

    createDMRequest.mutate(
      {
        toUserId,
        toUserName,
        message: message.trim(),
        keysOffered,
        roomId
      },
      {
        onSuccess: () => {
          setMessage('')
          setKeysOffered(5)
          onClose()
        }
      }
    )
  }

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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="btdemo-glass rounded-2xl border border-zinc-800 w-full max-w-lg overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-white btdemo-text-glow">
                    Request DM
                  </h2>
                  <button
                    onClick={onClose}
                    className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {toUserAvatar ? (
                      <img
                        src={toUserAvatar}
                        alt={toUserName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-black text-lg">
                        {toUserName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white">{toUserName}</div>
                    <div className="text-sm text-zinc-400">
                      Offer keys to start a conversation
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Why do you want to connect? What value can you provide?"
                    maxLength={500}
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/50 resize-none"
                  />
                  <div className="mt-2 text-xs text-zinc-500 text-right">
                    {message.length}/500
                  </div>
                </div>

                {/* Keys offered */}
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">
                    Keys Offered
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={Math.min(50, keyBalance)}
                      value={keysOffered}
                      onChange={(e) => setKeysOffered(Number(e.target.value))}
                      className="flex-1 accent-[#00FF88]"
                    />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400/20 text-yellow-400 font-bold min-w-[100px] justify-center">
                      <Coins className="w-5 h-5" />
                      {keysOffered}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Higher offers get faster responses. Keys refunded if declined.
                  </p>
                </div>

                {/* Balance warning */}
                {keyBalance < keysOffered && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-red-400 mb-1">
                        Insufficient Keys
                      </div>
                      <div className="text-xs text-red-300">
                        You need {keysOffered} keys but only have {keyBalance}.
                        Get more keys to send this request.
                      </div>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#00FF88]/5 border border-[#00FF88]/20">
                  <MessageSquare className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-zinc-300">
                    <span className="font-bold text-[#00FF88]">How it works:</span> Your keys are locked until {toUserName} responds. If accepted, you can start chatting. If declined or expires (48h), keys are fully refunded.
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 btdemo-btn-glass py-3"
                    disabled={createDMRequest.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !message.trim() ||
                      keyBalance < keysOffered ||
                      createDMRequest.isPending
                    }
                    className="flex-1 btdemo-btn-glow py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createDMRequest.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
