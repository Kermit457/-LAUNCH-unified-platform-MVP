"use client"

import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Video,
  Clock,
  Users,
  Upload,
  Eye,
  Package,
  FileCheck,
  Trophy,
  CheckCircle,
  ChevronDown,
  Globe,
  Download,
  Loader,
  Check,
  FileText,
  MoreVertical,
  DollarSign
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCampaignById } from '@/lib/appwrite/services/campaigns'
import { createSubmission, getSubmissions, approveSubmission, rejectSubmission, type Submission } from '@/lib/appwrite/services/submissions'
import { useUser } from '@/hooks/useUser'
import { EscrowStatusCard, type EscrowStatus } from '@/components/payments/EscrowStatusCard'
import { SubmissionReviewCard } from '@/components/campaigns/SubmissionReviewCard'
import type { Campaign } from '@/lib/appwrite/services/campaigns'
import { cn } from '@/lib/utils'

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { userId, isAuthenticated } = useUser()

  // UI state
  const [hasJoined, setHasJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<any>(null)
  const [rulesExpanded, setRulesExpanded] = useState(false)
  const [assetsExpanded, setAssetsExpanded] = useState(false)

  // Submission form state
  const [platform, setPlatform] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Escrow state
  const [escrowData, setEscrowData] = useState<{
    escrowId?: string
    status?: EscrowStatus
    totalAmount?: number
    releasedAmount?: number
    participantsTotal?: number
    participantsPaid?: number
    deadline?: string
  } | null>(null)

  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [submissionsTab, setSubmissionsTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // Animated progress
  const [animatedProgress, setAnimatedProgress] = useState(0)

  // Fetch submissions for this campaign
  const fetchSubmissions = async () => {
    if (!params?.id) return
    try {
      setLoadingSubmissions(true)
      const data = await getSubmissions({ campaignId: params.id as string })
      setSubmissions(data)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoadingSubmissions(false)
    }
  }

  // Escrow action handlers
  const handleReleasePayment = async () => {
    console.log('Release payment clicked - mock action')
    alert('Payment release functionality will be connected to Solana smart contract')
  }

  const handleCancelEscrow = async () => {
    console.log('Cancel escrow clicked - mock action')
    alert('Escrow cancellation will be connected to Solana smart contract')
  }

  // Submission review handlers with escrow integration
  const handleApproveSubmission = async (submissionId: string, earnings: number) => {
    try {
      await approveSubmission(submissionId, earnings)
      console.log(`Release ${earnings} SOL from escrow to participant`)
      await fetchSubmissions()

      if (escrowData) {
        const newPaidCount = (escrowData.participantsPaid || 0) + 1
        const newReleasedAmount = (escrowData.releasedAmount || 0) + earnings

        setEscrowData({
          ...escrowData,
          participantsPaid: newPaidCount,
          releasedAmount: newReleasedAmount,
          status: newPaidCount >= (escrowData.participantsTotal || 0) ? 'released' : 'partial'
        })
      }
    } catch (error) {
      console.error('Failed to approve submission:', error)
      throw error
    }
  }

  const handleRejectSubmission = async (submissionId: string, reason?: string) => {
    try {
      await rejectSubmission(submissionId, reason)
      await fetchSubmissions()
    } catch (error) {
      console.error('Failed to reject submission:', error)
      throw error
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated || !userId) {
      setSubmitError('Please sign in to submit')
      return
    }

    if (!platform || !videoUrl) {
      setSubmitError('Platform and video URL are required')
      return
    }

    try {
      setSubmitting(true)
      setSubmitError('')

      await createSubmission({
        submissionId: `sub_${Date.now()}_${userId}`,
        campaignId: campaign.id,
        userId: userId,
        status: 'pending',
        mediaUrl: videoUrl,
        views: 0,
        earnings: 0,
        notes: description || undefined,
      })

      setSubmitSuccess(true)
      setPlatform('')
      setVideoUrl('')
      setDescription('')

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)

      // Refresh submissions
      await fetchSubmissions()
    } catch (error) {
      console.error('Failed to submit:', error)
      setSubmitError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    async function fetchCampaign() {
      if (!params?.id) return

      try {
        setLoading(true)
        const data = await getCampaignById(params.id as string)

        // Fetch submissions for this campaign
        await fetchSubmissions()

        if (!data) {
          // Campaign not found - use mock data
          console.warn('Campaign not found in Appwrite, using mock data')
          setCampaign({
            id: params.id as string,
            title: 'Clip $COIN Launch Video',
            description: 'Create engaging short-form content showcasing the $COIN token launch. Best clips will be featured across our social channels!',
            pool: 2000,
            paid: 400,
            ratePerThousand: 20,
            participants: 23,
            views: 45,
            platforms: ['youtube', 'tiktok', 'twitch'],
            duration: '5 days left',
            socialLinks: [
              'https://twitter.com/coinproject',
              'https://discord.gg/coinproject',
              'https://t.me/coinproject'
            ],
            driveLink: 'https://drive.google.com/drive/folders/creator-kit',
            rules: {
              minViews: 1000,
              minDuration: 30,
              maxDuration: 180,
              platforms: ['youtube', 'tiktok', 'twitch'],
            },
            examples: [
              { id: '1', creator: '@creator1', views: 15000, earned: 300 },
              { id: '2', creator: '@creator2', views: 12000, earned: 240 },
              { id: '3', creator: '@creator3', views: 8500, earned: 170 },
            ]
          })
          setLoading(false)
          return
        }

        // Convert Appwrite Campaign to page format
        setCampaign({
          id: data.$id,
          title: data.title,
          description: data.description,
          pool: (data as any).budget || 0,
          paid: (data as any).budgetPaid || 0,
          ratePerThousand: data.ratePerThousand || 20,
          participants: data.participants || 0,
          views: (data as any).totalViews || 0,
          platforms: data.platforms || ['youtube', 'tiktok', 'twitch'],
          duration: data.deadline ? new Date(data.deadline).toLocaleDateString() : 'No deadline',
          socialLinks: (data as any).socialLinks || [],
          driveLink: (data as any).creatorKitUrl || '',
          rules: {
            minViews: data.minViews || 1000,
            minDuration: data.minDuration || 30,
            maxDuration: data.maxDuration || 180,
            platforms: data.platforms || ['youtube', 'tiktok', 'twitch'],
          },
          examples: (data as any).topSubmissions || []
        })

        // Set mock escrow data if campaign has escrow fields
        const campaignData = data as Campaign
        if (campaignData.escrowId && campaignData.escrowStatus && campaignData.escrowAmount) {
          setEscrowData({
            escrowId: campaignData.escrowId,
            status: campaignData.escrowStatus,
            totalAmount: campaignData.escrowAmount,
            releasedAmount: (campaignData.paidParticipants || 0) * (campaignData.escrowAmount / (campaignData.expectedParticipants || 1)),
            participantsTotal: campaignData.expectedParticipants || 10,
            participantsPaid: campaignData.paidParticipants || 0,
            deadline: data.deadline
          })
        }
      } catch (error) {
        console.error('Failed to fetch campaign:', error)
        // Fallback to mock data
        setCampaign({
          id: params.id,
          title: 'Clip $COIN Launch Video',
          description: 'Create engaging short-form content showcasing the $COIN token launch. Best clips will be featured across our social channels!',
          pool: 2000,
          paid: 400,
          ratePerThousand: 20,
          participants: 23,
          views: 45,
          platforms: ['youtube', 'tiktok', 'twitch'],
          duration: '5 days left',
          socialLinks: [
            'https://twitter.com/coinproject',
            'https://discord.gg/coinproject',
            'https://t.me/coinproject'
          ],
          driveLink: 'https://drive.google.com/drive/folders/creator-kit',
          rules: {
            minViews: 1000,
            minDuration: 30,
            maxDuration: 180,
            platforms: ['youtube', 'tiktok', 'twitch'],
          },
          examples: [
            { id: '1', creator: '@creator1', views: 15000, earned: 300 },
            { id: '2', creator: '@creator2', views: 12000, earned: 240 },
            { id: '3', creator: '@creator3', views: 8500, earned: 170 },
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    if (params?.id) {
      fetchCampaign()
    }
  }, [params?.id])

  // Animate progress bar on mount
  useEffect(() => {
    if (campaign) {
      const progress = Math.round((campaign.paid / campaign.pool) * 100)
      setTimeout(() => setAnimatedProgress(progress), 300)
    }
  }, [campaign])

  // Helper function to get social link label
  const getLinkLabel = (url: string) => {
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter'
    if (url.includes('discord')) return 'Discord'
    if (url.includes('t.me') || url.includes('telegram')) return 'Telegram'
    if (url.includes('youtube')) return 'YouTube'
    if (url.includes('tiktok')) return 'TikTok'
    if (url.includes('twitch')) return 'Twitch'
    return 'Link'
  }

  // Loading skeleton
  if (loading || !campaign) {
    return (
      <div className="min-h-screen bg-black">
        {/* Sticky Header Skeleton */}
        <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-[#D1FD0A]/20">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="h-9 w-24 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-9 w-9 bg-zinc-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-1 bg-zinc-900">
            <div className="h-full w-0 bg-[#D1FD0A] animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-3 space-y-3">
          <div className="h-20 rounded-lg glass-premium animate-pulse" />
          <div className="h-32 rounded-lg glass-premium animate-pulse" />
          <div className="h-14 rounded-xl glass-premium animate-pulse" />
          <div className="h-60 rounded-lg glass-premium animate-pulse" />
        </div>
      </div>
    )
  }

  const progressPct = Math.round((campaign.paid / campaign.pool) * 100)
  const isOwner = userId && campaign.userId === userId // Check if current user is campaign owner

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-[#D1FD0A]/20">
        <div className="flex items-center justify-between px-3 py-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-[#D1FD0A]" />
            <span className="text-sm text-white font-medium">Campaigns</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-zinc-800 transition-colors active:scale-95">
            <MoreVertical className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
        {/* Progress indicator */}
        <div className="h-1 bg-zinc-900">
          <div
            className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#B8E309] transition-all duration-700 ease-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="pb-8">
        {/* Compact Hero Section */}
        <div className="p-3 space-y-3">
          {/* Title + Status */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-1 rounded-md bg-[#D1FD0A]/20 border border-[#D1FD0A]/40 text-[#D1FD0A] text-xs font-bold">
                🎯 LIVE
              </span>
              <span className="text-xs text-zinc-400">Campaign</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {campaign.title}
            </h1>
            <p className="text-sm text-zinc-400 mt-2 line-clamp-2 md:line-clamp-none">
              {campaign.description}
            </p>
          </div>

          {/* Key Stats (2-column compact on mobile, 4-column on desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="glass-premium p-3 rounded-lg border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Prize</div>
              <div className="text-lg md:text-xl font-led-dot text-white">${campaign.pool.toLocaleString()}</div>
            </div>
            <div className="glass-premium p-3 rounded-lg border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Rate</div>
              <div className="text-lg md:text-xl font-led-dot text-white">${campaign.ratePerThousand}/1k</div>
            </div>
            <div className="glass-premium p-3 rounded-lg border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Creators</div>
              <div className="text-lg md:text-xl font-led-dot text-white">{campaign.participants}</div>
            </div>
            <div className="glass-premium p-3 rounded-lg border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Views</div>
              <div className="text-lg md:text-xl font-led-dot text-white">{campaign.views}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">
                <span className="font-led-dot text-white">${campaign.paid.toLocaleString()}</span> of{' '}
                <span className="font-led-dot text-white">${campaign.pool.toLocaleString()}</span> paid
              </span>
              <span className="font-led-dot text-[#D1FD0A]">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#B8E309] transition-all duration-700 ease-out shadow-lg shadow-[#D1FD0A]/20"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Primary Action CTA */}
        <div className="px-3 pb-3">
          {!hasJoined ? (
            <button
              onClick={() => setHasJoined(true)}
              className="w-full h-14 rounded-xl bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#D1FD0A]/20 hover:shadow-xl hover:shadow-[#D1FD0A]/30"
            >
              <Video className="w-5 h-5" />
              Join Campaign
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/40 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-[#D1FD0A]" />
                <span className="text-[#D1FD0A] font-bold">You're in!</span>
              </div>
              <p className="text-xs text-zinc-400">Submit your clip below to start earning</p>
            </div>
          )}
        </div>

        {/* Escrow Status Card */}
        {escrowData && escrowData.escrowId && escrowData.status && escrowData.totalAmount !== undefined && (
          <div className="px-3 pb-3">
            <EscrowStatusCard
              escrowId={escrowData.escrowId}
              status={escrowData.status}
              totalAmount={escrowData.totalAmount}
              releasedAmount={escrowData.releasedAmount}
              participantsTotal={escrowData.participantsTotal || 0}
              participantsPaid={escrowData.participantsPaid || 0}
              deadline={escrowData.deadline}
              onRelease={handleReleasePayment}
              onCancel={handleCancelEscrow}
            />
          </div>
        )}

        {/* Collapsible Rules Section */}
        <div className="border-t border-zinc-800">
          <button
            onClick={() => setRulesExpanded(!rulesExpanded)}
            className="w-full px-3 py-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D1FD0A]" />
              <span className="font-bold text-white">Campaign Rules</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-zinc-400 transition-transform duration-300",
                rulesExpanded && "rotate-180"
              )}
            />
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              rulesExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-3 pb-4 space-y-3">
              {/* Quick Rules (Scannable) */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D1FD0A] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white font-medium">
                      {campaign.rules.platforms.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                    </div>
                    <div className="text-xs text-zinc-500">Accepted platforms</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D1FD0A] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white font-medium">
                      {campaign.rules.minDuration}-{campaign.rules.maxDuration} seconds
                    </div>
                    <div className="text-xs text-zinc-500">Video length requirement</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D1FD0A] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white font-medium">
                      {campaign.rules.minViews.toLocaleString()} minimum views
                    </div>
                    <div className="text-xs text-zinc-500">To qualify for payout</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D1FD0A] mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white font-medium">
                      ${campaign.ratePerThousand} per 1,000 views
                    </div>
                    <div className="text-xs text-zinc-500">Payment rate</div>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {campaign.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Form (Inline, Always Visible if Joined) */}
        {hasJoined && (
          <div className="border-t border-zinc-800 p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#D1FD0A]" />
              <h3 className="font-bold text-white">Submit Your Clip</h3>
            </div>

            {/* Compact Form */}
            <div className="space-y-2">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full h-12 px-3 rounded-lg glass-premium border border-[#D1FD0A]/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:ring-offset-2 focus:ring-offset-black transition-all"
              >
                <option value="" className="bg-zinc-900">Select platform</option>
                {campaign.rules.platforms.map((p: string) => (
                  <option key={p} value={p} className="bg-zinc-900">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>

              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full h-12 px-3 rounded-lg glass-premium border border-[#D1FD0A]/20 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:ring-offset-2 focus:ring-offset-black transition-all"
              />

              <button
                onClick={handleSubmit}
                disabled={!platform || !videoUrl || submitting}
                className="w-full h-12 rounded-lg bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-[#D1FD0A]/20 hover:shadow-xl hover:shadow-[#D1FD0A]/30"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Clip'
                )}
              </button>
            </div>

            {/* Success Toast */}
            {submitSuccess && (
              <div className="p-3 rounded-lg bg-[#D1FD0A]/20 border border-[#D1FD0A]/40 flex items-start gap-2 animate-in slide-in-from-top duration-300">
                <CheckCircle className="w-5 h-5 text-[#D1FD0A] flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-[#D1FD0A]">Submitted!</div>
                  <div className="text-xs text-zinc-400">Your clip is under review</div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 flex items-start gap-2 animate-in slide-in-from-top duration-300">
                <div className="text-sm font-bold text-red-300">{submitError}</div>
              </div>
            )}
          </div>
        )}

        {/* Horizontal Scroll Leaderboard (Mobile) / Grid (Desktop) */}
        <div className="border-t border-zinc-800 py-3">
          <div className="px-3 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D1FD0A]" />
              <h3 className="font-bold text-white">Top Creators</h3>
            </div>
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto scrollbar-hide pl-3">
            <div className="flex gap-2 pb-2">
              {campaign.examples.slice(0, 5).map((creator: any, idx: number) => (
                <div
                  key={creator.id}
                  className="flex-shrink-0 w-32 p-3 rounded-lg glass-premium border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all active:scale-95"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-led-dot text-zinc-500">#{idx + 1}</span>
                  </div>
                  <div className="text-sm font-medium text-white truncate">
                    {creator.creator}
                  </div>
                  <div className="text-xs text-zinc-400 font-led-dot">
                    {creator.views.toLocaleString()} views
                  </div>
                  <div className="mt-2 text-lg font-bold font-led-dot text-[#D1FD0A]">
                    ${creator.earned}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:block px-3">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {campaign.examples.slice(0, 6).map((creator: any, idx: number) => (
                <div
                  key={creator.id}
                  className="p-4 rounded-lg glass-premium border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-led-dot text-zinc-500">#{idx + 1}</span>
                    <span className="text-xl font-bold font-led-dot text-[#D1FD0A]">${creator.earned}</span>
                  </div>
                  <div className="text-base font-medium text-white">
                    {creator.creator}
                  </div>
                  <div className="text-sm text-zinc-400 font-led-dot">
                    {creator.views.toLocaleString()} views
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Assets Section */}
        <div className="border-t border-zinc-800">
          <button
            onClick={() => setAssetsExpanded(!assetsExpanded)}
            className="w-full px-3 py-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D1FD0A]" />
              <span className="font-bold text-white">Creator Kit & Links</span>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-zinc-400 transition-transform duration-300",
                assetsExpanded && "rotate-180"
              )}
            />
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              assetsExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-3 pb-4 space-y-3">
              {/* Creator Kit Download */}
              {campaign.driveLink && (
                <a
                  href={campaign.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/30 hover:bg-[#D1FD0A]/20 active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5 text-[#D1FD0A] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#D1FD0A]">Download Creator Kit</div>
                    <div className="text-xs text-zinc-400">Logos, guidelines & assets</div>
                  </div>
                </a>
              )}

              {/* Social Links Grid */}
              {campaign.socialLinks && campaign.socialLinks.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {campaign.socialLinks.map((link: string, idx: number) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg glass-premium border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all active:scale-95 min-h-[48px]"
                    >
                      <Globe className="w-4 h-4 text-[#D1FD0A] flex-shrink-0" />
                      <span className="text-xs text-white truncate">{getLinkLabel(link)}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Earnings Info Card */}
        <div className="border-t border-zinc-800 p-3">
          <div className="glass-premium rounded-lg border border-[#D1FD0A]/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D1FD0A]" />
              <h3 className="font-bold text-white">Earnings Calculator</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Rate per 1k views</span>
                <span className="font-led-dot text-white font-bold">${campaign.ratePerThousand}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Payment in</span>
                <span className="px-2 py-1 rounded bg-[#D1FD0A]/10 border border-[#D1FD0A]/30 text-[#D1FD0A] text-xs font-bold">
                  USDC
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <div className="text-xs text-zinc-500 mb-1">Example calculation:</div>
                <div className="text-sm text-zinc-400">
                  <span className="font-led-dot">10,000</span> views = {' '}
                  <span className="text-[#D1FD0A] font-bold font-led-dot">${campaign.ratePerThousand * 10} USDC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="border-t border-zinc-800 p-3">
          <div className="glass-premium rounded-lg border border-[#D1FD0A]/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#D1FD0A]" />
              <h3 className="font-bold text-white">Timeline</h3>
            </div>
            <div className="flex items-center gap-2 text-[#D1FD0A]">
              <Clock className="w-4 h-4" />
              <span className="font-semibold font-led-dot">{campaign.duration}</span>
            </div>
          </div>
        </div>

        {/* Submissions Review Section (Owner Only) */}
        {submissions.length > 0 && (
          <div className="border-t border-zinc-800 p-3">
            <div className="glass-premium rounded-lg border border-[#D1FD0A]/20 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#D1FD0A] flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#D1FD0A]" />
                  Submissions (<span className="font-led-dot">{submissions.length}</span>)
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSubmissionsTab(tab)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap min-h-[44px]",
                      submissionsTab === tab
                        ? 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-2 border-[#D1FD0A]/40'
                        : 'glass-premium text-zinc-400 hover:text-white border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/30'
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab !== 'all' && (
                      <span className="ml-1.5 text-xs opacity-70 font-led-dot">
                        ({submissions.filter(s => s.status === tab).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Submissions List */}
              <div className="space-y-3">
                {loadingSubmissions ? (
                  <div className="text-center py-8 text-zinc-400">
                    <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading submissions...
                  </div>
                ) : (
                  submissions
                    .filter(s => submissionsTab === 'all' || s.status === submissionsTab)
                    .map((submission) => (
                      <SubmissionReviewCard
                        key={submission.$id}
                        submission={submission}
                        campaignRatePerThousand={campaign.ratePerThousand}
                        onApprove={handleApproveSubmission}
                        onReject={handleRejectSubmission}
                        compact={false}
                      />
                    ))
                )}

                {submissions.filter(s => submissionsTab === 'all' || s.status === submissionsTab).length === 0 && !loadingSubmissions && (
                  <div className="text-center py-8 text-zinc-500">
                    No {submissionsTab !== 'all' ? submissionsTab : ''} submissions yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
