'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconLock, IconUsdc, IconVerified, IconAttention } from '@/lib/icons'

interface Milestone {
  id: string
  description: string
  amount: number
  status: 'pending' | 'in_progress' | 'completed' | 'disputed'
}

interface EscrowModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
  totalBudget: number
  currency?: 'USDC' | 'SOL'
  existingMilestones?: Milestone[]
  onConfirm?: (milestones: Milestone[]) => void
}

export function EscrowModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  totalBudget,
  currency = 'USDC',
  existingMilestones = [],
  onConfirm,
}: EscrowModalProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(
    existingMilestones.length > 0
      ? existingMilestones
      : [
          {
            id: '1',
            description: '',
            amount: 0,
            status: 'pending',
          },
        ]
  )
  const [isPending, setIsPending] = useState(false)

  const totalAllocated = milestones.reduce((sum, m) => sum + m.amount, 0)
  const remaining = totalBudget - totalAllocated

  const addMilestone = () => {
    if (milestones.length < 5) {
      setMilestones([
        ...milestones,
        {
          id: Date.now().toString(),
          description: '',
          amount: 0,
          status: 'pending',
        },
      ])
    }
  }

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((m) => m.id !== id))
    }
  }

  const updateMilestone = (id: string, field: 'description' | 'amount', value: string | number) => {
    setMilestones(
      milestones.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      )
    )
  }

  const canConfirm =
    milestones.every((m) => m.description.trim().length > 5 && m.amount > 0) &&
    totalAllocated === totalBudget

  const handleConfirm = async () => {
    if (!canConfirm) return

    setIsPending(true)

    if (onConfirm) {
      onConfirm(milestones)
    }

    // TODO: Create escrow contract
    setTimeout(() => {
      setIsPending(false)
      onClose()
    }, 1000)
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto"
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
                  <IconLock className="icon-primary" size={32} />
                  <h2 className="text-2xl font-bold text-white">Escrow Setup</h2>
                </div>
                <p className="text-sm text-zinc-400">
                  Define milestones and payment schedule
                </p>
              </div>

              {/* Job Info */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-zinc-400 mb-1">JOB</div>
                    <div className="text-white font-medium">{jobTitle}</div>
                    <div className="text-xs text-zinc-400 mt-1">ID: {jobId.slice(0, 8)}...</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1">BUDGET</div>
                    <div className="font-led-dot text-3xl text-primary flex items-center gap-2">
                      {totalBudget}
                      {currency === 'USDC' && <IconUsdc size={24} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-zinc-400">
                    Milestones ({milestones.length}/5)
                  </label>
                  <button
                    onClick={addMilestone}
                    disabled={milestones.length >= 5}
                    className="px-3 py-1 glass-interactive rounded-lg text-xs text-primary hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Add Milestone
                  </button>
                </div>

                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="glass-interactive p-4 rounded-xl border-2 border-primary/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                          <span className="font-led-dot text-primary">{index + 1}</span>
                        </div>

                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={milestone.description}
                            onChange={(e) =>
                              updateMilestone(milestone.id, 'description', e.target.value)
                            }
                            placeholder={`e.g., UI mockup, Working prototype, Final delivery...`}
                            className="w-full p-3 glass-interactive rounded-lg bg-transparent text-white placeholder:text-zinc-600 outline-none border-2 border-zinc-700 focus:border-primary"
                            maxLength={100}
                          />

                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <input
                                type="number"
                                value={milestone.amount || ''}
                                onChange={(e) =>
                                  updateMilestone(
                                    milestone.id,
                                    'amount',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder="Amount"
                                className="w-full p-3 glass-interactive rounded-lg bg-transparent text-white placeholder:text-zinc-600 outline-none border-2 border-zinc-700 focus:border-primary"
                                min={0}
                                max={remaining + milestone.amount}
                                step={currency === 'USDC' ? 0.01 : 0.001}
                              />
                            </div>
                            <div className="text-zinc-400 text-sm">{currency}</div>
                          </div>
                        </div>

                        {milestones.length > 1 && (
                          <button
                            onClick={() => removeMilestone(milestone.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <IconClose size={16} className="text-zinc-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Summary */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Total Budget</span>
                    <span className="text-white font-led-dot">{totalBudget} {currency}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Allocated</span>
                    <span className="text-primary font-led-dot">{totalAllocated.toFixed(2)} {currency}</span>
                  </div>
                  <div className="h-px bg-zinc-700 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Remaining</span>
                    <span className={`font-led-dot text-xl ${
                      remaining === 0 ? 'text-primary' : 'text-[#FF6B6B]'
                    }`}>
                      {remaining.toFixed(2)} {currency}
                    </span>
                  </div>
                </div>

                {remaining !== 0 && (
                  <div className="mt-3 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/50 rounded-lg flex items-start gap-2">
                    <IconAttention size={16} className="text-[#FF6B6B] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#FF6B6B]">
                      {remaining > 0
                        ? `You must allocate all ${totalBudget} ${currency} across milestones`
                        : `Total allocated exceeds budget by ${Math.abs(remaining).toFixed(2)} ${currency}`}
                    </p>
                  </div>
                )}
              </div>

              {/* How Escrow Works */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="text-xs font-bold text-primary mb-2">ℹ HOW ESCROW WORKS</div>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Funds are locked in smart contract on approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Each milestone must be approved before payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Disputes can be raised if work doesn't meet standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Curators can arbitrate disputes (requires 3 curator votes)</span>
                  </li>
                </ul>
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
                  onClick={handleConfirm}
                  disabled={!canConfirm || isPending}
                  className="flex-1 px-6 py-4 bg-[#D1FD0A] hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <IconVerified size={20} className="text-black" />
                      Create Escrow
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
