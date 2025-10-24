"use client"

import { useState } from 'react'
import { Trophy, Users as UsersIcon } from 'lucide-react'
import { HeroMetricsBTDemo } from '@/components/btdemo/HeroMetricsBTDemo'
import { SpotlightCarouselBTDemo } from '@/components/btdemo/SpotlightCarouselBTDemo'
import { FeaturedProjectsCarousel } from '@/components/launch/FeaturedProjectsCarousel'
import type { UnifiedCardData } from '@/components/UnifiedCard'
import { CommunityCompositionBTDemo } from '@/components/btdemo/CommunityCompositionBTDemo'
import { AdvancedTableViewBTDemo } from '@/components/btdemo/AdvancedTableViewBTDemo'
import { ActivityStreamBTDemo } from '@/components/btdemo/ActivityStreamBTDemo'
import { PartnershipCardsBTDemo } from '@/components/btdemo/PartnershipCardsBTDemo'
import { SubmitLaunchDrawer } from '@/components/btdemo/overlays/SubmitLaunchDrawer'
import { TradeModal } from '@/components/btdemo/overlays/TradeModal'
import { CommentsDrawer } from '@/components/btdemo/overlays/CommentsDrawer'
import { CollaborateModal } from '@/components/btdemo/overlays/CollaborateModal'
import { SubmitClipModal } from '@/components/btdemo/overlays/SubmitClipModal'
import { useLaunchData } from '@/hooks/useLaunchData'
import { getMockCommunityStats } from '@/lib/appwrite/services/community'
import { TokenLaunchPreview } from '@/components/launch/TokenLaunchPreview'
import { IconRocket } from '@/lib/icons'
import { cn } from '@/lib/cn'

