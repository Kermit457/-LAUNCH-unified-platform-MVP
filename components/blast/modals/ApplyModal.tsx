/**
 * Apply to Room Modal
 * Application form with key deposits and priority scoring
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Lock,
  Zap,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Star,
  Coins,
  Info,
} from 'lucide-react'
import { BlastRoom } from '@/lib/types/blast'
import { useApplyToRoom } from '@/hooks/blast/useApplyToRoom'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { useMotionScore } from '@/hooks/blast/useMotionScore'
import { usePrivy } from '@privy-io/react-auth'
import { DEPOSITS } from '@/lib/constants/blast'

interface ApplyModalProps {
  room: BlastRoom
  isOpen: boolean
  onClose: () => void
}

export function ApplyModal({ room, isOpen, onClose }: ApplyModalProps) {
  const { user } = usePrivy()
  const { keyBalance } = useKeyGate()
  const { data: motionScore } = useMotionScore(user?.id || '')
  const { mutate: apply, isPending } = useApplyToRoom()

  const [message, setMessage] = useState('')
  const [keysToStake, setKeysToStake] = useState(room.minKeys || 1)
  const [attachments, setAttachments] = useState<string[]>([])

  // Calculate total keys needed (entry deposit + stake)
  const totalKeysNeeded = DEPOSITS.ROOM_ENTRY + keysToStake
  const hasEnoughKeys = keyBalance >= totalKeysNeeded

  // Calculate priority score preview
  const priorityScore =
    keysToStake * 10 + // Keys staked weight
    (motionScore?.currentScore || 0) * 2 + // Motion score weight
    0 // Activity bonus (starts at 0)

  const handleSubmit = () => {
    if (!message.trim()) {
      return
    }

    apply(
      {
        roomId: room.$id,
        message: message.trim(),
        keysToStake,
        attachments: attachments.length > 0 ? attachments : undefined,
      },
      {
        onSuccess: () => {
          onClose()
          setMessage('')
          setKeysToStake(room.minKeys || 1)
          setAttachments([])
        },
      }
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative btdemo-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">
                    Apply to Room
                  </h2>
                  <p className="text-zinc-400 line-clamp-1">{room.title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Room Info */}
              <div className="btdemo-glass-subtle rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF88] to-cyan-500 flex items-center justify-center">
                    {room.creatorAvatar ? (
                      <img
                        src={room.creatorAvatar}
                        alt={room.creatorName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-black text-sm">
                        {room.creatorName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white">{room.creatorName}</div>
                    <div className="text-xs text-zinc-500">Room Creator</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-500" />
                    <span className="text-white">
                      {room.filledSlots}/{room.maxSlots || '∞'}
                    </span>
                    <span className="text-zinc-500">applied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-zinc-500" />
                    <span className="text-white">{room.minKeys || 0}</span>
                    <span className="text-zinc-500">keys min</span>
                  </div>
                </div>
              </div>

              {/* Application Message */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Application Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Why are you a good fit for this opportunity?"
                  className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:border-[#00FF88] focus:outline-none resize-none"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-500">Min 10 characters</span>
                  <span
                    className={`text-xs ${
                      message.length > 450
                        ? 'text-orange-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {message.length}/500
                  </span>
                </div>
              </div>

              {/* Keys to Stake */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Keys to Stake
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={room.minKeys || 1}
                    max={25}
                    value={keysToStake}
                    onChange={(e) =>
                      setKeysToStake(Math.max(room.minKeys || 1, parseInt(e.target.value) || 0))
                    }
                    className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white text-2xl font-bold text-center focus:border-[#00FF88] focus:outline-none"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setKeysToStake(Math.min(25, keysToStake + 1))}
                      className="btdemo-btn-glass w-12 h-12 flex items-center justify-center text-xl"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        setKeysToStake(Math.max(room.minKeys || 1, keysToStake - 1))
                      }
                      className="btdemo-btn-glass w-12 h-12 flex items-center justify-center text-xl"
                    >
                      −
                    </button>
                  </div>
                </div>

                {/* Quick Stakes */}
                <div className="flex gap-2 mt-3">
                  {[1, 5, 10, 25].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setKeysToStake(Math.max(room.minKeys || 1, amount))}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                        keysToStake === amount
                          ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]'
                          : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-zinc-500">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Higher stakes increase your priority in the queue. Stake is refunded if not accepted.
                  </span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="btdemo-glass-subtle rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-5 h-5 text-[#00FF88]" />
                  <span className="font-bold text-white">Cost Breakdown</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Entry Deposit</span>
                    <span className="text-white font-bold">{DEPOSITS.ROOM_ENTRY} key</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Keys Staked</span>
                    <span className="text-white font-bold">{keysToStake} keys</span>
                  </div>
                  <div className="h-px bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Total Locked</span>
                    <span className="text-[#00FF88] font-black text-lg">
                      {totalKeysNeeded} keys
                    </span>
                  </div>
                </div>

                {/* Refund Conditions */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Entry deposit refunded if you show activity (2+ actions)</span>
                  </div>
                  <div className="flex items-start gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Stake refunded if not accepted by creator</span>
                  </div>
                  <div className="flex items-start gap-2 text-orange-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Entry deposit forfeited if you ghost (0 activity)</span>
                  </div>
                </div>
              </div>

              {/* Priority Score Preview */}
              <div className="btdemo-glass-subtle rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#00FF88]" />
                  <span className="font-bold text-white">Your Priority Score</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#00FF88]">
                    {priorityScore}
                  </span>
                  <span className="text-zinc-500">points</span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Keys Staked ({keysToStake} × 10)</span>
                    <span className="text-white font-bold">{keysToStake * 10}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Motion Score ({motionScore?.currentScore || 0} × 2)</span>
                    <span className="text-white font-bold">
                      {(motionScore?.currentScore || 0) * 2}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Activity Bonus</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                </div>
              </div>

              {/* Balance Check */}
              {!hasEnoughKeys && (
                <div className="btdemo-glass-subtle rounded-xl p-4 border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-orange-400 mb-1">
                        Insufficient Keys
                      </div>
                      <div className="text-sm text-zinc-400">
                        You have {keyBalance} keys but need {totalKeysNeeded} keys to apply.
                      </div>
                      <button
                        onClick={() => (window.location.href = '/')}
                        className="mt-3 btdemo-btn-glass px-4 py-2 text-sm"
                      >
                        Buy Keys
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800 p-6 flex gap-3">
              <button
                onClick={onClose}
                disabled={isPending}
                className="flex-1 btdemo-btn-glass py-4 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  isPending ||
                  !hasEnoughKeys ||
                  message.length < 10 ||
                  message.length > 500
                }
                className="flex-1 btdemo-btn-glow py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Applying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Apply Now
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
