"use client"

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Rocket, Twitter, ExternalLink, Share2, Bookmark, Zap, TrendingUp, MessageCircle, Radio, Users, Copy, Check, BarChart3, DollarSign, Droplet, ShoppingCart } from 'lucide-react'
import { HealthChart } from '@/components/launch/HealthChart'
import { LaunchTimeseriesPoint } from '@/types/launch'
import { convictionSeries } from '@/utils/health'
import { useState } from 'react'
import { useTokenData } from '@/lib/tokenData'
import { fmtUsd, fmtPct, fmtNum, isNewToken } from '@/lib/format'
import { cn } from '@/lib/cn'
import { PriceSpark } from '@/components/launch/cards/PriceSpark'

// Simple icon components for platforms
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627c-.168.9-.5 1.201-.82 1.23c-.697.064-1.226-.461-1.901-.903c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.781-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345c-.479.329-.913.489-1.302.481c-.428-.009-1.252-.242-1.865-.442c-.751-.244-1.349-.374-1.297-.789c.027-.216.324-.437.893-.663c3.498-1.524 5.831-2.529 6.998-3.015c3.333-1.386 4.025-1.627 4.476-1.635c.099-.002.321.023.465.14c.121.099.155.232.171.325c.016.093.036.305.02.469z"/>
  </svg>
)

const PumpFunIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7zm-2-11l2 2l4-4l1.41 1.41L12 13.83l-3.41-3.42L10 9z"/>
    </svg>
  </div>
)

// Mock data - replace with real data fetching
const mockLaunchData: LaunchTimeseriesPoint[] = [
  {
    ts: Date.now() - 7 * 24 * 60 * 60 * 1000,
    contributors: 42,
    fees_usd: 1250,
    boosts_usd: 5000,
    views: 12000,
    buybacks_usd: 800,
    network_mentions: 3500,
    live_hours: 3,
    chat_msgs: 850,
    upvotes: 245,
    dms: 120,
    collaborations: 3,
    campaigns: 2,
    social_score: 45,
    event: 'live'
  },
  {
    ts: Date.now() - 5 * 24 * 60 * 60 * 1000,
    contributors: 58,
    fees_usd: 1800,
    boosts_usd: 6200,
    views: 15000,
    buybacks_usd: 1200,
    network_mentions: 4200,
    live_hours: 6,
    chat_msgs: 1200,
    upvotes: 312,
    dms: 185,
    collaborations: 5,
    campaigns: 3,
    social_score: 58,
  },
  {
    ts: Date.now() - 3 * 24 * 60 * 60 * 1000,
    contributors: 63,
    fees_usd: 2000,
    boosts_usd: 6800,
    views: 16500,
    buybacks_usd: 1350,
    network_mentions: 5100,
    live_hours: 9,
    chat_msgs: 1450,
    upvotes: 387,
    dms: 220,
    collaborations: 7,
    campaigns: 4,
    social_score: 65,
  },
  {
    ts: Date.now() - 2 * 24 * 60 * 60 * 1000,
    contributors: 67,
    fees_usd: 2100,
    boosts_usd: 7500,
    views: 18000,
    buybacks_usd: 1500,
    network_mentions: 5800,
    live_hours: 12,
    chat_msgs: 1650,
    upvotes: 425,
    dms: 265,
    collaborations: 8,
    campaigns: 5,
    social_score: 72,
    event: 'tge'
  },
  {
    ts: Date.now() - 1 * 24 * 60 * 60 * 1000,
    contributors: 72,
    fees_usd: 2300,
    boosts_usd: 8200,
    views: 19500,
    buybacks_usd: 1650,
    network_mentions: 6500,
    live_hours: 15,
    chat_msgs: 1850,
    upvotes: 498,
    dms: 310,
    collaborations: 10,
    campaigns: 6,
    social_score: 78,
  },
]

