"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LiveLaunchCard } from '@/components/launch/cards/LiveLaunchCard'
import { UpcomingLaunchCard } from '@/components/launch/cards/UpcomingLaunchCard'
import { CommentsModal } from '@/components/comments/CommentsModal'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
import { CollaborateModal } from '@/components/launch/CollaborateModal'
import { LaunchCardData } from '@/types/launch'
import { TrendingUp, Rocket, Clock, LayoutGrid, Link2, MessageSquare, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { getLaunches, createLaunchDocument } from '@/lib/appwrite/services/launches'
import { addVote, getVoteCount, getUserVotes } from '@/lib/appwrite/services/votes'
import { getComments } from '@/lib/appwrite/services/comments'
import { useUser } from '@/hooks/useUser'

type FilterType = 'ALL' | 'ICM' | 'CCM'
type StatusFilterType = 'ALL' | 'LIVE' | 'UPCOMING'
type SortType = 'trending' | 'newest' | 'conviction'

export default function DiscoverPage() {
  const router = useRouter()
  const { userId, isAuthenticated } = useUser()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [selectedLaunch, setSelectedLaunch] = useState<{ id: string; title: string } | null>(null)
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL')
  const [sortBy, setSortBy] = useState<SortType>('trending')
  const [launches, setLaunches] = useState<LaunchCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitLaunchOpen, setIsSubmitLaunchOpen] = useState(false)
  const [userVotedLaunches, setUserVotedLaunches] = useState<Set<string>>(new Set())
  const [collaborateOpen, setCollaborateOpen] = useState(false)
  const [selectedCollaborateLaunch, setSelectedCollaborateLaunch] = useState<{
    id: string
    title: string
    creatorName?: string
    creatorAvatar?: string
    createdBy?: string
  } | null>(null)

  // Fetch launches from Appwrite
  useEffect(() => {
    async function fetchLaunches() {
      try {
        setLoading(true)
        const [data, votedLaunches] = await Promise.all([
          getLaunches({ limit: 100 }),
          userId ? getUserVotes(userId) : Promise.resolve([])
        ])

        setUserVotedLaunches(new Set(votedLaunches))

        // Get real vote and comment counts for each launch
        const launchesWithCounts = await Promise.all(
          data.map(async (launch) => {
            const [voteCount, comments] = await Promise.all([
              getVoteCount(launch.$id),
              getComments(launch.$id).catch(() => [])
            ])

            return {
              id: launch.$id,
              title: launch.tokenName,
              subtitle: launch.description,
              logoUrl: launch.tokenImage,
              scope: (launch.tags && launch.tags.includes('ICM')) ? 'ICM' as const : 'CCM' as const,
              status: launch.status === 'live' ? 'LIVE' as const : launch.status === 'upcoming' ? 'UPCOMING' as const : 'LIVE' as const,
              convictionPct: launch.convictionPct || 0,
              commentsCount: comments.length,
              upvotes: voteCount,
              contributionPoolPct: launch.contributionPoolPct,
              feesSharePct: launch.feesSharePct,
              mint: launch.$id,
              contributors: [],
              tgeAt: launch.status === 'upcoming' ? new Date(launch.createdAt).getTime() : undefined,
            }
          })
        )

        setLaunches(launchesWithCounts)
      } catch (error) {
        console.error('Failed to fetch launches:', error)
        setLaunches([])
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [userId])

  // Mock data for LIVE ICM cards (with real Solana mints for API testing) - FALLBACK ONLY
  const liveICMCards: LaunchCardData[] = [
    {
      id: 'demo-sol',
      title: 'Solana',
      subtitle: 'Fast, scalable blockchain for decentralized applications',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=SOL&backgroundColor=14f195',
      scope: 'ICM',
      status: 'LIVE',
      convictionPct: 94,
      commentsCount: 342,
      upvotes: 1240,
      contributionPoolPct: 2,
      feesSharePct: 10,
      mint: 'So11111111111111111111111111111111111111112', // Real SOL mint
      contributors: [
        { id: 'anatoly', name: 'Anatoly Yakovenko', twitter: 'aeyakovenko', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AY&backgroundColor=14f195' },
        { id: 'raj', name: 'Raj Gokal', twitter: 'rajgokal', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RG&backgroundColor=9945ff' },
        { id: 'austin', name: 'Austin Federa', twitter: 'Austin_Federa', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AF&backgroundColor=00d4ff' },
        { id: 'stephen', name: 'Stephen Akridge', twitter: 'stephenakridge', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SA&backgroundColor=dc1fff' },
        { id: 'greg', name: 'Greg Fitzgerald', twitter: 'gregfitzgerald', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GF&backgroundColor=ff6b00' },
        { id: 'eric', name: 'Eric Williams', twitter: 'ericwilliams', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EW&backgroundColor=10b981' },
        { id: 'lily', name: 'Lily Liu', twitter: 'lilygliu', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LL&backgroundColor=8b5cf6' },
      ],
    },
    {
      id: 'demo-usdc',
      title: 'USDC',
      subtitle: 'Digital dollar stablecoin from Circle',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=USDC&backgroundColor=2775ca',
      scope: 'ICM',
      status: 'LIVE',
      convictionPct: 89,
      commentsCount: 156,
      upvotes: 892,
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Real USDC mint
    },
    {
      id: 'demo-bonk',
      title: 'BONK',
      subtitle: 'The community-driven memecoin of Solana',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=BONK&backgroundColor=ff6b00',
      scope: 'ICM',
      status: 'LIVE',
      convictionPct: 76,
      commentsCount: 523,
      upvotes: 2103,
      contributionPoolPct: 5,
      feesSharePct: 15,
      mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // Real BONK mint
      contributors: [
        { id: 'bonk1', name: 'BONK Team', twitter: 'bonk_inu', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BT&backgroundColor=ff6b00' },
        { id: 'bonk2', name: 'Community Lead', twitter: 'bonkcommunity', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CL&backgroundColor=fbbf24' },
        { id: 'bonk3', name: 'Marketing', twitter: 'bonkmarketing', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MK&backgroundColor=f97316' },
      ],
    },
  ]

  // Mock data for LIVE CCM cards (no mint, no token data)
  const liveCCMCards: LaunchCardData[] = [
    {
      id: 'demo-ccm-1',
      title: 'LaunchOS Platform',
      subtitle: 'Community-driven protocol for decentralized launches',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=LaunchOS&backgroundColor=8b5cf6',
      scope: 'CCM',
      status: 'LIVE',
      convictionPct: 92,
      commentsCount: 287,
      upvotes: 1456,
      contributionPoolPct: 3,
      feesSharePct: 20,
      contributors: [
        { id: 'los1', name: 'Core Dev', twitter: 'launchos_dev', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CD&backgroundColor=8b5cf6' },
        { id: 'los2', name: 'Product Lead', twitter: 'launchos_product', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PL&backgroundColor=a855f7' },
        { id: 'los3', name: 'Community Manager', twitter: 'launchos_cm', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CM&backgroundColor=06b6d4' },
        { id: 'los4', name: 'Designer', twitter: 'launchos_design', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DS&backgroundColor=ec4899' },
      ],
    },
    {
      id: 'demo-ccm-2',
      title: 'DeFi Alliance',
      subtitle: 'Cross-chain liquidity aggregation protocol',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DeFiAlliance&backgroundColor=10b981',
      scope: 'CCM',
      status: 'LIVE',
      convictionPct: 68,
      commentsCount: 94,
      upvotes: 423,
    },
  ]

  // Mock data for UPCOMING cards (future TGE timestamps)
  const upcomingCards: LaunchCardData[] = [
    {
      id: 'demo-upcoming-1',
      title: 'Quantum Protocol',
      subtitle: 'Next-gen cross-chain bridge with quantum security',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Quantum&backgroundColor=f59e0b',
      scope: 'ICM',
      status: 'UPCOMING',
      convictionPct: 87,
      commentsCount: 128,
      upvotes: 634,
      tgeAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from now
    },
    {
      id: 'demo-upcoming-2',
      title: 'SocialFi Hub',
      subtitle: 'Decentralized social media with creator rewards',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=SocialFi&backgroundColor=ec4899',
      scope: 'CCM',
      status: 'UPCOMING',
      convictionPct: 91,
      commentsCount: 412,
      upvotes: 1823,
      tgeAt: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
    },
    {
      id: 'demo-upcoming-3',
      title: 'GameFi Arena',
      subtitle: 'Play-to-earn gaming ecosystem with real rewards',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=GameFi&backgroundColor=06b6d4',
      scope: 'ICM',
      status: 'UPCOMING',
      convictionPct: 79,
      commentsCount: 267,
      upvotes: 978,
      tgeAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
    },
  ]

  // Callback handlers
  const handleUpvote = async (launchId: string) => {
    if (!isAuthenticated || !userId) {
      alert('Please sign in to vote')
      return
    }

    // Check if already voted
    if (userVotedLaunches.has(launchId)) {
      alert('You have already voted for this launch')
      return
    }

    try {
      await addVote(launchId, userId)

      // Update local state
      setUserVotedLaunches(prev => new Set(Array.from(prev).concat(launchId)))
      setLaunches(prev => prev.map(l =>
        l.id === launchId ? { ...l, upvotes: (l.upvotes || 0) + 1 } : l
      ))
    } catch (error: any) {
      console.error('Failed to upvote:', error)
      alert(error.message || 'Failed to vote')
    }
  }

  const handleComment = (id: string) => {
    const card = allLaunches.find(c => c.id === id)
    if (card) {
      setSelectedLaunch({ id: card.id, title: card.title })
      setCommentsOpen(true)
    }
  }

  const handleBoost = (id: string) => {
    // TODO: Open boost payment modal
    alert('Boost feature coming soon! This will allow you to promote launches.')
  }

  const handleCollaborate = async (launchId: string) => {
    if (!isAuthenticated || !userId) {
      alert('Please sign in to collaborate')
      return
    }

    const launch = launches.find(l => l.id === launchId)
    if (launch) {
      setSelectedCollaborateLaunch({
        id: launchId,
        title: launch.title,
        creatorName: launch.creatorName,
        creatorAvatar: launch.creatorAvatar,
        createdBy: launch.createdBy
      })
      setCollaborateOpen(true)
    }
  }

  const handleSendCollaborationInvite = async (message: string) => {
    if (!userId || !selectedCollaborateLaunch) return

    // TODO: Implement collaboration invite sending
    // await sendCollaborationInvite({
    //   launchId: selectedCollaborateLaunch.id,
    //   senderId: userId,
    //   receiverId: selectedCollaborateLaunch.createdBy,
    //   message
    // })

    console.log('Sending collaboration request to project owner:', {
      launchId: selectedCollaborateLaunch.id,
      senderId: userId,
      receiverId: selectedCollaborateLaunch.createdBy,
      message
    })
  }

  const handleView = (id: string) => {
    router.push(`/launch/${id}`)
  }

  const handleSetReminder = (id: string) => {
    // TODO: Implement reminder functionality
    alert('Reminder set! We\'ll notify you when this launch goes live.')
  }

  // Combined and filtered data
  const allLaunches = useMemo(() => {
    // Use real data if loaded, otherwise fall back to mock data
    if (launches.length > 0) {
      return launches
    }
    return [...liveICMCards, ...liveCCMCards, ...upcomingCards]
  }, [launches])

  const filteredLaunches = useMemo(() => {
    let filtered = allLaunches

    // Apply scope filter (ICM/CCM)
    if (filter === 'ICM') {
      filtered = filtered.filter(l => l.scope === 'ICM')
    } else if (filter === 'CCM') {
      filtered = filtered.filter(l => l.scope === 'CCM')
    }

    // Apply status filter (LIVE/UPCOMING)
    if (statusFilter === 'LIVE') {
      filtered = filtered.filter(l => l.status === 'LIVE')
    } else if (statusFilter === 'UPCOMING') {
      filtered = filtered.filter(l => l.status === 'UPCOMING')
    }

    // Apply sort
    if (sortBy === 'trending') {
      filtered = [...filtered].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => {
        const aTime = a.tgeAt || Date.now()
        const bTime = b.tgeAt || Date.now()
        return bTime - aTime
      })
    } else if (sortBy === 'conviction') {
      filtered = [...filtered].sort((a, b) => (b.convictionPct || 0) - (a.convictionPct || 0))
    }

    return filtered
  }, [allLaunches, filter, statusFilter, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const total = allLaunches.length
    const upcoming = allLaunches.filter(l => l.status === 'UPCOMING').length
    const live = allLaunches.filter(l => l.status === 'LIVE').length
    const avgConviction = Math.round(
      allLaunches.reduce((sum, l) => sum + (l.convictionPct || 0), 0) / total
    )
    return { total, upcoming, live, avgConviction }
  }, [allLaunches])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Rocket className="w-8 h-8 text-fuchsia-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Launch</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Discover live token launches and creator campaigns. Curate, boost, clip, predict, and build in public.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setFilter('ALL')}
            variant={filter === 'ALL' ? 'default' : 'secondary'}
            size="sm"
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            ALL
          </Button>
          <Button
            onClick={() => setFilter('ICM')}
            variant={filter === 'ICM' ? 'default' : 'secondary'}
            size="sm"
            className="gap-2"
          >
            <Link2 className="w-4 h-4" />
            ICM
          </Button>
          <Button
            onClick={() => setFilter('CCM')}
            variant={filter === 'CCM' ? 'default' : 'secondary'}
            size="sm"
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            CCM
          </Button>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10" />

          {/* Status Filters */}
          <Button
            onClick={() => setStatusFilter('LIVE')}
            variant={statusFilter === 'LIVE' ? 'default' : 'secondary'}
            size="sm"
            className="gap-2"
          >
            <Flame className="w-4 h-4" />
            LIVE
          </Button>
          <Button
            onClick={() => setStatusFilter('UPCOMING')}
            variant={statusFilter === 'UPCOMING' ? 'default' : 'secondary'}
            size="sm"
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            UPCOMING
          </Button>
        </div>
        <Button
          variant="boost"
          size="lg"
          className="gap-2"
          onClick={() => setIsSubmitLaunchOpen(true)}
        >
          <Rocket className="w-5 h-5" />
          Create a Launch
        </Button>
      </div>

      {/* Launch Existing Token Button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setIsSubmitLaunchOpen(true)}
        >
          <Rocket className="w-4 h-4" />
          Launch Existing Token
        </Button>
      </div>

      {/* Stats KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
          <div className="text-sm text-zinc-500 mb-1">Total Launches</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            {stats.total}
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
          <div className="text-sm text-zinc-500 mb-1">Upcoming</div>
          <div className="text-3xl font-bold text-amber-400">
            {stats.upcoming}
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
          <div className="text-sm text-zinc-500 mb-1">Live Now</div>
          <div className="text-3xl font-bold text-green-400">
            {stats.live}
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
          <div className="text-sm text-zinc-500 mb-1">Avg Conviction</div>
          <div className="text-3xl font-bold text-cyan-400">
            {stats.avgConviction}%
          </div>
        </div>
      </div>

      {/* Sort and Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-500">Showing {filteredLaunches.length} launches</p>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Sort by:</span>
          <button
            onClick={() => setSortBy('trending')}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all",
              sortBy === 'trending'
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Flame className="w-4 h-4" />
            Trending
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-all",
              sortBy === 'newest'
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white"
                : "text-zinc-400 hover:text-white"
            )}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy('conviction')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-all",
              sortBy === 'conviction'
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white"
                : "text-zinc-400 hover:text-white"
            )}
          >
            Conviction
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading launches...</p>
        </div>
      )}

      {/* Launches Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLaunches.map((card) => {
            const hasVoted = userVotedLaunches.has(card.id)

            if (card.status === 'UPCOMING') {
              return (
                <UpcomingLaunchCard
                  key={card.id}
                  data={card}
                  hasVoted={hasVoted}
                  onUpvote={handleUpvote}
                  onComment={handleComment}
                  onBoost={handleBoost}
                  onFollow={handleCollaborate}
                  onView={handleView}
                  onSetReminder={handleSetReminder}
                />
              )
            }
            return (
              <LiveLaunchCard
                key={card.id}
                data={card}
                hasVoted={hasVoted}
                onUpvote={handleUpvote}
                onComment={handleComment}
                onBoost={handleBoost}
                onFollow={handleCollaborate}
                onView={handleView}
              />
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredLaunches.length === 0 && (
        <div className="text-center py-16">
          <Rocket className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
          <p className="text-zinc-500">No launches found for this filter</p>
        </div>
      )}

      {/* Comments Modal */}
      {selectedLaunch && (
        <CommentsModal
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          launchId={selectedLaunch.id}
          launchTitle={selectedLaunch.title}
        />
      )}

      {/* Collaborate Modal */}
      {selectedCollaborateLaunch && (
        <CollaborateModal
          open={collaborateOpen}
          onClose={() => setCollaborateOpen(false)}
          launchId={selectedCollaborateLaunch.id}
          launchTitle={selectedCollaborateLaunch.title}
          creatorName={selectedCollaborateLaunch.creatorName}
          creatorAvatar={selectedCollaborateLaunch.creatorAvatar}
          onSendInvite={handleSendCollaborationInvite}
        />
      )}

      {/* Submit Launch Drawer */}
      <SubmitLaunchDrawer
        isOpen={isSubmitLaunchOpen}
        onClose={() => setIsSubmitLaunchOpen(false)}
        onSubmit={async (data) => {
          if (!isAuthenticated || !userId) {
            alert('Please sign in to create a launch')
            return
          }

          try {
            // Upload logo if provided
            let logoUrl = ''
            if (data.logoFile) {
              // TODO: Upload to storage
              logoUrl = URL.createObjectURL(data.logoFile) // Temporary - replace with actual upload
            }

            // Generate unique launch ID
            const launchId = `launch_${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`

            await createLaunchDocument({
              launchId,
              scope: data.scope,
              title: data.title,
              subtitle: data.subtitle,
              logoUrl,
              createdBy: userId,
              convictionPct: 0,
              commentsCount: 0,
              upvotes: 0,
              contributionPoolPct: data.economics?.contributionPoolPct,
              feesSharePct: data.economics?.feesSharePct,
              status: data.status === 'Live' ? 'live' : 'upcoming',
            })

            setIsSubmitLaunchOpen(false)
            // Refresh launches
            window.location.reload()
          } catch (error) {
            console.error('Failed to create launch:', error)
            alert('Failed to create launch. Please try again.')
          }
        }}
      />
    </div>
  )
}
