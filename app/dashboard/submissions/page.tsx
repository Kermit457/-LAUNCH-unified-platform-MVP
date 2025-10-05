'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import { SubmissionTable } from '@/components/dashboard/Tables'
import { SubmissionViewer } from '@/components/drawers/SubmissionViewer'
import { mockSubmissions } from '@/lib/dashboardData'
import type { Submission } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set())
  const [viewingSubmission, setViewingSubmission] = useState<Submission | undefined>()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleApprove = (id: string) => {
    setSubmissions(submissions.map(s =>
      s.id === id
        ? { ...s, status: 'approved' as const, decidedAt: Date.now() }
        : s
    ))
    setViewingSubmission(undefined)
  }

  const handleReject = (id: string, reason: string) => {
    setSubmissions(submissions.map(s =>
      s.id === id
        ? { ...s, status: 'rejected' as const, notes: reason, decidedAt: Date.now() }
        : s
    ))
    setViewingSubmission(undefined)
  }

  const handleNeedsFix = (id: string, note: string) => {
    setSubmissions(submissions.map(s =>
      s.id === id
        ? { ...s, status: 'needs_fix' as const, notes: note }
        : s
    ))
    setViewingSubmission(undefined)
  }

  const handleBulkApprove = () => {
    setSubmissions(submissions.map(s =>
      selectedSubmissions.has(s.id)
        ? { ...s, status: 'approved' as const, decidedAt: Date.now() }
        : s
    ))
    setSelectedSubmissions(new Set())
  }

  const handleBulkReject = () => {
    const reason = prompt('Reason for bulk rejection:')
    if (!reason) return
    setSubmissions(submissions.map(s =>
      selectedSubmissions.has(s.id)
        ? { ...s, status: 'rejected' as const, notes: reason, decidedAt: Date.now() }
        : s
    ))
    setSelectedSubmissions(new Set())
  }

  const filteredSubmissions = statusFilter === 'all'
    ? submissions
    : submissions.filter(s => s.status === statusFilter)

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    needs_fix: submissions.filter(s => s.status === 'needs_fix').length,
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Submissions</h1>
            <p className="text-sm text-white/50 mt-1">Review and manage campaign submissions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/50" />
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                statusFilter === status
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              )}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')} ({count})
            </button>
          ))}
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedSubmissions.size > 0 && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-white">
              {selectedSubmissions.size} submission{selectedSubmissions.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkReject}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 font-medium text-sm transition-all"
              >
                Reject Selected
              </button>
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 font-medium text-sm transition-all"
              >
                Approve Selected
              </button>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <SubmissionTable
            submissions={filteredSubmissions}
            selectedIds={Array.from(selectedSubmissions)}
            onSelectChange={(ids) => setSelectedSubmissions(new Set(ids))}
            onRowClick={(id) => {
              const submission = submissions.find(s => s.id === id)
              if (submission) setViewingSubmission(submission)
            }}
            onApprove={handleApprove}
            onReject={(id) => {
              const reason = prompt('Reason for rejection:')
              if (reason) handleReject(id, reason)
            }}
            onNeedsFix={(id) => {
              const note = prompt('What needs to be fixed?')
              if (note) handleNeedsFix(id, note)
            }}
          />
        </div>
      </div>

      {/* Submission Viewer Drawer */}
      {viewingSubmission && (
        <SubmissionViewer
          isOpen={!!viewingSubmission}
          onClose={() => setViewingSubmission(undefined)}
          submission={viewingSubmission}
          onApprove={() => handleApprove(viewingSubmission.id)}
          onReject={(reason) => handleReject(viewingSubmission.id, reason)}
          onNeedsFix={(note) => handleNeedsFix(viewingSubmission.id, note)}
        />
      )}
    </>
  )
}