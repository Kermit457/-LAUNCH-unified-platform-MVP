"use client"

import { EnhancedLaunchCard, LaunchCardData } from '@/components/launch/EnhancedLaunchCard'

/**
 * Test page for Enhanced Launch Cards with ownership UX
 * Demonstrates three states:
 * A) No ownership (myKeys=0)
 * B) Small position (myKeys=57, 2.3% share)
 * C) Large position (myKeys=1200, 18.9% share, no token estimate)
 */
export default function CardsTestPage() {
  // Fixture A: Zero position
  const cardA: LaunchCardData = {
    id: 'test-a',
    title: 'ICM.RUN',
    subtitle: 'RUN',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=degen',
    ticker: '$RUN',
    status: 'upcoming',
    marketType: 'icm',
    beliefScore: 0,
    upvotes: 2,
    commentsCount: 2,
    viewCount: 1,
    launchSupplyPct: 20, // 20% of supply at launch
    revenueSharePct: 0, // No revenue sharing (won't show)
    currentPrice: 0.059,
    twitterUrl: 'https://twitter.com/icmrun',
    priceChange24h: 0, // No change yet for upcoming
    contributors: [
      { name: 'Alice Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
      { name: 'Bob Builder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
    ],

    // Zero ownership
    myKeys: 0,
    mySharePct: 0,
    estLaunchTokens: null,

    hasVoted: false,
    isVoting: false,
    onVote: async () => {
      console.log('Voted on card A')
    },
    onComment: () => {
      console.log('Commented on card A')
    },
    onCollaborate: () => {
      console.log('Collaborate on card A')
    },
    onDetails: () => {
      console.log('Details for card A')
    },
  }

  // Fixture B: Normal position with UNCLAIMED AIRDROP
  const cardB: LaunchCardData = {
    id: 'test-b',
    title: 'CCM.VIBES',
    subtitle: 'Community Content Mining for creators',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=vibes',
    ticker: '$VIBES',
    status: 'live',
    marketType: 'ccm',
    beliefScore: 82,
    upvotes: 389,
    commentsCount: 67,
    viewCount: 1542,
    launchSupplyPct: 30, // 30% of supply at launch
    revenueSharePct: 15, // Shares 15% of fees with holders
    currentPrice: 0.142,
    twitterUrl: 'https://twitter.com/ccmvibes',
    priceChange24h: 15.3, // Positive 24h change
    contributors: [
      { name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie' },
      { name: 'Dana', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dana' },
      { name: 'Eve', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve' },
    ],

    // Small position
    myKeys: 57,
    mySharePct: 2.3,
    estLaunchTokens: 12340,

    // Claimable tokens available!
    airdropAmount: 5000,
    hasClaimedAirdrop: false,

    hasVoted: true,
    isVoting: false,
    onVote: async () => {
      console.log('Voted on card B')
    },
    onComment: () => {
      console.log('Commented on card B')
    },
    onCollaborate: () => {
      console.log('Collaborate on card B')
    },
    onDetails: () => {
      console.log('Details for card B')
    },
    onClaimAirdrop: async () => {
      console.log('Claiming tokens for card B')
      alert('Success! 5,000 tokens claimed and added to your wallet.')
    },
  }

  // Fixture C: Large position, no token estimate
  const cardC: LaunchCardData = {
    id: 'test-c',
    title: 'MEGA.WHALE',
    subtitle: 'For the big players and ecosystem builders',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=whale',
    ticker: '$WHALE',
    status: 'live',
    marketType: 'icm',
    beliefScore: 91,
    upvotes: 1247,
    commentsCount: 203,
    viewCount: 8923,
    launchSupplyPct: 25, // 25% of supply at launch
    revenueSharePct: 10, // Shares 10% of fees with holders
    currentPrice: 2.456,
    twitterUrl: 'https://twitter.com/megawhale',
    priceChange24h: -8.2, // Negative 24h change
    contributors: [
      { name: 'Frank', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank' },
      { name: 'Grace', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace' },
      { name: 'Hank', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hank' },
      { name: 'Ivy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ivy' },
      { name: 'Jack', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jack' },
    ],

    // Large position
    myKeys: 1200,
    mySharePct: 18.9,
    estLaunchTokens: null, // Token distribution not yet determined

    hasVoted: true,
    isVoting: false,
    onVote: async () => {
      console.log('Voted on card C')
    },
    onComment: () => {
      console.log('Commented on card C')
    },
    onCollaborate: () => {
      console.log('Collaborate on card C')
    },
    onDetails: () => {
      console.log('Details for card C')
    },
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Enhanced Launch Cards</h1>
          <p className="text-neutral-400">
            Testing ownership UX: pill, CTA swap, and micro-ring indicator
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Test Case A: Zero Position */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-neutral-300">
              A) Zero Position (myKeys=0)
            </h2>
            <p className="text-sm text-neutral-500 mb-3">
              Expected: No pill, "Buy Keys" CTA, ring track only (no progress)
            </p>
            <EnhancedLaunchCard data={cardA} />
          </div>

          {/* Test Case B: Small Position with Claimable Tokens */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-neutral-300">
              B) Small Position (myKeys=57, 2.3%) + Claimable Tokens
            </h2>
            <p className="text-sm text-neutral-500 mb-3">
              Expected: Purple "Tokens Ready to Claim" banner with sparkles, "Holding 57" pill, "Manage" CTA, ring ~2.3%
            </p>
            <EnhancedLaunchCard data={cardB} />
          </div>

          {/* Test Case C: Large Position */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-neutral-300">
              C) Large Position (myKeys=1200, 18.9%, no estimate)
            </h2>
            <p className="text-sm text-neutral-500 mb-3">
              Expected: "Holding 1200" pill, "Manage" CTA, ring ~18.9%, tooltip without
              token estimate
            </p>
            <EnhancedLaunchCard data={cardC} />
          </div>
        </div>

        {/* Visual Reference Guide */}
        <div className="mt-12 p-6 border border-white/10 rounded-2xl bg-white/5">
          <h2 className="text-2xl font-bold mb-4">Visual Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Ownership Pill</h3>
              <ul className="text-neutral-400 space-y-1">
                <li>• Shows only if myKeys &gt; 0</li>
                <li>• Top-right absolute position</li>
                <li>• Hidden on mobile (sm:flex)</li>
                <li>• Format: &quot;Holding &#123;N&#125;&quot;</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sky-400 mb-2">CTA Swap</h3>
              <ul className="text-neutral-400 space-y-1">
                <li>• &quot;Buy Keys&quot; if myKeys = 0</li>
                <li>• &quot;Manage&quot; if myKeys &gt; 0</li>
                <li>• data-cta attribute for testing</li>
                <li>• Opens launch page with action param</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Micro-Ring</h3>
              <ul className="text-neutral-400 space-y-1">
                <li>• Maps mySharePct to 0-75% arc</li>
                <li>• Track always visible (20% opacity)</li>
                <li>• Progress stroke if myKeys &gt; 0</li>
                <li>• Tooltip on hover/focus</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Keyboard Testing Instructions */}
        <div className="mt-6 p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl">
          <h3 className="font-semibold text-yellow-400 mb-2">
            ⌨️ Accessibility Testing
          </h3>
          <p className="text-sm text-neutral-300">
            Tab to avatar container → Tooltip should appear on focus → Verify
            aria-label reads share percentage
          </p>
        </div>
      </div>
    </div>
  )
}
