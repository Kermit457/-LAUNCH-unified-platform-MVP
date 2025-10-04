// Mock data for testing without database

export interface MockPrediction {
  id: string
  streamerId: string
  question: string
  options: string[]
  state: 'OPEN' | 'LOCKED' | 'SETTLED'
  tallies: Record<string, number>
  winningOption?: string
  createdAt: string
}

export interface MockSocialAction {
  id: string
  streamerId: string
  actionKey: string
  label: string
  targetUrl: string
  counter: number
  goal: number
  active: boolean
}

// In-memory storage
export const mockPredictions: MockPrediction[] = [
  {
    id: 'pred_001',
    streamerId: 'demo',
    question: 'BTC price next 15 minutes?',
    options: ['UP 📈', 'DOWN 📉'],
    state: 'OPEN',
    tallies: { 'UP 📈': 42, 'DOWN 📉': 38 },
    createdAt: new Date().toISOString(),
  },
]

export const mockSocialActions: MockSocialAction[] = [
  {
    id: 'social_001',
    streamerId: 'demo',
    actionKey: 'join_telegram',
    label: '💬 Join Telegram',
    targetUrl: 'https://t.me/example',
    counter: 87,
    goal: 100,
    active: true,
  },
  {
    id: 'social_002',
    streamerId: 'demo',
    actionKey: 'follow_x',
    label: '🐦 Follow on X',
    targetUrl: 'https://x.com/example',
    counter: 45,
    goal: 80,
    active: true,
  },
  {
    id: 'social_003',
    streamerId: 'demo',
    actionKey: 'join_discord',
    label: '🎮 Join Discord',
    targetUrl: 'https://discord.gg/example',
    counter: 63,
    goal: 75,
    active: true,
  },
]

export const mockVotes = new Map<string, string>() // userId -> option
