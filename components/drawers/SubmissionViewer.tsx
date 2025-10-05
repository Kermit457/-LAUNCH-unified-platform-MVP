"use client"

import { useState } from 'react'
import { X, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { Submission } from '@/lib/types'
import { fmtMoney } from '@/lib/format'
import { StatusBadge } from '../dashboard/StatusBadge'
import { cn } from '@/lib/cn'

interface SubmissionViewerProps {
  isOpen: boolean
  onClose: () => void
  submission: Submission | null
  onApprove?: (id: string) => void
  onReject?: (id: string, reason: string) => void
  onNeedsFix?: (id: string, note: string) => void
}

export function SubmissionViewer({
  isOpen,
  onClose,
  submission,
  onApprove,
  onReject,
  onNeedsFix
}: SubmissionViewerProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [fixNote, setFixNote] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showFixForm, setShowFixForm] = useState(false)

  if (!isOpen || !submission) return null

  const handleApprove = () => {
    if (onApprove) {
      onApprove(submission.id)
      onClose()
    }
  }

  const handleReject = () => {
    if (onReject && rejectReason.trim()) {
      onReject(submission.id, rejectReason)
      onClose()
    }
  }

  const handleNeedsFix = () => {
    if (onNeedsFix && fixNote.trim()) {
      onNeedsFix(submission.id, fixNote)
      onClose()
    }
  }

  const getCheckBadge = (pass: boolean, label: string) => (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold',
      pass ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
    )}>
      {pass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {label}
    </span>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-4xl h-full bg-neutral-900 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-neutral-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Submission Review</h2>
            <p className="text-sm text-white/60 mt-1">ID: {submission.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-white/60 mb-1">Status</div>
              <StatusBadge status={submission.status} />
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-white/60 mb-1">Reward</div>
              <div className="text-lg font-bold text-white">{fmtMoney(submission.reward)}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-white/60 mb-1">Platform</div>
              <div className="text-lg font-bold text-white capitalize">{submission.platform}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-sm text-white/60 mb-1">Verified Views</div>
              <div className="text-lg font-bold text-white">{submission.viewsVerified.toLocaleString('en-US')}</div>
            </div>
          </div>

          {/* Auto-checks */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Auto-checks</h3>
            <div className="flex flex-wrap gap-2">
              {getCheckBadge(submission.checks.linkOk, 'Link OK')}
              {getCheckBadge(!submission.checks.dup, 'No Duplicate')}
              {getCheckBadge(submission.checks.tagOk, 'Tags OK')}
              {getCheckBadge(submission.checks.durationOk, 'Duration OK')}
              {submission.checks.watermarkOk !== undefined && getCheckBadge(submission.checks.watermarkOk, 'Watermark OK')}
              {submission.checks.banned !== undefined && getCheckBadge(!submission.checks.banned, 'Not Banned')}
            </div>
          </div>

          {/* Link Preview */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Content Link</h3>
              <a
                href={submission.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            </div>

            {/* Iframe Preview */}
            <div className="rounded-xl bg-black/40 border border-white/10 aspect-video overflow-hidden">
              {submission.platform === 'youtube' && submission.link.includes('youtube.com/watch?v=') && (
                <iframe
                  src={`https://www.youtube.com/embed/${new URL(submission.link).searchParams.get('v')}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video preview"
                />
              )}
              {submission.platform === 'twitch' && (
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center">
                    <p className="mb-2">Twitch embed preview</p>
                    <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">
                      View on Twitch
                    </a>
                  </div>
                </div>
              )}
              {submission.platform === 'x' && (
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center">
                    <p className="mb-2">X/Twitter post</p>
                    <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">
                      View on X
                    </a>
                  </div>
                </div>
              )}
              {submission.platform === 'tiktok' && (
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center">
                    <p className="mb-2">TikTok video</p>
                    <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">
                      View on TikTok
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Existing Notes */}
          {submission.notes && (
            <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-5">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Notes</h3>
              <p className="text-white/80">{submission.notes}</p>
            </div>
          )}

          {/* Decision Forms */}
          {submission.status === 'pending' && (
            <>
              {/* Reject Form */}
              {showRejectForm && (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-red-300">Reject Submission</h3>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide a reason for rejection..."
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={4}
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={!rejectReason.trim()}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Needs Fix Form */}
              {showFixForm && (
                <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-orange-300">Request Fix</h3>
                  <textarea
                    value={fixNote}
                    onChange={(e) => setFixNote(e.target.value)}
                    placeholder="What needs to be fixed?"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={4}
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowFixForm(false)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNeedsFix}
                      disabled={!fixNote.trim()}
                      className="flex-1 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all"
                    >
                      Send Fix Request
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions Footer */}
        {submission.status === 'pending' && (
          <div className="sticky bottom-0 bg-neutral-900 border-t border-white/10 px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => {
                setShowRejectForm(true)
                setShowFixForm(false)
              }}
              disabled={showRejectForm}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-300 font-semibold transition-all"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
            <button
              onClick={() => {
                setShowFixForm(true)
                setShowRejectForm(false)
              }}
              disabled={showFixForm}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 disabled:opacity-50 text-orange-300 font-semibold transition-all"
            >
              <AlertCircle className="w-5 h-5" />
              Needs fix
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold transition-all shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  )
}