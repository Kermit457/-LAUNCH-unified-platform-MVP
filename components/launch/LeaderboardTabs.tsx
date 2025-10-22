"use client"

import { useState } from 'react'
import { Trophy, TrendingUp, Users as UsersIcon, Video, Zap, LayoutGrid, Table } from 'lucide-react'
import { LeaderboardSkeleton } from '@/components/design-system/Skeleton'
import { AdvancedTableView } from '@/components/AdvancedTableView'
import { UnifiedCard } from '@/components/UnifiedCard'
import type { BuilderRanking, InvestorRanking, CommunityRanking, ClipperRanking, TraderRanking } from '@/lib/appwrite/services/leaderboard'
import type { AdvancedListingData } from '@/lib/advancedTradingData'
import type { UnifiedCardData } from '@/components/UnifiedCard'
import { cn } from '@/lib/cn'

interface LeaderboardTabsProps {
  builders: BuilderRanking[]
  investors: InvestorRanking[]
  communities: CommunityRanking[]
  clippers: ClipperRanking[]
  traders: TraderRanking[]
  isLoading?: boolean
}

type TabType = 'builders' | 'investors' | 'communities' | 'clippers' | 'traders'
type ViewMode = 'table' | 'cards'

export function LeaderboardTabs({ builders, investors, communities, clippers, traders, isLoading }: LeaderboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('builders')
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const tabs = [
    { id: 'builders' as const, label: 'Builders', icon: Trophy, count: builders.length },
    { id: 'investors' as const, label: 'Investors', icon: TrendingUp, count: investors.length },
    { id: 'communities' as const, label: 'Communities', icon: UsersIcon, count: communities.length },
    { id: 'clippers' as const, label: 'Clippers', icon: Video, count: clippers.length },
    { id: 'traders' as const, label: 'Traders', icon: Zap, count: traders.length }
  ]

  // Convert rankings to AdvancedListingData format
  const convertToListingData = (): AdvancedListingData[] => {
    switch (activeTab) {
      case 'builders':
        return builders.map((builder, index) => ({
          id: builder.userId,
          type: 'icm' as const,
          title: builder.displayName,
          subtitle: `${builder.launchesCount} launches · ${builder.successRate.toFixed(0)}% success`,
          ticker: '',
          logoUrl: builder.avatar,
          status: 'active' as const,
          beliefScore: builder.successRate,
          upvotes: 0,
          commentsCount: 0,
          viewCount: 0,
          holders: builder.launchesCount,
          currentPrice: builder.totalTVL / 1000,
          priceChange24h: 0,
          metrics: {
            createdAt: Date.now(),
            creatorName: builder.displayName,
            creatorAvatar: builder.avatar,
            creatorWallet: builder.username,
            volume24h: builder.totalTVL,
            graduationPercent: builder.successRate
          }
        }))

      case 'investors':
        return investors.map((investor) => ({
          id: investor.userId,
          type: 'icm' as const,
          title: investor.displayName,
          subtitle: `${investor.holdingsCount} holdings`,
          ticker: '',
          logoUrl: investor.avatar,
          status: 'active' as const,
          beliefScore: Math.max(0, Math.min(100, investor.roi)),
          upvotes: 0,
          commentsCount: 0,
          viewCount: 0,
          holders: investor.holdingsCount,
          currentPrice: investor.portfolioValue / 1000,
          priceChange24h: investor.roi,
          metrics: {
            createdAt: Date.now(),
            creatorName: investor.displayName,
            creatorAvatar: investor.avatar,
            creatorWallet: investor.username,
            volume24h: investor.portfolioValue,
            graduationPercent: Math.max(0, Math.min(100, investor.roi))
          }
        }))

      case 'communities':
        return communities.map((community) => ({
          id: community.communityId,
          type: 'ccm' as const,
          title: community.name,
          subtitle: `${community.membersCount} members · ${community.launchesCount} launches`,
          ticker: '',
          logoUrl: community.logoUrl,
          status: 'active' as const,
          beliefScore: community.engagementScore,
          upvotes: 0,
          commentsCount: 0,
          viewCount: 0,
          holders: community.membersCount,
          currentPrice: community.totalTVL / 1000,
          priceChange24h: 0,
          metrics: {
            createdAt: Date.now(),
            creatorName: community.name,
            creatorAvatar: community.logoUrl,
            creatorWallet: community.communityId,
            volume24h: community.totalTVL,
            graduationPercent: community.engagementScore
          }
        }))

      case 'clippers':
        return clippers.map((clipper) => ({
          id: clipper.userId,
          type: 'ccm' as const,
          title: clipper.displayName,
          subtitle: `${clipper.clipsCreated} clips · ${(clipper.totalViews / 1000).toFixed(1)}k views · ${clipper.avgCTR.toFixed(1)}% CTR`,
          ticker: '',
          logoUrl: clipper.avatar,
          status: 'active' as const,
          beliefScore: clipper.avgCTR * 10,
          upvotes: 0,
          commentsCount: 0,
          viewCount: clipper.totalViews,
          holders: clipper.clipsCreated,
          currentPrice: clipper.totalEarnings,
          priceChange24h: 0,
          metrics: {
            createdAt: Date.now(),
            creatorName: clipper.displayName,
            creatorAvatar: clipper.avatar,
            creatorWallet: clipper.username,
            volume24h: clipper.totalEarnings,
            graduationPercent: clipper.avgCTR * 10
          }
        }))

      case 'traders':
        return traders.map((trader) => ({
          id: trader.userId,
          type: 'meme' as const,
          title: trader.displayName,
          subtitle: `${trader.tradesCount} trades · ${trader.winRate.toFixed(0)}% win rate`,
          ticker: '',
          logoUrl: trader.avatar,
          status: 'active' as const,
          beliefScore: trader.winRate,
          upvotes: 0,
          commentsCount: 0,
          viewCount: 0,
          holders: trader.tradesCount,
          currentPrice: trader.totalVolume / 100,
          priceChange24h: trader.pnl > 0 ? 10 : -10,
          metrics: {
            createdAt: Date.now(),
            creatorName: trader.displayName,
            creatorAvatar: trader.avatar,
            creatorWallet: trader.username,
            volume24h: trader.totalVolume,
            graduationPercent: trader.winRate
          }
        }))

      default:
        return []
    }
  }

  const listingData = convertToListingData()

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-black text-gradient-main">Leaderboards</h2>

        {/* View Toggle - Mobile Optimized */}
        <div className="flex items-center gap-1 md:gap-2 bg-zinc-900/80 backdrop-blur-xl rounded-lg md:rounded-xl p-1 md:p-1.5 border border-zinc-800">
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              "min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 px-3 md:px-4 py-2 md:py-2 rounded-md md:rounded-lg font-medium text-xs md:text-sm transition-all flex items-center justify-center gap-1 md:gap-2",
              viewMode === 'table'
                ? "bg-[#00FFFF] text-black"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 active:scale-95"
            )}
          >
            <Table className="w-4 h-4 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              "min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 px-3 md:px-4 py-2 md:py-2 rounded-md md:rounded-lg font-medium text-xs md:text-sm transition-all flex items-center justify-center gap-1 md:gap-2",
              viewMode === 'cards'
                ? "bg-[#00FFFF] text-black"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 active:scale-95"
            )}
          >
            <LayoutGrid className="w-4 h-4 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Tabs - Mobile Optimized */}
      <div
        className="flex gap-2 md:gap-2 mb-4 md:mb-6 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
        role="tablist"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "snap-start flex items-center gap-2 md:gap-2 px-4 md:px-6 py-3 md:py-3 min-h-[44px] rounded-lg md:rounded-xl font-medium text-sm md:text-sm transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                  : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700 active:scale-95'
              )}
            >
              <Icon className="w-4 h-4 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
              <span className={cn(
                "px-2 md:px-2 py-0.5 rounded-full text-xs md:text-xs font-bold",
                activeTab === tab.id ? 'bg-[#00FF88]/20' : 'bg-zinc-800'
              )}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <LeaderboardSkeleton />
      ) : listingData.length === 0 ? (
        <div className="glass-premium p-12 rounded-2xl text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2 text-zinc-300">No Data Yet</h3>
          <p className="text-zinc-500">This leaderboard will populate as users engage with the platform</p>
        </div>
      ) : (
        <div>
          {viewMode === 'table' ? (
            <div className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl border border-zinc-800/50 overflow-hidden">
              <AdvancedTableView
                listings={listingData}
                onBuyClick={(listing, amount) => {
                  console.log('Buy clicked:', listing, amount)
                }}
                onCollaborateClick={(listing) => {
                  console.log('Collaborate clicked:', listing)
                }}
                onCommentClick={(listing) => {
                  console.log('Comment clicked:', listing)
                }}
                onRowClick={(listing) => {
                  console.log('Row clicked:', listing)
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listingData.map((listing) => (
                <UnifiedCard
                  key={listing.id}
                  data={{
                    ...listing,
                    onVote: async () => console.log('Vote:', listing.id),
                    onComment: () => console.log('Comment:', listing.id),
                    onCollaborate: () => console.log('Collaborate:', listing.id),
                    onDetails: () => console.log('Details:', listing.id),
                    onBuyKeys: () => console.log('Buy keys:', listing.id),
                    onShare: () => console.log('Share:', listing.id),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
