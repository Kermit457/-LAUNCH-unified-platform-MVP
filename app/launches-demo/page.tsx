"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LiveLaunchCard } from '@/components/launch/cards/LiveLaunchCard'
import { UpcomingLaunchCard } from '@/components/launch/cards/UpcomingLaunchCard'
import { CommentsModal } from '@/components/comments/CommentsModal'
import { LaunchCardData } from '@/types/launch'
import { TrendingUp, Rocket, Clock } from 'lucide-react'

export default function LaunchesDemoPage() {
  const router = useRouter()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [selectedLaunch, setSelectedLaunch] = useState<{ id: string; title: string } | null>(null)
  // Mock data for LIVE ICM cards (with real Solana mints for API testing)
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
  const handleUpvote = (id: string) => console.log('Upvote:', id)
  const handleComment = (id: string) => {
    const card = [...liveICMCards, ...liveCCMCards, ...upcomingCards].find(c => c.id === id)
    if (card) {
      setSelectedLaunch({ id: card.id, title: card.title })
      setCommentsOpen(true)
    }
  }
  const handleBoost = (id: string) => console.log('Boost:', id)
  const handleFollow = (id: string) => console.log('Follow:', id)
  const handleView = (id: string) => {
    console.log('Navigating to:', `/launch/${id}`)
    router.push(`/launch/${id}`)
  }
  const handleSetReminder = (id: string) => console.log('Set Reminder:', id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Launch Cards Demo</h1>
              <p className="text-sm text-white/60 mt-1">
                Showcasing LIVE and UPCOMING variants with real token data
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white/70">
                  {liveICMCards.length + liveCCMCards.length} LIVE
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-white/70">{upcomingCards.length} UPCOMING</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* LIVE ICM Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-white">
              LIVE ICM Launches
              <span className="ml-2 text-sm font-normal text-white/50">
                (with real token data)
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveICMCards.map((card) => (
              <LiveLaunchCard
                key={card.id}
                data={card}
                onUpvote={handleUpvote}
                onComment={handleComment}
                onBoost={handleBoost}
                onFollow={handleFollow}
                onView={handleView}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40 italic">
            These cards fetch real token data from DexScreener API every 15 seconds.
          </p>
        </section>

        {/* LIVE CCM Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              LIVE CCM Launches
              <span className="ml-2 text-sm font-normal text-white/50">
                (community campaigns, no token data)
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveCCMCards.map((card) => (
              <LiveLaunchCard
                key={card.id}
                data={card}
                onUpvote={handleUpvote}
                onComment={handleComment}
                onBoost={handleBoost}
                onFollow={handleFollow}
                onView={handleView}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40 italic">
            CCM campaigns don't have token mints, so no token row or KPIs are shown.
          </p>
        </section>

        {/* UPCOMING Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              UPCOMING Launches
              <span className="ml-2 text-sm font-normal text-white/50">
                (pre-TGE with countdown)
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingCards.map((card) => (
              <UpcomingLaunchCard
                key={card.id}
                data={card}
                onUpvote={handleUpvote}
                onComment={handleComment}
                onBoost={handleBoost}
                onFollow={handleFollow}
                onView={handleView}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40 italic">
            Countdown timers update every second. TGE timestamps are in the future.
          </p>
        </section>

        {/* Dev Notes */}
        <div className="mt-12 rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-sm font-bold text-white mb-3">Developer Notes</h3>
          <ul className="space-y-2 text-xs text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                <strong>LIVE ICM cards</strong> poll DexScreener API every 15 seconds for
                real-time token data (price, MCAP, volume, holders).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                <strong>LIVE CCM cards</strong> render without token rows or KPIs since they
                don't have mint addresses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                <strong>UPCOMING cards</strong> show TGE countdowns that update every second,
                with "Set Reminder" buttons instead of "Trade".
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">⚠</span>
              <span>
                API failures are gracefully handled with skeleton loaders and error messages
                ("No on-chain data yet.").
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">ℹ</span>
              <span>
                All button clicks log to console. Open DevTools to see callback outputs.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Comments Modal */}
      {selectedLaunch && (
        <CommentsModal
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          launchId={selectedLaunch.id}
          launchTitle={selectedLaunch.title}
        />
      )}
    </div>
  )
}
