import type { Project } from '@/types';
import type { EarnCard } from '@/components/EarnCard';
import { getCreatorAvatar, getProjectLogo } from './avatarUtils';

// ===== MOCK DATA FOR LaunchOS PLATFORM =====
// TODO: Replace with Supabase real-time queries
// TODO: Add pagination for large datasets

// ===== PROJECTS (ICM + CCM Launches) =====
export const launchProjects: Project[] = [
  // === ICM LAUNCHES (Token-based) ===
  {
    id: '1',
    type: 'launch',
    title: '$AIKIT Token TGE',
    subtitle: 'AI Tools Platform • TGE in 3h',
    description: 'Revolutionary AI-powered toolkit for crypto traders and developers',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AIKit Team&backgroundColor=8b5cf6,a855f7&backgroundType=gradientLinear',
    pill: { label: 'FDV $8M', kind: 'mcap' },
    status: 'upcoming',
    stats: { views: 1247, likes: 89 },
    platforms: ['twitter', 'telegram'],
    cta: { label: 'View Launch', href: '#' },
    creator: 'AIKit Team',
    upvotes: 127,
    boosted: true,
    boostCount: 3,
    comments: [
      { id: 'c1', author: 'CryptoWhale', text: 'This looks promising! AI + crypto is the future 🚀', timestamp: new Date('2025-01-10T10:30:00') },
      { id: 'c2', author: 'TokenHunter', text: 'FDV seems reasonable. I\'m in!', timestamp: new Date('2025-01-10T11:15:00') }
    ],
    createdAt: new Date('2025-01-09T08:00:00'),
    // ICM fields
    fdv: 8000000,
    poolValue: 500000,
    chain: 'Base',
    beliefScore: 87,
    ticker: '$AIKIT',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=AIKIT&backgroundColor=4f46e5,7c3aed',
    isLiveStreaming: false
  },
  {
    id: '2',
    type: 'launch',
    title: '$MEME Season 2',
    subtitle: 'Community Meme Coin • Live Now',
    description: 'The ultimate community-driven meme coin with viral potential',
    avatarUrl: getCreatorAvatar('MEME DAO', 1),
    pill: { label: 'FDV $12M', kind: 'mcap' },
    status: 'live',
    stats: { views: 3421, likes: 234 },
    platforms: ['twitter'],
    cta: { label: 'Trade Now', href: '#' },
    creator: 'MEME DAO',
    upvotes: 89,
    comments: [
      { id: 'c3', author: 'MemeLord', text: 'Season 1 was epic, ready for round 2! 🔥', timestamp: new Date('2025-01-10T09:00:00') }
    ],
    createdAt: new Date('2025-01-08T14:00:00'),
    // ICM fields
    fdv: 12000000,
    poolValue: 800000,
    chain: 'Solana',
    beliefScore: 72,
    ticker: '$MEME',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=MEME&backgroundColor=ec4899,f472b6',
    isLiveStreaming: false
  },
  {
    id: '19',
    type: 'launch',
    title: '$BOOST Rewards Token',
    subtitle: 'Earn-to-Engage Platform • TGE Live',
    description: 'Revolutionary token rewards platform for social engagement',
    pill: { label: 'FDV $15M', kind: 'mcap' },
    status: 'live',
    stats: { views: 2134, likes: 156 },
    platforms: ['twitter', 'telegram'],
    cta: { label: 'Trade Now', href: '#' },
    creator: 'Boost Protocol',
    upvotes: 143,
    createdAt: new Date('2025-01-09T12:00:00'),
    // ICM fields
    fdv: 15000000,
    poolValue: 1200000,
    chain: 'Base',
    beliefScore: 91,
    ticker: '$BOOST',
    // Visual fields
    tokenLogo: '',
    isLiveStreaming: false
  },
  {
    id: '20',
    type: 'launch',
    title: '$RAID Token TGE',
    subtitle: 'Social Coordination Protocol • Upcoming',
    description: 'Decentralized raid coordination and rewards',
    pill: { label: 'FDV $6M', kind: 'mcap' },
    status: 'upcoming',
    stats: { views: 987, likes: 67 },
    platforms: ['twitter', 'discord'],
    cta: { label: 'View Launch', href: '#' },
    creator: 'Raid Labs',
    upvotes: 96,
    createdAt: new Date('2025-01-10T08:00:00'),
    // ICM fields
    fdv: 6000000,
    poolValue: 400000,
    chain: 'Ethereum',
    beliefScore: 78,
    ticker: '$RAID',
    // Visual fields
    tokenLogo: '',
    isLiveStreaming: false
  },
  {
    id: '21',
    type: 'launch',
    title: '$STREAM Utility Token',
    subtitle: 'Creator Monetization • TGE in 1h',
    description: 'Next-gen streaming platform token for creators',
    pill: { label: 'FDV $20M', kind: 'mcap' },
    status: 'upcoming',
    stats: { views: 3421, likes: 289 },
    platforms: ['twitch', 'twitter'],
    cta: { label: 'View Launch', href: '#' },
    creator: 'Stream Protocol',
    upvotes: 187,
    boosted: true,
    boostCount: 4,
    createdAt: new Date('2025-01-10T13:00:00'),
    // CCM fields (Creator Capital Market)
    marketType: 'ccm',
    fdv: 20000000,
    poolValue: 1500000,
    chain: 'Solana',
    beliefScore: 89,
    ticker: '$STREAM',
    // Visual fields
    tokenLogo: '',
    isLiveStreaming: false
  },
  {
    id: '22',
    type: 'launch',
    title: '$DEGEN V2 Launch',
    subtitle: 'Community Meme Revival • Live Now',
    description: 'The degen community is back with V2',
    pill: { label: 'FDV $5M', kind: 'mcap' },
    status: 'live',
    stats: { views: 5632, likes: 412 },
    platforms: ['twitter'],
    cta: { label: 'Trade Now', href: '#' },
    creator: 'Degen DAO',
    upvotes: 234,
    boosted: true,
    boostCount: 6,
    createdAt: new Date('2025-01-09T18:00:00'),
    // ICM fields
    fdv: 5000000,
    poolValue: 350000,
    chain: 'Base',
    beliefScore: 68,
    ticker: '$DEGEN',
    // Visual fields
    tokenLogo: '',
    isLiveStreaming: false
  },
  {
    id: '23',
    type: 'launch',
    title: '$CLIP Creator Token',
    subtitle: 'Clip Monetization • TGE Live',
    description: 'Earn from viral clips with $CLIP token',
    pill: { label: 'FDV $10M', kind: 'mcap' },
    status: 'live',
    stats: { views: 1876, likes: 134 },
    platforms: ['youtube', 'tiktok'],
    cta: { label: 'Trade Now', href: '#' },
    creator: 'Clip Network',
    upvotes: 119,
    createdAt: new Date('2025-01-08T20:00:00'),
    // CCM fields (Creator Capital Market)
    marketType: 'ccm',
    fdv: 10000000,
    poolValue: 750000,
    chain: 'Polygon',
    beliefScore: 82,
    ticker: '$CLIP',
    // Visual fields
    tokenLogo: '',
    isLiveStreaming: false
  },
  {
    id: '24',
    type: 'launch',
    title: '$PRED Prediction Market',
    subtitle: 'On-Chain Betting • TGE in 2h',
    description: 'Decentralized prediction markets for everything',
    pill: { label: 'FDV $18M', kind: 'mcap' },
    status: 'upcoming',
    stats: { views: 2987, likes: 203 },
    platforms: ['twitter', 'telegram'],
    cta: { label: 'View Launch', href: '#' },
    creator: 'Predict Protocol',
    upvotes: 167,
    createdAt: new Date('2025-01-10T11:00:00'),
    // ICM fields
    fdv: 18000000,
    poolValue: 1100000,
    chain: 'Arbitrum',
    beliefScore: 85,
    ticker: '$PRED',
    // Visual fields
    tokenLogo: '',
    isLiveStreaming: false
  },

  // === CAMPAIGNS ===
  {
    id: '3',
    type: 'campaign',
    title: 'Clip $COIN Launch Video',
    subtitle: '$20 per 1,000 views • YouTube & X',
    description: 'Create viral clips for the $COIN token launch and earn rewards',
    pill: { label: '$20 / 1k views', kind: 'rate' },
    progress: { paid: 400, pool: 2000 },
    status: 'live',
    stats: { views: 856, participants: 23 },
    platforms: ['youtube', 'twitter'],
    cta: { label: 'Start Clipping', href: '#' },
    creator: 'COIN Team',
    upvotes: 54,
    comments: [],
    createdAt: new Date('2025-01-10T06:00:00'),
    // CCM fields
    campaignType: 'clip',
    earnings: 1250,
    engagement: 76,
    ticker: '$COIN',
    beliefScore: 76, // Add belief score to CCM too
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=COIN&backgroundColor=f59e0b,fbbf24',
    isLiveStreaming: true // Campaign with live streaming
  },
  {
    id: '4',
    type: 'campaign',
    title: 'Promote $DEGEN Listing',
    subtitle: '$15 per 1,000 impressions',
    description: 'Spread the word about $DEGEN exchange listing across social media',
    pill: { label: '$15 / 1k', kind: 'rate' },
    progress: { paid: 750, pool: 3000 },
    status: 'live',
    stats: { views: 1230, participants: 45 },
    platforms: ['twitter', 'tiktok'],
    cta: { label: 'Join Campaign', href: '#' },
    creator: 'DEGEN Marketing',
    upvotes: 78,
    boosted: true,
    boostCount: 2,
    comments: [
      { id: 'c4', author: 'ClipMaster', text: 'Great rates! Already made $200', timestamp: new Date('2025-01-10T12:00:00') }
    ],
    createdAt: new Date('2025-01-09T15:00:00'),
    // CCM fields
    campaignType: 'ad',
    earnings: 2100,
    engagement: 89,
    ticker: '$DEGEN',
    beliefScore: 89, // Add belief score
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=DEGEN&backgroundColor=a855f7,c084fc',
    isLiveStreaming: false
  },

  // === RAIDS ===
  {
    id: '5',
    type: 'raid',
    title: 'Raid X Thread for $MEME',
    subtitle: 'Bounty pool $1,500 • Ends in 2h',
    pill: { label: '$1,500 bounty', kind: 'bounty' },
    progress: { paid: 300, pool: 1500 },
    status: 'live',
    stats: { participants: 127 },
    platforms: ['twitter'],
    cta: { label: 'Join Raid', href: '#' },
    endTime: '2h 15m',
    upvotes: 92,
    comments: [
      { id: 'c5', author: 'RaidLeader', text: 'LFG! Let\'s pump this thread 🚀', timestamp: new Date('2025-01-10T13:00:00') }
    ],
    createdAt: new Date('2025-01-10T11:00:00'),
    // CCM fields
    campaignType: 'raid',
    earnings: 850,
    engagement: 92,
    ticker: '$MEME',
    beliefScore: 92, // Add belief score
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=MEME2&backgroundColor=ef4444,f87171',
    isLiveStreaming: true // Raid with live coordination
  },
  {
    id: '6',
    type: 'raid',
    title: 'Discord Raid: NFT Drop',
    subtitle: '$500 split among top raiders',
    pill: { label: '$500 pool', kind: 'bounty' },
    progress: { paid: 150, pool: 500 },
    status: 'live',
    stats: { participants: 89 },
    platforms: ['discord'],
    cta: { label: 'Raid Now', href: '#' },
    upvotes: 45,
    comments: [],
    createdAt: new Date('2025-01-10T10:00:00'),
    // CCM fields
    campaignType: 'raid',
    earnings: 420,
    engagement: 78,
    ticker: '$NFT',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=NFT&backgroundColor=14b8a6,2dd4bf',
    isLiveStreaming: false
  },

  // === PREDICTIONS ===
  {
    id: '7',
    type: 'prediction',
    title: 'Will $DOG reach $5M mcap today?',
    subtitle: 'Closes in 2h • Winner takes all',
    pill: { label: 'Pool $3,200', kind: 'pool' },
    status: 'live',
    stats: { participants: 342 },
    platforms: ['twitter'],
    cta: { label: 'Place Bet', href: '#' },
    endTime: '1h 45m',
    upvotes: 156,
    boosted: true,
    boostCount: 5,
    comments: [
      { id: 'c6', author: 'PredictionKing', text: 'I\'m betting YES! This is gonna moon 🌙', timestamp: new Date('2025-01-10T12:30:00') },
      { id: 'c7', author: 'Skeptic420', text: 'Doubt it... market looks weak rn', timestamp: new Date('2025-01-10T13:10:00') }
    ],
    createdAt: new Date('2025-01-10T11:30:00'),
    // CCM fields
    campaignType: 'prediction',
    earnings: 1800,
    engagement: 94,
    ticker: '$DOG',
    beliefScore: 94, // Add belief score
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=DOG&backgroundColor=f97316,fb923c',
    isLiveStreaming: false
  },
  {
    id: '8',
    type: 'prediction',
    title: 'ETH Price in 24h',
    subtitle: 'Over/Under $3,500',
    pill: { label: 'Pool $5,100', kind: 'pool' },
    status: 'live',
    stats: { participants: 567 },
    platforms: ['twitter'],
    cta: { label: 'Predict', href: '#' },
    upvotes: 104,
    createdAt: new Date('2025-01-09T18:00:00'),
    // CCM fields
    campaignType: 'prediction',
    earnings: 2400,
    engagement: 87,
    ticker: '$ETH',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=ETH&backgroundColor=6366f1,818cf8',
    isLiveStreaming: false
  },
  {
    id: '9',
    type: 'prediction',
    title: 'Will Team A win?',
    subtitle: 'Esports match prediction',
    pill: { label: 'Pool $2,400', kind: 'pool' },
    status: 'upcoming',
    stats: { participants: 0 },
    platforms: ['twitch'],
    cta: { label: 'View', href: '#' },
    upvotes: 34,
    createdAt: new Date('2025-01-10T14:00:00'),
    // CCM fields
    campaignType: 'prediction',
    earnings: 0,
    engagement: 45,
    ticker: '$GAME',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=GAME&backgroundColor=8b5cf6,a78bfa',
    isLiveStreaming: true // Live esports match
  },

  // === ADS ===
  {
    id: '10',
    type: 'ad',
    title: 'OBS Ad: Crypto Wallet Promo',
    subtitle: 'CPM $3.50 • 7 days campaign',
    pill: { label: 'Budget $5,000', kind: 'pool' },
    status: 'live',
    stats: { views: 12847 },
    platforms: ['obs'],
    cta: { label: 'Add to Stream', href: '#' },
    upvotes: 67,
    createdAt: new Date('2025-01-09T12:00:00'),
    // CCM fields
    campaignType: 'ad',
    earnings: 3200,
    engagement: 82,
    ticker: '$WALLET',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=WALLET&backgroundColor=22c55e,4ade80',
    isLiveStreaming: false
  },
  {
    id: '11',
    type: 'ad',
    title: 'Banner: DEX Aggregator',
    subtitle: 'CPM $4.20 • 14 days',
    pill: { label: 'Budget $8,000', kind: 'pool' },
    status: 'live',
    stats: { views: 23456 },
    platforms: ['obs'],
    cta: { label: 'Install Widget', href: '#' },
    upvotes: 81,
    createdAt: new Date('2025-01-08T16:00:00'),
    // CCM fields
    campaignType: 'ad',
    earnings: 5600,
    engagement: 88,
    ticker: '$DEX',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=DEX&backgroundColor=3b82f6,60a5fa',
    isLiveStreaming: false
  },

  // === QUESTS ===
  {
    id: '12',
    type: 'quest',
    title: 'Join Discord + Follow X',
    subtitle: 'Complete all tasks for rewards',
    pill: { label: '+200 pts', kind: 'reward' },
    progress: { paid: 156, pool: 200 },
    status: 'live',
    stats: { participants: 156 },
    platforms: ['discord', 'twitter'],
    cta: { label: 'Complete Quest', href: '#' },
    upvotes: 112,
    createdAt: new Date('2025-01-09T08:00:00'),
    // CCM fields
    campaignType: 'quest',
    earnings: 950,
    engagement: 91,
    ticker: '$QUEST',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=QUEST&backgroundColor=eab308,facc15',
    isLiveStreaming: false
  },
  {
    id: '13',
    type: 'quest',
    title: 'Daily Engagement Quest',
    subtitle: 'Like + Retweet + Comment',
    pill: { label: '+50 pts', kind: 'reward' },
    progress: { paid: 89, pool: 100 },
    status: 'live',
    stats: { participants: 89 },
    platforms: ['twitter'],
    cta: { label: 'Start Quest', href: '#' },
    upvotes: 73,
    createdAt: new Date('2025-01-10T07:00:00'),
    // CCM fields
    campaignType: 'quest',
    earnings: 380,
    engagement: 79,
    ticker: '$DAILY',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=DAILY&backgroundColor=f43f5e,fb7185',
    isLiveStreaming: false
  },
  {
    id: '14',
    type: 'quest',
    title: 'Creator Onboarding',
    subtitle: 'Set up stream + widgets',
    pill: { label: '+500 pts', kind: 'reward' },
    progress: { paid: 23, pool: 100 },
    status: 'live',
    stats: { participants: 23 },
    platforms: ['obs', 'twitch'],
    cta: { label: 'Begin', href: '#' },
    upvotes: 91,
    createdAt: new Date('2025-01-08T10:00:00'),
    // CCM fields
    campaignType: 'quest',
    earnings: 1500,
    engagement: 85,
    ticker: '$CREATE',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=CREATE&backgroundColor=06b6d4,22d3ee',
    isLiveStreaming: false
  },

  // === SPOTLIGHTS ===
  {
    id: '15',
    type: 'spotlight',
    title: 'Creator of the Week: PixelPapi',
    subtitle: 'Top clipper this week • 2.4M views generated',
    status: 'live',
    stats: { views: 2401234, likes: 567 },
    platforms: ['youtube', 'twitter'],
    cta: { label: 'View Profile', href: '#' },
    creator: 'PixelPapi',
    upvotes: 189,
    createdAt: new Date('2025-01-08T06:00:00'),
    // CCM fields
    earnings: 8500,
    engagement: 96,
    ticker: '$PIXEL',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=PIXEL&backgroundColor=ec4899,f472b6',
    isLiveStreaming: false
  },
  {
    id: '16',
    type: 'spotlight',
    title: 'Rising Star: CryptoClips',
    subtitle: 'New creator crushing it • $4,200 earned this week',
    status: 'live',
    stats: { views: 456789, likes: 234 },
    platforms: ['tiktok'],
    cta: { label: 'Follow', href: '#' },
    creator: 'CryptoClips',
    upvotes: 142,
    createdAt: new Date('2025-01-09T14:00:00'),
    // CCM fields
    earnings: 4200,
    engagement: 93,
    ticker: '$CLIPS',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=CLIPS&backgroundColor=8b5cf6,a78bfa',
    isLiveStreaming: false
  },

  // === ADDITIONAL VARIETY ===
  {
    id: '17',
    type: 'campaign',
    title: 'Stream $LAUNCH Gameplay',
    subtitle: '$50/hour streaming with widget',
    pill: { label: '$50 / hour', kind: 'rate' },
    progress: { paid: 1200, pool: 5000 },
    status: 'live',
    stats: { participants: 12 },
    platforms: ['twitch', 'youtube'],
    cta: { label: 'Go Live', href: '#' },
    upvotes: 98,
    createdAt: new Date('2025-01-09T16:00:00'),
    // CCM fields
    campaignType: 'clip',
    earnings: 2800,
    engagement: 84,
    ticker: '$LAUNCH',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=LAUNCH&backgroundColor=e700ff,5a00ff',
    isLiveStreaming: true // Live streaming gameplay
  },
  {
    id: '18',
    type: 'raid',
    title: 'StreamWars: Team Battle',
    subtitle: 'Raid opposing team\'s chat',
    pill: { label: '$2,000 prize', kind: 'bounty' },
    progress: { paid: 500, pool: 2000 },
    status: 'live',
    stats: { participants: 234 },
    platforms: ['twitch'],
    cta: { label: 'Join Battle', href: '#' },
    endTime: '3h 20m',
    upvotes: 176,
    createdAt: new Date('2025-01-10T09:00:00'),
    // CCM fields
    campaignType: 'raid',
    earnings: 1400,
    engagement: 95,
    ticker: '$WAR',
    // Visual fields
    tokenLogo: 'https://api.dicebear.com/7.x/shapes/svg?seed=WAR&backgroundColor=dc2626,ef4444',
    isLiveStreaming: true // Live battle raid
  }
];

