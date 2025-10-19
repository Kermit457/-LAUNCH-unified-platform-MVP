import type { UnifiedCardData } from '@/components/UnifiedCard'

// ============================================================================
// NET WORTH DASHBOARD - MOCK DATA
// ============================================================================

// User Position in a Curve
export interface UserPosition {
  keysOwned: number
  totalValue: number // SOL
  avgBuyPrice: number
  currentPrice: number
  pnl: number // Profit/Loss in SOL
  pnlPercent: number
  ownershipPct: number
  boughtAt: number // timestamp
}

// Net Worth Statistics
export interface NetWorthStats {
  totalValue: number // Total portfolio value in SOL
  change24h: number // Change in SOL
  changePercent: number
  totalEarned: {
    lifetime: number
    thisWeek: number
    thisMonth: number
  }
}

// Portfolio Breakdown
export interface PortfolioBreakdown {
  icm: { value: number, count: number, percentage: number }
  ccm: { value: number, count: number, percentage: number }
  meme: { value: number, count: number, percentage: number }
}

// Collaboration
export interface Collaboration {
  id: string
  curveId: string
  curveName: string
  curveType: 'icm' | 'ccm' | 'meme'
  curveAvatar?: string
  status: 'active' | 'pending' | 'completed'

  collaborators: {
    userId: string
    name: string
    avatar?: string
    role: string
    equity?: number
    keys?: number
  }[]

  unreadMessages: number
  lastActivity: number
  chatId: string
  startedAt: number
  completedAt?: number

  sharedRevenue?: number

  milestones?: {
    title: string
    completed: boolean
    dueDate?: number
  }[]
}

// Message/Conversation
export interface Message {
  id: string
  conversationId: string
  conversationType: 'dm' | 'collaboration' | 'holder-room'

  senderId: string
  senderName: string
  senderAvatar?: string

  content: string
  timestamp: number

  relatedCurve?: {
    id: string
    name: string
    type: 'icm' | 'ccm' | 'meme'
  }

  collaborationId?: string
  isRead: boolean
}

export interface Conversation {
  id: string
  type: 'dm' | 'collaboration' | 'holder-room'
  participants: {
    id: string
    name: string
    avatar?: string
  }[]
  unreadCount: number
  lastMessage: Message
  relatedCurve?: {
    id: string
    name: string
    type: 'icm' | 'ccm' | 'meme'
  }
  isPinned: boolean
  isMuted: boolean
}

// Earnings Breakdown
export interface EarningsData {
  totalEarnings: number
  referrals: {
    count: number
    earnings: number
    users: {
      id: string
      name: string
      avatar?: string
      earnedFrom: number
      joinedAt: number
    }[]
  }
  tradingFees: {
    total: number
    byCurve: {
      curveId: string
      curveName: string
      amount: number
    }[]
  }
  stakingRewards: {
    total: number
    positions: {
      curveId: string
      curveName: string
      staked: number
      earned: number
      apy: number
    }[]
  }
  airdrops: {
    total: number
    claimable: {
      curveId: string
      curveName: string
      amount: number
      claimBy: number
    }[]
  }
}

// Activity Log
export interface ActivityLog {
  id: string
  type: 'buy' | 'sell' | 'claim' | 'collaboration' | 'message' | 'milestone'
  timestamp: number

  curveId?: string
  curveName?: string
  curveType?: 'icm' | 'ccm' | 'meme'

  amount?: number
  keys?: number