export default function LaunchPage() {
  const [feedFilters, setFeedFilters] = useState({ status: 'all', sortBy: 'latest' })
  const [searchQuery, setSearchQuery] = useState('')

  // Featured Projects filter states
  const [typeFilter, setTypeFilter] = useState<'icm' | 'ccm' | 'meme' | null>(null)
  const [sortBy, setSortBy] = useState<'price' | 'volume' | 'motion' | 'holders' | 'views'>('motion')
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({})

  // Fetch all launch page data
  const {
    metrics,
    spotlight,
    builders,
    investors,
    communities,
    clippers,
    traders,
    feed,
    isLoading,
    error
  } = useLaunchData(feedFilters)

  // Mock community stats (replace with real data later)
  const communityStats = getMockCommunityStats()

  // Mock activities for feed
  const mockActivities = [
    {
      id: '1',
      type: 'buy' as const,
      user: { name: 'CryptoWhale', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=whale' },
      project: { name: 'LaunchOS Platform', ticker: 'LOS' },
      amount: 15.5,
      timestamp: Date.now() - 1000 * 30,
      value: 2500
    },
    {
      id: '2',
      type: 'network' as const,
      user: { name: 'DevMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev' },
      timestamp: Date.now() - 1000 * 60,
      value: 0
    },
    {
      id: '3',
      type: 'launch' as const,
      user: { name: 'BuilderDao', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=builder' },
      project: { name: 'DeFi Protocol', ticker: 'DFP' },
      timestamp: Date.now() - 1000 * 60 * 2,
      value: 5000
    },
    {
      id: '4',
      type: 'collab' as const,
      user: { name: 'TeamLead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=team' },
      project: { name: 'GameFi Arena', ticker: 'GFA' },
      timestamp: Date.now() - 1000 * 60 * 3,
      value: 0
    },
    {
      id: '5',
      type: 'sell' as const,
      user: { name: 'Trader99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader' },
      project: { name: 'LaunchOS Platform', ticker: 'LOS' },
      amount: 8.2,
      timestamp: Date.now() - 1000 * 60 * 4,
      value: 1200
    },
    {
      id: '6',
      type: 'motion' as const,
      user: { name: 'GameFi Arena', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=game' },
      project: { name: 'GameFi Arena', ticker: 'GFA' },
      timestamp: Date.now() - 1000 * 60 * 5,
      value: 0
    },
    {
      id: '7',
      type: 'curator' as const,
      user: { name: 'AlphaCurator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=curator' },
      timestamp: Date.now() - 1000 * 60 * 6,
      value: 0
    },
    {
      id: '8',
      type: 'holders' as const,
      user: { name: 'DeFi Protocol', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi' },
      project: { name: 'DeFi Protocol', ticker: 'DFP' },
      amount: 500,
      timestamp: Date.now() - 1000 * 60 * 7,
      value: 0
    },
    {
      id: '9',
      type: 'dm' as const,
      user: { name: 'InvestorPro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor' },
      timestamp: Date.now() - 1000 * 60 * 8,
      value: 0
    },
    {
      id: '10',
      type: 'clip' as const,
      user: { name: 'ContentKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=content' },
      project: { name: 'GameFi Arena', ticker: 'GFA' },
      timestamp: Date.now() - 1000 * 60 * 9,
      value: 0
    }
  ]

  // Convert community stats for BTDEMO component
  const btdemoCommunityStats = {
    builders: communityStats.builders,
    investors: communityStats.vcs,
    communities: communityStats.cultists,
    clippers: communityStats.influencers,
    traders: communityStats.traders
  }

  // Filter feed by search query (client-side)
  let filteredFeed = searchQuery
    ? feed.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : feed

  // Apply type filter and sorting to Featured Projects table
  const processedFeedForTable = (() => {
    // First map to the format with type information
    let processed = filteredFeed.map((project, idx) => ({
      ...project,
      assignedType: (idx === 0 ? 'icm' : idx === 1 ? 'ccm' : idx === 2 ? 'icm' : idx === 3 ? 'meme' : 'icm') as 'icm' | 'ccm' | 'meme',
      beliefScore: idx === 0 ? 95 : idx === 1 ? 87 : idx === 2 ? 92 : idx === 3 ? 85 : 85
    }))

    // Apply type filter
    if (typeFilter) {
      processed = processed.filter(p => p.assignedType === typeFilter)
    }

    // Apply sorting
    processed = [...processed].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (b.currentPrice || 0) - (a.currentPrice || 0)
        case 'volume':
          return (b.volume24h || 0) - (a.volume24h || 0)
        case 'motion':
          return (b.beliefScore || 0) - (a.beliefScore || 0)
        case 'holders':
          return (b.holders || 0) - (a.holders || 0)
        case 'views':
          return (b.clipViews || 0) - (a.clipViews || 0)
        default:
          return 0
      }
    })

    return processed
  })()

  const handleFilterChange = (status: string, sortBy: string) => {
    setFeedFilters({ status, sortBy })
  }

  // Overlay states
  const [submitDrawerOpen, setSubmitDrawerOpen] = useState(false)
  const [tradeModalOpen, setTradeModalOpen] = useState(false)
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false)
  const [collaborateModalOpen, setCollaborateModalOpen] = useState(false)
  const [clipModalOpen, setClipModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const handleLaunchClick = (): void => {
    setSubmitDrawerOpen(true)
  }

  const handleLaunchSubmit = (data: any): void => {
    console.log('Launch submitted:', data)
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden relative">
      {/* BTDemo Background Blur Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[325px] h-[325px] rounded-full bg-primary/20 blur-[125px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[325px] h-[325px] rounded-full bg-primary/15 blur-[125px]" />
        <div className="absolute top-3/4 left-3/4 w-[250px] h-[250px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Token Launch Preview - BTDemo Design System */}
        <TokenLaunchPreview
          onLaunch={(data) => {
            console.log('Token launch data:', data)
            handleLaunchSubmit(data)
          }}
        />

        {/* Hero Metrics - BTDEMO */}
        <HeroMetricsBTDemo
          vaultTVL={0}
          motion24h={0.0}
          liveProjects={3}
          tradingVolume={1800000}
          clipViews={588600}
        />

        {/* Featured Projects Carousel - NEW STANDOUT SECTION */}
        <FeaturedProjectsCarousel
          projects={spotlight.map((project, idx): UnifiedCardData => ({
            id: project.id,
            type: idx === 0 ? 'icm' : idx === 1 ? 'ccm' : 'meme',
            title: project.title,
            subtitle: project.description,
            logoUrl: project.logoUrl,
            ticker: project.ticker,
            status: project.status || 'live',
            beliefScore: 70 + (idx * 7), // 70-91 range
            upvotes: 42 + (idx * 15),
            commentsCount: 18 + (idx * 8),
            viewCount: project.views || 1250,
            clipViews: project.views,
            holders: project.holders,
            keyHolders: [],
            currentPrice: 0.05 + (idx * 0.02),
            contractPrice: 0.05 + (idx * 0.02),
            priceChange24h: 15.5 - (idx * 3.2),
            contributors: project.contributors || project.networkMembers || [],
            contributorsCount: project.contributorsCount || (project.contributors?.length) || (project.networkMembers?.length) || 12 + (idx * 3),
            myKeys: 0,
            mySharePct: 0,
            twitterUrl: project.twitterUrl,
            websiteUrl: project.websiteUrl,
            isLab: idx === 0,
            hasVoted: false,
            isVoting: false,
            onVote: async () => {},
            onComment: () => setCommentsDrawerOpen(true),
            onCollaborate: () => {
              setSelectedProject(project)
              setCollaborateModalOpen(true)
            },
            onBuyKeys: () => {
              setSelectedProject(project)
              setTradeModalOpen(true)
            },
            onClipClick: () => {
              setSelectedProject(project)
              setClipModalOpen(true)
            },
            notificationEnabled: notificationPrefs[project.id] || false,
            onNotificationToggle: () => {
              setNotificationPrefs(prev => ({
                ...prev,
                [project.id]: !prev[project.id]
              }))
            },
            onShare: () => {}
          }))}
          onBuyKeys={(project) => {
            setSelectedProject(project)
            setTradeModalOpen(true)
          }}
          onClipClick={(project) => {
            setSelectedProject(project)
            setClipModalOpen(true)
          }}
          onCollaborate={(project) => {
            setSelectedProject(project)
            setCollaborateModalOpen(true)
          }}
        />

        {/* Community Composition - BTDEMO */}
        <section className="container mx-auto px-4 py-4">
          <CommunityCompositionBTDemo stats={btdemoCommunityStats} />
        </section>

        {/* Featured Projects Table - BTDEMO */}
        <section className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-[#D1FD0A] mb-2">Leaderboard</h2>
            <p className="text-zinc-400">Where motion creates value and conviction builds empires</p>
          </div>

          {/* Filters Bar */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort Buttons - FIRST */}
              <button
                onClick={() => setSortBy('price')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  sortBy === 'price'
                    ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                )}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('volume')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  sortBy === 'volume'
                    ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                )}
              >
                Volume
              </button>
              <button
                onClick={() => setSortBy('motion')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  sortBy === 'motion'
                    ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                )}
              >
                Motion
              </button>
              <button
                onClick={() => setSortBy('holders')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  sortBy === 'holders'
                    ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                )}
              >
                Holders
              </button>
              <button
                onClick={() => setSortBy('views')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  sortBy === 'views'
                    ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                )}
              >
                Views
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-zinc-700" />

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 uppercase font-bold">TYPE:</span>
                <button
                  onClick={() => setTypeFilter(typeFilter === 'icm' ? null : 'icm')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    typeFilter === 'icm'
                      ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    ICM
                  </span>
                </button>
                <button
                  onClick={() => setTypeFilter(typeFilter === 'ccm' ? null : 'ccm')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    typeFilter === 'ccm'
                      ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <UsersIcon className="w-3 h-3" />
                    CCM
                  </span>
                </button>
                <button
                  onClick={() => setTypeFilter(typeFilter === 'meme' ? null : 'meme')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    typeFilter === 'meme'
                      ? "bg-[#D1FD0A] text-black border-[#D1FD0A]"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-[#D1FD0A]/50"
                  )}
                >
                  CULT
                </button>
              </div>

              {/* Clear Filters */}
              {typeFilter && (
                <>
                  <div className="h-6 w-px bg-zinc-700" />
                  <button
                    onClick={() => {
                      setTypeFilter(null)
                      setSortBy('motion')
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all underline"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="glass-premium rounded-2xl border-2 border-[#D1FD0A]/30 overflow-hidden">
            <AdvancedTableViewBTDemo
              listings={processedFeedForTable.map((project, idx) => ({
                id: project.id,
                type: project.assignedType,
                status: 'live',
                title: project.title,
                subtitle: project.description,
                logoUrl: project.logoUrl,
                ticker: project.ticker,
                currentPrice: project.currentPrice || 0.05,
                priceChange24h: project.priceChange24h || 15.5,
                holders: project.holders || 124,
                // Views linked to total clip views for this project
                viewCount: project.clipViews || project.clips?.reduce((acc: number, clip: any) => acc + (clip.views || 0), 0) || 1250,
                beliefScore: project.beliefScore,
                upvotes: project.upvotes || 42,
                commentsCount: project.commentsCount || 18,
                myKeys: 0,
                mySharePct: 0,
                hasVoted: false,
                creatorId: project.creatorId,
                metrics: {
                  volume24h: project.volume24h || 125000,
                  marketCap: project.marketCap || 2500000,
                  tvl: project.tvl || 850000,
                  createdAt: project.createdAt || Date.now() - 86400000,
                  graduationPercent: project.graduationPercent || 75,
                  // Creator data from user profile
                  creatorName: project.creator?.displayName || project.creatorName || 'LaunchOS Team',
                  creatorAvatar: project.creator?.avatar || project.creatorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator',
                  // Key holders count (actual token holders)
                  totalHolders: project.keyHolders?.length || project.holders || 0,
                  // Contributors from network/invites - showing Twitter avatars
                  contributorsCount: project.contributors?.length || project.networkMembers?.length || 12,
                  contributors: project.contributors || project.networkMembers || [],
                  // Social URLs from project creation data or user profile
                  websiteUrl: project.socialLinks?.website || project.websiteUrl,
                  telegramUrl: project.socialLinks?.telegram || project.telegramUrl,
                  twitterUrl: project.socialLinks?.twitter || project.twitterUrl || project.creator?.twitterHandle,
                  githubUrl: project.socialLinks?.github || project.githubUrl,
                  // Add lab status for experimental projects
                  isLab: project.isExperimental || Math.random() > 0.7
                }
              }))}
              onBuyClick={(listing) => {
                setSelectedProject(listing)
                setTradeModalOpen(true)
              }}
              onCollaborateClick={(listing) => {
                setSelectedProject(listing)
                setCollaborateModalOpen(true)
              }}
              onClipClick={(listing) => {
                setSelectedProject(listing)
                setClipModalOpen(true)
              }}
              onRowClick={(listing) => {
                // Navigate to project details page
                window.location.href = `/launch/${listing.id}`
              }}
            />
          </div>
        </section>

        {/* Active Feed - BTDEMO */}
        <section className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[480px_720px] gap-6 justify-center">
            {/* Accelerator Section */}
            <div className="order-2 lg:order-1">
              <div className="mb-3">
                <h3 className="text-base font-bold text-[#D1FD0A] mb-1">Accelerator</h3>
                <p className="text-sm text-zinc-400">Join our ecosystem programs</p>
              </div>
              <PartnershipCardsBTDemo />
            </div>

            {/* Activity Stream */}
            <div className="order-1 lg:order-2">
              <div className="mb-3">
                <h3 className="text-base font-bold text-[#D1FD0A] mb-1">Platform Activity</h3>
                <p className="text-sm text-zinc-400">Real-time feed of valuable actions</p>
              </div>
              <ActivityStreamBTDemo activities={mockActivities} />
            </div>
          </div>
        </section>
      </div>

      {/* Overlays */}
      <SubmitLaunchDrawer
        isOpen={submitDrawerOpen}
        onClose={() => setSubmitDrawerOpen(false)}
        onSubmit={handleLaunchSubmit}
      />

      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        project={selectedProject || {
          id: '1',
          name: 'LaunchOS Platform',
          ticker: 'LOS',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=launchos',
          motionScore: 847
        }}
        mode="buy"
      />

      <CommentsDrawer
        isOpen={commentsDrawerOpen}
        onClose={() => setCommentsDrawerOpen(false)}
        project={selectedProject || {
          id: '1',
          name: 'LaunchOS Platform',
          ticker: 'LOS'
        }}
      />

      <CollaborateModal
        isOpen={collaborateModalOpen}
        onClose={() => setCollaborateModalOpen(false)}
        project={selectedProject || {
          id: '1',
          name: 'LaunchOS Platform',
          ticker: 'LOS',
          logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=launchos'
        }}
      />

      <SubmitClipModal
        open={clipModalOpen}
        onClose={() => setClipModalOpen(false)}
        project={selectedProject}
        onSubmit={(data) => {
          console.log('Clip submitted:', data)
          // TODO: Implement clip submission logic
          setClipModalOpen(false)
        }}
      />

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="glass-premium p-6 rounded-2xl border-2 border-red-500/30 bg-red-500/5">
            <div className="text-red-400 font-medium">Error loading data: {error}</div>
          </div>
        </div>
      )}
    </div>
  )
}
