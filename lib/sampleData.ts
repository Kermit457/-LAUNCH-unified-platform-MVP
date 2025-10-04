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
    creator: 'AIKit Team',
    upvotes: 127,
    boosted: true,
    boostCount: 3,
    comments: [
      { id: 'c1', author: 'CryptoWhale', text: 'This looks promising! AI + crypto is the future 🚀', timestamp: new Date('2025-01-10T10:30:00') },
      { id: 'c2', author: 'TokenHunter', text: 'FDV seems reasonable. I\'m in!', timestamp: new Date('2025-01-10T11:15:00') }
    ],
    createdAt: new Date('2025-01-09T08:00:00')
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
    cta: { label: 'Trade Now', href: '#' },
    upvotes: 89,
    comments: [
      { id: 'c3', author: 'MemeLord', text: 'Season 1 was epic, ready for round 2! 🔥', timestamp: new Date('2025-01-10T09:00:00') }
    ],
    createdAt: new Date('2025-01-08T14:00:00')
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
    cta: { label: 'Start Clipping', href: '#' },
    upvotes: 54,
    comments: [],
    createdAt: new Date('2025-01-10T06:00:00')
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
    cta: { label: 'Join Campaign', href: '#' },
    upvotes: 78,
    boosted: true,
    boostCount: 2,
    comments: [
      { id: 'c4', author: 'ClipMaster', text: 'Great rates! Already made $200', timestamp: new Date('2025-01-10T12:00:00') }
    ],
    createdAt: new Date('2025-01-09T15:00:00')
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
    createdAt: new Date('2025-01-10T11:00:00')
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
    createdAt: new Date('2025-01-10T10:00:00')
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
    createdAt: new Date('2025-01-10T11:30:00')
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
    subtitle: 'Raid opposing team\'s chat',
    pill: { label: '$2,000 prize', kind: 'bounty' },
    progress: { paid: 500, pool: 2000 },
    status: 'live',
    stats: { participants: 234 },
    platforms: ['twitch'],
    cta: { label: 'Join Battle', href: '#' },
    endTime: '3h 20m'
  }
];

// Add default upvotes to projects that don't have them
sampleProjects.forEach((p) => {
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

// Helper function to filter by type
export function filterByType(type: string) {
  if (type === 'all') return sampleProjects;
  return sampleProjects.filter(p => p.type === type.toLowerCase());
}

// Helper function to filter by status
export function filterByStatus(status: string) {
  return sampleProjects.filter(p => p.status === status.toLowerCase());
}

// Helper function to sort projects
export function sortProjects(projects: Project[], sortBy: 'trending' | 'new' | 'votes' | 'ending') {
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

// TODO: Add real-time subscription hooks
// TODO: Implement server-side pagination
// TODO: Add search/filter by creator, platform, etc.
