'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconLock, IconTrophy, IconLightning } from '@/lib/icons'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { usePrivy } from '@privy-io/react-auth'

interface KeyDepositModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  roomTitle: string
  purpose: 'curator' | 'priority_boost' | 'custom'
  minDeposit?: number
  maxDeposit?: number
  onConfirm?: (amount: number) => void
}

export function KeyDepositModal({
  isOpen,
  onClose,
  roomId,
  roomTitle,
  purpose,
  minDeposit = 5,
  maxDeposit = 25,
  onConfirm,
}: KeyDepositModalProps) {
  const { user } = usePrivy()
  const { keyBalance } = useKeyGate()

  const [amount, setAmount] = useState(minDeposit)
  const [isPending, setIsPending] = useState(false)

  const canDeposit = amount >= minDeposit && amount <= maxDeposit && keyBalance >= amount

  // Calculate curator rewards estimate
  const estimatedReward = purpose === 'curator' ? amount * 0.1 : 0 // 10% bonus on successful room

  const handleDeposit = async () => {
    if (!canDeposit || !user) return

    setIsPending(true)

    if (onConfirm) {
      onConfirm(amount)
    }

    // TODO: Integrate with vault locking mutation
    setTimeout(() => {
      setIsPending(false)
      onClose()
    }, 1000)
  }

  const getPurposeInfo = () => {
    switch (purpose) {
      case 'curator':
        return {
          title: 'Stake to Curate',
          description: 'Lock keys to tag rooms and rank applicants',
          icon: IconTrophy,
          benefits: [
            `Earn ${(estimatedReward).toFixed(1)} keys bonus on success`,
            'Rank applicants by priority',
            'Tag rooms for discovery',
            'Draft one applicant (force-accept)',
          ],
          risks: [
            'Slashed if mis-tag reported',
            'Locked until room closes',
          ],
        }
      case 'priority_boost':
        return {
          title: 'Priority Boost',
          description: 'Stake more keys to rank higher in queue',
          icon: IconLightning,
          benefits: [
            'Higher priority score',
            'Better placement in queue',
            'Refunded if active (2+ actions)',
          ],
          risks: [
            'Forfeited if no activity',
            'Locked until reviewed',
          ],
        }
      default:
        return {
          title: 'Key Deposit',
          description: 'Lock keys for this action',
          icon: IconLock,
          benefits: ['Refunded on completion'],
          risks: ['Locked until action complete'],
        }
    }
  }

  const info = getPurposeInfo()
  const Icon = info.icon

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
                  <Icon className="icon-primary" size={32} />
                  <h2 className="text-2xl font-bold text-white">{info.title}</h2>
                </div>
                <p className="text-sm text-zinc-400">{info.description}</p>
              </div>

              {/* Room Info */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="text-xs text-zinc-400 mb-1">ROOM</div>
                <div className="text-white font-medium">{roomTitle}</div>
                <div className="text-xs text-zinc-400 mt-1">ID: {roomId.slice(0, 8)}...</div>
              </div>

              {/* Amount Slider */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-3">
                  Keys to Deposit
                </label>

                {/* LED Display */}
                <div className="glass-interactive p-6 rounded-xl border-2 border-primary/50 mb-4">
                  <div className="text-center">
                    <div className="font-led-dot text-6xl text-primary mb-2">{amount}</div>
                    <div className="text-xs text-zinc-400">KEYS</div>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={minDeposit}
                  max={Math.min(maxDeposit, keyBalance)}
                  step={1}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #D1FD0A 0%, #D1FD0A ${((amount - minDeposit) / (maxDeposit - minDeposit)) * 100}%, #27272a ${((amount - minDeposit) / (maxDeposit - minDeposit)) * 100}%, #27272a 100%)`,
                  }}
                />

                <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
                  <span>Min: {minDeposit}</span>
                  <span>Max: {maxDeposit}</span>
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <button
                    onClick={() => setAmount(minDeposit)}
                    className="px-3 py-2 glass-interactive rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    Min ({minDeposit})
                  </button>
                  <button
                    onClick={() => setAmount(Math.floor((minDeposit + maxDeposit) / 2))}
                    className="px-3 py-2 glass-interactive rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    Mid ({Math.floor((minDeposit + maxDeposit) / 2)})
                  </button>
                  <button
                    onClick={() => setAmount(maxDeposit)}
                    className="px-3 py-2 glass-interactive rounded-lg text-xs hover:bg-white/10 transition-colors"
                  >
                    Max ({maxDeposit})
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="glass-interactive p-4 rounded-xl mb-4">
                <div className="text-xs font-bold text-primary mb-2">✓ BENEFITS</div>
                <ul className="space-y-2">
                  {info.benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="text-xs font-bold text-[#FF6B6B] mb-2">⚠ RISKS</div>
                <ul className="space-y-2">
                  {info.risks.map((risk, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-[#FF6B6B] mt-0.5">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Balance Check */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Your Balance</span>
                  <div className="font-led-dot text-xl text-primary">{keyBalance}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">After Deposit</span>
                  <div className="font-led-dot text-xl text-white">{keyBalance - amount}</div>
                </div>
                {keyBalance < amount && (
                  <div className="mt-3 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/50 rounded-lg">
                    <p className="text-xs text-[#FF6B6B]">
                      Insufficient keys. You need {(amount - keyBalance)} more keys.
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
                  onClick={handleDeposit}
                  disabled={!canDeposit || isPending}
                  className="flex-1 px-6 py-4 bg-[#D1FD0A] hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Locking...
                    </>
                  ) : (
                    <>
                      <IconLock size={20} className="text-black" />
                      Lock {amount} Keys
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
