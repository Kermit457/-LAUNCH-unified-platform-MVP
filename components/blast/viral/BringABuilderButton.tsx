'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconCash, IconClose } from '@/lib/icons'
import { BRING_A_BUILDER } from '@/lib/blast/viral-mechanics'

interface BringABuilderButtonProps {
  userRole?: string
  onInvite: (inviteCode: string, role: 'developer' | 'designer') => void
  isPending?: boolean
  className?: string
}

export function BringABuilderButton({
  userRole,
  onInvite,
  isPending = false,
  className,
}: BringABuilderButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [selectedRole, setSelectedRole] = useState<'developer' | 'designer'>('developer')

  const handleInvite = () => {
    if (!inviteCode.trim()) return
    onInvite(inviteCode, selectedRole)
    setShowModal(false)
    setInviteCode('')
  }

  return (
    <>
      {/* Invite Button */}
      <motion.button
        onClick={() => setShowModal(true)}
        className={`w-full px-4 py-3 glass-premium rounded-xl font-medium text-white border border-primary/50 hover:border-primary transition-all flex items-center justify-center gap-2 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <IconCash size={20} className="text-primary" />
        <span>👷 Bring a Builder</span>
        <div className="badge-primary text-xs px-2 py-0.5 rounded-lg ml-auto">
          +{BRING_A_BUILDER.queueBoost} Queue
        </div>
      </motion.button>

      {/* Invite Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-premium p-8 rounded-3xl border-2 border-primary max-w-lg w-full relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <IconClose size={20} className="text-zinc-400" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <IconCash size={32} className="text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Bring a Builder
                </h3>

                <p className="text-sm text-zinc-400">
                  Invite a verified developer or designer to boost your queue priority
                </p>
              </div>

              {/* Rewards */}
              <div className="glass-interactive p-4 rounded-xl mb-6">
                <div className="text-xs font-bold text-primary mb-2">
                  🎁 DUAL REWARDS
                </div>
                <div className="space-y-2 text-sm text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span>Your Queue Boost</span>
                    <span className="font-led-dot text-primary">+{BRING_A_BUILDER.queueBoost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Their Queue Boost</span>
                    <span className="font-led-dot text-primary">+{BRING_A_BUILDER.queueBoost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SBT Badge</span>
                    <span className="text-xs badge-success px-2 py-0.5 rounded">
                      {BRING_A_BUILDER.sbtReward.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Selector */}
              <div className="mb-4">
                <label className="text-xs text-zinc-400 mb-2 block">
                  Builder Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BRING_A_BUILDER.verifiedRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role as 'developer' | 'designer')}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        selectedRole === role
                          ? 'bg-primary text-black'
                          : 'glass-interactive text-white hover:bg-white/10'
                      }`}
                    >
                      {role === 'developer' ? '👨‍💻' : '🎨'} {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invite Code Input */}
              <div className="mb-6">
                <label className="text-xs text-zinc-400 mb-2 block">
                  Invite Code or Username
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invite code or @username"
                  className="w-full px-4 py-3 glass-interactive rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Info */}
              <div className="p-3 bg-primary/10 border border-primary/50 rounded-lg mb-6">
                <p className="text-xs text-primary">
                  <strong>📌 Note:</strong> Invitee must be verified as a{' '}
                  {selectedRole} with at least 1 completed project or 50+ Motion Score.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className="flex-1 px-6 py-4 glass-interactive rounded-xl font-bold text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={isPending || !inviteCode.trim()}
                  className="flex-1 px-6 py-4 bg-primary hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <IconCash size={20} className="text-black" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>

              {/* Success Stories */}
              <div className="mt-6 pt-6 border-t border-zinc-700">
                <div className="text-xs font-bold text-zinc-400 mb-3">
                  💡 WHY IT WORKS
                </div>
                <div className="space-y-2 text-xs text-zinc-500">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Verified builders get priority in job/collab rooms</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>SBT badge shows on profile forever</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Queue boost applies to all future applications</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