// ===== EARNING OPPORTUNITIES (Campaigns, Raids, Predictions, Quests, Bounties) =====
export const earnCards: EarnCard[] = [
  // Campaigns
  {
    id: 'c1',
    type: 'campaign',
    title: 'Stream $LAUNCH Gameplay',
    platform: ['Twitch', 'YouTube'],
    reward: { currency: 'USDC', value: 50, per: 'hour' },
    progress: { paid: 1200, pool: 5000 },
    status: 'live',
    participants: 12
  },
  {
    id: 'c2',
    type: 'campaign',
    title: 'Clip $COIN Launch Video',
    platform: ['YouTube', 'Twitter'],
    reward: { currency: 'USDC', value: 20, per: '1k views' },
    progress: { paid: 400, pool: 2000 },
    status: 'live',
    duration: '4d left',
    participants: 23
  },
  {
    id: 'c3',
    type: 'campaign',
    title: 'Promote $DEGEN Listing',
    platform: ['Twitter', 'TikTok'],
    reward: { currency: 'USDC', value: 15, per: '1k views' },
    progress: { paid: 750, pool: 3000 },
    status: 'live',
    participants: 45
  },

  // Raids
  {
    id: 'r1',
    type: 'raid',
    title: 'Raid X Thread for $MEME',
    platform: ['Twitter'],
    reward: { currency: 'USDC', value: 1500 },
    progress: { paid: 300, pool: 1500 },
    duration: '2h 15m',
    status: 'live',
    participants: 127
  },
  {
    id: 'r2',
    type: 'raid',
    title: 'Discord Raid: NFT Drop',
    platform: ['Discord'],
    reward: { currency: 'USDC', value: 500 },
    progress: { paid: 150, pool: 500 },
    status: 'live',
    participants: 89
  },
  {
    id: 'r3',
    type: 'raid',
    title: 'StreamWars: Team Battle',
    platform: ['Twitch'],
    reward: { currency: 'USDC', value: 2000 },
    progress: { paid: 500, pool: 2000 },
    duration: '3h 20m',
    status: 'live',
    participants: 234
  },

  // Predictions
  {
    id: 'p1',
    type: 'prediction',
    title: 'Will $DOG reach $5M mcap today?',
    platform: ['Twitter'],
    reward: { currency: 'USDC', value: 3200, per: 'pool' },
    progress: { paid: 0, pool: 3200 },
    duration: '1h 45m',
    status: 'live',
    participants: 342
  },
  {
    id: 'p2',
    type: 'prediction',
    title: 'ETH Price in 24h: Over/Under $3,500',
    platform: ['Twitter'],
    reward: { currency: 'USDC', value: 5100, per: 'pool' },
    progress: { paid: 0, pool: 5100 },
    status: 'live',
    participants: 567
  },
  {
    id: 'p3',
    type: 'prediction',
    title: 'Will Team A win?',
    platform: ['Twitch'],
    reward: { currency: 'USDC', value: 2400, per: 'pool' },
    progress: { paid: 0, pool: 2400 },
    status: 'upcoming',
    participants: 0
  },

  // Quests
  {
    id: 'q1',
    type: 'quest',
    title: 'Join Discord + Follow X',
    platform: ['Twitter', 'Discord'],
    reward: { currency: 'PTS', value: 200 },
    progress: { paid: 156, pool: 200 },
    status: 'live',
    participants: 156
  },
  {
    id: 'q2',
    type: 'quest',
    title: 'Daily Engagement Quest',
    platform: ['Twitter'],
    reward: { currency: 'PTS', value: 50 },
    progress: { paid: 89, pool: 100 },
    status: 'live',
    participants: 89
  },
  {
    id: 'q3',
    type: 'quest',
    title: 'Creator Onboarding',
    platform: ['Twitch', 'OBS'],
    reward: { currency: 'PTS', value: 500 },
    progress: { paid: 23, pool: 100 },
    status: 'live',
    participants: 23
  },

  // Bounties
  {
    id: 'b1',
    type: 'bounty',
    title: 'Design $LAUNCH Logo Contest',
    platform: ['Twitter'],
    reward: { currency: 'USDC', value: 3000 },
    progress: { paid: 0, pool: 3000 },
    duration: '7d left',
    status: 'live',
    participants: 47
  },
  {
    id: 'b2',
    type: 'bounty',
    title: 'Write Technical Article',
    platform: ['Medium'],
    reward: { currency: 'USDC', value: 500 },
    progress: { paid: 0, pool: 500 },
    duration: '5d left',
    status: 'live',
    participants: 12
  }
];

