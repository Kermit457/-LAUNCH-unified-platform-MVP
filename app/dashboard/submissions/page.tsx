'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react'
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

interface StatCardProps {
  icon: any
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  color: string
}

const StatCard = ({ icon: Icon, label, value, change, trend, color }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6 transition-all hover:border-${color}-500/50`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2 rounded-lg bg-${color}-500/10`}>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      {change && (
        <span className={cn(
          'text-sm font-medium',
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        )}>
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-design-zinc-400">{label}</p>
    </div>
  </motion.div>
)

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
        const data = await getSubmissions({ userId: (user as any).$id || (user as any).id })
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

  const toggleSubmission = (id: string) => {
    const newSelected = new Set(selectedSubmissions)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSubmissions(newSelected)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-purple-500 mx-auto mb-4"></div>
        <p className="text-design-zinc-400">Loading submissions...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Submissions</h1>
            <p className="text-design-zinc-300">Review and manage campaign submissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Clock}
            label="Pending Review"
            value={statusCounts.pending}
            color="design-purple"
          />
          <StatCard
            icon={CheckCircle2}
            label="Approved"
            value={statusCounts.approved}
            change="+12%"
            trend="up"
            color="green"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={statusCounts.rejected}
            color="red"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-design-zinc-400" />
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                statusFilter === status
                  ? 'bg-design-purple-500 text-white'
                  : 'bg-design-zinc-900/50 text-design-zinc-400 hover:bg-design-zinc-800 border border-design-zinc-800'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          ))}
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedSubmissions.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-design-purple-500/20 border border-design-purple-500/30 rounded-xl p-4 flex items-center justify-between"
          >
            <span className="text-sm text-white">
              {selectedSubmissions.size} submission{selectedSubmissions.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkReject}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 font-medium text-sm transition-all border border-red-500/30"
              >
                Reject Selected
              </button>
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 font-medium text-sm transition-all border border-green-500/30"
              >
                Approve Selected
              </button>
            </div>
          </motion.div>
        )}

        {/* Submissions Table */}
        <div className="bg-design-zinc-900/50 backdrop-blur-sm border border-design-zinc-800 rounded-xl overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-design-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No submissions yet</h3>
              <p className="text-design-zinc-400">Submissions from campaigns will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-design-zinc-900/80 border-b border-design-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-design-zinc-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.size === filteredSubmissions.length && filteredSubmissions.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubmissions(new Set(filteredSubmissions.map(s => s.id)))
                          } else {
                            setSelectedSubmissions(new Set())
                          }
                        }}
                        className="rounded border-design-zinc-700 bg-design-zinc-900 text-design-purple-500 focus:ring-design-purple-500 focus:ring-offset-design-zinc-900"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-design-zinc-400 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-design-zinc-400 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-design-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-design-zinc-400 uppercase tracking-wider">Earnings</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-design-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-design-zinc-800">
                  {filteredSubmissions.map((submission, idx) => (
                    <motion.tr
                      key={submission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-design-zinc-800/50 transition-colors cursor-pointer"
                      onClick={() => setViewingSubmission(submission)}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedSubmissions.has(submission.id)}
                          onChange={() => toggleSubmission(submission.id)}
                          className="rounded border-design-zinc-700 bg-design-zinc-900 text-design-purple-500 focus:ring-design-purple-500 focus:ring-offset-design-zinc-900"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{submission.campaignName || 'Unknown Campaign'}</div>
                        <div className="text-xs text-design-zinc-500">ID: {submission.campaignId.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-design-zinc-300">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          submission.status === 'approved' && 'bg-green-500/20 text-green-400 border border-green-500/30',
                          submission.status === 'rejected' && 'bg-red-500/20 text-red-400 border border-red-500/30',
                          submission.status === 'pending' && 'bg-design-purple-500/20 text-design-purple-400 border border-design-purple-500/30'
                        )}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {submission.earnings ? `$${submission.earnings}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {submission.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const reason = prompt('Reason for rejection:')
                                if (reason) handleReject(submission.id, reason)
                              }}
                              className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-medium transition-all border border-red-500/30"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              className="px-3 py-1 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 text-sm font-medium transition-all border border-green-500/30"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
