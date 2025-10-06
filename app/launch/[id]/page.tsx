"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Heart, Eye } from 'lucide-react'
import { LaunchHeaderCompact } from '@/components/launch/LaunchHeaderCompact'
import { ChartTabs } from '@/components/launch/ChartTabs'
import { TokenStatsCompact } from '@/components/launch/TokenStatsCompact'
import { AboutCollapse } from '@/components/launch/AboutCollapse'
import { useState, useEffect } from 'react'
import { useTokenData } from '@/lib/tokenData'
import { generateMockCandles, generateMockActivity } from '@/lib/mockChartData'
import type { Contributor, Candle, ActivityPoint } from '@/types/launch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LaunchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isBoosted, setIsBoosted] = useState(false)
  const [chartData, setChartData] = useState<{ candles: Candle[]; activity: ActivityPoint[] }>({
    candles: [],
    activity: [],
  })

  // TODO: Fetch real launch data by params.id
  const launch = {
    id: params.id,
    title: 'Solana',
    subtitle: 'Fast, scalable blockchain for decentralized applications',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=SOL&backgroundColor=14f195',
    scope: 'ICM' as const,
    status: 'LIVE' as const,
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK token
    dexPairId: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // Use token address directly
    convictionPct: 94,
    socials: {
      twitter: '@solana',
      discord: 'discord.gg/solana',
      telegram: 't.me/solana',
      website: 'solana.com'
    },
    team: [
      { id: 'anatoly', name: 'Anatoly Yakovenko', twitter: 'aeyakovenko', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AY&backgroundColor=14f195' },
      { id: 'raj', name: 'Raj Gokal', twitter: 'rajgokal', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RG&backgroundColor=9945ff' },
      { id: 'austin', name: 'Austin Federa', twitter: 'Austin_Federa', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AF&backgroundColor=00d4ff' },
    ] as Contributor[],
    contributors: [
      { id: 'stephen', name: 'Stephen Akridge', twitter: 'stephenakridge', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SA&backgroundColor=dc1fff' },
      { id: 'greg', name: 'Greg Fitzgerald', twitter: 'gregfitzgerald', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GF&backgroundColor=ff6b00' },
      { id: 'eric', name: 'Eric Williams', twitter: 'ericwilliams', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EW&backgroundColor=10b981' },
      { id: 'lily', name: 'Lily Liu', twitter: 'lilygliu', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LL&backgroundColor=8b5cf6' },
    ] as Contributor[],
    description: `Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.

Solana is all about speed and scalability. It can process thousands of transactions per second with minimal fees, making it ideal for DeFi, NFTs, and Web3 applications.

Our platform features:
• Lightning-fast transaction speeds (65,000+ TPS)
• Ultra-low fees (fractions of a cent)
• Proof of History consensus mechanism
• Growing ecosystem of 400+ projects
• Developer-friendly tooling and SDKs
• Vibrant community of builders and users`,
  }

  const isICM = launch.scope === 'ICM'

  // Fetch token data if ICM with mint
  const { data: tokenData, loading: tokenLoading, error: tokenError } = useTokenData(
    isICM ? launch.mint : undefined,
    15000
  )

  const hasTokenData = tokenData.priceUsd !== undefined

  // Generate mock chart data on mount
  useEffect(() => {
    const candles = generateMockCandles(100, 0.00015, 300)
    const activity = generateMockActivity(candles)
    setChartData({ candles, activity })

    // TODO: Replace with real data fetch
    // const fetchChartData = async () => {
    //   const candles = await fetchRealCandles(launch.dexPairId, '5m')
    //   const activity = await fetchRealActivity(launch.id, {
    //     start: candles[0].t,
    //     end: candles[candles.length - 1].t,
    //   })
    //   setChartData({ candles, activity })
    // }
    // fetchChartData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black pb-20 lg:pb-8">
      {/* Content Wrapper - Compact max-width */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* HEADER CARD - Compact */}
        <LaunchHeaderCompact
          logoUrl={launch.logoUrl}
          title={launch.title}
          subtitle={launch.subtitle}
          status={launch.status}
          scope={launch.scope}
          convictionPct={launch.convictionPct}
          socials={launch.socials}
          team={launch.team}
          contributors={launch.contributors}
          className="mb-4"
        />

        {/* CHART TABS - Only for LIVE tokens with dexPairId */}
        {launch.status === "LIVE" && launch.dexPairId && (
          <ChartTabs
            pairId={launch.dexPairId}
            candles={chartData.candles}
            activity={chartData.activity}
            className="mb-4"
          />
        )}

        {/* TOKEN STATS GRID - Compact Cards */}
        {isICM && launch.mint && hasTokenData && !tokenLoading && (
          <TokenStatsCompact
            stats={{
              change24h: tokenData.change24h,
              vol24hUsd: tokenData.vol24hUsd,
              holders: tokenData.holders,
              mcapUsd: tokenData.mcapUsd,
            }}
            className="mb-4"
          />
        )}

        {/* Loading State for Token Stats */}
        {isICM && launch.mint && tokenLoading && (
          <TokenStatsCompact
            stats={{}}
            loading={true}
            className="mb-4"
          />
        )}

        {/* Error State */}
        {isICM && launch.mint && tokenError && !tokenLoading && (
          <div className="mb-4 text-center py-4 text-white/40 italic text-sm rounded-xl bg-white/[0.02] border border-white/5">
            Unable to load token data. Please try again later.
          </div>
        )}

        {/* ABOUT SECTION - Collapsible */}
        <Card variant="default" hover={false} className="mb-4">
          <div className="p-6">
            <AboutCollapse content={launch.description} previewLines={3} />
          </div>
        </Card>

        {/* ACTIONS - Sticky on Mobile */}
        <div className="fixed lg:relative bottom-0 left-0 right-0
                        border-t lg:border-0 border-white/10
                        bg-black/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none
                        p-4 lg:p-0 flex gap-2 z-50">
          <Button
            variant="boost"
            onClick={() => setIsBoosted(true)}
            className="flex-1 lg:flex-none lg:px-8"
          >
            <TrendingUp className="w-5 h-5" />
            Boost
          </Button>
          <Button variant="secondary" className="px-4 lg:px-6">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Follow</span>
          </Button>
          <Button variant="secondary" className="px-4 lg:px-6">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
