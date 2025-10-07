"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, X, ExternalLink, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCampaignById } from '@/lib/appwrite/services/campaigns'
import { getCampaignSubmissions, approveSubmission, rejectSubmission } from '@/lib/appwrite/services/submissions'
import { getUserProfile } from '@/lib/appwrite/services/users'
import { useUser } from '@/hooks/useUser'

export default function CampaignReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useUser()
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Approval modal state
  const [approvalModal, setApprovalModal] = useState<any>(null)
  const [viewCount, setViewCount] = useState('')
  const [approvalNotes, setApprovalNotes] = useState('')

  // Rejection modal state
  const [rejectionModal, setRejectionModal] = useState<any>(null)
  const [rejectionNotes, setRejectionNotes] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const campaignData = await getCampaignById(params.id as string)
        setCampaign(campaignData)

        const submissionsData = await getCampaignSubmissions(params.id as string)

        // Fetch creator profiles for each submission
        const submissionsWithCreators = await Promise.all(
          submissionsData.map(async (sub) => {
            const creator = await getUserProfile(sub.userId)
            return { ...sub, creator }
          })
        )

        setSubmissions(submissionsWithCreators)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const handleApprove = async () => {
    if (!approvalModal || !viewCount) return

    try {
      setProcessingId(approvalModal.$id)

      const views = parseInt(viewCount)
      const ratePerThousand = campaign.ratePerThousand || 20
      const earnings = (views / 1000) * ratePerThousand

      await approveSubmission(approvalModal.$id, earnings, approvalNotes || undefined)

      // Update local state
      setSubmissions(submissions.map(sub =>
        sub.$id === approvalModal.$id
          ? { ...sub, status: 'approved', earnings, views }
          : sub
      ))

      setApprovalModal(null)
      setViewCount('')
      setApprovalNotes('')
    } catch (error) {
      console.error('Failed to approve submission:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async () => {
    if (!rejectionModal) return

    try {
      setProcessingId(rejectionModal.$id)

      await rejectSubmission(rejectionModal.$id, rejectionNotes || undefined)

      // Update local state
      setSubmissions(submissions.map(sub =>
        sub.$id === rejectionModal.$id
          ? { ...sub, status: 'rejected' }
          : sub
      ))

      setRejectionModal(null)
      setRejectionNotes('')
    } catch (error) {
      console.error('Failed to reject submission:', error)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending')
  const approvedSubmissions = submissions.filter(s => s.status === 'approved')
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected')

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaign
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Review Submissions
          </h1>
          <p className="text-zinc-400">{campaign?.title}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm text-zinc-400 mb-1">Pending</div>
            <div className="text-2xl font-bold text-orange-400">{pendingSubmissions.length}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm text-zinc-400 mb-1">Approved</div>
            <div className="text-2xl font-bold text-green-400">{approvedSubmissions.length}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm text-zinc-400 mb-1">Rejected</div>
            <div className="text-2xl font-bold text-red-400">{rejectedSubmissions.length}</div>
          </div>
        </div>

        {/* Pending Submissions */}
        {pendingSubmissions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Pending Review</h2>
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.$id} className="rounded-xl bg-white/5 border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {submission.creator?.avatar && (
                        <img
                          src={submission.creator.avatar}
                          alt={submission.creator.displayName}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-white">{submission.creator?.displayName || 'Unknown'}</div>
                        <div className="text-sm text-zinc-400">@{submission.creator?.username || 'unknown'}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-semibold">
                      Pending
                    </span>
                  </div>

                  {submission.notes && (
                    <p className="text-zinc-300 mb-4">{submission.notes}</p>
                  )}

                  <div className="mb-4">
                    <a
                      href={submission.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Submission
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setApprovalModal(submission)}
                      disabled={processingId === submission.$id}
                      className="flex-1 h-10 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectionModal(submission)}
                      disabled={processingId === submission.$id}
                      className="flex-1 h-10 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Submissions */}
        {approvedSubmissions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Approved</h2>
            <div className="space-y-3">
              {approvedSubmissions.map((submission) => (
                <div key={submission.$id} className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {submission.creator?.avatar && (
                      <img
                        src={submission.creator.avatar}
                        alt={submission.creator.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-white">{submission.creator?.displayName}</div>
                      <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        {submission.views?.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-bold">${submission.earnings?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Submissions */}
        {rejectedSubmissions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Rejected</h2>
            <div className="space-y-3">
              {rejectedSubmissions.map((submission) => (
                <div key={submission.$id} className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    {submission.creator?.avatar && (
                      <img
                        src={submission.creator.avatar}
                        alt={submission.creator.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-white">{submission.creator?.displayName}</div>
                      <div className="text-sm text-zinc-400">Rejected</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {approvalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Approve Submission</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                View Count <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={viewCount}
                onChange={(e) => setViewCount(e.target.value)}
                placeholder="10000"
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-400/80"
              />
              {viewCount && (
                <p className="mt-2 text-sm text-zinc-400">
                  Earnings: <span className="text-emerald-400 font-semibold">
                    ${((parseInt(viewCount) / 1000) * (campaign?.ratePerThousand || 20)).toFixed(2)} USDC
                  </span>
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
                placeholder="Great work!"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-400/80 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setApprovalModal(null)
                  setViewCount('')
                  setApprovalNotes('')
                }}
                className="flex-1 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={!viewCount || processingId === approvalModal.$id}
                className="flex-1 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === approvalModal.$id ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Submission</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                rows={3}
                placeholder="Doesn't meet campaign requirements..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-400/80 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectionModal(null)
                  setRejectionNotes('')
                }}
                className="flex-1 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processingId === rejectionModal.$id}
                className="flex-1 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === rejectionModal.$id ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
