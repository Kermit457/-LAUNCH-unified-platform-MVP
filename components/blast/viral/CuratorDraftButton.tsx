'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconTrophy, IconTarget } from '@/lib/icons'
import { checkCuratorDraft, CURATOR_DRAFT } from '@/lib/blast/viral-mechanics'

interface CuratorDraftButtonProps {
  curatorRank: number
  curatorMotionScore: number
  roomDraftCount: number
  applicantId: string
  applicantName: string
  onDraft: (applicantId: string) => void
  isPending?: boolean
}

export function CuratorDraftButton({
  curatorRank,
  curatorMotionScore,
  roomDraftCount,
  applicantId,
  applicantName,
  onDraft,
  isPending = false,
}: CuratorDraftButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const { eligible, draftsRemaining } = checkCuratorDraft(
    curatorRank,
    curatorMotionScore,
    roomDraftCount
  )

  if (!eligible) return null

  const handleDraft = () => {
    onDraft(applicantId)
    setShowConfirm(false)
  }

  return (
    <>
      {/* Draft Button */}
      <motion.button
        onClick={() => setShowConfirm(true)}
        className="w-full px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC700] hover:to-[#FF9500] rounded-xl font-bold text-black transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <IconTrophy size={20} className="text-black" />
        <span>🎯 CURATOR DRAFT</span>
      </motion.button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-premium p-8 rounded-3xl border-2 border-[#FFD700] max-w-md w-full"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                <IconTrophy size={32} className="text-black" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Curator Draft Power
              </h3>

              <p className="text-sm text-zinc-400">
                Use your top curator privilege to force-accept this applicant
              </p>
            </div>

            {/* Info */}
            <div className="glass-interactive p-4 rounded-xl mb-6">
              <div className="text-xs font-bold text-[#FFD700] mb-2">
                ⭐ YOUR CURATOR STATUS
              </div>
              <div className="space-y-2 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>Rank</span>
                  <span className="font-led-dot text-[#FFD700]">#{curatorRank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Motion Score</span>
                  <span className="font-led-dot text-primary">{curatorMotionScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Drafts Remaining</span>
                  <span className="font-led-dot text-[#FFD700]">{draftsRemaining}</span>
                </div>
              </div>
            </div>

            {/* Target */}
            <div className="glass-interactive p-4 rounded-xl mb-6 border-2 border-primary/50">
              <div className="flex items-center gap-3">
                <IconTarget size={24} className="text-primary" />
                <div>
                  <div className="text-white font-medium">{applicantName}</div>
                  <div className="text-xs text-zinc-400">Will be auto-accepted</div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="p-3 bg-[#FFA500]/10 border border-[#FFA500]/50 rounded-lg mb-6">
              <p className="text-xs text-[#FFA500]">
                <strong>⚠️ Note:</strong> This is a one-time power per room. Room creator can still reject
                if applicant doesn't meet requirements.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 px-6 py-4 glass-interactive rounded-xl font-bold text-white hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDraft}
                disabled={isPending}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC700] hover:to-[#FF9500] rounded-xl font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Drafting...
                  </>
                ) : (
                  <>
                    <IconTrophy size={20} className="text-black" />
                    Confirm Draft
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
