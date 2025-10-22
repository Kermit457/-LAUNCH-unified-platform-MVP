"use client"

import { UserCard } from './UserCard'

// Mock users data - sorted by activity level (replace with real API)
const mockUsers = [
  {
    id: '1',
    handle: 'crypto_mike',
    skills: ['Solana', 'Rust', 'React'],
    online: true,
    motionScore: 95,
    price: 0.42,
    projectsCompleted: 12,
    holdings: 28,
    contributions: 156,
    responseTime: '< 1h'
  },
  {
    id: '2',
    handle: 'sarah_dev',
    skills: ['TypeScript', 'Next.js', 'Design'],
    online: true,
    motionScore: 92,
    price: 0.38,
    projectsCompleted: 28,
    holdings: 45,
    contributions: 234,
    responseTime: '< 30m'
  },
  {
    id: '3',
    handle: 'scout_anna',
    skills: ['Scouting', 'Due Diligence', 'Network'],
    online: true,
    motionScore: 88,
    price: 0.25,
    projectsCompleted: 15,
    holdings: 32,
    contributions: 98,
    responseTime: '< 2h'
  },
  {
    id: '4',
    handle: 'alex_builder',
    skills: ['Python', 'AI/ML', 'Backend'],
    online: true,
    motionScore: 85,
    price: 0.18,
    projectsCompleted: 5,
    holdings: 18,
    contributions: 67,
    responseTime: '< 3h'
  },
  {
    id: '5',
    handle: 'degen_trader',
    skills: ['Trading', 'DeFi', 'Analysis'],
    online: true,
    motionScore: 78,
    price: 0.12,
    projectsCompleted: 8,
    holdings: 24,
    contributions: 89,
    responseTime: '< 4h'
  },
  {
    id: '6',
    handle: 'meme_master',
    skills: ['Design', 'Marketing', 'Memes'],
    online: false,
    motionScore: 65,
    price: 0.08,
    projectsCompleted: 3,
    holdings: 12,
    contributions: 34,
    responseTime: '1d'
  }
]

interface PeopleGridProps {
  searchQuery: string
  limit?: number
  horizontal?: boolean
}

export function PeopleGrid({ searchQuery, limit = 20, horizontal = false }: PeopleGridProps) {
  // Filter users - only show online users
  let filteredUsers = mockUsers.filter(user => {
    // Only show online users
    if (!user.online) return false

    // Search filter
    if (searchQuery && !user.handle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  // Apply limit
  if (limit) {
    filteredUsers = filteredUsers.slice(0, limit)
  }

  const handleConnect = (userId: string) => {
    console.log('Connect:', userId)
  }

  const handleInvite = (userId: string) => {
    console.log('Invite to project:', userId)
  }

  const handleMessage = (userId: string) => {
    console.log('Send DM:', userId)
  }

  const handleTip = (userId: string) => {
    console.log('Tip/Reward:', userId)
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-400">
          {searchQuery
            ? `No users found matching "${searchQuery}"`
            : 'No users online at the moment'
          }
        </p>
      </div>
    )
  }

  return (
    <div>
      {horizontal ? (
        // Horizontal scroll row for top performers
        <div
          className="flex gap-1.5 md:gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex-shrink-0 w-24 md:w-48">
              <UserCard
                user={user}
                onConnect={handleConnect}
                onInvite={handleInvite}
                onMessage={handleMessage}
                onTip={handleTip}
                compact
              />
            </div>
          ))}
        </div>
      ) : (
        // Grid - responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onConnect={handleConnect}
              onInvite={handleInvite}
              onMessage={handleMessage}
              onTip={handleTip}
            />
          ))}
        </div>
      )}
    </div>
  )
}
