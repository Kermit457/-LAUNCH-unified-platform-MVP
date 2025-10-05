"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Eye, TrendingUp, Clock, Users, Target, Coins, Upload } from 'lucide-react'
import { useState } from 'react'

export default function BountyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hasJoined, setHasJoined] = useState(false)

  // TODO: Fetch real bounty data by params.id
  const bounty = {
    id: params.id,
    type: 'bounty' as const,
    title: 'Create Content for $TOKEN',
    description: 'Create engaging content about $TOKEN and earn per approved submission. Video, thread, or article format accepted.',
    targetUrl: 'https://token.project/guidelines',
    pool: 500,
    paid: 120,
    participants: 12,
    maxParticipants: undefined,
    views: 89,
    platforms: ['youtube', 'twitter'],
    duration: '5 days left',
    rules: {
      platforms: ['youtube', 'twitter'],
      requiredTags: ['#token', '@token_official'],
      minDurationSec: 30,
      evidence: 'link' as const,
      perUserLimit: 5,
      reviewerSlaHrs: 48,
    },
    funding: {
      mint: 'USDC',
      amount: 500,
      model: 'per_task' as const,
      perTaskAmount: 25,
    }
  }

  const progressPct = Math.round((bounty.paid / bounty.pool) * 100)

  return (
    <div className="min-h-screen pb-24">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero Section */}
      <div className="rounded-2xl border p-6 mb-6 bg-gradient-to-br from-emerald-950/40 to-neutral-900/70 border-emerald-500/30">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 rounded-lg border font-bold text-sm bg-emerald-500/30 border-emerald-400/60 text-emerald-200">
                💰 Bounty
              </div>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-sm font-bold text-green-400 uppercase">
                Live
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{bounty.title}</h1>
            <p className="text-white/70">{bounty.description}</p>
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
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Budget</div>
            <div className="text-xl font-bold text-emerald-400">${bounty.pool.toLocaleString()} USDC</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Paid Out</div>
            <div className="text-xl font-bold text-white">${bounty.paid.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Participants</div>
            <div className="text-xl font-bold text-cyan-400">{bounty.participants}/{bounty.maxParticipants || '∞'}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Views</div>
            <div className="text-xl font-bold text-white">{bounty.views}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>${bounty.paid} of ${bounty.pool} paid out</span>
            <span className="font-semibold text-white">{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        {!hasJoined ? (
          <button
            onClick={() => setHasJoined(true)}
            className="w-full h-12 rounded-xl font-bold inline-flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white"
          >
            <TrendingUp className="w-5 h-5" />
            Join Bounty
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-center">
            <p className="text-green-300 font-semibold">✓ You've joined this bounty!</p>
            <p className="text-sm text-green-400/80 mt-1">Complete tasks to earn ${bounty.funding.perTaskAmount} per approval</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-fuchsia-400" />
              Target
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/60 mb-1">URL</div>
                <a
                  href={bounty.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors break-all"
                >
                  {bounty.targetUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Rules</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-white/60 mb-2">Required Tags</div>
                <div className="flex flex-wrap gap-2">
                  {bounty.rules.requiredTags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-2">Evidence Required</div>
                <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm">
                  {bounty.rules.evidence === 'link' ? '🔗 Link' : bounty.rules.evidence === 'video' ? '📹 Video' : '📸 Screenshot'}
                </span>
              </div>
              {bounty.rules.perUserLimit && (
                <div>
                  <div className="text-sm text-white/60 mb-2">Per-User Limit</div>
                  <span className="text-white">{bounty.rules.perUserLimit} submissions</span>
                </div>
              )}
              {bounty.rules.reviewerSlaHrs && (
                <div>
                  <div className="text-sm text-white/60 mb-2">Review SLA</div>
                  <span className="text-white">{bounty.rules.reviewerSlaHrs} hours</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Evidence (only if joined) */}
          {hasJoined && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                Submit Evidence
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Proof URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                  <p className="mt-1 text-xs text-white/40">Link to your completed content (video, thread, article, etc.)</p>
                </div>
                <button className="w-full h-12 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all">
                  Submit for Review
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              Funding
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/60 mb-1">Token</div>
                <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold inline-block">
                  {bounty.funding.mint}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Model</div>
                <div className="text-white capitalize">{bounty.funding.model.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Per Task</div>
                <div className="text-white font-bold">${bounty.funding.perTaskAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-white/60 mb-1">Budget Cap</div>
                <div className="text-white font-bold">${bounty.funding.amount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Timeline
            </h2>
            <div className="flex items-center gap-2 text-orange-300">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{bounty.duration}</span>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Top Contributors
            </h2>
            <div className="space-y-2">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">#{rank}</span>
                    <span className="text-white text-sm">@creator{rank}</span>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">${25 * (4 - rank)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
