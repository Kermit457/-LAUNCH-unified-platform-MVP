"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Eye, TrendingUp, Clock, Users, Target, Coins, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getQuestById } from '@/lib/appwrite/services/quests'
import { getSubmissions, createSubmission } from '@/lib/appwrite/services/submissions'
import { useUser } from '@/hooks/useUser'

export default function RaidDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { userId, isAuthenticated } = useUser()
  const [hasJoined, setHasJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [raid, setRaid] = useState<any>(null)

  // Submission form state
  const [proofUrl, setProofUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Fetch raid data from Appwrite
  useEffect(() => {
    async function fetchRaid() {
      try {
        setLoading(true)
        const data = await getQuestById(params.id as string)

        if (!data) {
          setLoading(false)
          return
        }

        // Calculate total paid from approved submissions
        const submissions = await getSubmissions({
          questId: data.$id,
          status: 'approved',
          limit: 1000
        })
        const totalPaid = submissions.reduce((sum, sub) => sum + (sub.earnings || 0), 0)

        // Convert Appwrite Quest to raid format
        setRaid({
          id: data.$id,
          type: 'raid' as const,
          title: data.title,
          description: data.description,
          targetUrl: '',
          pool: data.poolAmount,
          paid: totalPaid,
          participants: data.participants,
          maxParticipants: 100,
          views: 0,
          platforms: data.platforms || ['twitter'],
          duration: data.deadline ? new Date(data.deadline).toLocaleDateString() : 'No deadline',
          rules: {
            platforms: data.platforms || ['twitter'],
            requiredTags: [],
            minDurationSec: 10,
            evidence: 'link' as const,
            perUserLimit: 3,
            reviewerSlaHrs: 24,
          },
          funding: {
            mint: 'USDC',
            amount: data.poolAmount,
            model: 'pool' as const,
          }
        })
      } catch (error) {
        console.error('Failed to fetch raid:', error)
        // Fallback
        setRaid({
          id: params.id,
          type: 'raid' as const,
          title: 'Raid Not Found',
          description: 'This raid may have been removed or does not exist',
          targetUrl: '',
          pool: 0,
          paid: 0,
          participants: 0,
          maxParticipants: 0,
          views: 0,
          platforms: [],
          duration: '',
          rules: {},
          funding: { mint: 'USDC', amount: 0, model: 'pool' as const }
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchRaid()
    }
  }, [params.id])

  // Handle submission
  const handleSubmit = async () => {
    if (!isAuthenticated || !userId) {
      setSubmitError('Please sign in to submit')
      return
    }

    if (!proofUrl) {
      setSubmitError('Proof URL is required')
      return
    }

    try {
      setSubmitting(true)
      setSubmitError('')

      await createSubmission({
        submissionId: `sub_${Date.now()}_${userId}`,
        questId: raid.id,
        userId: userId,
        status: 'pending',
        mediaUrl: proofUrl,
        views: 0,
        earnings: 0,
      })

      setSubmitSuccess(true)
      setProofUrl('')
    } catch (error) {
      console.error('Failed to submit:', error)
      setSubmitError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !raid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const progressPct = Math.round((raid.paid / raid.pool) * 100)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

      {/* Hero Section */}
      <div className="rounded-2xl border p-6 mb-6 bg-white/5 border-white/10 backdrop-blur-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 rounded-lg border font-bold text-sm bg-red-500/30 border-red-400/60 text-red-200">
                ⚔️ Raid
              </div>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-sm font-bold text-green-400 uppercase">
                Live
              </span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">{raid.title}</h1>
            <p className="text-zinc-400">{raid.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <Share2 className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xl">
            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Pool</div>
            <div className="text-xl font-bold text-emerald-400">${raid.pool.toLocaleString()} USDC</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xl">
            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Paid Out</div>
            <div className="text-xl font-bold text-white">${raid.paid.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xl">
            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Participants</div>
            <div className="text-xl font-bold text-cyan-400">{raid.participants}/{raid.maxParticipants || '∞'}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-xl">
            <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Views</div>
            <div className="text-xl font-bold text-white">{raid.views}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
            <span>${raid.paid} of ${raid.pool} paid out</span>
            <span className="font-semibold text-white">{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        {!hasJoined ? (
          <button
            onClick={() => setHasJoined(true)}
            className="w-full h-12 rounded-xl font-bold inline-flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white"
          >
            <TrendingUp className="w-5 h-5" />
            Join Raid
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-center backdrop-blur-xl">
            <p className="text-green-300 font-semibold">✓ You've joined this raid!</p>
            <p className="text-sm text-green-400/80 mt-1">Complete the tasks below to earn rewards</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-fuchsia-400" />
              Target
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">URL</div>
                <a
                  href={raid.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors break-all"
                >
                  {raid.targetUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4">Rules</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-zinc-500 mb-2 uppercase tracking-wide">Required Tags</div>
                <div className="flex flex-wrap gap-2">
                  {raid.rules.requiredTags?.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2 uppercase tracking-wide">Evidence Required</div>
                <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm">
                  {raid.rules.evidence === 'link' ? '🔗 Link' : raid.rules.evidence === 'video' ? '📹 Video' : '📸 Screenshot'}
                </span>
              </div>
              {raid.rules.perUserLimit && (
                <div>
                  <div className="text-sm text-zinc-500 mb-2 uppercase tracking-wide">Per-User Limit</div>
                  <span className="text-white">{raid.rules.perUserLimit} submissions</span>
                </div>
              )}
              {raid.rules.reviewerSlaHrs && (
                <div>
                  <div className="text-sm text-zinc-500 mb-2 uppercase tracking-wide">Review SLA</div>
                  <span className="text-white">{raid.rules.reviewerSlaHrs} hours</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Evidence (only if joined) */}
          {hasJoined && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                Submit Evidence
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Proof URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-xl"
                  />
                  <p className="mt-1 text-xs text-zinc-500">Link to your completed action (tweet, post, etc.)</p>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-sm">
                    ✓ Submission received! Check your dashboard to track its status.
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              Funding
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Token</div>
                <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold inline-block">
                  {raid.funding.mint}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Model</div>
                <div className="text-white capitalize">{raid.funding.model}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-1 uppercase tracking-wide">Amount</div>
                <div className="text-white font-bold">${raid.funding.amount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Timeline
            </h2>
            <div className="flex items-center gap-2 text-orange-300">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{raid.duration}</span>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Top Contributors
            </h2>
            <div className="space-y-2">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-sm">#{rank}</span>
                    <span className="text-white text-sm">@user{rank}</span>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">${50 * (4 - rank)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}
