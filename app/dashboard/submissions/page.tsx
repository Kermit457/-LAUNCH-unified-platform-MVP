'use client'

import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { SubmissionTable } from '@/components/dashboard/Tables'
import { SubmissionViewer } from '@/components/drawers/SubmissionViewer'
import type { Submission } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import {
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  Submission as AppwriteSubmission
} from '@/lib/appwrite/services/submissions'

// Convert Appwrite submission to Dashboard submission
function appwriteToDashboard(s: AppwriteSubmission): Submission {
  return {
    id: s.$id,
    userId: s.userId,
    campaignId: s.campaignId || s.questId || '',
    campaignName: '', // Will need to fetch campaign details
    submittedAt: new Date(s.$createdAt).getTime(),
    status: s.status,
    contentUrl: s.mediaUrl,
    earnings: s.earnings,
    feedback: s.notes
  }
}

export default function SubmissionsPage() {
  const { user } = useUser()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set())
  const [viewingSubmission, setViewingSubmission] = useState<Submission | undefined>()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Fetch submissions from Appwrite
  useEffect(() => {
    async function fetchSubmissions() {
      if (!user) return

      try {
        setLoading(true)
        const data = await getSubmissions({ userId: user.$id })
        const converted = data.map(appwriteToDashboard)
        setSubmissions(converted)
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
        setSubmissions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [user])

  const handleApprove = async (id: string) => {
    try {
      await approveSubmission(id, 10, 'Approved') // Default earnings
      setSubmissions(submissions.map(s =>
        s.id === id
          ? { ...s, status: 'approved' as const, earnings: 10 }
          : s
      ))
      setViewingSubmission(undefined)
    } catch (error) {
      console.error('Failed to approve submission:', error)
      alert('Failed to approve submission')
    }
  }

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectSubmission(id, reason)
      setSubmissions(submissions.map(s =>
        s.id === id
          ? { ...s, status: 'rejected' as const, feedback: reason }
          : s
      ))
      setViewingSubmission(undefined)
    } catch (error) {
      console.error('Failed to reject submission:', error)
      alert('Failed to reject submission')
    }
  }

  const handleNeedsFix = async (id: string, note: string) => {
    try {
      await rejectSubmission(id, `Needs fix: ${note}`)
      setSubmissions(submissions.map(s =>
        s.id === id
          ? { ...s, status: 'rejected' as const, feedback: note }
          : s
      ))
      setViewingSubmission(undefined)
    } catch (error) {
      console.error('Failed to update submission:', error)
      alert('Failed to update submission')
    }
  }

  const handleBulkApprove = async () => {
    try {
      await Promise.all(
        Array.from(selectedSubmissions).map(id => approveSubmission(id, 10, 'Bulk approved'))
      )
      setSubmissions(submissions.map(s =>
        selectedSubmissions.has(s.id)
          ? { ...s, status: 'approved' as const, earnings: 10 }
          : s
      ))
      setSelectedSubmissions(new Set())
    } catch (error) {
      console.error('Failed to bulk approve:', error)
      alert('Failed to approve submissions')
    }
  }

  const handleBulkReject = async () => {
    const reason = prompt('Reason for bulk rejection:')
    if (!reason) return

    try {
      await Promise.all(
        Array.from(selectedSubmissions).map(id => rejectSubmission(id, reason))
      )
      setSubmissions(submissions.map(s =>
        selectedSubmissions.has(s.id)
          ? { ...s, status: 'rejected' as const, feedback: reason }
          : s
      ))
      setSelectedSubmissions(new Set())
    } catch (error) {
      console.error('Failed to bulk reject:', error)
      alert('Failed to reject submissions')
    }
  }

  const filteredSubmissions = statusFilter === 'all'
    ? submissions
    : submissions.filter(s => s.status === statusFilter)

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white/60">Loading submissions...</p>
      </div>
    )
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