  description: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

// Mock Holdings with User Positions
export const mockHoldings: (UnifiedCardData & { userPosition: UserPosition })[] = [
  {
    id: 'aikit',
    type: 'icm',
    title: 'AI Development Toolkit',
    ticker: '$AIKIT',
    symbol: '$AIKIT',
    description: 'Open-source AI tools for developers. Complete SDK with pre-trained models.',
    creator: 'Alice Chen',
    creatorHandle: '@alice',
    avatar: '💼',

    price: 0.83,
    marketCap: 125000,
    holders: 47,
    volume24h: 12500,

    status: 'active',
    stage: 'active',
    curveProgress: 68,
    beliefScore: 78,
    upvotes: 125,
    commentsCount: 34,

    userPosition: {
      keysOwned: 15,
      totalValue: 12.45,
      avgBuyPrice: 0.75,
      currentPrice: 0.83,
      pnl: 1.2,
      pnlPercent: 10.7,
      ownershipPct: 3.2,
      boughtAt: Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 days ago
    },

    isOwned: false,
    isFollowing: true,
    hasKeys: true,
    hasAirdrop: false
  },
  {
    id: 'elonmusk',
    type: 'ccm',
    title: 'Elon Musk',
    ticker: '@elonmusk',
    symbol: '@elonmusk',
    description: 'Tech entrepreneur, SpaceX & Tesla CEO. Backing innovation in AI and space.',
    creator: 'Elon Musk',
    creatorHandle: '@elonmusk',
    avatar: '🚀',

    price: 2.45,
    marketCap: 450000,
    holders: 234,
    volume24h: 45000,

    status: 'active',
    stage: 'active',
    curveProgress: 85,
    beliefScore: 92,
    upvotes: 456,
    commentsCount: 89,

    userPosition: {
      keysOwned: 25,
      totalValue: 61.25,
      avgBuyPrice: 2.1,
      currentPrice: 2.45,
      pnl: 8.75,
      pnlPercent: 16.7,
      ownershipPct: 10.7,
      boughtAt: Date.now() - 12 * 24 * 60 * 60 * 1000
    },

    isOwned: false,
    isFollowing: true,
    hasKeys: true,
    hasAirdrop: true,
    airdropAmount: 100
  },
  {
    id: 'pepe',
    type: 'meme',
    title: 'PEPE Classic',
    ticker: '$PEPE',
    symbol: '$PEPE',
    description: 'The original meme coin. Internet culture meets DeFi.',
    creator: 'Anon',
    creatorHandle: '@pepecreator',
    avatar: '🐸',

    price: 0.045,
    marketCap: 89000,
    holders: 567,
    volume24h: 23000,

    status: 'active',
    stage: 'active',
    curveProgress: 72,
    beliefScore: 65,
    upvotes: 234,
    commentsCount: 156,

    userPosition: {
      keysOwned: 100,
      totalValue: 4.5,
      avgBuyPrice: 0.05,
      currentPrice: 0.045,
      pnl: -0.5,
      pnlPercent: -10,
      ownershipPct: 1.8,
      boughtAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },

    isOwned: false,
    isFollowing: false,
    hasKeys: true,
    hasAirdrop: false
  }
]

// Mock Curves Owned by User
export const mockMyCurves: UnifiedCardData[] = [
  {
    id: 'my-defi',
    type: 'icm',
    title: 'DeFi Protocol',
    ticker: '$DEFI',
    symbol: '$DEFI',
    description: 'Decentralized lending protocol with automated yield optimization.',
    creator: 'You',
    creatorHandle: '@you',
    avatar: '💰',

    price: 1.25,
    marketCap: 180000,
    holders: 89,
    volume24h: 18000,

    status: 'active',
    stage: 'active',
    curveProgress: 75,
    beliefScore: 82,
    upvotes: 312,
    commentsCount: 67,

    isOwned: true,
    isFollowing: false,
    hasKeys: false,
    hasAirdrop: false,

    ownedStats: {
      totalRaised: 67.5,
      yourRevenue: 3.375,
      holderCount: 89,
      avgHolding: 0.76
    }
  }
]

// Mock Collaborations
export const mockCollaborations: Collaboration[] = [
  {
    id: 'collab-1',
    curveId: 'aikit',
    curveName: '$AIKIT',
    curveType: 'icm',
    curveAvatar: '💼',
    status: 'active',

    collaborators: [
      { userId: '1', name: 'Alice Chen', avatar: '👩‍💻', role: 'Founder', equity: 40, keys: 1000 },
      { userId: '2', name: 'You', role: 'Co-Developer', equity: 20, keys: 500 },
      { userId: '3', name: 'Bob Smith', avatar: '👨‍💼', role: 'Marketing', equity: 15, keys: 375 }
    ],

    unreadMessages: 12,
    lastActivity: Date.now() - 2 * 60 * 60 * 1000,
    chatId: 'chat-aikit',
    startedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,

    sharedRevenue: 8.4,

    milestones: [
      { title: 'Launch MVP', completed: true },
      { title: 'Reach 50 holders', completed: true },
      { title: 'Integrate with 3 platforms', completed: false, dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000 }
    ]
  },
  {
    id: 'collab-2',
    curveId: 'nft-project',
    curveName: '$NFT',
    curveType: 'icm',
    curveAvatar: '🎨',
    status: 'pending',

    collaborators: [
      { userId: '4', name: 'Charlie Dev', avatar: '🎨', role: 'Lead Designer', equity: 30 },
      { userId: '2', name: 'You', role: 'Developer', equity: 25 }
    ],

    unreadMessages: 3,
    lastActivity: Date.now() - 5 * 60 * 60 * 1000,
    chatId: 'chat-nft',
    startedAt: Date.now() - 3 * 24 * 60 * 60 * 1000
  }
]

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'collaboration',
    participants: [
      { id: '1', name: 'Alice Chen', avatar: '👩‍💻' },
      { id: '2', name: 'You' },
      { id: '3', name: 'Bob Smith', avatar: '👨‍💼' }
    ],
    unreadCount: 12,
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      conversationType: 'collaboration',
      senderId: '1',
      senderName: 'Alice Chen',
      senderAvatar: '👩‍💻',
      content: 'Great progress on the API integration!',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      collaborationId: 'collab-1',
      isRead: false
    },
    relatedCurve: { id: 'aikit', name: '$AIKIT', type: 'icm' },
    isPinned: true,
    isMuted: false
  },
  {
    id: 'conv-2',
    type: 'dm',
    participants: [
      { id: '5', name: 'Elon Musk', avatar: '🚀' },
      { id: '2', name: 'You' }
    ],
    unreadCount: 5,
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      conversationType: 'dm',
      senderId: '5',
      senderName: 'Elon Musk',
      content: 'Thanks for buying keys! Want to collaborate?',
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      isRead: false
    },
    relatedCurve: { id: 'elonmusk', name: '@elonmusk', type: 'ccm' },
    isPinned: false,
    isMuted: false
  },
  {
    id: 'conv-3',
    type: 'holder-room',
    participants: [
      { id: '2', name: 'You' }
    ],
    unreadCount: 23,
    lastMessage: {
      id: 'msg-3',
      conversationId: 'conv-3',
      conversationType: 'holder-room',
      senderId: '15',
      senderName: 'whale_trader',
      content: 'Just bought 50 more keys! 🚀',
      timestamp: Date.now() - 30 * 60 * 1000,
      isRead: false
    },
    relatedCurve: { id: 'pepe', name: '$PEPE', type: 'meme' },
    isPinned: false,
    isMuted: false
  }
]

