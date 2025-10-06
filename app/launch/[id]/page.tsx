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
import { getLaunch } from '@/lib/appwrite/services/launches'

export default function LaunchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isBoosted, setIsBoosted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [launch, setLaunch] = useState<any>(null)
  const [chartData, setChartData] = useState<{ candles: Candle[]; activity: ActivityPoint[] }>({
    candles: [],
    activity: [],
  })

  // Fetch launch data from Appwrite
  useEffect(() => {
    async function fetchLaunch() {
      try {
        setLoading(true)
        const data = await getLaunch(params.id as string)

        // Convert Appwrite Launch to component format
        setLaunch({
          id: data.$id,
          title: data.tokenName,
          subtitle: data.description,
          logoUrl: data.tokenImage,
          scope: data.tags.includes('ICM') ? 'ICM' : 'CCM',
          status: data.status === 'live' ? 'LIVE' : 'UPCOMING',
          mint: data.tokenSymbol || '',
          dexPairId: data.tokenSymbol || '',
          convictionPct: data.convictionPct || 0,
          socials: {
            twitter: data.tags.find(t => t.startsWith('@')) || '',
            discord: '',
            telegram: '',
            website: ''
          },
          team: data.team || [],
          contributors: data.contributors || [],
          description: data.description || 'No description available.',
        })
      } catch (error) {
        console.error('Failed to fetch launch:', error)
        // Fallback to mock data
        setLaunch({
          id: params.id,
          title: 'Launch Not Found',
          subtitle: 'This launch may have been removed or does not exist',
          logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=404',
          scope: 'ICM' as const,
          status: 'LIVE' as const,
          mint: '',
          dexPairId: '',
          convictionPct: 0,
          socials: {},
          team: [],
          contributors: [],
          description: 'Launch details could not be loaded.',
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchLaunch()
    }
  }, [params.id])

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
