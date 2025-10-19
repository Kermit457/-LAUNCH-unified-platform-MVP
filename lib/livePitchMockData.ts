import type { UnifiedCardData } from '@/components/UnifiedCard'

// ============================================================================
// LIVE PITCH - MOCK DATA
// ============================================================================

export interface LiveChatMessage {
  id: string
  userId: string
  username: string
  avatar?: string
  message: string
  timestamp: number

  // Special message types
  type: 'message' | 'key-purchase' | 'gift' | 'join' | 'milestone'

  // System message data
  systemData?: {
    action: 'bought_keys' | 'sent_gift' | 'reached_milestone'
    amount?: number
    emoji?: string
  }

  // User badges
  badges?: ('owner' | 'verified' | 'whale' | 'early-supporter')[]
}

export interface LivePitchData {
  id: string

  // Creator
  creatorId: string
  creatorName: string
  creatorAvatar?: string
  creatorHandle: string

  // Curve being pitched
  curve: UnifiedCardData

  // Stream status
  status: 'live' | 'starting-soon' | 'ended' | 'replay'
  viewerCount: number
  viewersPeak: number
  startedAt: number
  scheduledFor?: number // For starting-soon

  // Engagement metrics (real-time)
  liveStats: {
    keysTraded: number // Keys bought during stream
    volumeTraded: number // SOL traded during stream
    giftsReceived: number // Number of gifts
    giftValue: number // Total SOL from gifts
    reactionsCount: number
    reactions: { emoji: string, count: number }[]
  }

  // Stream content
  streamUrl?: string
  thumbnailUrl?: string
  pitchDescription: string

  // Chat
  chatMessages: LiveChatMessage[]
}

