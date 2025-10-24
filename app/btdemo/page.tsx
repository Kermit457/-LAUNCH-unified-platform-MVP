'use client'

import React, { useState, memo } from 'react'
import { UnifiedCard } from '@/components/UnifiedCard'
import { cn } from '@/lib/cn'
import {
  // Platform & Social Icons (4)
  IconTwitter,
  IconTelegram,
  IconDiscord,
  IconGithub,

  // Action Icons (10)
  IconLightning,
  IconCollabExpand,
  IconPriceUp,
  IconPriceDown,
  IconUpvote,
  IconFreeze,
  IconClose,
  IconDeposit,
  IconWithdraw,
  IconNetwork,

  // Motion System (5)
  IconMotion,
  IconMotion1,
  IconMotion2,
  IconMotion4,
  IconMotion5,

  // Navigation (5)
  IconMenu,
  IconNavArrowUp,
  IconNavArrowDown,
  IconNavArrowLeft,
  IconNavArrowRight,

  // Badges (3)
  IconContributorBubble,
  IconActivityBadge,
  IconMotionScoreBadge,

  // Achievements (5)
  IconTopPerformer,
  IconTrophy,
  IconGem,
  IconLab,
  IconVerified,

  // Crypto (2)
  IconUsdc,
  IconSolana,

  // Stats (5)
  IconRocket,
  IconCash,
  IconCap,
  IconGuide,
  IconWeb,

  // Visualizations (2)
  IconMotionBar,
  IconChartAnimation,

  // Utility (9)
  IconMessage,
  IconChat,
  IconWallet,
  IconComputer,
  IconAim,
  IconInfo,
  IconNotification,
  IconSearch,
  IconAttention,

  // Community (1)
  IconCult,
} from '@/lib/icons'

// Types
type TabType = 'overview' | 'icons' | 'components' | 'interactions'

// Helper to format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Color schemes for each type
const colorSchemes = {
  icm: {
    name: 'Project',
    emoji: '💼',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    badgeIcon: IconCash,
  },
  ccm: {
    name: 'Creator',
    emoji: '🎥',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    badgeIcon: IconComputer,
  },
  meme: {
    name: 'Meme',
    emoji: '🔥',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    badgeIcon: IconRocket,
  }
} as const

interface ProjectData {
  id: string
  name: string
  subtitle: string
  motionScore: number
  price: number
  priceChange: number
  marketCap: string
  volume: string
  contributors: number
  upvotes: number
  comments: number
  isVerified: boolean
  isTopPerformer: boolean
  isPremium: boolean
  isFrozen: boolean
}

// Sample data
const sampleProjects: ProjectData[] = [
  {
    id: '1',
    name: 'Project Nebula',
    subtitle: 'DeFi Yield Optimizer',
    motionScore: 95,
    price: 0.42,
    priceChange: 15.3,
    marketCap: '1.2M',
    volume: '340K',
    contributors: 247,
    upvotes: 324,
    comments: 89,
    isVerified: true,
    isTopPerformer: true,
    isPremium: true,
    isFrozen: false
  },
  {
    id: '2',
    name: 'Alpha Protocol',
    subtitle: 'Cross-chain Bridge',
    motionScore: 78,
    price: 1.85,
    priceChange: -5.2,
    marketCap: '4.5M',
    volume: '890K',
    contributors: 158,
    upvotes: 567,
    comments: 134,
    isVerified: true,
    isTopPerformer: false,
    isPremium: false,
    isFrozen: false
  },
  {
    id: '3',
    name: 'Frozen Asset',
    subtitle: 'Locked Liquidity Pool',
    motionScore: 42,
    price: 0.15,
    priceChange: 0,
    marketCap: '320K',
    volume: '0',
    contributors: 45,
    upvotes: 89,
    comments: 23,
    isVerified: false,
    isTopPerformer: false,
    isPremium: false,
    isFrozen: true
  }
]

// Motion Score Component
const MotionScoreDisplay = memo(({ score }: { score: number }) => {
  const getMotionLevel = (score: number) => {
    if (score <= 20) return { Icon: IconMotion1, color: 'text-[#FF005C]', label: 'Low' }
    if (score <= 40) return { Icon: IconMotion2, color: 'text-orange-500', label: 'Medium-Low' }
    if (score <= 60) return { Icon: IconMotion, color: 'text-yellow-500', label: 'Medium' }
    if (score <= 80) return { Icon: IconMotion4, color: 'text-lime-500', label: 'High' }
    return { Icon: IconMotion5, color: 'text-[#D1FD0A]', label: 'Extreme', glow: true }
  }

  const level = getMotionLevel(score)
  const { Icon } = level

  return (
    <div className="p-4 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
      <div className="flex items-center gap-3">
        {/* Main Motion Icon */}
        <Icon className={level.color} size={32} />

        {/* Progress Bar */}
        <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
          />
        </div>

        {/* Number Display */}
        <div className="font-led-dot text-3xl text-primary">{score}</div>
      </div>
    </div>
  )
})
MotionScoreDisplay.displayName = 'MotionScoreDisplay'