// Mock Earnings
export const mockEarnings: EarningsData = {
  totalEarnings: 45.2,

  referrals: {
    count: 23,
    earnings: 12.5,
    users: [
      { id: 'ref-1', name: 'Dave Wilson', avatar: '👨‍💼', earnedFrom: 3.2, joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000 },
      { id: 'ref-2', name: 'Emma Davis', avatar: '👩‍💻', earnedFrom: 2.8, joinedAt: Date.now() - 20 * 24 * 60 * 60 * 1000 },
      { id: 'ref-3', name: 'Frank Miller', earnedFrom: 1.5, joinedAt: Date.now() - 10 * 24 * 60 * 60 * 1000 }
    ]
  },

  tradingFees: {
    total: 18.3,
    byCurve: [
      { curveId: 'my-defi', curveName: '$DEFI', amount: 12.5 },
      { curveId: 'my-nft', curveName: '$NFT', amount: 5.8 }
    ]
  },

  stakingRewards: {
    total: 8.4,
    positions: [
      { curveId: 'aikit', curveName: '$AIKIT', staked: 50, earned: 4.2, apy: 23.5 },
      { curveId: 'elonmusk', curveName: '@elonmusk', staked: 30, earned: 4.2, apy: 18.7 }
    ]
  },

  airdrops: {
    total: 6.0,
    claimable: [
      { curveId: 'elonmusk', curveName: '@elonmusk', amount: 100, claimBy: Date.now() + 7 * 24 * 60 * 60 * 1000 },
      { curveId: 'bonk', curveName: '$BONK', amount: 500, claimBy: Date.now() + 14 * 24 * 60 * 60 * 1000 }
    ]
  }
}

// Mock Net Worth Stats
export const mockNetWorthStats: NetWorthStats = {
  totalValue: 127.5,
  change24h: 12.3,
  changePercent: 10.7,
  totalEarned: {
    lifetime: 45.2,
    thisWeek: 8.4,
    thisMonth: 18.7
  }
}

// Mock Portfolio Breakdown
export const mockPortfolioBreakdown: PortfolioBreakdown = {
  icm: { value: 44.8, count: 12, percentage: 35.1 },
  ccm: { value: 58.7, count: 18, percentage: 46.0 },
  meme: { value: 24.0, count: 17, percentage: 18.9 }
}

// Mock Activity
export const mockActivity: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'buy',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    curveId: 'pepe',
    curveName: '$PEPE',
    curveType: 'meme',
    amount: 4.5,
    keys: 100,
    description: 'Bought 100 keys for 4.5 SOL'
  },
  {
    id: 'act-2',
    type: 'collaboration',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    curveId: 'aikit',
    curveName: '$AIKIT',
    curveType: 'icm',
    description: 'Joined as co-developer'
  },
  {
    id: 'act-3',
    type: 'claim',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    curveId: 'elonmusk',
    curveName: '@elonmusk',
    curveType: 'ccm',
    amount: 100,
    description: 'Claimed 100 token airdrop'
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTotalNetWorth(): number {
  return mockNetWorthStats.totalValue
}

export function getHoldingsValue(): number {
  return mockHoldings.reduce((sum, h) => sum + h.userPosition.totalValue, 0)
}

export function getActiveCollaborations(): Collaboration[] {
  return mockCollaborations.filter(c => c.status === 'active')
}

export function getPendingCollaborations(): Collaboration[] {
  return mockCollaborations.filter(c => c.status === 'pending')
}

export function getUnreadMessageCount(): number {
  return mockConversations.reduce((sum, c) => sum + c.unreadCount, 0)
}

export function getTopPerformer(): typeof mockHoldings[0] | null {
  return mockHoldings.reduce((best, current) =>
    current.userPosition.pnlPercent > best.userPosition.pnlPercent ? current : best
  , mockHoldings[0])
}

export function getWorstPerformer(): typeof mockHoldings[0] | null {
  return mockHoldings.reduce((worst, current) =>
    current.userPosition.pnlPercent < worst.userPosition.pnlPercent ? current : worst
  , mockHoldings[0])
}