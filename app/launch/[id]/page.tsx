"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Heart, Eye, MessageCircle, Send, ArrowBigUp, Clock, Users, Coins } from 'lucide-react'
import { LaunchHeaderCompact } from '@/components/launch/LaunchHeaderCompact'
import { ChartTabs } from '@/components/launch/ChartTabs'
import { TokenStatsCompact } from '@/components/launch/TokenStatsCompact'
import { AboutCollapse } from '@/components/launch/AboutCollapse'
import { TradingPanel } from '@/components/trading/TradingPanel'
import { useState, useEffect } from 'react'
import { useTokenData } from '@/lib/tokenData'
import { generateMockCandles, generateMockActivity } from '@/lib/mockChartData'
import type { Contributor, Candle, ActivityPoint } from '@/types/launch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getLaunch } from '@/lib/appwrite/services/launches'
import { useComments } from '@/hooks/useComments'
import { useRealtimeVotes } from '@/hooks/useRealtimeVotes'
import { useToast } from '@/hooks/useToast'
import { LaunchHeaderSkeleton, StatsCardSkeleton, ChartSkeleton, CommentSkeleton } from '@/components/LoadingSkeletons'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useRealtimeTracking } from '@/hooks/useRealtimeTracking'

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
  const [newComment, setNewComment] = useState('')
  const [voteFlash, setVoteFlash] = useState(false)

  const { success, error: showError } = useToast()

  const launchId = params?.id as string

  // Real-time comments
  const { comments, loading: commentsLoading, addComment, upvoteComment } = useComments(launchId)

  // Real-time votes
  const { voteCount, hasVoted, toggleVote, isVoting } = useRealtimeVotes(launchId)

  // Real-time tracking (views & boosts)
  const { viewCount, boostCount, boost, isBoosting } = useRealtimeTracking(launchId, true)

  // Fetch launch data from Appwrite
  useEffect(() => {
    async function fetchLaunch() {
      if (!launchId) return

      try {
        setLoading(true)
        const data = await getLaunch(launchId)

        if (!data) {
          throw new Error('Launch not found')
        }

        // Convert Appwrite Launch to component format
        setLaunch({
          id: data.$id,
          title: data.tokenName || data.title || 'Unknown',
          subtitle: data.description || data.subtitle || '',
          logoUrl: data.tokenImage || data.logoUrl,
          scope: data.scope || ((data.tags && data.tags.includes('ICM')) ? 'ICM' : 'CCM'),
          status: data.status === 'live' ? 'LIVE' : data.status === 'active' ? 'ACTIVE' : 'ENDED',
          mint: data.tokenSymbol || '',
          dexPairId: data.launchId || data.$id,
          convictionPct: data.convictionPct || 0,
          contributionPoolPct: data.contributionPoolPct,
          feesSharePct: data.feesSharePct,
          tgeDate: data.tgeDate,
          socials: {
            twitter: (data.tags && data.tags.find(t => t.startsWith('@'))) || '',
            discord: '',
            telegram: '',
            website: ''
          },
          team: data.team || [],
          contributors: data.contributors || [],
          description: data.description || data.subtitle || 'No description available.',
        })
      } catch (error) {
        console.error('Failed to fetch launch:', error)
        // Fallback to mock data
        setLaunch({
          id: launchId,
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

    if (launchId) {
      fetchLaunch()
    }
  }, [launchId])

  const isICM = launch?.scope === 'ICM'

  // Fetch token data if ICM with mint
  const { data: tokenData, loading: tokenLoading, error: tokenError } = useTokenData(
    isICM ? launch?.mint : undefined,
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

  // Show loading state while fetching
  if (loading || !launch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back Button Skeleton */}
          <div className="mb-4 h-8 w-20 bg-white/10 rounded animate-pulse"></div>

          {/* Header Skeleton */}
          <LaunchHeaderSkeleton />

          {/* Stats Skeleton */}
          <div className="mt-4">
            <StatsCardSkeleton />
          </div>

          {/* Chart Skeleton */}
          <div className="mt-4">
            <ChartSkeleton />
          </div>

          {/* Comments Skeleton */}
          <Card variant="default" hover={false} className="mt-4">
            <div className="p-6">
              <div className="h-6 w-32 bg-white/10 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
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

        {/* ENGAGEMENT STATS BAR */}
        <Card variant="default" hover={false} className="mb-4">
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Votes */}
              <button
                onClick={async () => {
                  try {
                    await toggleVote()
                    // Trigger flash animation
                    setVoteFlash(true)
                    setTimeout(() => setVoteFlash(false), 500)

                    // Show toast notification
                    if (hasVoted) {
                      success('Vote removed!', 'You can change your mind anytime')
                    } else {
                      success('Voted!', 'Thanks for supporting this launch')
                    }
                  } catch (error: any) {
                    console.error('Vote failed:', error.message)
                    showError('Failed to vote', error.message)
                  }
                }}
                disabled={isVoting}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  hasVoted
                    ? 'bg-fuchsia-500/20 border border-fuchsia-500/40'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-500/40'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${voteFlash ? 'animate-flash' : ''}`}
              >
                <ArrowBigUp className={`w-6 h-6 ${hasVoted ? 'text-fuchsia-400 fill-fuchsia-400' : 'text-white/70'}`} />
                <div className="text-center">
                  <div className={`text-xl font-bold ${hasVoted ? 'text-fuchsia-400' : 'text-white'}`}>{voteCount}</div>
                  <div className="text-xs text-white/60">Upvotes</div>
                </div>
              </button>

              {/* Comments */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{comments.length}</div>
                  <div className="text-xs text-white/60">Comments</div>
                </div>
              </div>

              {/* Contributors */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <Users className="w-6 h-6 text-purple-400" />
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{launch.contributors?.length || 0}</div>
                  <div className="text-xs text-white/60">Contributors</div>
                </div>
              </div>

              {/* Views (real-time) */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <Eye className="w-6 h-6 text-green-400" />
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{viewCount}</div>
                  <div className="text-xs text-white/60">Views</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ECONOMICS & TGE INFO */}
        {((launch.contributionPoolPct && launch.contributionPoolPct > 0) ||
          (launch.feesSharePct && launch.feesSharePct > 0) ||
          launch.tgeDate) && (
          <Card variant="default" hover={false} className="mb-4">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white/60 mb-3">Launch Details</h3>
              <div className="flex flex-wrap gap-3">
                {/* Contribution Pool Badge */}
                {launch.contributionPoolPct && launch.contributionPoolPct > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <Coins className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-semibold text-emerald-300">
                        {launch.contributionPoolPct}% Total Supply
                      </div>
                      <div className="text-xs text-emerald-400/60">Contribution Pool</div>
                    </div>
                  </div>
                )}

                {/* Fees Share Badge */}
                {launch.feesSharePct && launch.feesSharePct > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-sm font-semibold text-amber-300">
                        {launch.feesSharePct}% Fees Share
                      </div>
                      <div className="text-xs text-amber-400/60">Revenue Split</div>
                    </div>
                  </div>
                )}

                {/* TGE Date Badge */}
                {launch.tgeDate && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-sm font-semibold text-cyan-300">
                        {new Date(launch.tgeDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-cyan-400/60">TGE Date</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* CHART + TRADING PANEL - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Chart - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            {launch.status === "LIVE" && launch.dexPairId && (
              <ChartTabs
                pairId={launch.dexPairId}
                candles={chartData.candles}
                activity={chartData.activity}
              />
            )}
          </div>

          {/* Trading Panel - Takes 1 column on desktop */}
          <div className="lg:col-span-1">
            <TradingPanel
              curveId={launchId}
              currentPrice={0.0001234}
              userBalance={1250.50}
              symbol={launch.mint || launch.title}
            />
          </div>
        </div>

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

        {/* COMMENTS SECTION - Real-time */}
        <Card variant="default" hover={false} className="mb-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments
                <span className="text-sm text-white/40">({comments.length})</span>
              </h3>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                LIVE
              </div>
            </div>

            {/* Add Comment */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && newComment.trim()) {
                      try {
                        await addComment(newComment)
                        setNewComment('')
                        success('Comment added!', 'Your comment is now live')
                      } catch (error: any) {
                        showError('Failed to post comment', error.message)
                      }
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-fuchsia-500/50"
                />
                <Button
                  onClick={async () => {
                    if (newComment.trim()) {
                      try {
                        await addComment(newComment)
                        setNewComment('')
                        success('Comment added!', 'Your comment is now live')
                      } catch (error: any) {
                        showError('Failed to post comment', error.message)
                      }
                    }
                  }}
                  disabled={!newComment.trim()}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-8 text-white/40">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.avatar || `https://api.dicebear.com/7.x/avatars/svg?seed=${comment.author}`}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{comment.author}</span>
                        <span className="text-xs text-white/40">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mb-2">{comment.text}</p>
                      <button
                        onClick={() => upvoteComment(comment.id)}
                        className="flex items-center gap-1 text-xs text-white/60 hover:text-fuchsia-400 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        {comment.upvotes || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* ACTIONS - Sticky on Mobile */}
        <div className="fixed lg:relative bottom-0 left-0 right-0
                        border-t lg:border-0 border-white/10
                        bg-black/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none
                        p-4 lg:p-0 flex gap-2 z-50">
          <Button
            variant="boost"
            onClick={async () => {
              try {
                await boost()
                setIsBoosted(true)
                success('Boosted!', `This launch now has ${boostCount + 1} boosts`)
              } catch (error: any) {
                showError('Boost failed', error.message)
              }
            }}
            disabled={isBoosting}
            className="flex-1 lg:flex-none lg:px-8 gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Boost {boostCount > 0 && `(${boostCount})`}
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
    </ErrorBoundary>
  )
}
