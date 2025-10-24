"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Play } from 'lucide-react'
import { IconSearch } from '@/lib/icons'
import { createCampaign, type Campaign } from '@/lib/appwrite/services/campaigns'
import { type Clip, submitClipToProject } from '@/lib/appwrite/services/clips'
import { useWallet } from '@/contexts/WalletContext'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { type CampaignFormData } from '@/lib/validations/clip'
import { useClips } from '@/hooks/useClips'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useClipMutations } from '@/hooks/useClipMutations'
import { useQueryClient } from '@tanstack/react-query'
import { useRealtimeClips } from '@/hooks/useRealtimeClips'
import { useRealtimeCampaigns } from '@/hooks/useRealtimeCampaigns'
import { SearchBar } from '@/components/clips/SearchBar'
import { PaginationControls } from '@/components/clips/PaginationControls'
import { ClipCardGrid } from '@/components/clips/ClipCardGrid'
import { ClipCardScroll } from '@/components/clips/ClipCardScroll'
import { PendingReviewSection } from '@/components/clips/PendingReviewSection'
import { AdvancedFilters } from '@/components/clips/AdvancedFilters'

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
  // UI State (modals, selections, view mode)
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false)
  const [submitClipOpen, setSubmitClipOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [hoveredClipId, setHoveredClipId] = useState<string | null>(null)
  const [selectedReviewClips, setSelectedReviewClips] = useState<Set<string>>(new Set())
  const [batchActionLoading, setBatchActionLoading] = useState(false)
  const [collapsedCampaigns, setCollapsedCampaigns] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const clipsPerPage = 15

  // Advanced Filters State
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>([])
  const [filterMinEngagement, setFilterMinEngagement] = useState<number | undefined>()
  const [filterDateFrom, setFilterDateFrom] = useState<string | undefined>()
  const [filterDateTo, setFilterDateTo] = useState<string | undefined>()
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('grid')
  const [isMobile, setIsMobile] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const { userId, user, userInfo, connected } = useWallet()
  const router = useRouter()
  const { addNotification } = useNotifications()

  // 🚀 React Query Hooks - Replace manual state management
  const { data: clips = [], isLoading: clipsLoading } = useClips({
    status: 'active',
    sortBy: 'views',
    page: currentPage,
    limit: clipsPerPage,
    // Advanced filters
    search: searchQuery || undefined,
    platform: filterPlatforms.length > 0 ? filterPlatforms : undefined,
    minEngagement: filterMinEngagement,
    dateFrom: filterDateFrom,
    dateTo: filterDateTo
  })

  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns({
    createdBy: userId || undefined
  })

  const { data: myClips = [] } = useClips({
    submittedBy: userId || undefined,
    enabled: !!userId
  })

  const { data: pendingClips = [], isLoading: pendingLoading } = useClips({
    status: 'pending',
    enabled: !!userId
  })

  const { submit: submitMutation, approve: approveMutation } = useClipMutations()
  const queryClient = useQueryClient()

  // 🔴 Realtime Subscriptions - Live updates for clips and campaigns
  // Enable live metrics refresh every 30s for real-time dashboard
  useRealtimeClips({
    enabled: true,
    refreshMetrics: true,
    refreshInterval: 30000 // 30 seconds
  })
  useRealtimeCampaigns(true)

  // Derived state for pending clips by campaign
  const [pendingClipsByCampaign, setPendingClipsByCampaign] = useState<Record<string, number>>({})

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    const baseTabs = ["All", "Trending", "My Clips", "Campaigns", "Analytics"]
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
    } else if (selectedTab === tabs.indexOf("All")) {
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

  // 🚀 Calculate pending clips by campaign (derived from React Query data)
  useEffect(() => {
    const pendingCounts: Record<string, number> = {}
    pendingClips.forEach(clip => {
      if (clip.campaignId) {
        pendingCounts[clip.campaignId] = (pendingCounts[clip.campaignId] || 0) + 1
      }
    })
    setPendingClipsByCampaign(pendingCounts)
  }, [pendingClips])

  // 🚀 Pending clips are now loaded automatically by useClips hook

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
        // Refresh campaigns list via React Query
        queryClient.invalidateQueries({ queryKey: ['campaigns'] })
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

  const handleReactToClip = useCallback((clipId: string, emoji: string = '🔥') => {
    if (!connected) {
      toast.error('Please connect your wallet to react')
      return
    }

    setReactions(prev => new Map(prev).set(clipId, emoji))
    // TODO: Save to Appwrite reactions collection
    toast.success(`Reacted with ${emoji}`)
  }, [connected])

  const handleShareClip = useCallback((clipId: string, clip: Clip) => {
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
  }, [])

  const handlePlayClip = useCallback((clipId: string) => {
    setSelectedClipId(clipId)
    console.log('Playing clip:', clipId)
    // TODO: Open video player modal or navigate to external URL
    const clip = clips.find(c => c.$id === clipId)
    if (clip) {
      window.open(clip.embedUrl, '_blank')
    }
  }, [clips])

  const handleApproveClip = useCallback(async (clipId: string) => {
    approveMutation.mutate({
      clipId,
      approved: true,
      userId: userId || undefined
    })
    // React Query will automatically refetch pending clips and update UI
  }, [approveMutation, userId])

  const handleRejectClip = useCallback(async (clipId: string) => {
    approveMutation.mutate({
      clipId,
      approved: false,
      userId: userId || undefined
    })
    // React Query will automatically refetch pending clips and update UI
  }, [approveMutation, userId])

  const handleBatchApprove = useCallback(async () => {
    if (selectedReviewClips.size === 0) return

    setBatchActionLoading(true)
    const clipIds = Array.from(selectedReviewClips)

    // Approve each clip using mutation
    for (const clipId of clipIds) {
      approveMutation.mutate({
        clipId,
        approved: true,
        userId: userId || undefined
      })
    }

    setSelectedReviewClips(new Set())
    setBatchActionLoading(false)
    toast.success(`${clipIds.length} clips approved!`)
    // React Query will automatically refetch and update pending clips
  }, [selectedReviewClips, approveMutation, userId])

  const handleBatchReject = useCallback(async () => {
    if (selectedReviewClips.size === 0) return

    setBatchActionLoading(true)
    const clipIds = Array.from(selectedReviewClips)

    // Reject each clip using mutation
    for (const clipId of clipIds) {
      approveMutation.mutate({
        clipId,
        approved: false,
        userId: userId || undefined
      })
    }

    setSelectedReviewClips(new Set())
    setBatchActionLoading(false)
    toast.success(`${clipIds.length} clips rejected`)
    // React Query will automatically refetch and update pending clips
  }, [selectedReviewClips, approveMutation, userId])

  const toggleClipSelection = useCallback((clipId: string) => {
    setSelectedReviewClips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(clipId)) {
        newSet.delete(clipId)
      } else {
        newSet.add(clipId)
      }
      return newSet
    })
  }, [])

  const toggleCampaignCollapse = useCallback((campaignId: string) => {
    setCollapsedCampaigns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId)
      } else {
        newSet.add(campaignId)
      }
      return newSet
    })
  }, [])

  const handleSubmitClip = async (data: {
    embedUrl: string
    title?: string
    projectName?: string
    projectId?: string
    projectLogo?: string
    campaignId?: string
  }) => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    const currentUserId = userId || 'unknown'

    // Extract user info from Privy
    const creatorUsername = user?.twitter?.username || user?.email?.address?.split('@')[0] || user?.google?.name || currentUserId.slice(0, 12)
    const creatorAvatar = user?.twitter?.profilePictureUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUserId}`

    // NEW: Use enhanced submission flow for project clips
    if (data.projectId && data.projectName) {
      try {
        const { clip, isNewContributor } = await submitClipToProject({
          embedUrl: data.embedUrl,
          submittedBy: currentUserId,
          submitterName: creatorUsername,
          submitterAvatar: creatorAvatar,
          projectId: data.projectId,
          projectName: data.projectName,
          projectLogo: data.projectLogo,
          title: data.title
        })

        // Show success message
        toast.success('Clip Submitted!', `Awaiting approval from ${data.projectName}`)

        // Trigger notification for project owner
        addNotification(
          'submission_new',
          'New Clip Submitted',
          `${creatorUsername} submitted a clip to ${data.projectName}`,
          {
            userId: currentUserId,
            username: creatorUsername,
            avatar: creatorAvatar,
            projectId: data.projectId,
            projectName: data.projectName,
            clipId: clip.$id,
            actionUrl: `/profile?tab=pending-clips&projectId=${data.projectId}`
          }
        )

        // Show contributor badge if new
        if (isNewContributor) {
          addNotification(
            'achievement_unlocked',
            'New Contributor!',
            `You're now a contributor to ${data.projectName}`,
            {
              projectId: data.projectId,
              projectName: data.projectName
            }
          )
          toast.success('Contributor Badge Earned!', `Welcome to ${data.projectName}`)
        }

        // Reset modal and refresh clips
        setSubmitClipOpen(false)
        queryClient.invalidateQueries({ queryKey: ['clips'] })
        setCurrentPage(1)
        return
      } catch (error: any) {
        console.error('Failed to submit clip to project:', error)
        toast.error('Submission Failed', error.message || 'Failed to submit clip')
        return
      }
    }

    // Regular clip submission (no project)
    submitMutation.mutate({
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

    // Reset to page 1 when submitting new clip
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-btdemo-canvas text-btdemo-text pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-premium border-b border-[#D1FD0A]/20">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onCreateCampaign={() => setCreateCampaignOpen(true)}
          onSubmitClip={() => setSubmitClipOpen(true)}
          viewMode={viewMode}
          isMobile={isMobile}
        />

        {/* Advanced Filters */}
        <div className="mx-auto max-w-7xl px-3 md:px-4 pt-2">
          <AdvancedFilters
            platforms={filterPlatforms}
            minEngagement={filterMinEngagement}
            dateFrom={filterDateFrom}
            dateTo={filterDateTo}
            onPlatformsChange={setFilterPlatforms}
            onMinEngagementChange={setFilterMinEngagement}
            onDateFromChange={setFilterDateFrom}
            onDateToChange={setFilterDateTo}
            onClearFilters={() => {
              setFilterPlatforms([])
              setFilterMinEngagement(undefined)
              setFilterDateFrom(undefined)
              setFilterDateTo(undefined)
            }}
          />
        </div>

        {/* View Toggle & Tabs */}
        <div className={cn(
          "mx-auto max-w-7xl px-3 md:px-4",
          viewMode === 'scroll' && isMobile ? "py-2" : "pb-2 md:pb-3"
        )}>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle - Mobile only */}
            {isMobile && (
            <div className="flex gap-1.5 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('scroll')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all min-h-[36px]",
                  viewMode === 'scroll'
                    ? "bg-[#D1FD0A] text-black"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                Scroll
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all min-h-[36px]",
                  viewMode === 'grid'
                    ? "bg-[#D1FD0A] text-black"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                Grid
              </button>
            </div>
            )}

            {/* Tabs */}
            <nav className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide flex-1" role="tablist" aria-label="Clip navigation tabs">
              {tabs.map((t, idx) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={selectedTab === idx}
                  aria-controls={`tabpanel-${idx}`}
                  onClick={() => setSelectedTab(idx)}
                  className={cn(
                    "px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap relative min-h-[36px] md:min-h-0 flex items-center justify-center transition-all",
                    selectedTab === idx
                      ? "bg-[#D1FD0A] text-black font-bold"
                      : isMobile
                        ? "text-zinc-400 hover:text-white"
                        : "glass-premium border border-[#D1FD0A]/20 text-zinc-400 hover:text-white hover:border-[#D1FD0A]/40"
                  )}
                >
                  {t}
                  {t === "Review Pending" && totalPendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-4 md:min-w-[20px] md:h-5 px-1 md:px-1.5 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-black bg-[#D1FD0A] rounded-full">
                      {totalPendingCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* +Clip Button - Mobile only in Scroll mode */}
            {isMobile && viewMode === 'scroll' && (
              <button
                onClick={() => setSubmitClipOpen(true)}
                className="flex-shrink-0 rounded-lg bg-[#D1FD0A] hover:bg-[#B8E309] text-black px-4 py-1.5 text-sm font-bold min-h-[36px] flex items-center justify-center transition-all hover:scale-105"
              >
                +Clip
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main (single column, no sidebar) */}
      <main
        className="mx-auto max-w-7xl px-3 md:px-4 py-3 md:py-6 space-y-3 md:space-y-6 bg-btdemo-canvas min-h-screen"
        role="main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Review Pending Tab Content */}
        {selectedTab === tabs.indexOf("Review Pending") && (
          <section className="space-y-6">
            <PendingReviewSection
              pendingClips={pendingClips}
              campaigns={campaigns}
              userId={userId}
              selectedReviewClips={selectedReviewClips}
              collapsedCampaigns={collapsedCampaigns}
              batchActionLoading={batchActionLoading}
              pendingLoading={pendingLoading}
              onToggleSelection={toggleClipSelection}
              onToggleCampaignCollapse={toggleCampaignCollapse}
              onApprove={handleApproveClip}
              onReject={handleRejectClip}
              onBatchApprove={handleBatchApprove}
              onBatchReject={handleBatchReject}
              onClearSelection={() => setSelectedReviewClips(new Set())}
            />
          </section>
        )}

        {/* Hero Metrics - Hide in Scroll mode on mobile */}
        {selectedTab !== tabs.indexOf("Review Pending") && selectedTab !== 5 && selectedTab !== 2 && selectedTab !== 3 && (viewMode === 'grid' || !isMobile) && (
        <section className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-2 md:gap-3 -mx-3 px-3 md:mx-0 md:px-0 md:grid md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="snap-center shrink-0 min-w-[160px] md:min-w-0 glass-premium rounded-xl md:rounded-2xl border border-[#D1FD0A]/20 p-3 md:p-5">
              <div className="text-[10px] md:text-xs uppercase tracking-wider text-zinc-400 font-medium">{m.label}</div>
              <div className="mt-1 md:mt-2 text-xl md:text-3xl font-led-dot text-white">{m.value}</div>
            </div>
          ))}
        </section>
        )}

        {/* Analytics Tab */}
        {selectedTab === tabs.indexOf("Analytics") && (
          <section className="space-y-3 md:space-y-6">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">Analytics Overview</h2>
              <div className="flex gap-1.5 md:gap-2">
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10">7D</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-white text-[10px] md:text-xs font-semibold">30D</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10">90D</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10">All</button>
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="rounded-lg md:rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3 md:p-6">
              <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-4">Platform Distribution</h3>
              <div className="space-y-2 md:space-y-3">
                {[
                  { platform: 'YouTube', count: clips.filter(c => c.platform === 'youtube').length, color: 'bg-red-500' },
                  { platform: 'Twitter/X', count: clips.filter(c => c.platform === 'twitter').length, color: 'bg-blue-400' },
                  { platform: 'TikTok', count: clips.filter(c => c.platform === 'tiktok').length, color: 'bg-black border border-white/20' },
                  { platform: 'Instagram', count: clips.filter(c => c.platform === 'instagram').length, color: 'bg-gradient-to-r from-lime-500 to-pink-500' },
                ].map(p => (
                  <div key={p.platform} className="flex items-center gap-2 md:gap-3">
                    <div className={cn("w-2 h-2 md:w-3 md:h-3 rounded-full", p.color)} />
                    <div className="flex-1 text-xs md:text-sm text-white/80">{p.platform}</div>
                    <div className="text-xs md:text-sm font-semibold font-led-dot">{p.count} clips</div>
                    <div className="text-[10px] md:text-xs text-white/50 font-led-dot">{clips.length > 0 ? Math.round((p.count / clips.length) * 100) : 0}%</div>
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
                        <div className="text-xs md:text-sm font-semibold font-led-dot">{clip.views.toLocaleString()}</div>
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
        {selectedTab === tabs.indexOf("My Clips") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Clips</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-white text-xs font-semibold">All</button>
                <button className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs hover:bg-white/10">Approved</button>
                <button className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs hover:bg-white/10">Pending</button>
                <button className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs hover:bg-white/10">Rejected</button>
              </div>
            </div>

            {clips.filter(c => c.submittedBy === userId).length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] mb-4">
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-white font-semibold hover:from-[#B8E008] hover:to-[#A0C007] transition"
                >
                  Submit Your First Clip
                </button>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {clips
                  .filter(c => c.submittedBy === userId)
                  .map((clip, idx) => {
                    // Determine status display
                    const getStatusBadge = () => {
                      if (clip.status === 'active' || clip.approved) {
                        return { icon: '✓', text: 'Approved', color: 'bg-[#D1FD0A] text-black' }
                      } else if (clip.status === 'pending') {
                        return { icon: '⏳', text: 'Pending', color: 'bg-orange-500 text-white' }
                      } else if (clip.status === 'rejected') {
                        return { icon: '✗', text: 'Rejected', color: 'bg-red-500 text-white' }
                      }
                      return { icon: '○', text: 'Unknown', color: 'bg-zinc-500 text-white' }
                    }
                    const status = getStatusBadge()

                    return (
                      <div
                        key={clip.$id}
                        className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
                        onClick={() => window.open(clip.embedUrl, '_blank')}
                      >
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
                          <div className="text-xs md:text-sm font-semibold font-led-dot">{clip.views.toLocaleString()}</div>
                          <div className="text-[9px] md:text-xs text-white/50">views</div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-semibold whitespace-nowrap ${status.color}`}>
                          {status.icon} {status.text}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </section>
        )}

        {/* Campaigns Tab (My Campaigns) */}
        {selectedTab === tabs.indexOf("Campaigns") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#D1FD0A]">My Campaigns</h2>
              <button
                onClick={() => setCreateCampaignOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-black text-sm font-semibold hover:from-[#B8E008] hover:to-[#A0C007] transition"
              >
                + New Campaign
              </button>
            </div>

            {campaigns.filter(c => c.createdBy === userId).length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] mb-4">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Campaigns Yet</h3>
                <p className="text-white/60 max-w-md mx-auto mb-6">
                  Create your first campaign to get creators promoting your project and amplifying your reach.
                </p>
                <button
                  onClick={() => setCreateCampaignOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-black font-semibold hover:from-[#B8E008] hover:to-[#A0C007] transition"
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
                          <div className="size-14 rounded-full bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] flex items-center justify-center flex-shrink-0">
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4">
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold font-led-dot">{budgetPct}%</div>
                            <div className="text-xs text-white/50">Budget Left</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold font-led-dot">{pendingCount}</div>
                            <div className="text-xs text-white/50">Pending</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold font-led-dot">0</div>
                            <div className="text-xs text-white/50">Approved</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5">
                            <div className="text-lg font-bold font-led-dot">0</div>
                            <div className="text-xs text-white/50">Views</div>
                          </div>
                        </div>

                        {/* Budget Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-white/60 font-led-dot">${budgetPaid} of ${budgetTotal} paid out</span>
                            <span className="font-semibold text-white font-led-dot">${budgetRemaining} remaining</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] transition-all duration-500" style={{ width: `${budgetPct}%` }} />
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

        {/* Campaign Board - Hide in Scroll mode on mobile */}
        {selectedTab !== tabs.indexOf("Review Pending") && selectedTab !== tabs.indexOf("Analytics") && selectedTab !== tabs.indexOf("My Clips") && (viewMode === 'grid' || !isMobile) && (
        <section>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-semibold">Live Campaigns</h2>
            <button
              onClick={() => setCreateCampaignOpen(true)}
              className="text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold transition-all hover:scale-105"
            >
              Start Campaign
            </button>
          </div>
          {campaignsLoading ? (
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
              {campaigns.map((campaign) => {
                // Calculate budget percentage (budgetTotal - budgetPaid)
                const budgetPaid = campaign.budgetPaid || 0
                const budgetTotal = campaign.budgetTotal || 1
                const budgetRemaining = Math.max(0, budgetTotal - budgetPaid)
                const budgetPct = Math.round((budgetRemaining / budgetTotal) * 100)

                return (
                  <div key={campaign.$id} className="glass-premium rounded-xl md:rounded-2xl border border-[#D1FD0A]/20 p-3 md:p-5 flex flex-col gap-2 md:gap-4 hover:border-[#D1FD0A]/40 transition-all">
                    {/* Header with Logo and Title */}
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] flex items-center justify-center flex-shrink-0">
                        <span className="text-base md:text-xl font-bold text-white">{campaign.title.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-bold text-white truncate">{campaign.title}</h3>
                        <p className="text-[10px] md:text-xs text-white/50 mt-0.5 font-led-dot">
                          Earn ${campaign.prizePool / 1000} per 1K Views
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <button className="text-white/60 hover:text-white/90 transition hidden md:block">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <div className="px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-[#D1FD0A] text-black text-[10px] md:text-xs font-semibold whitespace-nowrap font-led-dot">
                          ${Math.round(campaign.prizePool / 1000)} / 1K
                        </div>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] md:text-sm mb-1.5 md:mb-2">
                        <span className="text-white/60 font-led-dot">${budgetPaid} of ${budgetTotal} paid</span>
                        <span className="font-semibold text-white font-led-dot">{budgetPct}%</span>
                      </div>
                      <div className="h-1.5 md:h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] transition-all duration-500" style={{ width: `${budgetPct}%` }} />
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
                            className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-[#D1FD0A]/60 bg-zinc-800 text-xs md:text-sm font-semibold text-[#D1FD0A] hover:bg-zinc-700 transition active:scale-95"
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
                            className="flex items-center justify-center gap-1 md:gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-[#D1FD0A]/60 bg-zinc-800 text-xs md:text-sm font-semibold text-[#D1FD0A] hover:bg-zinc-700 transition active:scale-95"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => handleJoinCampaign(campaign.$id)}
                            className="flex-1 flex items-center justify-center gap-1 md:gap-1.5 rounded-lg md:rounded-xl bg-[#D1FD0A] hover:bg-[#B8E309] text-black py-1.5 md:py-2 text-xs md:text-sm font-bold transition active:scale-95"
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
        {selectedTab !== tabs.indexOf("Review Pending") && selectedTab !== tabs.indexOf("Campaigns") && selectedTab !== tabs.indexOf("My Clips") && selectedTab !== tabs.indexOf("Analytics") && (
        <section>
          {/* Hide header in Scroll mode on mobile */}
          {(viewMode === 'grid' || !isMobile) && (
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h2 className="text-base md:text-lg font-semibold">Top Clips</h2>
              <div className="flex gap-1.5 md:gap-2 text-[11px] md:text-sm">
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">Trending</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hidden sm:inline-flex">Newest</button>
                <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hidden md:inline-flex">Highest CTR</button>
              </div>
            </div>
          )}
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
          ) : viewMode === 'scroll' ? (
            /* Scroll Mode - TikTok/Instagram Style */
            <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide -mx-3 md:-mx-4">
              {filteredClips.map((clip, index) => (
                <ClipCardScroll
                  key={clip.$id}
                  clip={clip}
                  index={index}
                  onReact={() => handleReactToClip(clip.$id)}
                  onShare={() => handleShareClip(clip.$id, clip)}
                />
              ))}
            </div>
          ) : (
            /* Grid Mode - Traditional Layout */
            <>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {filteredClips.map((clip) => {
                const isSelected = selectedClipId === clip.$id
                const embedUrl = getEmbedUrl(clip)
                const isHovered = hoveredClipId === clip.$id

                return (
                  <ClipCardGrid
                    key={clip.$id}
                    clip={clip}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    embedUrl={embedUrl}
                    onSelect={() => setSelectedClipId(isSelected ? null : clip.$id)}
                    onMouseEnter={() => {
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
                    onPlayClip={() => handlePlayClip(clip.$id)}
                    onReact={() => handleReactToClip(clip.$id)}
                    onShare={() => handleShareClip(clip.$id, clip)}
                  />
                )
              })}
            </div>

            <PaginationControls
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalItems={clips.length}
              itemsPerPage={clipsPerPage}
              isLoading={clipsLoading}
            />
            </>
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
