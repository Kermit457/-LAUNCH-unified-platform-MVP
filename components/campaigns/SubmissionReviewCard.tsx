import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, XCircle, Eye, DollarSign,
  Calendar, ExternalLink, AlertCircle, Loader2
} from 'lucide-react'
import type { Submission } from '@/lib/appwrite/services/submissions'

interface SubmissionReviewCardProps {
  submission: Submission
  campaignRatePerThousand: number
  onApprove: (submissionId: string, earnings: number) => Promise<void>
  onReject: (submissionId: string, reason?: string) => Promise<void>
  compact?: boolean
}

export function SubmissionReviewCard({
  submission,
  campaignRatePerThousand,
  onApprove,
  onReject,
  compact = false
}: SubmissionReviewCardProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // Calculate earnings based on views
  const calculatedEarnings = (submission.views / 1000) * campaignRatePerThousand

  const handleApprove = async () => {
    try {
      setIsApproving(true)
      await onApprove(submission.$id, calculatedEarnings)
    } catch (error) {
      console.error('Failed to approve:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    try {
      setIsRejecting(true)
      await onReject(submission.$id, rejectReason)
      setShowRejectModal(false)
      setRejectReason('')
    } catch (error) {
      console.error('Failed to reject:', error)
    } finally {
      setIsRejecting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/40'
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/40'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40'
      default: return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/40'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'rejected': return XCircle
      case 'pending': return AlertCircle
      default: return AlertCircle
    }
  }

  const StatusIcon = getStatusIcon(submission.status)

  // Compact version for lists
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Status badge */}
            <div className={`px-2 py-1 rounded-lg ${getStatusColor(submission.status)} border text-xs font-semibold flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {submission.status}
            </div>

            {/* Submission info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-3 h-3 text-zinc-400" />
                <span className="text-white font-semibold">{submission.views.toLocaleString()} views</span>
              </div>
              <div className="text-xs text-zinc-500 truncate">
                {new Date(submission.$createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Earnings */}
            {submission.status === 'approved' && (
              <div className="flex items-center gap-1 text-green-400 font-bold">
                <DollarSign className="w-4 h-4" />
                {submission.earnings.toFixed(2)}
              </div>
            )}
          </div>

          {/* Media link */}
          <a
            href={submission.mediaUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-3 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-zinc-400" />
          </a>
        </div>
      </motion.div>
    )
  }

  // Full review card
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg ${getStatusColor(submission.status)} border font-semibold text-sm flex items-center gap-2`}>
              <StatusIcon className="w-4 h-4" />
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="w-3 h-3" />
            {new Date(submission.$createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
              <Eye className="w-3 h-3" />
              Views
            </div>
            <div className="text-white font-bold text-lg">{submission.views.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Earnings
            </div>
            <div className="text-green-400 font-bold text-lg">
              {submission.status === 'approved'
                ? `$${submission.earnings.toFixed(2)}`
                : `~$${calculatedEarnings.toFixed(2)}`}
            </div>
            {submission.status === 'pending' && (
              <div className="text-xs text-zinc-500">Estimated</div>
            )}
          </div>
        </div>

        {/* Media Link */}
        <a
          href={submission.mediaUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 p-3 rounded-xl bg-lime-500/10 border border-lime-500/30 hover:bg-lime-500/20 transition-colors mb-4 group"
        >
          <ExternalLink className="w-4 h-4 text-lime-400" />
          <span className="text-lime-300 text-sm font-medium group-hover:text-lime-200">
            View Submission
          </span>
          <div className="flex-1" />
          <span className="text-xs text-lime-400/60 truncate max-w-[200px]">
            {submission.mediaUrl}
          </span>
        </a>

        {/* Notes */}
        {submission.notes && (
          <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 mb-4">
            <div className="text-xs text-zinc-500 mb-1">Notes</div>
            <div className="text-sm text-zinc-300">{submission.notes}</div>
          </div>
        )}

        {/* Actions - Only show for pending submissions */}
        {submission.status === 'pending' && (
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Approve & Pay ${calculatedEarnings.toFixed(2)}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRejectModal(true)}
              disabled={isApproving || isRejecting}
              className="flex-1 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </motion.button>
          </div>
        )}

        {/* Reviewed info */}
        {submission.reviewedAt && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="text-xs text-zinc-500">
              Reviewed on {new Date(submission.reviewedAt).toLocaleString()}
            </div>
          </div>
        )}
      </motion.div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Reject Submission</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Please provide a reason for rejecting this submission (optional):
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Does not meet minimum quality standards..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none mb-4"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason('')
                  }}
                  className="flex-1 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    'Confirm Reject'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