// Legacy export for backwards compatibility
export const sampleProjects = launchProjects;

// Add default upvotes to projects that don't have them
launchProjects.forEach((p) => {
  if (p.upvotes === undefined) {
    p.upvotes = Math.floor(Math.random() * 100) + 10; // Random 10-110
  }
  if (p.comments === undefined) {
    p.comments = [];
  }
  if (p.createdAt === undefined) {
    p.createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)); // Random within last week
  }
});

// Helper function to filter projects by type (ICM/CCM)
export function filterLaunchProjects(filter: 'all' | 'icm' | 'ccm') {
  if (filter === 'all') return launchProjects;
  if (filter === 'icm') return launchProjects.filter(p => p.type === 'launch');
  if (filter === 'ccm') return launchProjects.filter(p => p.type !== 'launch');
  return launchProjects;
}

// Helper function to filter earn cards by type
export function filterEarnCards(type: 'all' | 'campaign' | 'raid' | 'prediction' | 'quest' | 'bounty') {
  if (type === 'all') return earnCards;
  return earnCards.filter(e => e.type === type);
}

// Legacy helper functions
export function filterByType(type: string) {
  if (type === 'all') return launchProjects;
  return launchProjects.filter(p => p.type === type.toLowerCase());
}

export function filterByStatus(status: string) {
  return launchProjects.filter(p => p.status === status.toLowerCase());
}