// Mock Live Pitches
export const mockLivePitches: LivePitchData[] = [
  {
    id: 'live-aikit',
    creatorId: 'alice',
    creatorName: 'Alice Chen',
    creatorAvatar: '👩‍💻',
    creatorHandle: '@alice',

    status: 'live',
    viewerCount: 1234,
    viewersPeak: 1567,
    startedAt: Date.now() - 23 * 60 * 1000, // Started 23 min ago

    curve: {
      id: 'aikit',
      type: 'icm',
      title: 'AI Development Toolkit',
      ticker: '$AIKIT',
      symbol: '$AIKIT',
      description: 'Open-source AI tools for developers. Complete SDK with pre-trained models.',
      creator: 'Alice Chen',
      creatorHandle: '@alice',
      avatar: '💼',

      status: 'live',
      beliefScore: 78,
      upvotes: 125,
      commentsCount: 34,

      holders: 47,
      currentPrice: 0.83
    },

    liveStats: {
      keysTraded: 47,
      volumeTraded: 24.5,
      giftsReceived: 12,
      giftValue: 8.4,
      reactionsCount: 342,
      reactions: [
        { emoji: '🔥', count: 125 },
        { emoji: '🚀', count: 98 },
        { emoji: '💰', count: 76 },
        { emoji: '👏', count: 43 }
      ]
    },

    pitchDescription: 'Building the most comprehensive AI toolkit for developers. Join me as I demo the latest features and announce our partnership with leading AI companies!',

    chatMessages: [
      {
        id: 'msg-1',
        userId: 'user1',
        username: 'crypto_trader',
        message: 'This is incredible! Just bought 10 keys 🚀',
        timestamp: Date.now() - 2 * 1000,
        type: 'message'
      },
      {
        id: 'msg-2',
        userId: 'user2',
        username: 'degen_mike',
        message: 'Just aped in with 5 SOL',
        timestamp: Date.now() - 5 * 1000,
        type: 'message',
        badges: ['whale']
      },
      {
        id: 'msg-3',
        userId: 'system',
        username: 'whale_watcher',
        message: 'bought 50 keys for 41.5 SOL',
        timestamp: Date.now() - 8 * 1000,
        type: 'key-purchase',
        systemData: { action: 'bought_keys', amount: 50 }
      },
      {
        id: 'msg-4',
        userId: 'user4',
        username: 'moon_hunter',
        message: 'LFG! To the moon! 🌙',
        timestamp: Date.now() - 12 * 1000,
        type: 'message'
      },
      {
        id: 'msg-5',
        userId: 'alice',
        username: 'Alice Chen',
        avatar: '👩‍💻',
        message: 'Welcome everyone! So excited to show you what we\'ve built',
        timestamp: Date.now() - 20 * 1000,
        type: 'message',
        badges: ['owner', 'verified']
      }
    ]
  },
  {
    id: 'live-elon',
    creatorId: 'elon',
    creatorName: 'Elon Musk',
    creatorAvatar: '🚀',
    creatorHandle: '@elonmusk',

    status: 'live',
    viewerCount: 3421,
    viewersPeak: 4123,
    startedAt: Date.now() - 45 * 60 * 1000, // Started 45 min ago

    curve: {
      id: 'elonmusk',
      type: 'ccm',
      title: 'Elon Musk',
      ticker: '@elonmusk',
      symbol: '@elonmusk',
      description: 'Tech entrepreneur, SpaceX & Tesla CEO. Backing innovation in AI and space.',
      creator: 'Elon Musk',
      creatorHandle: '@elonmusk',
      avatar: '🚀',

      status: 'live',
      beliefScore: 92,
      upvotes: 456,
      commentsCount: 89,

      holders: 234,
      currentPrice: 2.45
    },

    liveStats: {
      keysTraded: 156,
      volumeTraded: 89.3,
      giftsReceived: 45,
      giftValue: 23.7,
      reactionsCount: 1248,
      reactions: [
        { emoji: '🚀', count: 456 },
        { emoji: '💎', count: 312 },
        { emoji: '🔥', count: 289 },
        { emoji: '⚡', count: 191 }
      ]
    },

    pitchDescription: 'Discussing the future of AI, space exploration, and why I\'m building on Solana. AMA session!',

    chatMessages: []
  },
  {
    id: 'live-pepe',
    creatorId: 'pepecreator',
    creatorName: 'Pepe Creator',
    creatorAvatar: '🐸',
    creatorHandle: '@pepecreator',

    status: 'live',
    viewerCount: 567,
    viewersPeak: 789,
    startedAt: Date.now() - 10 * 60 * 1000, // Started 10 min ago

    curve: {
      id: 'pepe',
      type: 'meme',
      title: 'PEPE Classic',
      ticker: '$PEPE',
      symbol: '$PEPE',
      description: 'The original meme coin. Internet culture meets DeFi.',
      creator: 'Anon',
      creatorHandle: '@pepecreator',
      avatar: '🐸',

      status: 'live',
      beliefScore: 65,
      upvotes: 234,
      commentsCount: 156,

      holders: 567,
      currentPrice: 0.045
    },

    liveStats: {
      keysTraded: 234,
      volumeTraded: 10.5,
      giftsReceived: 67,
      giftValue: 3.4,
      reactionsCount: 892,
      reactions: [
        { emoji: '🐸', count: 445 },
        { emoji: '😂', count: 267 },
        { emoji: '🔥', count: 180 }
      ]
    },

    pitchDescription: 'PEPE to the moon! Community takeover happening now. Join the frog army! 🐸',

    chatMessages: []
  },
  {
    id: 'starting-defi',
    creatorId: 'bob',
    creatorName: 'Bob Smith',
    creatorAvatar: '👨‍💼',
    creatorHandle: '@bob',

    status: 'starting-soon',
    viewerCount: 0,
    viewersPeak: 0,
    startedAt: 0,
    scheduledFor: Date.now() + 2 * 60 * 60 * 1000, // In 2 hours

    curve: {
      id: 'defi',
      type: 'icm',
      title: 'DeFi Protocol',
      ticker: '$DEFI',
      symbol: '$DEFI',
      description: 'Decentralized lending protocol with automated yield optimization.',
      creator: 'Bob Smith',
      creatorHandle: '@bob',
      avatar: '💰',

      status: 'upcoming',
      beliefScore: 82,
      upvotes: 312,
      commentsCount: 67,

      holders: 89,
      currentPrice: 1.25
    },

    liveStats: {
      keysTraded: 0,
      volumeTraded: 0,
      giftsReceived: 0,
      giftValue: 0,
      reactionsCount: 0,
      reactions: []
    },

    pitchDescription: 'Unveiling our DeFi protocol with revolutionary yield strategies. Don\'t miss the launch!',

    chatMessages: []
  }
]

// Mock Live Stats
export const mockLiveStats = {
  totalLiveNow: 12,
  totalViewers: 15234,
  totalRaisedToday: 245.8,
  yourActiveStreams: 0
}

// Helper Functions
export function getFeaturedPitch(): LivePitchData | null {
  const livePitches = mockLivePitches.filter(p => p.status === 'live')
  return livePitches.length > 0
    ? livePitches.reduce((best, current) =>
        current.viewerCount > best.viewerCount ? current : best
      )
    : null
}

export function getLivePitches(): LivePitchData[] {
  return mockLivePitches.filter(p => p.status === 'live')
}

export function getUpcomingPitches(): LivePitchData[] {
  return mockLivePitches.filter(p => p.status === 'starting-soon')
}

export function getTotalViewers(): number {
  return mockLivePitches
    .filter(p => p.status === 'live')
    .reduce((sum, p) => sum + p.viewerCount, 0)
}