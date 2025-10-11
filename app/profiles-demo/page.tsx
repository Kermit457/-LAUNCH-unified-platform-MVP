"use client"

import { useState } from 'react'
import { CleanLaunchCard, CreatorProfileCard } from '@/components/design-system'

export default function ProfilesDemoPage() {
  // Mock creator data
  const mockCreators = [
    {
      id: 'creator-1',
      name: 'Solidity Dev',
      handle: '@solidity_dev',
      bio: 'Smart contract auditor | Web3 builder | Security first 🔒',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=solidity',
      isVerified: true,
      badges: ['Builder', 'Developer'],
      followers: 1234,
      projectsCount: 8,
      viewCount: 5420,
      twitter: 'https://twitter.com/solidity_dev',
      website: 'https://soliditydev.eth',
      keyPrice: 0.0125,
      keyHolders: 42,
      convictionPct: 78
    },
    {
      id: 'creator-2',
      name: 'Design Guru',
      handle: '@design_pro',
      bio: 'UI/UX designer for Web3 | Creating beautiful experiences ✨',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
      isVerified: true,
      badges: ['Designer', 'Creative'],
      followers: 892,
      projectsCount: 5,
      viewCount: 3210,
      twitter: 'https://twitter.com/design_pro',
      website: 'https://designguru.io',
      keyPrice: 0.0089,
      keyHolders: 28,
      convictionPct: 64
    },
    {
      id: 'creator-3',
      name: 'DeFi Builder',
      handle: '@defi_builder',
      bio: 'Building the future of decentralized finance | Solana maximalist 🚀',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi',
      isVerified: false,
      badges: ['Builder'],
      followers: 456,
      projectsCount: 3,
      viewCount: 1890,
      twitter: 'https://twitter.com/defi_builder',
      keyPrice: 0.0056,
      keyHolders: 15,
      convictionPct: 52
    }
  ]

  // Mock project data
  const mockProjects = [
    {
      id: 'project-1',
      title: 'ICM.RUN',
      subtitle: 'Conviction-based project with community-driven launch mechanism',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=icm',
      scope: 'ICM',
      status: 'UPCOMING' as const,
      upvotes: 42,
      commentsCount: 8,
      viewCount: 234,
      convictionPct: 67,
      keyHolders: 35,
      contributionPoolPct: 30,
      feesSharePct: 15,
      keyPrice: 0.0145,
      contributors: [
        { id: '1', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
        { id: '2', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
        { id: '3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie' }
      ]
    },
    {
      id: 'project-2',
      title: 'SolanaPay Pro',
      subtitle: 'Next-generation payment infrastructure for Solana ecosystem',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=solanapay',
      scope: 'CCM',
      status: 'LIVE' as const,
      upvotes: 128,
      commentsCount: 24,
      viewCount: 892,
      convictionPct: 85,
      keyHolders: 67,
      contributionPoolPct: 40,
      feesSharePct: 20,
      keyPrice: 0.0234,
      contributors: [
        { id: '4', name: 'David', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
        { id: '5', name: 'Eve', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve' }
      ]
    }
  ]

  const [votedProjects, setVotedProjects] = useState<Set<string>>(new Set())

  const handleVote = (projectId: string) => {
    setVotedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profiles Demo</h1>
          <p className="text-zinc-400">Comparing Project Cards vs Creator Profile Cards</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Project Cards */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-violet-400">📦</span>
              Project Cards
            </h2>
            <div className="space-y-4">
              {mockProjects.map(project => (
                <CleanLaunchCard
                  key={project.id}
                  launch={project}
                  hasVoted={votedProjects.has(project.id)}
                  onVote={() => handleVote(project.id)}
                  onComment={() => console.log('Comment on project:', project.title)}
                  onCollaborate={() => console.log('Collaborate on project:', project.title)}
                  onDetails={() => console.log('View details:', project.title)}
                  onBuyKeys={() => console.log('Buy keys for project:', project.title, 'at price:', project.keyPrice)}
                  onNotify={() => console.log('Notify for project:', project.title)}
                  onShare={() => console.log('Share project:', project.title)}
                />
              ))}
            </div>
          </div>

          {/* Right: Creator Profile Cards */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">👤</span>
              Creator Profile Cards
            </h2>
            <div className="space-y-4">
              {mockCreators.map(creator => (
                <CreatorProfileCard
                  key={creator.id}
                  creator={creator}
                  onBuyKeys={() => console.log('Buy keys from creator:', creator.name, 'at price:', creator.keyPrice)}
                  onInvite={() => console.log('Invite creator:', creator.name)}
                  onDetails={() => console.log('View creator details:', creator.name)}
                  onNotify={() => console.log('Notify for creator:', creator.name)}
                  onShare={() => console.log('Share creator profile:', creator.name)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Notes */}
        <div className="mt-12 p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800">
          <h3 className="text-xl font-bold text-white mb-4">Design Comparison</h3>

          {/* Key Concept */}
          <div className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <p className="text-sm text-orange-300 leading-relaxed">
              <span className="font-bold">Key Concept:</span> Both Project cards and Creator profile cards now share the same bonding curve system.
              Each has a <span className="font-semibold">Buy Keys</span> button that shows the current key price in SOL (◎), displays
              the number of key holders with the orange Zap icon (⚡), shows a <span className="font-semibold">Conviction progress bar</span>,
              and includes a <span className="font-semibold">Notification bell</span> for updates. This unified approach means every entity on LaunchOS has its own tradeable keys!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-violet-400 mb-2">Project Cards Have:</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Upvote + Comment buttons (left column)</li>
                <li>• Status badges (LIVE/UPCOMING)</li>
                <li>• Scope badges (ICM/CCM)</li>
                <li>• Conviction progress bar</li>
                <li>• Pool % and Fees %</li>
                <li>• Key holders count (orange Zap icon)</li>
                <li>• Buy Keys button with price (◎ SOL symbol)</li>
                <li>• Collaborate button</li>
                <li>• Notification bell</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Creator Cards Have:</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Social links (Twitter/Website in left column)</li>
                <li>• Verified checkmark overlay on avatar</li>
                <li>• Badge tags (Builder, Developer, etc.)</li>
                <li>• User handle (@username)</li>
                <li>• Followers count</li>
                <li>• Projects count</li>
                <li>• Key holders count (orange Zap icon)</li>
                <li>• Conviction progress bar</li>
                <li>• Buy Keys button with price (◎ SOL symbol)</li>
                <li>• Invite button (instead of Collaborate)</li>
                <li>• Notification bell</li>
                <li>• No status/scope badges</li>
                <li>• No pool/fees percentages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