export default function LaunchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isBoosted, setIsBoosted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Compute conviction from health data
  const convictionValues = convictionSeries(mockLaunchData)
  const currentConviction = convictionValues[convictionValues.length - 1] || 0

  // TODO: Fetch real launch data by params.id
  const launch = {
    id: params.id,
    title: 'StreamWars: Team Battle',
    subtitle: 'Revolutionary streaming platform on Solana',
    ticker: '$STREAM',
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=STREAM&backgroundColor=8b5cf6,a855f7,06b6d4',
    marketType: 'icm' as const,
    status: 'live' as const,
    mint: 'So11111111111111111111111111111111111111112', // SOL mint for demo
    beliefScore: Math.round(currentConviction),
    description: 'StreamWars is building the future of decentralized streaming with on-chain rewards, creator tools, and community governance. Join the revolution.',
    creator: '@streamwars_dev',
    pumpFunUrl: 'https://pump.fun/coin/STREAM',
    socials: {
      twitter: '@streamwars_io',
      discord: 'discord.gg/streamwars',
      telegram: 't.me/streamwars',
      website: 'streamwars.io'
    },
    team: [
      { name: 'Alex Chen', role: 'Founder & CEO', avatar: 'AC', verified: true },
      { name: 'Sarah Kim', role: 'CTO', avatar: 'SK', verified: true },
      { name: 'Mike Ross', role: 'Head of Growth', avatar: 'MR', verified: false },
    ],
    topContributors: [
      { name: 'cryptowhale.sol', role: 'Smart Contract Auditor', avatar: 'CW' },
      { name: 'degen_trader', role: 'Marketing Advisor', avatar: 'DT' },
      { name: 'solana_maxi', role: 'Community Manager', avatar: 'SM' },
      { name: 'moon_shot', role: 'Backend Developer', avatar: 'MS' },
      { name: 'diamond_hands', role: 'Technical Writer', avatar: 'DH' },
    ],
    platforms: ['twitter', 'discord', 'telegram'],
    fdv: 5000000,
    raised: 250000,
    contributors: 72,
    totalLiveHours: 15,
    networkActivity: 6500,
    chatMessages: 1850,
  }

  const isCCM = launch.marketType === 'ccm'

  // Fetch token data if ICM with mint
  const { data: tokenData, loading: tokenLoading, error: tokenError } = useTokenData(
    launch.marketType === 'icm' ? launch.mint : undefined,
    15000
  )

  const handleCopyMint = async () => {
    if (!launch.mint) return
    await navigator.clipboard.writeText(launch.mint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const showNewBadge = isNewToken(tokenData.createdAt)
  const hasTokenData = tokenData.priceUsd !== undefined

  return (
    <div className="min-h-screen pb-24">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero Section */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Token Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-xl flex-shrink-0 overflow-hidden">
            {launch.tokenLogo ? (
              <img
                src={launch.tokenLogo}
                alt={launch.ticker || launch.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-white text-2xl font-bold">${launch.ticker?.slice(0, 2).replace('$', '').toUpperCase() || 'ST'}</span>`
                }}
              />
            ) : (
              launch.ticker?.slice(0, 2).replace('$', '').toUpperCase() || 'ST'
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{launch.title}</h1>
                  {launch.status === 'live' && (
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-sm font-bold text-green-400 uppercase flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 fill-green-400" />
                      Live
                    </span>
                  )}
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-lg text-sm font-bold text-blue-400">
                    {isCCM ? 'CCM' : 'ICM'}
                  </span>
                </div>
                <p className="text-lg text-white/70 mb-3">{launch.subtitle}</p>

                {/* Creator & Social Links */}
                <div className="flex items-center gap-4 flex-wrap mb-2">
                  {/* Creator with pump.fun */}
                  <a
                    href={launch.pumpFunUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors group"
                  >
                    <PumpFunIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300 font-medium group-hover:text-purple-200">{launch.creator}</span>
                  </a>

                  {/* Social Handles */}
                  {launch.socials.twitter && (
                    <a
                      href={`https://twitter.com/${launch.socials.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <Twitter className="w-4 h-4 text-sky-400" />
                      <span className="text-sm text-white/70 group-hover:text-white">{launch.socials.twitter}</span>
                    </a>
                  )}
                  {launch.socials.discord && (
                    <a
                      href={`https://${launch.socials.discord}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <DiscordIcon className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm text-white/70 group-hover:text-white">{launch.socials.discord}</span>
                    </a>
                  )}
                  {launch.socials.telegram && (
                    <a
                      href={`https://${launch.socials.telegram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <TelegramIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white/70 group-hover:text-white">{launch.socials.telegram}</span>
                    </a>
                  )}
                  {launch.socials.website && (
                    <a
                      href={`https://${launch.socials.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-white/60" />
                      <span className="text-sm text-white/70 group-hover:text-white">{launch.socials.website}</span>
                    </a>
                  )}
                </div>

                <p className="text-white/60 text-sm">{launch.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-lg border border-white/10 transition-colors ${
                    isBookmarked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-400' : ''}`} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                  <Share2 className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>

            {/* Conviction Bar */}
            <div className="mb-4 rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white/80">Community Conviction</span>
                <span className="text-xl font-bold text-green-400">{launch.beliefScore}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400 transition-all duration-500 shadow-lg shadow-green-500/50"
                  style={{ width: `${launch.beliefScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-white/50">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs text-white/60 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Contributors
                </div>
                <div className="text-lg font-bold text-cyan-400">{launch.contributors}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs text-white/60 mb-1 flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  Live Time
                </div>
                <div className="text-lg font-bold text-orange-400">{launch.totalLiveHours}h</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs text-white/60 mb-1 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  Chat Activity
                </div>
                <div className="text-lg font-bold text-indigo-400">{launch.chatMessages.toLocaleString('en-US')}</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBoosted(true)}
                className="px-6 h-11 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold inline-flex items-center gap-2 transition-all"
              >
                <Zap className="w-5 h-5" />
                Boost (10 $LAUNCH)
              </button>
              <button className="px-6 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors">
                Follow
              </button>
              <button className="px-6 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-bold inline-flex items-center gap-2 transition-all">
                <Rocket className="w-5 h-5" />
                Join Launch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Metrics Section - ICM Only */}
      {!isCCM && launch.mint && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Token Metrics
          </h2>

          {/* Token Address Row */}
          <div className="mb-4 pb-4 border-b border-white/10">
            <div className="flex flex-col gap-3">
              {/* Token Address */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/50 flex-shrink-0">Token Address:</span>
                <code className="text-xs text-white/80 font-mono flex-1 min-w-0 truncate select-all bg-white/5 px-3 py-1.5 rounded-lg">
                  {launch.mint}
                </code>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Copy */}
                <button
                  onClick={handleCopyMint}
                  className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm transition-all flex items-center gap-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </button>

                {/* Solscan */}
                {tokenData.solscanUrl && (
                  <a
                    href={tokenData.solscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Solscan</span>
                  </a>
                )}

                {/* Chart */}
                {tokenData.dexUrl && (
                  <a
                    href={tokenData.dexUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm transition-all flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Chart</span>
                  </a>
                )}

                {/* New Badge */}
                {showNewBadge && (
                  <span className="ml-auto px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-bold flex items-center gap-1.5">
                    🆕 New Token
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Token KPIs - 3x2 Grid */}
          {hasTokenData && !tokenLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {/* Price */}
              {tokenData.priceUsd !== undefined && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-white/50 uppercase font-semibold">Price</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{fmtUsd(tokenData.priceUsd)}</div>
                  {tokenData.change24h !== undefined && (
                    <div
                      className={cn(
                        'text-sm font-bold inline-flex items-center gap-1 px-2 py-1 rounded',
                        tokenData.change24h >= 0
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      )}
                    >
                      {tokenData.change24h >= 0 ? '↗' : '↘'}
                      {fmtPct(tokenData.change24h)}
                    </div>
                  )}
                  {tokenData.spark && <PriceSpark data={tokenData.spark} className="mt-2" />}
                </div>
              )}

              {/* Liquidity */}
              {tokenData.liqUsd !== undefined && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-white/50 uppercase font-semibold">Liquidity</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{fmtUsd(tokenData.liqUsd)}</div>
                  <p className="text-xs text-white/40 mt-1">Depth & stability</p>
                </div>
              )}

              {/* 24h Volume */}
              {tokenData.vol24hUsd !== undefined && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-white/50 uppercase font-semibold">24h Volume</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{fmtUsd(tokenData.vol24hUsd)}</div>
                  <p className="text-xs text-white/40 mt-1">Trading activity</p>
                </div>
              )}

              {/* Market Cap */}
              {tokenData.mcapUsd !== undefined && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-white/50 uppercase font-semibold">Market Cap</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{fmtUsd(tokenData.mcapUsd)}</div>
                  <p className="text-xs text-white/40 mt-1">Fully diluted value</p>
                </div>
              )}

              {/* Holders */}
              {tokenData.holders !== undefined && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-white/50 uppercase font-semibold">Holders</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{fmtNum(tokenData.holders)}</div>
                  <p className="text-xs text-white/40 mt-1">Token distribution</p>
                </div>
              )}

              {/* Buy/Sell Pressure */}
              {tokenData.txns24h && (
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/50 uppercase font-semibold">24h Transactions</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-white/50 mb-0.5">Buys</div>
                      <div className="text-xl font-bold text-green-400">{fmtNum(tokenData.txns24h.buys)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/50 mb-0.5">Sells</div>
                      <div className="text-xl font-bold text-red-400">{fmtNum(tokenData.txns24h.sells)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {tokenLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-3" />
                  <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {tokenError && !tokenLoading && (
            <div className="text-center py-6 text-white/40 italic text-sm">
              Unable to load token data. Please try again later.
            </div>
          )}

          {/* Quick Buy CTA */}
          {tokenData.dexUrl && (
            <div className="pt-4 border-t border-white/10">
              <a
                href={tokenData.dexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-green-400/50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
              >
                <Zap className="w-5 h-5" fill="currentColor" />
                Quick Buy on DEX
              </a>
            </div>
          )}
        </div>
      )}

      {/* Launch Health Chart */}
      <div className="mb-6">
        <HealthChart data={mockLaunchData} />
      </div>

      {/* Team & Contributors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Core Team */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Core Team
          </h2>
          <div className="space-y-3">
            {launch.team.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{member.name}</span>
                    {member.verified && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-white/60">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Key Contributors
          </h2>
          <div className="space-y-3">
            {launch.topContributors.map((contributor, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                  {contributor.avatar}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white text-sm">{contributor.name}</span>
                  <div className="text-xs text-white/60">{contributor.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">About</h2>
        <div className="space-y-3 text-white/70">
          <p>StreamWars is revolutionizing the streaming industry with blockchain technology, enabling true ownership for creators and fair compensation models.</p>
          <p>Our platform features:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>On-chain rewards and revenue sharing</li>
            <li>Decentralized content moderation</li>
            <li>Creator-first monetization tools</li>
            <li>Community governance via $STREAM token</li>
            <li>Real-time analytics and performance tracking</li>
            <li>Multi-platform streaming support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
