"use client"

import { useState } from 'react'
import { LaunchHeaderBTDemo } from '@/components/btdemo/LaunchHeaderBTDemo'
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

export default function LaunchPage() {
  const [feedFilters, setFeedFilters] = useState({ status: 'all', sortBy: 'latest' })
  const [searchQuery, setSearchQuery] = useState('')

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
      type: 'launch' as const,
      user: { name: 'BuilderDao', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=builder' },
      project: { name: 'DeFi Protocol', ticker: 'DFP' },
      timestamp: Date.now() - 1000 * 60 * 2,
      value: 5000
    },
    {
      id: '3',
      type: 'buy' as const,
      user: { name: 'MegaInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mega' },
      project: { name: 'GameFi Arena', ticker: 'GFA' },
      amount: 22.3,
      timestamp: Date.now() - 1000 * 60 * 4,
      value: 3600
    },
    {
      id: '4',
      type: 'milestone' as const,
      user: { name: 'GameFi Arena', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=game' },
      project: { name: 'GameFi Arena', ticker: 'GFA' },
      timestamp: Date.now() - 1000 * 60 * 6,
      value: 3000
    },
    {
      id: '5',
      type: 'vote' as const,
      user: { name: 'CommunityMod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mod' },
      project: { name: 'DeFi Protocol', ticker: 'DFP' },
      timestamp: Date.now() - 1000 * 60 * 8,
      value: 200
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
  const filteredFeed = searchQuery
    ? feed.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : feed

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
        {/* Header - BTDEMO */}
        <LaunchHeaderBTDemo
          onSearch={setSearchQuery}
          onLaunchClick={handleLaunchClick}
          notificationCount={3}
        />

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
            contributors: [],
            contributorsCount: 12 + (idx * 3),
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
            onNotificationToggle: () => {},
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
            <h2 className="text-2xl md:text-3xl font-black text-[#D1FD0A] mb-2">Featured Projects</h2>
            <p className="text-zinc-400">Top performing launches with the highest motion scores</p>
          </div>

          <div className="glass-premium rounded-2xl border-2 border-[#D1FD0A]/30 overflow-hidden">
            <AdvancedTableViewBTDemo
              listings={filteredFeed.map((project, idx) => ({
                id: project.id,
                type: idx === 0 ? 'icm' : idx === 1 ? 'ccm' : idx === 2 ? 'icm' : idx === 3 ? 'meme' : 'icm',
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
                beliefScore: idx === 0 ? 95 : idx === 1 ? 87 : idx === 2 ? 92 : idx === 3 ? 85 : 85,
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
          <h2 className="text-xl md:text-2xl font-black mb-4 text-[#D1FD0A]">Active Feed</h2>

          <div className="grid grid-cols-1 lg:grid-cols-[600px_600px] gap-6 justify-center">
            {/* Partnership Cards */}
            <PartnershipCardsBTDemo />

            {/* Activity Stream */}
            <div>
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