// Helper function to sort projects
export function sortProjects(projects: Project[], sortBy: 'trending' | 'new' | 'votes' | 'ending' | 'belief' | 'fdv') {
  const sorted = [...projects];

  switch (sortBy) {
    case 'trending':
      // Weighted formula: (upvotes × 2 + comments × 5) / (days old + 1)
      return sorted.sort((a, b) => {
        const daysOldA = a.createdAt ? (Date.now() - a.createdAt.getTime()) / (24 * 60 * 60 * 1000) : 1;
        const daysOldB = b.createdAt ? (Date.now() - b.createdAt.getTime()) / (24 * 60 * 60 * 1000) : 1;
        const scoreA = ((a.upvotes || 0) * 2 + (a.comments?.length || 0) * 5) / (daysOldA + 1);
        const scoreB = ((b.upvotes || 0) * 2 + (b.comments?.length || 0) * 5) / (daysOldB + 1);
        return scoreB - scoreA;
      });

    case 'new':
      return sorted.sort((a, b) => {
        const timeA = a.createdAt?.getTime() || 0;
        const timeB = b.createdAt?.getTime() || 0;
        return timeB - timeA;
      });

    case 'votes':
      return sorted.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    case 'belief':
      // Sort by belief score (ICM-specific)
      return sorted.sort((a, b) => (b.beliefScore || 0) - (a.beliefScore || 0));

    case 'fdv':
      // Sort by Fully Diluted Valuation (ICM-specific)
      return sorted.sort((a, b) => (b.fdv || 0) - (a.fdv || 0));

    case 'ending':
      // Put projects with endTime first, sorted by time remaining
      return sorted.sort((a, b) => {
        if (!a.endTime && !b.endTime) return 0;
        if (!a.endTime) return 1;
        if (!b.endTime) return -1;
        return a.endTime.localeCompare(b.endTime);
      });

    default:
      return sorted;
  }
}

// Auto-fill missing avatarUrl and tokenLogo fields (temporary placeholders until Twitter auth)
launchProjects.forEach((p, index) => {
  // Add creator avatar if missing
  if (!p.avatarUrl && p.creator) {
    p.avatarUrl = getCreatorAvatar(p.creator, index % 10)
  }

  // Add project logo if missing or empty
  if (!p.tokenLogo || p.tokenLogo === '') {
    const seed = p.ticker || p.title
    p.tokenLogo = getProjectLogo(seed, index % 9)
  }
})

// TODO: Add real-time subscription hooks
// TODO: Implement server-side pagination
// TODO: Add search/filter by creator, platform, etc.
