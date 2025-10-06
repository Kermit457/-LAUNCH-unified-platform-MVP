"use client"

import { useState } from 'react'
import { Users } from 'lucide-react'
import { ProfileCard } from '@/components/network/ProfileCard'
import { ConnState } from '@/types/network'

export default function NetworkPage() {
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set())

  const handleInvite = (id: string) => {
    setInvitedUsers(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    console.log('Invited:', id)
  }

  const handleCancelInvite = (id: string) => {
    setInvitedUsers(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    console.log('Cancelled invite:', id)
  }

  const getState = (id: string, isConnected?: boolean, isSelf?: boolean): ConnState => {
    if (isSelf) return 'self'
    if (isConnected) return 'connected'
    if (invitedUsers.has(id)) return 'pending'
    return 'none'
  }

  const mockProfiles = [
    {
      id: 'u1',
      name: 'CryptoKing',
      handle: '@cryptoking',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CryptoKing&backgroundColor=8b5cf6,a855f7',
      verified: true,
      roles: ['Streamer', 'Degen', 'Trader'],
      mutuals: 15,
      bio: 'Markets, memes, and mid-caps.',
      x: {
        followers: 3500,
        following: 1300,
        posts: 10200,
        verified: true,
      },
      links: {
        x: 'https://x.com/cryptoking',
        youtube: 'https://youtube.com/@cryptoking',
        twitch: 'https://twitch.tv/cryptoking',
        discord: 'https://discord.gg/cryptoking',
        web: 'https://cryptoking.io',
      },
      state: getState('u1'),
    },
    {
      id: 'u2',
      name: 'StreamLord',
      handle: '@streamlord',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=StreamLord&backgroundColor=ec4899,8b5cf6',
      verified: false,
      roles: ['Streamer', 'Creator'],
      mutuals: 8,
      bio: 'Live every day. Building in public.',
      x: {
        followers: 12500,
        following: 890,
        posts: 5600,
        verified: false,
      },
      links: {
        x: 'https://x.com/streamlord',
        twitch: 'https://twitch.tv/streamlord',
        youtube: 'https://youtube.com/@streamlord',
      },
      state: getState('u2', true),
    },
    {
      id: 'u3',
      name: 'DegenTrader',
      handle: '@degentrader',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DegenTrader&backgroundColor=a855f7,06b6d4',
      verified: true,
      roles: ['Trader', 'Degen'],
      mutuals: 23,
      bio: '100x or bust. NFA.',
      x: {
        followers: 8900,
        following: 450,
        posts: 15300,
        verified: true,
      },
      links: {
        x: 'https://x.com/degentrader',
        web: 'https://degentrader.com',
      },
      state: getState('u3'),
    },
    {
      id: 'u4',
      name: 'You',
      handle: '@yourhandle',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=ec4899,f97316',
      verified: true,
      roles: ['Creator', 'Developer'],
      bio: 'Building the future of Web3.',
      x: {
        followers: 1200,
        following: 340,
        posts: 2100,
        verified: false,
      },
      links: {
        x: 'https://x.com/yourhandle',
        web: 'https://yoursite.com',
      },
      state: getState('u4', false, true),
    },
    {
      id: 'u5',
      name: 'MoonWhale',
      handle: '@moonwhale',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=MoonWhale&backgroundColor=06b6d4,8b5cf6',
      verified: false,
      roles: ['Investor', 'Degen'],
      mutuals: 42,
      bio: 'Early investor. Portfolio builder.',
      x: {
        followers: 25600,
        following: 125,
        posts: 890,
        verified: true,
      },
      links: {
        x: 'https://x.com/moonwhale',
        discord: 'https://discord.gg/moonwhale',
      },
      state: getState('u5'),
    },
    {
      id: 'u6',
      name: 'PixelGuru',
      handle: '@pixelguru',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PixelGuru&backgroundColor=f97316,ec4899',
      verified: true,
      roles: ['Creator', 'Developer'],
      mutuals: 6,
      bio: 'NFT artist & smart contract dev.',
      x: {
        followers: 6700,
        following: 890,
        posts: 3400,
        verified: false,
      },
      links: {
        x: 'https://x.com/pixelguru',
        youtube: 'https://youtube.com/@pixelguru',
        web: 'https://pixelguru.art',
      },
      state: getState('u6'),
    },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-8 h-8 text-fuchsia-400" />
          <h1 className="text-4xl font-bold gradient-text-launchos">
            Network
          </h1>
        </div>
        <p className="text-white/60 text-lg">
          Connect with creators, streamers, and traders in the LaunchOS ecosystem
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Total Network</div>
          <div className="text-2xl font-bold gradient-text-launchos">247</div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Connected</div>
          <div className="text-2xl font-bold text-green-400">42</div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-400">{invitedUsers.size}</div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Suggestions</div>
          <div className="text-2xl font-bold text-cyan-400">18</div>
        </div>
      </div>

      {/* Profile Cards Grid - Default Variant */}
      <h2 className="text-2xl font-bold text-white mb-6">Suggested Connections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mockProfiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            {...profile}
            state={profile.state as ConnState}
            onInvite={handleInvite}
            onCancelInvite={handleCancelInvite}
            onChat={(id) => console.log('Chat with:', id)}
            onFollow={(id) => console.log('Follow:', id)}
            onShare={(id) => console.log('Share:', id)}
            onInviteToCampaign={(id) => console.log('Invite to campaign:', id)}
            onEditProfile={() => console.log('Edit profile')}
          />
        ))}
      </div>

      {/* Compact Variant Example */}
      <h2 className="text-2xl font-bold text-white mb-6">Quick View (Compact)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {mockProfiles.slice(0, 4).map((profile) => (
          <ProfileCard
            key={`compact-${profile.id}`}
            {...profile}
            state={profile.state as ConnState}
            variant="compact"
            onInvite={handleInvite}
            onCancelInvite={handleCancelInvite}
            onChat={(id) => console.log('Chat with:', id)}
            onFollow={(id) => console.log('Follow:', id)}
            onShare={(id) => console.log('Share:', id)}
            onInviteToCampaign={(id) => console.log('Invite to campaign:', id)}
            onEditProfile={() => console.log('Edit profile')}
          />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 rounded-2xl bg-gradient-to-br from-fuchsia-950/40 to-purple-950/40 border border-fuchsia-500/20 p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Want to grow your network?</h2>
        <p className="text-white/70 text-lg mb-8">
          Connect with top creators and unlock collaboration opportunities
        </p>
        <button
          className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
          data-cta="network-complete-profile"
          disabled={true}
          title="Feature coming soon"
        >
          Complete Your Profile
        </button>
      </div>
    </div>
  )
}
