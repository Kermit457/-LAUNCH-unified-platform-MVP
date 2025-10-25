/**
 * ApplicantQueue - BTDemo design
 * Manage room applications with AI matching & priority scoring
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MotionMeter } from '../shared/MotionMeter'
import { useApplicants } from '@/hooks/blast/useApplicants'
import { useAcceptApplicant } from '@/hooks/blast/useAcceptApplicant'
import { useRejectApplicant } from '@/hooks/blast/useRejectApplicant'
import { useBestFitApplicants } from '@/hooks/blast/useBestFitApplicants'
import { RequestDMModal } from '../dm/RequestDMModal'
import {
  IconVerified,
  IconClose,
  IconLightning,
  IconChartAnimation,
  IconMessage,
  IconDeposit,
  IconMotion,
  IconActivityBadge,
  IconTrophy,
  IconLab,
  IconAim,
  IconContributorBubble,
  IconMotionScoreBadge
} from '@/lib/icons'

interface ApplicantQueueProps {
  roomId: string
}

export function ApplicantQueue({ roomId }: ApplicantQueueProps) {
  const { data: applicants = [], isLoading } = useApplicants(roomId)
  const { data: matchScores = [], isLoading: isLoadingMatches } = useBestFitApplicants(roomId)
  const acceptMutation = useAcceptApplicant(roomId)
  const rejectMutation = useRejectApplicant(roomId)
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<'priority' | 'ai'>('ai')
  const [dmModalOpen, setDmModalOpen] = useState(false)
  const [selectedDMUser, setSelectedDMUser] = useState<{ id: string, name: string, avatar?: string } | null>(null)

  const handleAccept = (applicantId: string) => {
    acceptMutation.mutate(applicantId)
  }

  const handleReject = (applicantId: string) => {
    rejectMutation.mutate({ applicationId: applicantId })
  }

  // Sort applicants
  const sortedApplicants = sortMode === 'ai' && matchScores.length > 0
    ? matchScores
        .map(ms => ({
          ...applicants.find(a => a.$id === ms.applicantId)!,
          matchScore: ms.score,
          matchReasons: ms.reasons,
        }))
        .filter(Boolean)
    : [...applicants].sort((a, b) => b.priorityScore - a.priorityScore)

  const pendingCount = applicants.filter((a) => a.status === 'pending').length
  const acceptedCount = applicants.filter((a) => a.status === 'accepted').length

  if (isLoading) {
    return (
      <div className="glass-premium rounded-3xl p-12 border-2 border-primary/50 text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400">Loading applicants...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Queue Header */}
      <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">Applicant Queue</h2>
          <div className="flex items-center gap-4">
            <div className="glass-interactive px-4 py-2 rounded-xl border border-primary/50">
              <span className="stat-label mr-2">Pending</span>
              <span className="font-led-dot text-xl text-primary">{pendingCount}</span>
            </div>
            <div className="glass-interactive px-4 py-2 rounded-xl border border-primary/50">
              <span className="stat-label mr-2">Accepted</span>
              <span className="font-led-dot text-xl text-primary">{acceptedCount}</span>
            </div>
          </div>
        </div>

        {/* Sort Mode Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setSortMode('ai')}
            disabled={isLoadingMatches}
            className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              sortMode === 'ai'
                ? 'glass-premium border border-primary text-primary'
                : 'glass-interactive text-zinc-400 hover:text-primary'
            }`}
          >
            <IconLab size={20} />
            <span>AI Match Score</span>
          </button>
          <button
            onClick={() => setSortMode('priority')}
            className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              sortMode === 'priority'
                ? 'glass-premium border border-primary text-primary'
                : 'glass-interactive text-zinc-400 hover:text-primary'
            }`}
          >
            <IconChartAnimation size={20} />
            <span>Priority Score</span>
          </button>
        </div>

        <p className="text-zinc-400 text-sm">
          {sortMode === 'ai'
            ? '🤖 AI-powered ranking based on match quality & reputation'
            : 'Sorted by priority (keys × 10 + motion × 2 + activity × 5)'}
        </p>
      </div>

      {/* Applicant Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedApplicants.map((applicant, index) => (
            <motion.div
              key={applicant.$id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-premium p-6 rounded-3xl border-2 transition-all ${
                applicant.status === 'accepted'
                  ? 'border-primary bg-primary/5'
                  : applicant.status === 'rejected'
                  ? 'border-[#FF005C]/50 bg-[#FF005C]/5 opacity-50'
                  : 'border-primary/50 hover:border-primary'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {applicant.userAvatar ? (
                    <img
                      src={applicant.userAvatar}
                      alt={applicant.userName}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center token-logo-glow">
                      <span className="text-white font-black text-xl">
                        {applicant.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <IconMotionScoreBadge
                    score={applicant.userMotionScore}
                    size={30}
                    className="absolute -bottom-2 -right-2"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">
                        {applicant.userName}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <MotionMeter userId={applicant.userId} size="sm" />
                        <span>Applied {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Score Badge */}
                    {sortMode === 'ai' && (applicant as any).matchScore !== undefined ? (
                      <div className="glass-interactive px-4 py-2 rounded-xl border-2 border-primary/50">
                        <div className="flex items-center gap-2">
                          <IconLab size={20} className="icon-primary" />
                          <span className="font-led-dot text-2xl text-primary">
                            {((applicant as any).matchScore).toFixed(0)}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 text-center">AI Match</div>
                      </div>
                    ) : (
                      <div className="glass-interactive px-4 py-2 rounded-xl border-2 border-primary/50">
                        <div className="flex items-center gap-2">
                          <IconChartAnimation size={20} className="icon-primary" />
                          <span className="font-led-dot text-2xl text-primary">
                            {applicant.priorityScore}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 text-center">Priority</div>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-zinc-300 mb-4 leading-relaxed p-4 glass-interactive rounded-xl border border-primary/30">
                    {applicant.message}
                  </p>

                  {/* AI Match Reasons */}
                  {sortMode === 'ai' && (applicant as any).matchReasons && (applicant as any).matchReasons.length > 0 && (
                    <div className="mb-4 p-4 rounded-xl glass-interactive border border-primary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <IconAim size={16} className="icon-primary" />
                        <span className="stat-label">AI MATCH INSIGHTS</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {((applicant as any).matchReasons as string[]).map((reason: string, idx: number) => (
                          <span
                            key={idx}
                            className="badge-primary text-xs"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="glass-interactive p-3 rounded-xl border border-primary/50">
                      <div className="flex items-center gap-2 mb-1">
                        <IconDeposit size={14} className="icon-muted" />
                        <span className="stat-label text-xs">Staked</span>
                      </div>
                      <div className="font-led-dot text-lg text-primary">{applicant.keysStaked}</div>
                      <div className="text-xs text-zinc-400">keys</div>
                    </div>

                    <div className="glass-interactive p-3 rounded-xl border border-primary/50">
                      <div className="flex items-center gap-2 mb-1">
                        <IconMotion size={14} className="icon-muted" />
                        <span className="stat-label text-xs">Motion</span>
                      </div>
                      <div className="font-led-dot text-lg text-primary">{applicant.userMotionScore}</div>
                    </div>

                    <div className="glass-interactive p-3 rounded-xl border border-primary/50">
                      <div className="flex items-center gap-2 mb-1">
                        <IconActivityBadge size={14} className="icon-muted" />
                        <span className="stat-label text-xs">Activity</span>
                      </div>
                      <div className="font-led-dot text-lg text-primary">{applicant.activityCount}</div>
                    </div>
                  </div>

                  {/* Priority Breakdown (Expandable) */}
                  {selectedApplicant === applicant.$id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-4 rounded-xl glass-interactive border border-primary/50"
                    >
                      <div className="stat-label mb-3">PRIORITY BREAKDOWN</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Keys ({applicant.keysStaked} × 10)</span>
                          <span className="font-led-dot text-primary">{applicant.keysStaked * 10}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Motion ({applicant.userMotionScore} × 2)</span>
                          <span className="font-led-dot text-primary">{applicant.userMotionScore * 2}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Activity ({applicant.activityCount} × 5)</span>
                          <span className="font-led-dot text-primary">{applicant.activityCount * 5}</span>
                        </div>
                        <div className="h-px bg-zinc-800 my-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold">Total Priority</span>
                          <span className="font-led-dot text-2xl text-primary">{applicant.priorityScore}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {applicant.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleAccept(applicant.$id)}
                          disabled={acceptMutation.isPending}
                          className="flex-1 bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {acceptMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          ) : (
                            <IconVerified size={20} className="text-black" />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(applicant.$id)}
                          disabled={rejectMutation.isPending}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-[#FF005C] font-semibold px-6 py-3 rounded-xl transition-all border-2 border-[#FF005C] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {rejectMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-[#FF005C]/20 border-t-[#FF005C] rounded-full animate-spin" />
                          ) : (
                            <IconClose size={20} />
                          )}
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDMUser({
                              id: applicant.userId,
                              name: applicant.userName,
                              avatar: applicant.userAvatar
                            })
                            setDmModalOpen(true)
                          }}
                          className="icon-interactive"
                          title="Send DM"
                        >
                          <IconMessage size={20} />
                        </button>
                        <button
                          onClick={() =>
                            setSelectedApplicant(
                              selectedApplicant === applicant.$id ? null : applicant.$id
                            )
                          }
                          className="icon-interactive"
                          title="View Details"
                        >
                          <IconTrophy size={20} />
                        </button>
                      </>
                    ) : applicant.status === 'accepted' ? (
                      <div className="flex-1 flex items-center justify-center gap-2 py-3 text-primary font-bold">
                        <IconVerified size={20} />
                        Accepted
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-2 py-3 text-[#FF005C] font-bold">
                        <IconClose size={20} />
                        Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {applicants.length === 0 && (
          <div className="glass-premium rounded-3xl p-12 border-2 border-primary/50 text-center">
            <IconContributorBubble className="icon-primary mx-auto mb-4" size={64} />
            <h3 className="text-2xl font-black text-white mb-2">No Applicants Yet</h3>
            <p className="text-zinc-400">
              Applications will appear here as people apply
            </p>
          </div>
        )}
      </div>

      {/* DM Modal */}
      {selectedDMUser && (
        <RequestDMModal
          isOpen={dmModalOpen}
          onClose={() => {
            setDmModalOpen(false)
            setSelectedDMUser(null)
          }}
          toUserId={selectedDMUser.id}
          toUserName={selectedDMUser.name}
          toUserAvatar={selectedDMUser.avatar}
          roomId={roomId}
        />
      )}
    </div>
  )
}
