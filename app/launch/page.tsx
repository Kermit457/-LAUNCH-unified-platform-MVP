"use client"

import { useState } from 'react'
import { LaunchHeader } from '@/components/launch/LaunchHeader'
import { TokenLaunchPreview } from '@/components/launch/TokenLaunchPreview'
import { HeroMetrics } from '@/components/launch/HeroMetrics'
import { CommunityComposition } from '@/components/launch/CommunityComposition'
import { SpotlightCarousel } from '@/components/launch/SpotlightCarousel'
import { LeaderboardTabs } from '@/components/launch/LeaderboardTabs'
import { ProjectFeed } from '@/components/launch/ProjectFeed'
import { useLaunchData } from '@/hooks/useLaunchData'
import { getMockCommunityStats } from '@/lib/appwrite/services/community'

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white pb-20 overflow-x-hidden">
      {/* Header */}
      <LaunchHeader
        onSearch={setSearchQuery}
      />

      {/* Token Launch Preview - NEW */}
      <TokenLaunchPreview
        onLaunch={(data) => {
          console.log('Token launch data:', data)
          // TODO: Implement token launch
        }}
      />

      {/* Hero Metrics */}
      <HeroMetrics
        metrics={metrics}
        isLoading={isLoading}
        clipStats={{
          totalViews: 588608,
          totalClips: 1247,
          totalCreators: 342
        }}
        tradingVolume={1845923}
        networkActivity={4521}
      />

      {/* Spotlight Section */}
      <SpotlightCarousel projects={spotlight} isLoading={isLoading} />

      {/* Community Composition */}
      <section className="container mx-auto px-4 py-4">
        <CommunityComposition stats={communityStats} isLoading={isLoading} />
      </section>

      {/* Leaderboards */}
      <LeaderboardTabs
        builders={builders}
        investors={investors}
        communities={communities}
        clippers={clippers}
        traders={traders}
        isLoading={isLoading}
      />

      {/* Active Feed */}
      <ProjectFeed
        projects={filteredFeed}
        isLoading={isLoading}
        onFilterChange={handleFilterChange}
      />

      {/* Submit Launch Drawer */}
      {/* <SubmitLaunchDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      /> */}

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="glass-premium p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
            <div className="text-red-400 font-medium">Error loading data: {error}</div>
          </div>
        </div>
      )}
    </div>
  )
}
