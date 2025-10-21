'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp, MessageCircle, Send, ArrowBigUp, Clock, Users, Eye, Coins } from 'lucide-react'
import { LaunchHeaderCompact } from '@/components/launch/LaunchHeaderCompact'
import { ChartTabs } from '@/components/launch/ChartTabs'
import { AboutCollapse } from '@/components/launch/AboutCollapse'
import { generateMockCandles, generateMockActivity } from '@/lib/mockChartData'
import type { Candle, ActivityPoint } from '@/types/launch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getLaunch } from '@/lib/appwrite/services/launches'
import { useComments } from '@/hooks/useComments'
import { useRealtimeVotes } from '@/hooks/useRealtimeVotes'
import { useToast } from '@/hooks/useToast'
import { useRealtimeTracking } from '@/hooks/useRealtimeTracking'

interface LaunchDetailsModalProps {
  open: boolean
  onClose: () => void
  launchId: string
  listing?: any // Optional: pass listing data directly to avoid fetch
}

export function LaunchDetailsModal({ open, onClose, launchId, listing }: LaunchDetailsModalProps) {
  const [loading, setLoading] = useState(true)
  const [launch, setLaunch] = useState<any>(null)
  const [chartData, setChartData] = useState<{ candles: Candle[]; activity: ActivityPoint[] }>({
    candles: [],
    activity: [],
  })
  const [newComment, setNewComment] = useState('')
  const [voteFlash, setVoteFlash] = useState(false)
  const [tradingModalOpen, setTradingModalOpen] = useState(false)

  const { success, error: showError } = useToast()

  // Real-time comments
  const { comments, loading: commentsLoading, addComment, upvoteComment } = useComments(launchId)

  // Real-time votes
  const { voteCount, hasVoted, toggleVote, isVoting } = useRealtimeVotes(launchId)

  // Real-time tracking (views & boosts)
  const { viewCount, boostCount, boost, isBoosting } = useRealtimeTracking(launchId, open)

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    if (open) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  // Fetch launch data from Appwrite or use provided listing
  useEffect(() => {
    async function loadLaunch() {
      if (!launchId || !open) return

      try {
        setLoading(true)

        // If listing data is provided, use it directly
        if (listing) {
          setLaunch({
            id: listing.id,
            title: listing.title,
            subtitle: listing.subtitle || '',
            logoUrl: listing.logo || listing.logoUrl,
            scope: listing.type === 'icm' ? 'ICM' : listing.type === 'ccm' ? 'CCM' : 'MEME',
            status: listing.status === 'live' ? 'LIVE' : listing.status === 'upcoming' ? 'UPCOMING' : 'ACTIVE',
            mint: listing.ticker || '',
            dexPairId: listing.id,
            convictionPct: listing.beliefScore || 0,
            contributionPoolPct: 0,
            feesSharePct: 0,
            tgeDate: null,
            socials: {
              twitter: listing.platforms?.twitter || '',
              discord: '',
              telegram: '',
              website: ''
            },
            team: [],
            contributors: listing.contributors || [],
            description: listing.description || listing.subtitle || 'No description available.',
          })

          // Generate mock chart data
          const candles = generateMockCandles(100, 0.00015, 300)
          const activity = generateMockActivity(candles)
          setChartData({ candles, activity })
          setLoading(false)
          return
        }

        // Otherwise try to fetch from Appwrite
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
          status: data.status === 'live' ? 'LIVE' : data.status === 'upcoming' ? 'UPCOMING' : 'ENDED',
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

        // Generate mock chart data
        const candles = generateMockCandles(100, 0.00015, 300)
        const activity = generateMockActivity(candles)
        setChartData({ candles, activity })
      } catch (error) {
        console.error('Failed to fetch launch:', error)
        showError('Failed to load launch', 'Please try again')
      } finally {
        setLoading(false)
      }
    }

    if (launchId && open) {
      loadLaunch()
    }
  }, [launchId, open, listing])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-zinc-950 backdrop-blur-xl rounded-2xl border border-zinc-800 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700 transition-colors z-10"
          >
            <X className="w-5 h-5 text-zinc-300" />
          </button>

          {loading || !launch ? (
            <div className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-zinc-800/50 rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-2/3 mx-auto"></div>
                <div className="h-64 bg-zinc-800/50 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
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
              />

              {/* ENGAGEMENT STATS BAR */}
              <Card variant="default" hover={false}>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Votes */}
                    <button
                      onClick={async () => {
                        try {
                          await toggleVote()
                          setVoteFlash(true)
                          setTimeout(() => setVoteFlash(false), 500)
                          success(hasVoted ? 'Vote removed!' : 'Voted!', hasVoted ? 'You can change your mind anytime' : 'Thanks for supporting this launch')
                        } catch (error: any) {
                          showError('Failed to vote', error.message)
                        }
                      }}
                      disabled={isVoting}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                        hasVoted
                          ? 'bg-[#00FF88]/10 border border-[#00FF88]/40'
                          : 'bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700 hover:border-[#00FF88]/40'
                      } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${voteFlash ? 'animate-flash' : ''}`}
                    >
                      <ArrowBigUp className={`w-6 h-6 ${hasVoted ? 'text-[#00FF88] fill-[#00FF88]' : 'text-zinc-400'}`} />
                      <div className="text-center">
                        <div className={`text-xl font-bold ${hasVoted ? 'text-[#00FF88]' : 'text-white'}`}>{voteCount}</div>
                        <div className="text-xs text-zinc-500">Upvotes</div>
                      </div>
                    </button>

                    {/* Comments */}
                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700">
                      <MessageCircle className="w-6 h-6 text-[#00FFFF]" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{comments.length}</div>
                        <div className="text-xs text-zinc-500">Comments</div>
                      </div>
                    </div>

                    {/* Contributors */}
                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700">
                      <Users className="w-6 h-6 text-[#8800FF]" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{launch.contributors?.length || 0}</div>
                        <div className="text-xs text-zinc-500">Contributors</div>
                      </div>
                    </div>

                    {/* Views */}
                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700">
                      <Eye className="w-6 h-6 text-[#FFD700]" />
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{viewCount}</div>
                        <div className="text-xs text-zinc-500">Views</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ECONOMICS & TGE INFO */}
              {((launch.contributionPoolPct && launch.contributionPoolPct > 0) ||
                (launch.feesSharePct && launch.feesSharePct > 0) ||
                launch.tgeDate) && (
                <Card variant="default" hover={false}>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3">Launch Details</h3>
                    <div className="flex flex-wrap gap-3">
                      {launch.contributionPoolPct && launch.contributionPoolPct > 0 && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/30">
                          <Coins className="w-5 h-5 text-[#00FF88]" />
                          <div>
                            <div className="text-sm font-semibold text-[#00FF88]">{launch.contributionPoolPct}% Total Supply</div>
                            <div className="text-xs text-zinc-500">Contribution Pool</div>
                          </div>
                        </div>
                      )}
                      {launch.feesSharePct && launch.feesSharePct > 0 && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
                          <TrendingUp className="w-5 h-5 text-[#FFD700]" />
                          <div>
                            <div className="text-sm font-semibold text-[#FFD700]">{launch.feesSharePct}% Fees Share</div>
                            <div className="text-xs text-zinc-500">Revenue Split</div>
                          </div>
                        </div>
                      )}
                      {launch.tgeDate && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/30">
                          <Clock className="w-5 h-5 text-[#00FFFF]" />
                          <div>
                            <div className="text-sm font-semibold text-[#00FFFF]">
                              {new Date(launch.tgeDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="text-xs text-zinc-500">TGE Date</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* CHART + BUY/SELL BUTTON */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Chart */}
                <div className="lg:col-span-2">
                  {launch.status === "LIVE" && launch.dexPairId && (
                    <ChartTabs
                      pairId={launch.dexPairId}
                      candles={chartData.candles}
                      activity={chartData.activity}
                    />
                  )}
                </div>

                {/* Buy/Sell Action Card */}
                <div className="lg:col-span-1">
                  <Card variant="default" hover={false} className="h-full">
                    <div className="p-6 flex flex-col items-center justify-center gap-4 h-full">
                      <div className="text-center">
                        <div className="text-sm text-zinc-500 mb-2">Current Price</div>
                        <div className="text-3xl font-bold text-white">◎ 0.0001234</div>
                      </div>
                      <Button
                        onClick={() => setTradingModalOpen(true)}
                        className="w-full bg-gradient-to-r from-[#00FF88] to-[#00DD77] hover:from-[#00DD77] hover:to-[#00FF88] text-black font-bold"
                      >
                        Buy / Sell Keys
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* ABOUT SECTION */}
              <Card variant="default" hover={false}>
                <div className="p-6">
                  <AboutCollapse content={launch.description} previewLines={3} />
                </div>
              </Card>

              {/* COMMENTS SECTION */}
              <Card variant="default" hover={false}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Comments
                      <span className="text-sm text-zinc-500">({comments.length})</span>
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#00FF88]">
                      <span className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse"></span>
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
                        className="flex-1 bg-zinc-800/30 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00FFFF]/50"
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
                    <div className="text-center py-8 text-zinc-500">
                      Loading comments...
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                      No comments yet. Be the first to comment!
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
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
                              <span className="text-xs text-zinc-500">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-zinc-300 text-sm mb-2">{comment.text}</p>
                            <button
                              onClick={() => upvoteComment(comment.id)}
                              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-[#00FF88] transition-colors"
                            >
                              <TrendingUp className="w-3 h-3" />
                              {comment.upvotes || 0}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="boost"
                  onClick={async () => {
                    try {
                      await boost()
                      success('Boosted!', `This launch now has ${boostCount + 1} boosts`)
                    } catch (error: any) {
                      showError('Boost failed', error.message)
                    }
                  }}
                  disabled={isBoosting}
                  className="flex-1 gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 hover:from-[#FFD700]/30 hover:to-[#FFA500]/30 border border-[#FFD700]/30 text-[#FFD700]"
                >
                  <TrendingUp className="w-5 h-5" />
                  Boost {boostCount > 0 && `(${boostCount})`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trading Modal (nested) - TODO: Replace with actual curve data */}
      {/* {tradingModalOpen && launch && (
        <SimpleBuySellModal
          isOpen={tradingModalOpen}
          onClose={() => setTradingModalOpen(false)}
          curve={{
            id: launch.id,
            supply: 1000,
            holders: 10,
          } as any}
          ownerName={launch.title}
          ownerAvatar={launch.logoUrl}
          twitterHandle={launch.socials?.twitter || ''}
          userBalance={10}
          userKeys={0}
          onTrade={async (type, keys) => {
            success(`${type === 'buy' ? 'Bought' : 'Sold'} ${keys} keys`, 'Transaction successful')
          }}
        />
      )} */}
    </>
  )
}
