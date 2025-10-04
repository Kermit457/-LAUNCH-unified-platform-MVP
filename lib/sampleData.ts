import type { Project } from '@/types';

// ===== MOCK DATA FOR $LAUNCH UNIFIED PLATFORM =====
// TODO: Replace with Supabase real-time queries
// TODO: Add pagination for large datasets
// TODO: Implement filtering by platform, status, type

export const sampleProjects: Project[] = [
  // === LAUNCHES ===
  {
    id: '1',
    type: 'launch',
    title: '$AIKIT Token TGE',
    subtitle: 'AI Tools Platform • TGE in 3h',
    avatarUrl: '/logo.svg',
    pill: { label: 'FDV $8M', kind: 'mcap' },
    status: 'upcoming',
    stats: { views: 1247, likes: 89 },
    platforms: ['twitter', 'telegram'],
    cta: { label: 'View Launch', href: '#' },
    creator: 'AIKit Team'
  },
  {
    id: '2',
    type: 'launch',
    title: '$MEME Season 2',
    subtitle: 'Community Meme Coin • Live Now',
    pill: { label: 'FDV $12M', kind: 'mcap' },
    status: 'live',
    stats: { views: 3421, likes: 234 },
    platforms: ['twitter'],
    cta: { label: 'Trade Now', href: '#' }
  },

  // === CAMPAIGNS ===
  {
    id: '3',
    type: 'campaign',
    title: 'Clip $COIN Launch Video',
    subtitle: '$20 per 1,000 views • YouTube & X',
    pill: { label: '$20 / 1k views', kind: 'rate' },
    progress: { paid: 400, pool: 2000 },
    status: 'live',
    stats: { views: 856, participants: 23 },
    platforms: ['youtube', 'twitter'],
    cta: { label: 'Start Clipping', href: '#' }
  },
  {
    id: '4',
    type: 'campaign',
    title: 'Promote $DEGEN Listing',
    subtitle: '$15 per 1,000 impressions',
    pill: { label: '$15 / 1k', kind: 'rate' },
    progress: { paid: 750, pool: 3000 },
    status: 'live',
    stats: { views: 1230, participants: 45 },
    platforms: ['twitter', 'tiktok'],
    cta: { label: 'Join Campaign', href: '#' }
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
    endTime: '2h 15m'
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
    cta: { label: 'Raid Now', href: '#' }
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
    endTime: '1h 45m'
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
    cta: { label: 'Predict', href: '#' }
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
    cta: { label: 'View', href: '#' }
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
    cta: { label: 'Add to Stream', href: '#' }
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
    cta: { label: 'Install Widget', href: '#' }
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
    cta: { label: 'Complete Quest', href: '#' }
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
    cta: { label: 'Start Quest', href: '#' }
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
    cta: { label: 'Begin', href: '#' }
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
    creator: 'PixelPapi'
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
    creator: 'CryptoClips'
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
    cta: { label: 'Go Live', href: '#' }
  },
  {
    id: '18',
    type: 'raid',
    title: 'StreamWars: Team Battle',
    subtitle: 'Raid opposing team's chat',
    pill: { label: '$2,000 prize', kind: 'bounty' },
    progress: { paid: 500, pool: 2000 },
    status: 'live',
    stats: { participants: 234 },
    platforms: ['twitch'],
    cta: { label: 'Join Battle', href: '#' },
    endTime: '3h 20m'
  }
];

// Helper function to filter by type
export function filterByType(type: string) {
  if (type === 'all') return sampleProjects;
  return sampleProjects.filter(p => p.type === type.toLowerCase());
}

// Helper function to filter by status
export function filterByStatus(status: string) {
  return sampleProjects.filter(p => p.status === status.toLowerCase());
}

// TODO: Add real-time subscription hooks
// TODO: Implement server-side pagination
// TODO: Add search/filter by creator, platform, etc.
