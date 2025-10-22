"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Search, Play } from 'lucide-react'
import { createCampaign, getCampaigns, type Campaign } from '@/lib/appwrite/services/campaigns'
import { submitClip, getClips, approveClip, type Clip } from '@/lib/appwrite/services/clips'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { type CampaignFormData } from '@/lib/validations/clip'

// Lazy-load heavy modals to reduce initial bundle size
const CreateCampaignModal = dynamic(() => import('@/components/modals/CreateCampaignModal').then(mod => ({ default: mod.CreateCampaignModal })), {
  ssr: false,
})
const SubmitClipModal = dynamic(() => import('@/components/modals/SubmitClipModal').then(mod => ({ default: mod.SubmitClipModal })), {
  ssr: false,
})

// Extended Clip type with campaignTitle for review UI
interface ClipWithCampaign extends Clip {
  campaignTitle?: string
}

export default function ClipsAndCampaignsPage() {
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false)
  const [submitClipOpen, setSubmitClipOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [clips, setClips] = useState<Clip[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingClipsByCampaign, setPendingClipsByCampaign] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [clipsLoading, setClipsLoading] = useState(true)
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [hoveredClipId, setHoveredClipId] = useState<string | null>(null)
  const [pendingClips, setPendingClips] = useState<ClipWithCampaign[]>([])
  const [pendingLoading, setPendingLoading] = useState(false)
  const [selectedReviewClips, setSelectedReviewClips] = useState<Set<string>>(new Set())
  const [batchActionLoading, setBatchActionLoading] = useState(false)
  const [collapsedCampaigns, setCollapsedCampaigns] = useState<Set<string>>(new Set())
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const { userId, user, userInfo, connected } = useWallet()
  const router = useRouter()

  // Generate embed URL for video preview
  const getEmbedUrl = (clip: Clip): string | null => {
    try {
      const url = clip.embedUrl

      // YouTube
      if (clip.platform === 'youtube') {
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          /youtube\.com\/shorts\/([^&\n?#]+)/
        ]
        for (const pattern of patterns) {
          const match = url.match(pattern)
          if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`
        }
      }

      // TikTok - uses oembed
      if (clip.platform === 'tiktok') {
        // TikTok embed requires full page, not ideal for hover preview
        return null
      }

      // Twitter/X - uses oembed
      if (clip.platform === 'twitter') {
        return null
      }

      return null
    } catch (error) {
      return null
    }
  }

  // Calculate total pending clips for badge
  const totalPendingCount = useMemo(
    () => Object.values(pendingClipsByCampaign).reduce((sum, count) => sum + count, 0),
    [pendingClipsByCampaign]
  )

  // Show Review Pending tab only if user owns campaigns with pending clips
  const userOwnsCampaignsWithPending = useMemo(
    () => campaigns.some(c => c.createdBy === userId && pendingClipsByCampaign[c.campaignId] > 0),
    [campaigns, userId, pendingClipsByCampaign]
  )

  const tabs = useMemo(() => {
    const baseTabs = ["All", "Trending", "My Clips", "Campaigns", "Bounties", "Analytics"]
    return userOwnsCampaignsWithPending
      ? [...baseTabs.slice(0, 3), "Review Pending", ...baseTabs.slice(3)]
      : baseTabs
  }, [userOwnsCampaignsWithPending])

  // Swipe gesture handlers for mobile tab navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    }

    const deltaX = touchEnd.x - touchStartRef.current.x
    const deltaY = touchEnd.y - touchStartRef.current.y
    const deltaTime = touchEnd.time - touchStartRef.current.time

    // Check if it's a horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) * 2 && Math.abs(deltaX) > 50 && deltaTime < 300) {
      if (deltaX > 0 && selectedTab > 0) {
        // Swipe right - previous tab
        setSelectedTab(selectedTab - 1)
      } else if (deltaX < 0 && selectedTab < tabs.length - 1) {
        // Swipe left - next tab
        setSelectedTab(selectedTab + 1)
      }
    }

    touchStartRef.current = null
  }

  // Filter and sort clips based on search query and selected tab
  const filteredClips = useMemo(() => {
    let result = clips

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(clip =>
        clip.title?.toLowerCase().includes(query) ||
        clip.projectName?.toLowerCase().includes(query) ||
        clip.creatorUsername?.toLowerCase().includes(query) ||
        clip.platform.toLowerCase().includes(query)
      )
    }

    // Apply tab-specific sorting
    if (selectedTab === tabs.indexOf("Trending")) {
      // Trending: Sort by engagement rate (recent activity weighted)
      result = [...result].sort((a, b) => {
        const aRecency = Math.max(0, 7 - Math.floor((Date.now() - new Date(a.$createdAt).getTime()) / (1000 * 60 * 60 * 24)))
        const bRecency = Math.max(0, 7 - Math.floor((Date.now() - new Date(b.$createdAt).getTime()) / (1000 * 60 * 60 * 24)))
        const aScore = a.engagement * (1 + aRecency * 0.2) // Boost recent clips
        const bScore = b.engagement * (1 + bRecency * 0.2)
        return bScore - aScore
      })
    } else if (selectedTab === 0) {
      // All: Sort by views (default)
      result = [...result].sort((a, b) => b.views - a.views)
    }

    return result
  }, [clips, searchQuery, selectedTab, tabs])

  // Calculate metrics from filtered data (memoized to prevent recalculation on every render)
  const metrics = useMemo(() => {
    const clipsToUse = filteredClips
    const totalViews = clipsToUse.reduce((sum, clip) => sum + clip.views, 0)
    const totalLikes = clipsToUse.reduce((sum, clip) => sum + clip.likes, 0)
    const totalClicks = clipsToUse.reduce((sum, clip) => sum + clip.clicks, 0)
    const avgEngagement = clipsToUse.length > 0
      ? (clipsToUse.reduce((sum, clip) => sum + clip.engagement, 0) / clipsToUse.length).toFixed(1)
      : '0.0'

    return [
      { label: "Total Views", value: totalViews.toLocaleString() },
      { label: "Total Likes", value: totalLikes.toLocaleString() },
      { label: "Click-Through", value: totalClicks.toLocaleString() },
      { label: "Avg Engagement", value: `${avgEngagement}%` },
    ]
  }, [filteredClips])

  // Load campaigns from Appwrite
  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true)
        const data = await getCampaigns({ status: 'active', limit: 10 })
        setCampaigns(data)

        // OPTIMIZED: Load all pending clips once, then group by campaign
        const allPendingClips = await getClips({ status: 'pending' })
        const pendingCounts: Record<string, number> = {}

        allPendingClips.forEach(clip => {
          if (clip.campaignId) {
            pendingCounts[clip.campaignId] = (pendingCounts[clip.campaignId] || 0) + 1
          }
        })

        setPendingClipsByCampaign(pendingCounts)
      } catch (error) {
        console.error('Error loading campaigns:', error)
        toast.error('Failed to load campaigns')
      } finally {
        setLoading(false)
      }
    }
    loadCampaigns()
  }, [])

  // Load clips from Appwrite
  useEffect(() => {
    async function loadClips() {
      try {
        setClipsLoading(true)
        const data = await getClips({ status: 'active', sortBy: 'views', limit: 12 })
        setClips(data)
      } catch (error) {
        console.error('Error loading clips:', error)
      } finally {
        setClipsLoading(false)
      }
    }
    loadClips()
  }, [])

  // Load pending clips for review when Review Pending tab is selected
  useEffect(() => {
    async function loadPendingClips() {
      if (selectedTab !== tabs.indexOf("Review Pending") || !userId) return

      try {
        setPendingLoading(true)
        const allPendingClips: Clip[] = []

        // Fetch pending clips for all campaigns owned by user
        for (const campaign of campaigns) {
          if (campaign.createdBy === userId) {
            const clips = await getClips({
              campaignId: campaign.campaignId,
              status: 'pending'
            })
            allPendingClips.push(...clips.map(clip => ({ ...clip, campaignTitle: campaign.title })))
          }
        }

        setPendingClips(allPendingClips)
      } catch (error) {
        console.error('Error loading pending clips:', error)
      } finally {
        setPendingLoading(false)
      }
    }
    loadPendingClips()
  }, [selectedTab, userId, campaigns, tabs])

  const handleCreateCampaign = async (formData: CampaignFormData) => {
    try {
      if (!connected) {
        toast.error('Please connect your wallet first')
        return
      }

      const currentUserId = userId || 'unknown'

      // Calculate deadline from duration (in days)
      const durationDays = parseInt(formData.duration) || 7
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + durationDays)

      const campaign = await createCampaign({
        campaignId: `campaign_${Date.now()}`,
        type: formData.type || 'clipping',
        title: formData.title,
        description: formData.description || '',
        createdBy: currentUserId,
        status: 'active',
        prizePool: parseFloat(formData.budget) || 0,
        budgetTotal: parseFloat(formData.budget) || 0,
        ratePerThousand: parseFloat(formData.ratePerThousand || '0') || 0,
        minViews: 0,
        minDuration: 0,
        maxDuration: 0,
        platforms: formData.platforms || [],
        socialLinks: [],
        gdocUrl: '',
        imageUrl: '',
        ownerType: 'user',
        ownerId: currentUserId,
        deadline: deadline.toISOString(),
        requirements: formData.requirements || []
      })

      if (campaign) {
        console.log('✅ Campaign created successfully:', campaign)
        toast.success('Campaign created successfully!', {
          description: 'Creators can now submit clips to your campaign',
          action: {
            label: 'View',
            onClick: () => router.push(`/campaign/${campaign.$id}`)
          }
        })
        // Refresh campaigns list
        const updatedCampaigns = await getCampaigns({ status: 'active', limit: 10 })
        setCampaigns(updatedCampaigns)
      } else {
        toast.error('Failed to create campaign')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      const message = error instanceof Error ? error.message : 'Error creating campaign'
      toast.error(message)
    }
  }

  const [preSelectedCampaignId, setPreSelectedCampaignId] = useState<string | null>(null)

  const handleJoinCampaign = (campaignId: string) => {
    if (!connected) {
      toast.error('Please connect your wallet to join campaigns')
      return
    }
    // Open Submit Clip modal with campaign pre-selected
    setPreSelectedCampaignId(campaignId)
    setSubmitClipOpen(true)
  }

  const handleViewCampaignDetails = (campaignId: string) => {
    // Navigate to campaign detail page
    router.push(`/campaign/${campaignId}`)
  }

  const [reactions, setReactions] = useState<Map<string, string>>(new Map())

  const handleBuyClip = (clip: Clip) => {
    if (!connected) {
      toast.error('Please connect your wallet to buy')
      return
    }

    if (!clip.projectId) {
      toast.error('No project linked to this clip')
      return
    }

    // Navigate to project buy page
    router.push(`/launch/${clip.projectId}?action=buy`)
  }

  const handleReactToClip = (clipId: string, emoji: string = '🔥') => {
    if (!connected) {
      toast.error('Please connect your wallet to react')
      return
    }

    setReactions(prev => new Map(prev).set(clipId, emoji))
    // TODO: Save to Appwrite reactions collection
    toast.success(`Reacted with ${emoji}`)
  }

  const handleShareClip = (clipId: string, clip: Clip) => {
    const shareUrl = `${window.location.origin}/clip/${clipId}`
    navigator.clipboard.writeText(shareUrl)

    toast.success('Link copied!', {
      description: 'Share this clip with your network',
      action: {
        label: 'Tweet',
        onClick: () => {
          const tweetText = `Check out this clip! ${clip.projectName || 'Amazing content'}`
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          )
        }
      }
    })
  }

  const handlePlayClip = (clipId: string) => {
    setSelectedClipId(clipId)
    console.log('Playing clip:', clipId)
    // TODO: Open video player modal or navigate to external URL
    const clip = clips.find(c => c.$id === clipId)
    if (clip) {
      window.open(clip.embedUrl, '_blank')
    }
  }

  const handleApproveClip = async (clipId: string) => {
    try {
      await approveClip(clipId, true, userId || undefined)
      // Remove from pending list
      setPendingClips(prev => prev.filter(c => c.$id !== clipId))
      // Update pending count
      const clip = pendingClips.find(c => c.$id === clipId)
      if (clip?.campaignId) {
        setPendingClipsByCampaign(prev => ({
          ...prev,
          [clip.campaignId!]: Math.max(0, (prev[clip.campaignId!] || 0) - 1)
        }))
      }
      toast.success('Clip approved successfully!')
    } catch (error) {
      console.error('Error approving clip:', error)
      const message = error instanceof Error ? error.message : 'Failed to approve clip'
      toast.error(message)
    }
  }

  const handleRejectClip = async (clipId: string) => {
    try {
      await approveClip(clipId, false, userId || undefined)
      // Remove from pending list
      setPendingClips(prev => prev.filter(c => c.$id !== clipId))
      // Update pending count
      const clip = pendingClips.find(c => c.$id === clipId)
      if (clip?.campaignId) {
        setPendingClipsByCampaign(prev => ({
          ...prev,
          [clip.campaignId!]: Math.max(0, (prev[clip.campaignId!] || 0) - 1)
        }))
      }
      toast.success('Clip rejected')
    } catch (error) {
      console.error('Error rejecting clip:', error)
      const message = error instanceof Error ? error.message : 'Failed to reject clip'
      toast.error(message)
    }
  }

  const handleBatchApprove = async () => {
    if (selectedReviewClips.size === 0) return

    try {
      setBatchActionLoading(true)
      const clipIds = Array.from(selectedReviewClips)

      for (const clipId of clipIds) {
        await approveClip(clipId, true)
      }

      // Remove approved clips from pending list
      setPendingClips(prev => prev.filter(c => !selectedReviewClips.has(c.$id)))

      // Update pending counts
      clipIds.forEach(clipId => {
        const clip = pendingClips.find(c => c.$id === clipId)
        if (clip?.campaignId) {
          setPendingClipsByCampaign(prev => ({
            ...prev,
            [clip.campaignId!]: Math.max(0, (prev[clip.campaignId!] || 0) - 1)
          }))
        }
      })

      setSelectedReviewClips(new Set())
      toast.success(`${clipIds.length} clips approved successfully!`)
    } catch (error) {
      console.error('Error batch approving clips:', error)
      const message = error instanceof Error ? error.message : 'Failed to approve clips'
      toast.error(message)
    } finally {
      setBatchActionLoading(false)
    }
  }

  const handleBatchReject = async () => {
    if (selectedReviewClips.size === 0) return

    try {
      setBatchActionLoading(true)
      const clipIds = Array.from(selectedReviewClips)

      for (const clipId of clipIds) {
        await approveClip(clipId, false)
      }

      // Remove rejected clips from pending list
      setPendingClips(prev => prev.filter(c => !selectedReviewClips.has(c.$id)))

      // Update pending counts
      clipIds.forEach(clipId => {
        const clip = pendingClips.find(c => c.$id === clipId)
        if (clip?.campaignId) {
          setPendingClipsByCampaign(prev => ({
            ...prev,
            [clip.campaignId!]: Math.max(0, (prev[clip.campaignId!] || 0) - 1)
          }))
        }
      })

      setSelectedReviewClips(new Set())
      toast.success(`${clipIds.length} clips rejected`)
    } catch (error) {
      console.error('Error batch rejecting clips:', error)
      const message = error instanceof Error ? error.message : 'Failed to reject clips'
      toast.error(message)
    } finally {
      setBatchActionLoading(false)
    }
  }

  const toggleClipSelection = (clipId: string) => {
    setSelectedReviewClips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(clipId)) {
        newSet.delete(clipId)
      } else {
        newSet.add(clipId)
      }
      return newSet
    })
  }

  const toggleCampaignCollapse = (campaignId: string) => {
    setCollapsedCampaigns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId)
      } else {
        newSet.add(campaignId)
      }
      return newSet
    })
  }

  const handleSubmitClip = async (data: {
    embedUrl: string
    title?: string
    projectName?: string
    projectId?: string
    projectLogo?: string
    campaignId?: string
  }) => {
    try {
      if (!connected) {
        toast.error('Please connect your wallet first')
        return
      }

      const currentUserId = userId || 'unknown'

      // Extract user info from Privy
      const creatorUsername = user?.twitter?.username || user?.email?.address?.split('@')[0] || user?.google?.name || currentUserId.slice(0, 12)
      const creatorAvatar = user?.twitter?.profilePictureUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUserId}`

      const clip = await submitClip({
        embedUrl: data.embedUrl,
        submittedBy: currentUserId,
        campaignId: data.campaignId,
        title: data.title,
        projectName: data.projectName,
        projectId: data.projectId,
        projectLogo: data.projectLogo,
        creatorUsername,
        creatorAvatar,
        badge: 'LIVE'
      })

      if (clip) {
        console.log('✅ Clip submitted successfully:', clip)

        if (data.campaignId) {
          toast.success('Clip submitted for review!', {
            description: 'The campaign owner will review your submission'
          })
        } else {
          toast.success('Clip submitted successfully!')
        }

        // Refresh clips list
        const updatedClips = await getClips({ status: 'active', sortBy: 'views', limit: 12 })
        setClips(updatedClips)
      } else {
        toast.error('Failed to submit clip')
      }
    } catch (error) {
      console.error('Error submitting clip:', error)
      const message = error instanceof Error ? error.message : 'Error submitting clip'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 bg-neutral-950/90 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-3 md:px-4 py-2 md:py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
            <div className="text-base md:text-xl font-semibold tracking-tight flex items-center gap-2">
              <span className="text-white/90">🎬</span>
              <span>Clips & Campaigns</span>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto sm:max-w-md">
              <div className="relative flex-1 sm:flex-auto">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clips, creators, projects"
                  aria-label="Search clips, creators, and projects"
                  className="w-full rounded-lg md:rounded-xl bg-white/5 border border-white/10 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm outline-none focus:border-white/20 placeholder:text-white/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 md:right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 text-[10px] md:text-xs transition"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
                {!searchQuery && (
                  <div className="absolute right-2 md:right-2.5 top-1/2 -translate-y-1/2 text-white/40 text-[10px] md:text-xs">/</div>
                )}
              </div>
              <button
                onClick={() => setSubmitClipOpen(true)}
                className="flex-shrink-0 rounded-lg md:rounded-xl bg-white text-black px-4 md:px-4 py-2.5 md:py-2.5 text-sm md:text-sm font-medium hover:bg-neutral-200 transition min-h-[44px] flex items-center justify-center"
              >
                + Clip
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-3 md:px-4 pb-2 md:pb-3 relative">
          {/* Swipe hint indicator for mobile */}
          <div className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs animate-pulse pointer-events-none">
            ← swipe →
          </div>
          <nav className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Clip navigation tabs">
            {tabs.map((t, idx) => (
              <button
                key={t}
                role="tab"
                aria-selected={selectedTab === idx}
                aria-controls={`tabpanel-${idx}`}
                onClick={() => setSelectedTab(idx)}
                className={cn(
                  "px-3 md:px-3 py-2 md:py-1.5 rounded-full text-xs md:text-sm border whitespace-nowrap relative min-h-[40px] md:min-h-0 flex items-center justify-center",
                  selectedTab === idx
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                )}
              >
                {t}
                {t === "Review Pending" && totalPendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-4 md:min-w-[20px] md:h-5 px-1 md:px-1.5 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full animate-pulse">
                    {totalPendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main (single column, no sidebar) */}
      <main
        className="mx-auto max-w-7xl px-3 md:px-4 py-3 md:py-6 space-y-3 md:space-y-6"
        role="main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Review Pending Tab Content */}
        {selectedTab === tabs.indexOf("Review Pending") && (
          <section className="space-y-6">
            {/* Batch Actions Bar */}
            {selectedReviewClips.size > 0 && (
              <div className="sticky top-[120px] z-20 rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur p-4 flex items-center justify-between">
                <div className="text-sm text-white/80">
                  {selectedReviewClips.size} clip{selectedReviewClips.size !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedReviewClips(new Set())}
                    className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    disabled={batchActionLoading}
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleBatchReject}
                    className="px-4 py-2 rounded-xl text-sm border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    disabled={batchActionLoading}
                  >
                    {batchActionLoading ? 'Rejecting...' : 'Reject Selected'}
                  </button>
                  <button
                    onClick={handleBatchApprove}
                    className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
                    disabled={batchActionLoading}
                  >
                    {batchActionLoading ? 'Approving...' : 'Approve Selected'}
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {pendingLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
                    <div className="h-32 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : pendingClips.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
                <p className="text-white/60">No pending clips to review right now.</p>
              </div>
            ) : (
              /* Campaign Groups */
              <div className="space-y-4">
                {campaigns
                  .filter(campaign =>
                    campaign.createdBy === userId &&
                    pendingClips.some(clip => clip.campaignId === campaign.campaignId)
                  )
                  .map(campaign => {
                    const campaignClips = pendingClips.filter(clip => clip.campaignId === campaign.campaignId)
                    const isCollapsed = collapsedCampaigns.has(campaign.campaignId)

                    return (
                      <div key={campaign.$id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                        {/* Campaign Header */}
                        <button
                          onClick={() => toggleCampaignCollapse(campaign.campaignId)}
                          className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-xl font-bold text-white">{campaign.title.charAt(0)}</span>
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                              <p className="text-sm text-white/60">{campaignClips.length} pending clip{campaignClips.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <svg
                            className={cn(
                              "w-5 h-5 text-white/60 transition-transform",
                              isCollapsed ? "" : "rotate-180"
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Campaign Clips */}
                        {!isCollapsed && (
                          <div className="border-t border-white/10 p-4 space-y-3">
                            {campaignClips.map(clip => (
                              <div
                                key={clip.$id}
                                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition"
                              >
                                <div className="flex items-start gap-4">
                                  {/* Checkbox */}
                                  <label className="flex items-center cursor-pointer pt-1">
                                    <input
                                      type="checkbox"
                                      checked={selectedReviewClips.has(clip.$id)}
                                      onChange={() => toggleClipSelection(clip.$id)}
                                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-0 cursor-pointer"
                                    />
                                  </label>

                                  {/* Video Preview */}
                                  <div className="relative w-28 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 flex-shrink-0">
                                    {clip.thumbnailUrl ? (
                                      <img
                                        src={clip.thumbnailUrl}
                                        alt={clip.title || 'Clip'}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                                        {clip.platform.toUpperCase()}
                                      </div>
                                    )}
                                    {/* Platform Badge */}
                                    <div className={cn(
                                      "absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center",
                                      clip.platform === 'youtube' && "bg-red-600",
                                      clip.platform === 'tiktok' && "bg-black",
                                      clip.platform === 'twitter' && "bg-black",
                                      clip.platform === 'twitch' && "bg-purple-600",
                                      clip.platform === 'instagram' && "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
                                    )}>
                                      {clip.platform === 'youtube' && (
                                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                      )}
                                      {clip.platform === 'tiktok' && (
                                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                        </svg>
                                      )}
                                      {clip.platform === 'twitter' && (
                                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                      )}
                                    </div>
                                  </div>

                                  {/* Clip Info */}
                                  <div className="flex-1 min-w-0 space-y-3">
                                    {/* Creator Info */}
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={clip.creatorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${clip.submittedBy}`}
                                        alt={clip.creatorUsername || 'Creator'}
                                        className="w-8 h-8 rounded-full border border-white/20"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white truncate">
                                          {clip.creatorUsername ? `@${clip.creatorUsername}` : clip.submittedBy.slice(0, 12)}
                                        </div>
                                        <div className="text-xs text-white/50">
                                          Submitted {new Date(clip.$createdAt).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className="grid grid-cols-4 gap-3">
                                      <div className="text-center">
                                        <div className="text-sm font-semibold text-white">{clip.views.toLocaleString()}</div>
                                        <div className="text-xs text-white/50">Views</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-sm font-semibold text-white">{clip.likes.toLocaleString()}</div>
                                        <div className="text-xs text-white/50">Likes</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-sm font-semibold text-white">{clip.comments.toLocaleString()}</div>
                                        <div className="text-xs text-white/50">Comments</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-sm font-semibold text-emerald-400">{clip.engagement.toFixed(1)}%</div>
                                        <div className="text-xs text-white/50">Engagement</div>
                                      </div>
                                    </div>

                                    {/* Title/Link */}
                                    {clip.title && (
                                      <div className="text-sm text-white/80 line-clamp-2">
                                        {clip.title}
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                      <button
                                        onClick={() => window.open(clip.embedUrl, '_blank')}
                                        className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10 transition"
                                      >
                                        View Clip
                                      </button>
                                      <button
                                        onClick={() => handleRejectClip(clip.$id)}
                                        className="px-4 py-2 rounded-lg border border-red-500/50 bg-red-500/10 text-sm text-red-400 hover:bg-red-500/20 transition"
                                      >
                                        Reject
                                      </button>
                                      <button
                                        onClick={() => handleApproveClip(clip.$id)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 text-sm text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
                                      >
                                        Approve
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </section>
        )}

        {/* Hero Metrics */}
        {selectedTab !== tabs.indexOf("Review Pending") && selectedTab !== 5 && selectedTab !== 2 && selectedTab !== 3 && (
        <section className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-1.5 md:gap-3 -mx-3 px-3 md:mx-0 md:px-0 md:grid md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="snap-center shrink-0 min-w-[140px] md:min-w-0 rounded-lg md:rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-2 md:p-4">
              <div className="text-[10px] md:text-xs uppercase tracking-wide text-white/60">{m.label}</div>
              <div className="mt-0.5 md:mt-1 text-base md:text-xl font-semibold">{m.value}</div>
            </div>
          ))}
        </section>
        )}

        {/* Analytics Tab */}
        {selectedTab === 5 && (
          <section className="space-y-3 md:space-y-6">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">Analytics Overview</h2>
              <div className="flex gap-1.5 md:gap-2">
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10">7D</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[10px] md:text-xs font-semibold">30D</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10">90D</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10">All</button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-lg md:rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-2 md:p-4">
                  <div className="text-[10px] md:text-xs uppercase tracking-wide text-white/60">{m.label}</div>
                  <div className="mt-0.5 md:mt-1 text-lg md:text-2xl font-bold">{m.value}</div>
                  <div className="mt-0.5 md:mt-1 text-[9px] md:text-xs text-emerald-400 flex items-center gap-0.5 md:gap-1">
                    <svg className="w-2 h-2 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +12.5%
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Distribution */}
            <div className="rounded-lg md:rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3 md:p-6">
              <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-4">Platform Distribution</h3>
              <div className="space-y-2 md:space-y-3">
                {[
                  { platform: 'YouTube', count: clips.filter(c => c.platform === 'youtube').length, color: 'bg-red-500' },
                  { platform: 'Twitter/X', count: clips.filter(c => c.platform === 'twitter').length, color: 'bg-blue-400' },
                  { platform: 'TikTok', count: clips.filter(c => c.platform === 'tiktok').length, color: 'bg-black border border-white/20' },
                  { platform: 'Instagram', count: clips.filter(c => c.platform === 'instagram').length, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                ].map(p => (
                  <div key={p.platform} className="flex items-center gap-2 md:gap-3">
                    <div className={cn("w-2 h-2 md:w-3 md:h-3 rounded-full", p.color)} />
                    <div className="flex-1 text-xs md:text-sm text-white/80">{p.platform}</div>
                    <div className="text-xs md:text-sm font-semibold">{p.count} clips</div>
                    <div className="text-[10px] md:text-xs text-white/50">{clips.length > 0 ? Math.round((p.count / clips.length) * 100) : 0}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Clips */}
            <div className="rounded-lg md:rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3 md:p-6">
              <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-4">Top Performing Clips</h3>
              <div className="space-y-2 md:space-y-3">
                {clips
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((clip, idx) => (
                    <div key={clip.$id} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
                      <div className="text-sm md:text-lg font-bold text-white/40 w-5 md:w-6 text-center">#{idx + 1}</div>
                      <img
                        src={clip.thumbnailUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${clip.$id}`}
                        alt="Thumbnail"
                        className="w-12 h-12 md:w-16 md:h-16 rounded-md md:rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs md:text-sm font-medium text-white truncate">{clip.title || 'Untitled Clip'}</div>
                        <div className="text-[10px] md:text-xs text-white/50">by @{clip.creatorUsername || clip.submittedBy.slice(0, 12)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs md:text-sm font-semibold">{clip.views.toLocaleString()}</div>
                        <div className="text-[9px] md:text-xs text-white/50">views</div>
                      </div>
                    </div>
                  ))}
                {clips.length === 0 && (
                  <div className="text-center py-6 md:py-8 text-xs md:text-sm text-white/50">
                    No clips yet. Start submitting to see analytics!
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* My Clips Tab */}
        {selectedTab === 2 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Clips</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-xs font-semibold">All</button>
                <button className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs hover:bg-white/10">Approved</button>
                <button className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs hover:bg-white/10">Pending</button>
                <button className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs hover:bg-white/10">Rejected</button>
              </div>
            </div>

            {clips.filter(c => c.submittedBy === userId).length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Clips Yet</h3>
                <p className="text-white/60 max-w-md mx-auto mb-6">
                  Share content from Twitter, TikTok, YouTube, or Instagram. Get discovered and earn from views.
                </p>
                <button
                  onClick={() => setSubmitClipOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
                >
                  Submit Your First Clip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {clips
                  .filter(c => c.submittedBy === userId)
                  .map((clip) => {
                    const isSelected = selectedClipId === clip.$id
                    const embedUrl = getEmbedUrl(clip)
                    const isHovered = hoveredClipId === clip.$id

                    return (
                      <div
                        key={clip.$id}
                        onClick={() => setSelectedClipId(isSelected ? null : clip.$id)}
                        className={cn(
                          "group rounded-2xl overflow-hidden border bg-white/5 transition-all cursor-pointer",
                          isSelected
                            ? "border-fuchsia-500 ring-2 ring-fuchsia-500/50 scale-[1.02]"
                            : "border-white/10 hover:border-white/20"
                        )}
                      >
                        {/* Reuse clip card structure - simplified version */}
                        <div className="relative aspect-[9/16] bg-gradient-to-br from-neutral-800 to-neutral-900">
                          {clip.thumbnailUrl && (
                            <img
                              src={clip.thumbnailUrl}
                              alt={clip.title || 'Clip'}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold">
                            ✓ Approved
                          </div>

                          {/* Views Badge */}
                          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-white text-xs font-semibold">
                            👁 {clip.views.toLocaleString()}
                          </div>
                        </div>

                        {/* Clip Info */}
                        <div className="p-3 space-y-2">
                          <div className="text-sm font-medium text-white line-clamp-1">
                            {clip.title || 'Untitled Clip'}
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>{new Date(clip.$createdAt).toLocaleDateString()}</span>
                            <span>{clip.engagement.toFixed(1)}% eng.</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShareClip(clip.$id, clip)
                              }}
                              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition"
                            >
                              Share
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(clip.embedUrl, '_blank')
                              }}
                              className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 text-xs text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </section>
        )}

        {/* Campaigns Tab (My Campaigns) */}
        {selectedTab === 3 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Campaigns</h2>
              <button
                onClick={() => setCreateCampaignOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
              >
                + New Campaign
              </button>
            </div>

            {campaigns.filter(c => c.createdBy === userId).length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Campaigns Yet</h3>
                <p className="text-white/60 max-w-md mx-auto mb-6">
                  Create your first campaign to get creators promoting your project and amplifying your reach.
                </p>
                <button
                  onClick={() => setCreateCampaignOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
                >
                  Start Your First Campaign
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns
                  .filter(c => c.createdBy === userId)
                  .map((campaign) => {
                    const budgetPaid = campaign.budgetPaid || 0
                    const budgetTotal = campaign.budgetTotal || 1
                    const budgetRemaining = Math.max(0, budgetTotal - budgetPaid)
                    const budgetPct = Math.round((budgetRemaining / budgetTotal) * 100)
                    const pendingCount = pendingClipsByCampaign[campaign.campaignId] || 0

                    return (
                      <div key={campaign.$id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="size-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-white">{campaign.title.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1">{campaign.title}</h3>
                            <p className="text-sm text-white/60 line-clamp-2">{campaign.description || 'No description'}</p>
                          </div>
                          {pendingCount > 0 && (
                            <div className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-semibold animate-pulse">
                              {pendingCount} Pending
                            </div>
                          )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold">{budgetPct}%</div>
                            <div className="text-xs text-white/50">Budget Left</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold">{pendingCount}</div>
                            <div className="text-xs text-white/50">Pending</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold">0</div>
                            <div className="text-xs text-white/50">Approved</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold">0</div>
                            <div className="text-xs text-white/50">Views</div>
                          </div>
                        </div>

                        {/* Budget Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-white/60">${budgetPaid} of ${budgetTotal} paid out</span>
                            <span className="font-semibold text-white">${budgetRemaining} remaining</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500" style={{ width: `${budgetPct}%` }} />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {pendingCount > 0 && (
                            <button
                              onClick={() => {
                                setSelectedTab(tabs.indexOf("Review Pending"))
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white py-2.5 text-sm font-semibold hover:from-orange-600 hover:to-red-700 transition"
                            >
                              Review Submissions ({pendingCount})
                            </button>
                          )}
                          <button
                            onClick={() => handleViewCampaignDetails(campaign.$id)}
                            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </section>
        )}

        {/* Campaign Board */}
        {selectedTab !== tabs.indexOf("Review Pending") && selectedTab !== 5 && selectedTab !== 2 && selectedTab !== 3 && (
        <section>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold">Live Campaigns</h2>
            <button
              onClick={() => setCreateCampaignOpen(true)}
              className="text-[11px] md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
            >
              Start Campaign
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-white/60">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <p>No active campaigns yet.</p>
              <button
                onClick={() => setCreateCampaignOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
              >
                Create First Campaign
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
              {campaigns.map((campaign) => {
                // Calculate budget percentage (budgetTotal - budgetPaid)
                const budgetPaid = campaign.budgetPaid || 0
                const budgetTotal = campaign.budgetTotal || 1
                const budgetRemaining = Math.max(0, budgetTotal - budgetPaid)
                const budgetPct = Math.round((budgetRemaining / budgetTotal) * 100)

                return (
                  <div key={campaign.$id} className="rounded-lg md:rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3 md:p-5 flex flex-col gap-2 md:gap-4 hover:border-white/20 transition-colors">
                    {/* Header with Logo and Title */}
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-base md:text-xl font-bold text-white">{campaign.title.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-bold text-white truncate">{campaign.title}</h3>
                        <p className="text-[10px] md:text-xs text-white/50 mt-0.5">
                          Earn ${campaign.prizePool / 1000} per 1K Views
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <button className="text-white/60 hover:text-white/90 transition hidden md:block">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <div className="px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-blue-500 text-white text-[10px] md:text-xs font-semibold whitespace-nowrap">
                          ${Math.round(campaign.prizePool / 1000)} / 1K
                        </div>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] md:text-sm mb-1.5 md:mb-2">
                        <span className="text-white/60">${budgetPaid} of ${budgetTotal} paid</span>
                        <span className="font-semibold text-white">{budgetPct}%</span>
                      </div>
                      <div className="h-1.5 md:h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500" style={{ width: `${budgetPct}%` }} />
                      </div>
                    </div>

                    {/* Campaign Type with Icons */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="text-[10px] md:text-xs text-white/50">Type:</span>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg bg-white/5 border border-white/10 text-[10px] md:text-xs">
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Clipping
                        </span>
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <span className="ml-auto text-[10px] md:text-xs text-white/50">Views: 0</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5 md:gap-2 pt-1 md:pt-2">
                      {/* Show Review Submissions for campaign owner if there are pending clips */}
                      {campaign.createdBy === userId && pendingClipsByCampaign[campaign.campaignId] > 0 ? (
                        <>
                          <button
                            onClick={() => router.push(`/campaign/${campaign.campaignId}/review`)}
                            className="flex-1 flex items-center justify-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white py-1.5 md:py-2 text-[11px] md:text-sm font-semibold hover:from-orange-600 hover:to-red-700 transition active:scale-95"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Review ({pendingClipsByCampaign[campaign.campaignId]})
                          </button>
                          <button
                            onClick={() => handleViewCampaignDetails(campaign.$id)}
                            className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[11px] md:text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition active:scale-95"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewCampaignDetails(campaign.$id)}
                            className="flex items-center justify-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[11px] md:text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition active:scale-95"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => handleJoinCampaign(campaign.$id)}
                            className="flex-1 flex items-center justify-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-1.5 md:py-2 text-[11px] md:text-sm font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition active:scale-95"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Join
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        )}

        {/* Clip Feed */}
        {selectedTab !== tabs.indexOf("Review Pending") && (
        <section>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold">Top Clips</h2>
            <div className="flex gap-1.5 md:gap-2 text-[11px] md:text-sm">
              <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">Trending</button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hidden sm:inline-flex">Newest</button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hidden md:inline-flex">Highest CTR</button>
            </div>
          </div>
          {clipsLoading ? (
            <div className="text-center py-12 text-white/60">Loading clips...</div>
          ) : clips.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <p>No clips yet. Be the first to submit!</p>
              <button
                onClick={() => setSubmitClipOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
              >
                Submit First Clip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredClips.map((clip) => {
                const isSelected = selectedClipId === clip.$id

                const embedUrl = getEmbedUrl(clip)
                const isHovered = hoveredClipId === clip.$id

                return (
                  <div
                    key={clip.$id}
                    onClick={() => setSelectedClipId(isSelected ? null : clip.$id)}
                    onMouseEnter={() => {
                      // Add 500ms delay before showing video preview
                      hoverTimeoutRef.current = setTimeout(() => {
                        setHoveredClipId(clip.$id)
                      }, 500)
                    }}
                    onMouseLeave={() => {
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current)
                      }
                      setHoveredClipId(null)
                    }}
                    className={cn(
                      "group rounded-lg md:rounded-2xl overflow-hidden border bg-white/5 transition-all cursor-pointer",
                      isSelected
                        ? "border-fuchsia-500 ring-2 ring-fuchsia-500/50 scale-[1.02]"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="relative aspect-[9/16] bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                      {/* Thumbnail - hidden on hover if video available */}
                      {clip.thumbnailUrl ? (
                        <img
                          src={clip.thumbnailUrl}
                          alt={clip.title || 'Clip'}
                          loading="lazy"
                          className={cn(
                            "w-full h-full object-cover transition-opacity duration-300",
                            isHovered && embedUrl ? "opacity-0" : "opacity-100"
                          )}
                        />
                      ) : (
                        <div className={cn(
                          "text-white/30 text-sm transition-opacity duration-300",
                          isHovered && embedUrl ? "opacity-0" : "opacity-100"
                        )}>
                          {clip.platform.toUpperCase()} Clip
                        </div>
                      )}

                      {/* Video Embed - shown on hover */}
                      {embedUrl && isHovered && (
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full"
                          allow="autoplay; encrypted-media"
                          frameBorder="0"
                        />
                      )}

                      {/* Creator & Project Branding - Top Overlay */}
                      <div className="absolute top-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10">
                        <div className="flex items-start gap-1.5 md:gap-2">
                          {/* Creator Avatar - Clickable to profile */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/profile/${clip.submittedBy}`)
                            }}
                            className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white/20 bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center overflow-hidden hover:border-white/40 transition-all hover:scale-105"
                            aria-label={`View ${clip.creatorUsername || clip.submittedBy}'s profile`}
                          >
                            <img
                              src={clip.creatorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${clip.submittedBy}`}
                              alt={clip.creatorUsername || clip.submittedBy}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </button>

                          <div className="flex-1 min-w-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/profile/${clip.submittedBy}`)
                              }}
                              className="text-[10px] md:text-xs font-medium text-white/90 truncate hover:text-white hover:underline transition-colors flex items-center gap-0.5 md:gap-1"
                            >
                              {clip.creatorUsername ? (
                                <>
                                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 fill-[#1DA1F2]" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                  </svg>
                                  <span>@{clip.creatorUsername}</span>
                                </>
                              ) : (
                                <span>@{clip.submittedBy.slice(0, 12)}</span>
                              )}
                            </button>
                          </div>

                          {/* Platform Logo Badge - Top Right */}
                          <div className={cn(
                            "w-7 h-7 md:w-9 md:h-9 rounded-md md:rounded-lg flex items-center justify-center",
                            clip.platform === 'youtube' && "bg-red-600",
                            clip.platform === 'tiktok' && "bg-black",
                            clip.platform === 'twitter' && "bg-black",
                            clip.platform === 'twitch' && "bg-purple-600",
                            clip.platform === 'instagram' && "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
                          )}>
                            {clip.platform === 'twitter' && (
                              <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            )}
                            {clip.platform === 'tiktok' && (
                              <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                              </svg>
                            )}
                            {clip.platform === 'youtube' && (
                              <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            )}
                            {clip.platform === 'twitch' && (
                              <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                              </svg>
                            )}
                            {clip.platform === 'instagram' && (
                              <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Play button - only show when NOT hovering or no embed available */}
                      {!(embedUrl && isHovered) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlayClip(clip.$id)
                          }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                        >
                          <Play className="w-12 h-12 text-white drop-shadow-lg" />
                        </button>
                      )}

                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-fuchsia-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Selected
                        </div>
                      )}

                      {/* Metrics Overlay - Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex flex-col gap-0.5">
                            <div className="text-[10px] md:text-xs font-semibold">{clip.views.toLocaleString()}</div>
                            <div className="text-[8px] md:text-[10px] text-white/60">views</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-center">
                            <div className="text-[10px] md:text-xs font-semibold">{clip.likes.toLocaleString()}</div>
                            <div className="text-[8px] md:text-[10px] text-white/60">likes</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-center">
                            <div className="text-[10px] md:text-xs font-semibold">{clip.comments.toLocaleString()}</div>
                            <div className="text-[8px] md:text-[10px] text-white/60">cmnt</div>
                          </div>
                          <div className="flex flex-col gap-0.5 items-end">
                            <div className="text-[10px] md:text-xs font-semibold text-emerald-400">{clip.engagement.toFixed(1)}%</div>
                            <div className="text-[8px] md:text-[10px] text-white/60">eng</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 md:p-3 space-y-2 md:space-y-2">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        {/* Project Logo */}
                        {(clip.projectLogo || clip.projectName) && (
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                            {clip.projectLogo ? (
                              <img
                                src={clip.projectLogo}
                                alt={clip.projectName || 'Project'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-[9px] md:text-[10px] font-bold text-white/80">
                                {clip.projectName?.slice(0, 3).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="text-[11px] md:text-sm font-semibold truncate flex-1">
                          {clip.projectName || clip.title || `Clip #${clip.clipId.slice(-6)}`}
                        </div>
                      </div>

                      <div className="flex gap-1.5 md:gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBuyClip(clip)
                          }}
                          disabled={!clip.projectId}
                          className="flex-1 rounded-md md:rounded-lg bg-white text-black py-1 md:py-1.5 text-[10px] md:text-xs font-semibold hover:bg-neutral-200 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Buy
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReactToClip(clip.$id)
                          }}
                          className="rounded-md md:rounded-lg border border-white/10 bg-white/5 px-1.5 md:px-2.5 text-[10px] md:text-xs hover:bg-white/10 transition active:scale-95"
                        >
                          {reactions.has(clip.$id) ? reactions.get(clip.$id) : 'React'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShareClip(clip.$id, clip)
                          }}
                          className="rounded-md md:rounded-lg border border-white/10 bg-white/5 px-1.5 md:px-2.5 text-[10px] md:text-xs hover:bg-white/10 transition active:scale-95"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
        )}
      </main>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        open={createCampaignOpen}
        onClose={() => setCreateCampaignOpen(false)}
        onSubmit={handleCreateCampaign}
      />

      {/* Submit Clip Modal */}
      <SubmitClipModal
        open={submitClipOpen}
        onClose={() => {
          setSubmitClipOpen(false)
          setPreSelectedCampaignId(null)
        }}
        onSubmit={handleSubmitClip}
        preSelectedCampaignId={preSelectedCampaignId || undefined}
      />
    </div>
  )
}