// Project Card Component
const ProjectCard = memo(({ project }: { project: ProjectData }) => (
  <article className="glass-premium p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/50 transition-all border-2 border-primary/50 hover:border-primary">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center token-logo-glow">
            <IconMotion className="icon-primary" size={32} />
          </div>
          <IconMotionScoreBadge
            score={project.motionScore}
            size={30}
            className="absolute -bottom-2 -right-2"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="card-title">{project.name}</h3>
            {project.isVerified && <IconLab className="text-[#D1FD0A]" size={16} />}
            {project.isTopPerformer && <IconTopPerformer className="text-[#D1FD0A]" size={16} />}
          </div>
          <p className="card-subtitle">{project.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="icon-interactive">
          <IconCollabExpand size={20} />
        </button>
        <button className="icon-interactive-primary">
          <IconLightning size={20} />
        </button>
      </div>
    </div>

    {/* Motion Score */}
    <MotionScoreDisplay score={project.motionScore} />

    {/* Metrics Grid */}
    <div className="grid grid-cols-2 gap-3 my-4">
      <div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
        <div className="flex items-center gap-2 mb-1">
          <IconUsdc size={16} className="icon-muted" />
          <span className="stat-label">Price</span>
        </div>
        <div className="font-led-dot text-xl text-primary">${project.price.toFixed(2)}</div>
        <div className="flex items-center gap-1 text-xs">
          {project.priceChange > 0 ? (
            <>
              <IconPriceUp size={10} className="text-green-400" />
              <span className="text-green-400">+{project.priceChange}%</span>
            </>
          ) : (
            <span className="text-[#FF005C]">{project.priceChange}%</span>
          )}
        </div>
      </div>

      <div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
        <div className="flex items-center gap-2 mb-1">
          <IconCap size={16} className="icon-muted" />
          <span className="stat-label">Market Cap</span>
        </div>
        <div className="font-led-dot text-xl text-primary">${project.marketCap}</div>
        <div className="flex items-center gap-1 text-xs">
          <IconSolana size={10} className="icon-muted" />
          <span className="text-zinc-400">SOL</span>
        </div>
      </div>

      <div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
        <div className="flex items-center gap-2 mb-1">
          <IconCash size={16} className="icon-muted" />
          <span className="stat-label">24h Volume</span>
        </div>
        <div className="font-led-dot text-xl text-primary">${project.volume}</div>
        <div className="flex items-center gap-1 text-xs text-green-400">
          <IconChartAnimation size={10} />
          <span>Active</span>
        </div>
      </div>

      <div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
        <div className="flex items-center gap-2 mb-1">
          <IconContributorBubble size={16} className="icon-muted" />
          <span className="stat-label">Contributors</span>
        </div>
        <div className="font-led-dot text-xl text-primary">{project.contributors}</div>
        <div className="flex items-center gap-1 text-xs">
          <IconActivityBadge size={10} className="icon-muted" />
          <span className="text-zinc-400">+12 today</span>
        </div>
      </div>
    </div>

    {/* Status Badges */}
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <div className="badge-success flex items-center gap-1">
        <IconRocket size={12} />
        <span>Launched</span>
      </div>
      {project.isTopPerformer && (
        <div className="badge-primary flex items-center gap-1">
          <IconTrophy size={12} />
          <span>Top 10</span>
        </div>
      )}
      {project.isPremium && (
        <div className="badge-primary flex items-center gap-1">
          <IconGem size={12} />
          <span>Premium</span>
        </div>
      )}
      {project.isFrozen ? (
        <div className="badge-warning flex items-center gap-1">
          <IconFreeze size={12} />
          <span>Frozen</span>
        </div>
      ) : (
        <div className="badge-warning flex items-center gap-1">
          <IconAttention size={12} />
          <span>High Activity</span>
        </div>
      )}
    </div>

    {/* Engagement Stats */}
    <div className="flex items-center justify-between mb-4 p-3 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 icon-interactive-primary group">
          <IconUpvote size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-led-dot text-xl text-primary">{project.upvotes}</span>
        </button>

        <button className="flex items-center gap-2 icon-interactive">
          <IconMessage size={20} />
          <span className="font-led-dot text-xl text-primary">{project.comments}</span>
        </button>

        <button className="flex items-center gap-2 icon-interactive">
          <IconAim size={20} />
          <span className="text-xs text-zinc-400">Watch</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <IconComputer className="icon-muted" size={16} />
        <span className="text-xs text-zinc-400">Updated 2h ago</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="grid grid-cols-2 gap-3">
      <button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2">
        <IconLightning size={20} className="text-black" />
        <span className="text-black">Quick Buy</span>
      </button>
      <button className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center gap-2">
        <IconCollabExpand size={20} className="text-[#D1FD0A]" />
        <span className="text-[#D1FD0A]">View Details</span>
      </button>
    </div>

    {/* Social Links */}
    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-zinc-800">
      <a href="#" className="icon-interactive-primary">
        <IconWeb size={20} />
      </a>
      <a href="#" className="icon-interactive">
        <IconTwitter size={20} />
      </a>
      <a href="#" className="icon-interactive">
        <IconTelegram size={20} />
      </a>
      <a href="#" className="icon-interactive">
        <IconDiscord size={20} />
      </a>
      <a href="#" className="icon-interactive">
        <IconGithub size={20} />
      </a>
    </div>
  </article>
))
ProjectCard.displayName = 'ProjectCard'

// Icon Grid Component for Icons Tab
const IconGrid = memo(() => {
  // Icon Mapping Data
  const matchedIcons = [
    {
      customIcon: { Icon: IconCash, name: 'IconCash' },
      currentUsage: 'Volume display',
      status: 'correct',
      location: '/discover, /profile',
      lucideIcon: 'Lucide DollarSign/Volume'
    },
    {
      customIcon: { Icon: IconContributorBubble, name: 'IconContributorBubble' },
      currentUsage: 'Contributors count',
      status: 'correct',
      location: '/discover',
      lucideIcon: 'Lucide Users'
    },
    {
      customIcon: { Icon: IconPriceUp, name: 'IconPriceUp' },
      currentUsage: 'Price change indicator',
      status: 'warning',
      location: '/discover, /btdemo',
      lucideIcon: 'Lucide TrendingUp',
      suggestion: 'Consider using IconChartAnimation for price trends'
    },
    {
      customIcon: { Icon: IconMotion, name: 'IconMotion' },
      currentUsage: 'Motion score display',
      status: 'correct',
      location: 'All pages',
      lucideIcon: 'Custom only'
    },
    {
      customIcon: { Icon: IconLightning, name: 'IconLightning' },
      currentUsage: 'Quick actions, primary CTAs',
      status: 'correct',
      location: '/discover, /clip, /btdemo',
      lucideIcon: 'Lucide Zap'
    },
    {
      customIcon: { Icon: IconWallet, name: 'IconWallet' },
      currentUsage: 'Wallet connect button',
      status: 'correct',
      location: '/btdemo, /profile',
      lucideIcon: 'Lucide Wallet'
    },
    {
      customIcon: { Icon: IconSearch, name: 'IconSearch' },
      currentUsage: 'Search input',
      status: 'correct',
      location: '/discover, /clip, /btdemo',
      lucideIcon: 'Lucide Search'
    },
    {
      customIcon: { Icon: IconUpvote, name: 'IconUpvote' },
      currentUsage: 'Upvote/like actions',
      status: 'correct',
      location: '/discover',
      lucideIcon: 'Lucide ThumbsUp/Heart'
    },
    {
      customIcon: { Icon: IconMessage, name: 'IconMessage' },
      currentUsage: 'Comments/chat',
      status: 'correct',
      location: '/discover, /chat',
      lucideIcon: 'Lucide MessageCircle'
    },
    {
      customIcon: { Icon: IconNotification, name: 'IconNotification' },
      currentUsage: 'Notifications bell',
      status: 'correct',
      location: '/btdemo',
      lucideIcon: 'Lucide Bell'
    }
  ]

  const unmatchedIcons = [
    {
      Icon: IconVerified,
      name: 'IconVerified',
      suggestedUse: 'Verified projects, official badges, authenticated accounts',
      category: 'Achievements',
      priority: 'high'
    },
    {
      Icon: IconCult,
      name: 'IconCult',
      suggestedUse: 'Community cult following, viral projects, strong community indicators',
      category: 'Community',
      priority: 'high'
    },
    {
      Icon: IconPriceDown,
      name: 'IconPriceDown',
      suggestedUse: 'Negative price movement, downtrend indicators',
      category: 'Actions',
      priority: 'high'
    },
    {
      Icon: IconChat,
      name: 'IconChat',
      suggestedUse: 'Community chat, discussions, messaging features',
      category: 'Utility',
      priority: 'high'
    },
    {
      Icon: IconMotionBar,
      name: 'IconMotionBar',
      suggestedUse: 'Motion score visualizations, analytics charts, trend displays',
      category: 'Visualizations',
      priority: 'high'
    },
    {
      Icon: IconChartAnimation,
      name: 'IconChartAnimation',
      suggestedUse: 'Price charts, trading views, analytics dashboards',
      category: 'Visualizations',
      priority: 'high'
    },
    {
      Icon: IconGuide,
      name: 'IconGuide',
      suggestedUse: 'Launch status, new projects, trending items, featured content',
      category: 'Stats',
      priority: 'high'
    },
    {
      Icon: IconCollabExpand,
      name: 'IconCollabExpand',
      suggestedUse: 'Expand details, view more, full screen mode',
      category: 'Actions',
      priority: 'medium'
    },
    {
      Icon: IconFreeze,
      name: 'IconFreeze',
      suggestedUse: 'Freeze trading, pause actions, locked states',
      category: 'Actions',
      priority: 'high'
    },
    {
      Icon: IconDeposit,
      name: 'IconDeposit',
      suggestedUse: 'Deposit funds, add liquidity, incoming transfers',
      category: 'Actions',
      priority: 'high'
    },
    {
      Icon: IconWithdraw,
      name: 'IconWithdraw',
      suggestedUse: 'Withdraw funds, remove liquidity, outgoing transfers',
      category: 'Actions',
      priority: 'high'
    },
    {
      Icon: IconClose,
      name: 'IconClose',
      suggestedUse: 'Close modals, dismiss notifications, cancel actions',
      category: 'Actions',
      priority: 'medium'
    },
    {
      Icon: IconMotion1,
      name: 'IconMotion1',
      suggestedUse: 'Low motion indicator (0-20)',
      category: 'Motion System',
      priority: 'low'
    },
    {
      Icon: IconMotion2,
      name: 'IconMotion2',
      suggestedUse: 'Medium-low motion indicator (21-40)',
      category: 'Motion System',
      priority: 'low'
    },
    {
      Icon: IconMotion4,
      name: 'IconMotion4',
      suggestedUse: 'High motion indicator (61-80)',
      category: 'Motion System',
      priority: 'low'
    },
    {
      Icon: IconMotion5,
      name: 'IconMotion5',
      suggestedUse: 'Extreme motion indicator (81-100)',
      category: 'Motion System',
      priority: 'low'
    },
    {
      Icon: IconMenu,
      name: 'IconMenu',
      suggestedUse: 'Mobile menu toggle, navigation drawer',
      category: 'Navigation',
      priority: 'medium'
    },
    {
      Icon: IconNavArrowUp,
      name: 'IconNavArrowUp',
      suggestedUse: 'Scroll to top, collapse sections, sort ascending',
      category: 'Navigation',
      priority: 'low'
    },
    {
      Icon: IconNavArrowDown,
      name: 'IconNavArrowDown',
      suggestedUse: 'Expand sections, dropdown menus, sort descending',
      category: 'Navigation',
      priority: 'low'
    },
    {
      Icon: IconNavArrowLeft,
      name: 'IconNavArrowLeft',
      suggestedUse: 'Back navigation, previous slide, left scroll',
      category: 'Navigation',
      priority: 'low'
    },
    {
      Icon: IconNavArrowRight,
      name: 'IconNavArrowRight',
      suggestedUse: 'Forward navigation, next slide, right scroll',
      category: 'Navigation',
      priority: 'low'
    },
    {
      Icon: IconTopPerformer,
      name: 'IconTopPerformer',
      suggestedUse: 'Top 10 badges, leaderboard positions, high performers',
      category: 'Achievements',
      priority: 'medium'
    },
    {
      Icon: IconTrophy,
      name: 'IconTrophy',
      suggestedUse: 'Winner badges, achievements, milestones',
      category: 'Achievements',
      priority: 'medium'
    },
    {
      Icon: IconGem,
      name: 'IconGem',
      suggestedUse: 'Premium features, special items, rewards',
      category: 'Achievements',
      priority: 'medium'
    },
    {
      Icon: IconLab,
      name: 'IconLab',
      suggestedUse: 'Building status - projects under active construction/development',
      category: 'Stats',
      priority: 'high'
    },
    {
      Icon: IconActivityBadge,
      name: 'IconActivityBadge',
      suggestedUse: 'Activity indicators, engagement metrics',
      category: 'Badges',
      priority: 'medium'
    },
    {
      Icon: IconMotionScoreBadge,
      name: 'IconMotionScoreBadge',
      suggestedUse: 'Motion score badges with dynamic values',
      category: 'Badges',
      priority: 'high'
    },
    {
      Icon: IconRocket,
      name: 'IconRocket',
      suggestedUse: 'Rocket icon for rapid growth, explosive launches, moonshot projects',
      category: 'Stats',
      priority: 'medium'
    },
    {
      Icon: IconCap,
      name: 'IconCap',
      suggestedUse: 'Market cap display, total value indicators',
      category: 'Stats',
      priority: 'high'
    },
    {
      Icon: IconWeb,
      name: 'IconWeb',
      suggestedUse: 'Website links, external resources, web3 connections',
      category: 'Stats',
      priority: 'medium'
    },
    {
      Icon: IconUsdc,
      name: 'IconUsdc',
      suggestedUse: 'USDC token displays, stablecoin indicators',
      category: 'Crypto',
      priority: 'high'
    },
    {
      Icon: IconSolana,
      name: 'IconSolana',
      suggestedUse: 'SOL token displays, Solana network indicators',
      category: 'Crypto',
      priority: 'high'
    },
    {
      Icon: IconComputer,
      name: 'IconComputer',
      suggestedUse: 'System updates, tech indicators, automation',
      category: 'Utility',
      priority: 'low'
    },
    {
      Icon: IconAim,
      name: 'IconAim',
      suggestedUse: 'Target actions, watchlists, focus indicators',
      category: 'Utility',
      priority: 'medium'
    },
    {
      Icon: IconInfo,
      name: 'IconInfo',
      suggestedUse: 'Info tooltips, help text, documentation links',
      category: 'Utility',
      priority: 'medium'
    },
    {
      Icon: IconAttention,
      name: 'IconAttention',
      suggestedUse: 'Warnings, important notices, alerts',
      category: 'Utility',
      priority: 'medium'
    },
    {
      Icon: IconTwitter,
      name: 'IconTwitter',
      suggestedUse: 'Twitter/X social links',
      category: 'Social',
      priority: 'high'
    },
    {
      Icon: IconTelegram,
      name: 'IconTelegram',
      suggestedUse: 'Telegram group links',
      category: 'Social',
      priority: 'high'
    },
    {
      Icon: IconDiscord,
      name: 'IconDiscord',
      suggestedUse: 'Discord server links',
      category: 'Social',
      priority: 'high'
    },
    {
      Icon: IconGithub,
      name: 'IconGithub',
      suggestedUse: 'GitHub repository links, code resources',
      category: 'Social',
      priority: 'medium'
    }
  ]

  const iconCategories = [
    {
      title: 'Community',
      icons: [
        { Icon: IconCult, name: 'Cult Following' },
      ]
    },
    {
      title: 'Platform & Social',
      icons: [
        { Icon: IconTwitter, name: 'Twitter' },
        { Icon: IconTelegram, name: 'Telegram' },
        { Icon: IconDiscord, name: 'Discord' },
        { Icon: IconGithub, name: 'GitHub' },
      ]
    },
    {
      title: 'Actions',
      icons: [
        { Icon: IconLightning, name: 'Lightning' },
        { Icon: IconCollabExpand, name: 'Expand' },
        { Icon: IconPriceUp, name: 'Price Up' },
        { Icon: IconPriceDown, name: 'Price Down' },
        { Icon: IconUpvote, name: 'Upvote' },
        { Icon: IconFreeze, name: 'Freeze' },
        { Icon: IconClose, name: 'Close' },
        { Icon: IconDeposit, name: 'Deposit' },
        { Icon: IconWithdraw, name: 'Withdraw' },
        { Icon: IconNetwork, name: 'Network' },
      ]
    },
    {
      title: 'Motion System',
      icons: [
        { Icon: IconMotion, name: 'Motion' },
        { Icon: IconMotion1, name: 'Motion 1' },
        { Icon: IconMotion2, name: 'Motion 2' },
        { Icon: IconMotion4, name: 'Motion 4' },
        { Icon: IconMotion5, name: 'Motion 5' },
      ]
    },
    {
      title: 'Navigation',
      icons: [
        { Icon: IconMenu, name: 'Menu' },
        { Icon: IconNavArrowUp, name: 'Arrow Up' },
        { Icon: IconNavArrowDown, name: 'Arrow Down' },
        { Icon: IconNavArrowLeft, name: 'Arrow Left' },
        { Icon: IconNavArrowRight, name: 'Arrow Right' },
      ]
    },
    {
      title: 'Achievements & Badges',
      icons: [
        { Icon: IconVerified, name: 'Verified' },
        { Icon: IconTopPerformer, name: 'Top Performer' },
        { Icon: IconTrophy, name: 'Trophy' },
        { Icon: IconGem, name: 'Gem' },
        { Icon: IconLab, name: 'Lab Verified' },
        { Icon: IconContributorBubble, name: 'Contributors' },
        { Icon: IconActivityBadge, name: 'Activity' },
        { Icon: IconMotionScoreBadge, name: 'Motion Score', props: { score: 85 } },
      ]
    },
    {
      title: 'Stats & Data',
      icons: [
        { Icon: IconRocket, name: 'Rocket' },
        { Icon: IconCash, name: 'Cash' },
        { Icon: IconCap, name: 'Market Cap' },
        { Icon: IconGuide, name: 'Guide' },
        { Icon: IconWeb, name: 'Website' },
        { Icon: IconMotionBar, name: 'Motion Bar' },
        { Icon: IconChartAnimation, name: 'Chart' },
      ]
    },
    {
      title: 'Crypto',
      icons: [
        { Icon: IconUsdc, name: 'USDC' },
        { Icon: IconSolana, name: 'Solana' },
      ]
    },
    {
      title: 'Utility',
      icons: [
        { Icon: IconMessage, name: 'Message' },
        { Icon: IconChat, name: 'Chat' },
        { Icon: IconWallet, name: 'Wallet' },
        { Icon: IconComputer, name: 'Computer' },
        { Icon: IconAim, name: 'Aim' },
        { Icon: IconInfo, name: 'Info' },
        { Icon: IconNotification, name: 'Notification' },
        { Icon: IconSearch, name: 'Search' },
        { Icon: IconAttention, name: 'Attention' },
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* MATCHED ICONS SECTION */}
      <div className="glass-premium p-6 rounded-3xl border-2 border-[#00FF88]/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#00FF88] animate-pulse" />
          <h3 className="text-2xl font-bold text-[#00FF88]">Matched Icons - Currently in Use</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-6">
          Icons that are actively used in the application. Status indicators show correct usage vs. needs replacement.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {matchedIcons.map((item, idx) => (
            <div
              key={idx}
              className={`glass-interactive p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                item.status === 'correct'
                  ? 'border-[#00FF88]/40 hover:border-[#00FF88]/60'
                  : 'border-yellow-500/40 hover:border-yellow-500/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="glass-interactive p-3 rounded-xl border border-primary/20">
                    <item.customIcon.Icon size={40} className="icon-primary" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-white">{item.customIcon.name}</span>
                    {item.status === 'correct' ? (
                      <span className="badge-success flex items-center gap-1 text-[10px]">
                        <IconLab size={10} />
                        Correct Match
                      </span>
                    ) : (
                      <span className="badge-warning flex items-center gap-1 text-[10px]">
                        <IconAttention size={10} />
                        Needs Review
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Usage:</span>
                      <span>{item.currentUsage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Location:</span>
                      <span className="font-mono text-[10px]">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Replaces:</span>
                      <span className="font-mono text-[10px]">{item.lucideIcon}</span>
                    </div>
                    {item.suggestion && (
                      <div className="mt-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                        <span className="text-yellow-400 text-[10px]">{item.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UNMATCHED ICONS SECTION */}
      <div className="glass-premium p-6 rounded-3xl border-2 border-cyan-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="text-2xl font-bold text-cyan-400">Available Icons - Not Yet Used</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-6">
          Custom icons ready for implementation. Priority indicates recommended implementation order.
        </p>

        {/* Group by category */}
        {['Community', 'Visualizations', 'Actions', 'Crypto', 'Stats', 'Social', 'Achievements', 'Badges', 'Motion System', 'Navigation', 'Utility'].map((category) => {
          const categoryIcons = unmatchedIcons.filter(icon => icon.category === category)
          if (categoryIcons.length === 0) return null

          return (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="text-sm font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryIcons.map((item, idx) => (
                  <div
                    key={idx}
                    className={`glass-interactive p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                      item.priority === 'high'
                        ? 'border-[#FF005C]/30 hover:border-[#FF005C]/50'
                        : item.priority === 'medium'
                        ? 'border-yellow-500/30 hover:border-yellow-500/50'
                        : 'border-zinc-700/30 hover:border-zinc-600/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="glass-interactive p-2 rounded-lg">
                          <item.Icon size={24} className="icon-interactive-primary" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-white">{item.name}</span>
                          <span
                            className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                              item.priority === 'high'
                                ? 'bg-[#FF005C]/20 text-[#FF005C]'
                                : item.priority === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-zinc-700/50 text-zinc-400'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">{item.suggestedUse}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ORIGINAL ICON LIBRARY SECTIONS */}
      <div className="pt-6 border-t border-zinc-800">
        <h3 className="text-2xl font-bold mb-6 text-primary">Complete Icon Library</h3>
        <div className="space-y-8">
          {iconCategories.map((category) => (
            <div key={category.title} className="glass-premium p-6 rounded-3xl">
              <h3 className="text-xl font-bold mb-4 text-primary">{category.title}</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {category.icons.map(({ Icon, name, props }) => (
                  <div
                    key={name}
                    className="glass-interactive p-4 rounded-xl flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer group"
                  >
                    <Icon
                      size={32}
                      className="icon-interactive-primary group-hover:text-primary transition-colors"
                      {...(props || {})}
                    />
                    <span className="text-xs text-zinc-400 text-center">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
IconGrid.displayName = 'IconGrid'

export default function BTDemoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: IconMotion },
    { id: 'icons', label: 'Icons', icon: IconGem },
    { id: 'components', label: 'Components', icon: IconComputer },
    { id: 'interactions', label: 'Interactions', icon: IconLightning },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Blob Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[325px] h-[325px] rounded-full bg-primary/20 blur-[125px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[325px] h-[325px] rounded-full bg-primary/15 blur-[125px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full glass-premium border-b border-zinc-800 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <button className="icon-interactive-primary">
            <IconMenu size={24} />
          </button>

          <div className="flex items-center gap-2">
            <IconMotion className="icon-primary" size={24} />
            <span className="font-led-dot text-3xl text-primary">ICM MOTION</span>
          </div>

          <div className="flex-1 max-w-md mx-8 relative">
            <IconSearch className="icon-muted absolute left-3 top-1/2 -translate-y-1/2" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10 w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="icon-interactive-primary relative">
              <IconNotification size={24} className="text-[#D1FD0A]" />
              <span className="bg-[#D1FD0A] text-black absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>

            <button
              className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center gap-2"
              onClick={() => setWalletConnected(!walletConnected)}
            >
              <IconWallet size={20} className="text-black" />
              <span>{walletConnected ? 'Connected' : 'Connect Wallet'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        {/* Hero Stats */}
        <section className="glass-premium p-8 rounded-3xl mb-8">
          <h2 className="section-heading mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-interactive p-6 rounded-2xl group hover:border-primary transition-all border border-zinc-800/50">
              <div className="flex items-center justify-between mb-3">
                <IconMotion className="icon-primary group-hover:scale-110 transition-transform" size={32} />
                <IconNavArrowUp className="icon-muted" size={16} />
              </div>
              <div className="font-led-dot text-5xl text-primary">847</div>
              <div className="stat-label">Total Projects</div>
              <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
                <IconPriceUp size={12} />
                <span>+12.5%</span>
              </div>
            </div>

            <div className="glass-interactive p-6 rounded-2xl group hover:border-primary transition-all border border-zinc-800/50">
              <div className="flex items-center justify-between mb-3">
                <IconRocket className="icon-primary group-hover:animate-pulse" size={32} />
                <IconMotionBar className="icon-muted" size={16} />
              </div>
              <div className="font-led-dot text-5xl text-primary">124</div>
              <div className="stat-label">Active Launches</div>
              <div className="flex items-center gap-2 mt-2">
                <IconLightning className="text-yellow-400" size={12} />
                <span className="text-xs text-zinc-400">18 in last 24h</span>
              </div>
            </div>

            <div className="glass-interactive p-6 rounded-2xl group hover:border-primary transition-all border border-zinc-800/50">
              <div className="flex items-center justify-between mb-3">
                <IconCash className="icon-primary group-hover:scale-110 transition-transform" size={32} />
                <IconUsdc size={20} className="icon-muted" />
              </div>
              <div className="font-led-dot text-5xl text-primary">$2.4M</div>
              <div className="stat-label">24h Volume</div>
              <div className="flex items-center gap-1 text-sm text-green-400 mt-2">
                <IconPriceUp size={12} />
                <span>+8.3%</span>
              </div>
            </div>

            <div className="glass-interactive p-6 rounded-2xl group hover:border-primary transition-all border border-zinc-800/50">
              <div className="flex items-center justify-between mb-3">
                <IconCap className="icon-primary group-hover:rotate-12 transition-transform" size={32} />
                <IconSolana size={20} className="icon-muted" />
              </div>
              <div className="font-led-dot text-5xl text-primary">$45M</div>
              <div className="stat-label">Total Market Cap</div>
              <div className="flex items-center gap-2 mt-2">
                <IconChartAnimation className="text-cyan-400" size={12} />
                <span className="text-xs text-zinc-400">Live tracking</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 mb-6">
          {tabs.map(({ id, label, icon: TabIcon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all group ${
                activeTab === id
                  ? 'glass-premium border border-primary text-[#D1FD0A]'
                  : 'glass-interactive text-zinc-400 hover:text-[#D1FD0A] hover:shadow-[0_0_20px_rgba(209,253,10,0.3)]'
              }`}
            >
              <TabIcon size={20} className={activeTab === id ? 'text-[#D1FD0A]' : 'text-zinc-400 group-hover:text-[#D1FD0A]'} />
              <span className={activeTab === id ? 'text-[#D1FD0A]' : 'group-hover:text-[#D1FD0A]'}>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Filters Bar */}
            <div className="glass-premium p-4 rounded-2xl flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button className="badge-primary">All Projects</button>
                <button className="badge-primary flex items-center gap-2">
                  <IconLab size={16} />
                  <span>Verified</span>
                </button>
                <button className="badge-primary flex items-center gap-2">
                  <IconTopPerformer size={16} />
                  <span>Top Performers</span>
                </button>
                <button className="badge-primary flex items-center gap-2">
                  <IconGem size={16} />
                  <span>Premium</span>
                </button>
                <button className="badge-primary flex items-center gap-2">
                  <IconMotion5 size={16} />
                  <span>High Motion</span>
                </button>
                <button className="badge-warning flex items-center gap-2">
                  <IconFreeze size={16} />
                  <span>Frozen</span>
                </button>
              </div>

              <div className="relative">
                <button
                  className="glass-interactive px-4 py-2 rounded-xl flex items-center gap-2"
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  <IconMotionScoreBadge score={85} size={28} />
                  <span>Motion Score</span>
                  <IconNavArrowDown
                    size={16}
                    className={`icon-interactive transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {sortOpen && (
                  <div className="absolute top-full mt-2 right-0 glass-premium rounded-xl p-2 min-w-[200px] z-20">
                    <button className="list-item flex items-center gap-2 w-full">
                      <IconMotionScoreBadge score="M" size={24} />
                      <span>Motion Score</span>
                    </button>
                    <button className="list-item flex items-center gap-2 w-full">
                      <IconPriceUp size={20} />
                      <span>Price Change</span>
                    </button>
                    <button className="list-item flex items-center gap-2 w-full">
                      <IconCap size={20} />
                      <span>Market Cap</span>
                    </button>
                    <button className="list-item flex items-center gap-2 w-full">
                      <IconCash size={20} />
                      <span>Volume</span>
                    </button>
                    <button className="list-item flex items-center gap-2 w-full">
                      <IconUpvote size={20} />
                      <span>Most Upvoted</span>
                    </button>
                    <button className="list-item flex items-center gap-2 w-full">
                      <IconRocket size={20} />
                      <span>Newest</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sampleProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Wallet Actions Panel */}
            <aside className="fixed right-6 top-24 w-80 glass-premium p-6 rounded-3xl hidden xl:block">
              <div className="flex items-center gap-3 mb-6">
                <IconWallet className="icon-primary" size={32} />
                <div>
                  <h3 className="card-title">Wallet</h3>
                  <p className="card-subtitle">Manage your funds</p>
                </div>
              </div>

              <div className="glass-interactive p-4 rounded-xl mb-4 transition-all border-2 border-primary/50 hover:border-primary">
                <div className="flex items-center justify-between mb-2">
                  <span className="stat-label">Total Balance</span>
                  <IconInfo className="icon-muted" size={16} />
                </div>
                <div className="font-led-dot text-5xl text-primary">$12,450</div>
                <div className="flex items-center gap-2 mt-2">
                  <IconSolana size={16} />
                  <span className="text-sm text-zinc-400">342.5 SOL</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2">
                  <IconDeposit size={20} />
                  <span>Deposit</span>
                </button>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-primary/50 hover:border-primary flex items-center justify-center gap-2">
                  <IconWithdraw size={20} />
                  <span>Withdraw</span>
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconActivityBadge size={20} className="icon-primary" />
                  <h4 className="font-semibold">Recent Activity</h4>
                </div>

                <div className="space-y-2">
                  <div className="list-item flex items-center justify-between transition-all border-2 border-primary/50 hover:border-primary">
                    <div className="flex items-center gap-2">
                      <IconDeposit size={16} className="text-green-400" />
                      <span className="text-sm">Deposited</span>
                    </div>
                    <span className="font-led-dot text-xl text-primary">+100</span>
                  </div>
                  <div className="list-item flex items-center justify-between transition-all border-2 border-primary/50 hover:border-primary">
                    <div className="flex items-center gap-2">
                      <IconLightning size={16} className="text-yellow-400" />
                      <span className="text-sm">Quick Buy</span>
                    </div>
                    <span className="font-led-dot text-xl text-primary">-25</span>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {activeTab === 'icons' && <IconGrid />}

        {activeTab === 'components' && (
          <div className="space-y-6">
            {/* LED Font Comparison */}
            <div className="glass-premium p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-primary">LED Font Comparison</h2>
              <p className="text-sm text-zinc-400 mb-6">Compare DSEG14 Classic vs LED Dot-Matrix for numeric displays</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DSEG14 Classic */}
                <div className="glass-interactive p-6 rounded-2xl border-2 border-primary/40 hover:border-primary">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="font-bold text-white">DSEG14 Classic</h3>
                    <span className="text-xs text-zinc-500">(font-led)</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Motion Score</p>
                      <div className="font-led text-6xl text-primary">87</div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Price</p>
                      <div className="font-led text-4xl text-green-400">$1.234</div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">24h Change</p>
                      <div className="font-led text-3xl text-primary">+45.8%</div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Balance</p>
                      <div className="font-led text-2xl text-white">12,450.50</div>
                    </div>
                  </div>
                </div>

                {/* LED Dot-Matrix */}
                <div className="glass-interactive p-6 rounded-2xl border-2 border-cyan-500/40">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="font-bold text-white">LED Dot-Matrix</h3>
                    <span className="text-xs text-zinc-500">(font-led-dot)</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Motion Score</p>
                      <div className="font-led-dot text-6xl text-primary">87</div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Price</p>
                      <div className="font-led-dot text-4xl text-green-400">$1.234</div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">24h Change</p>
                      <div className="font-led-dot text-3xl text-cyan-400">+45.8%</div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Balance</p>
                      <div className="font-led-dot text-2xl text-white">12,450.50</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Guide */}
              <div className="mt-6 glass-interactive p-4 rounded-xl">
                <h4 className="text-sm font-bold mb-3 text-white flex items-center gap-2">
                  <IconGuide size={16} className="text-primary" />
                  Usage in Code
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500">DSEG14:</span>
                    <code className="text-primary">className="font-led text-4xl"</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500">Dot-Matrix:</span>
                    <code className="text-cyan-400">className="font-led-dot text-4xl"</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-premium p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-primary">Component Showcase</h2>

              {/* Leaderboard */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <IconTrophy className="icon-primary" size={32} />
                    <h3 className="section-heading">Top Performers</h3>
                  </div>
                  <button className="flex items-center gap-2 icon-interactive">
                    <span className="text-sm">View All</span>
                    <IconNavArrowRight size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((rank) => (
                    <div key={rank} className="glass-interactive p-4 rounded-2xl border-2 border-primary/40 hover:border-primary">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <IconTopPerformer className="icon-primary" size={40} />
                          <span className="absolute -top-2 -right-2 font-led-dot text-xl text-primary">{rank}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">Project #{rank}</h4>
                            <IconLab className="icon-primary" size={14} />
                            <IconGem className="icon-primary" size={14} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <IconMotionScoreBadge score={98 - rank * 5} size={24} />
                            <div className="flex items-center gap-1">
                              <IconUpvote size={14} />
                              <span>{1234 - rank * 100}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-led-dot text-xl text-green-400">+{45.8 - rank * 5}%</div>
                          <div className="flex items-center gap-1 justify-end">
                            <IconPriceUp size={12} className="text-green-400" />
                            <span className="text-xs text-zinc-400">24h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <IconGuide className="icon-primary" size={32} />
                  <h3 className="section-heading">Getting Started</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-interactive p-6 rounded-2xl">
                    <IconWallet className="icon-primary mb-4" size={32} />
                    <h4 className="font-semibold mb-2">Connect Wallet</h4>
                    <p className="text-sm text-zinc-400">Link your Solana wallet to start trading</p>
                  </div>

                  <div className="glass-interactive p-6 rounded-2xl">
                    <IconSearch className="icon-primary mb-4" size={32} />
                    <h4 className="font-semibold mb-2">Discover Projects</h4>
                    <p className="text-sm text-zinc-400">Browse and filter top motion projects</p>
                  </div>

                  <div className="glass-interactive p-6 rounded-2xl">
                    <IconLightning className="icon-primary mb-4" size={32} />
                    <h4 className="font-semibold mb-2">Quick Trade</h4>
                    <p className="text-sm text-zinc-400">Execute instant trades with one click</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interactions' && (
          <div className="glass-premium p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 text-primary">Interactive Elements</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hover States */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Hover Effects</h3>
                <div className="space-y-4">
                  <button className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 w-full flex items-center justify-center gap-2">
                    <IconLightning size={20} />
                    <span>Primary Button (Hover Me)</span>
                  </button>

                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-primary/50 hover:border-primary w-full flex items-center justify-center gap-2">
                    <IconCollabExpand size={20} />
                    <span>Secondary Button</span>
                  </button>

                  <div className="flex gap-4 justify-center">
                    <button className="icon-interactive-primary">
                      <IconMotion size={32} />
                    </button>
                    <button className="icon-interactive">
                      <IconWallet size={32} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Motion Bars */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Motion Visualization</h3>
                <div className="glass-interactive p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <IconChartAnimation className="icon-primary" size={20} />
                    <span className="stat-label">7-Day Motion Trend</span>
                  </div>

                  <div className="flex items-end justify-between gap-1 h-32">
                    {[65, 72, 68, 85, 78, 92, 88].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:from-primary hover:to-primary/80"
                          style={{ height: `${value}%` }}
                        />
                        <span className="text-xs text-zinc-500">{['M','T','W','T','F','S','S'][index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}