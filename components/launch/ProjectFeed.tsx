"use client"

import { TrendingUp, Video, DollarSign, MessageSquare, ArrowUp, Trophy, Sparkles } from 'lucide-react'
import type { FeedProject } from '@/lib/appwrite/services/feed'

// Mock activity data - replace with real data from Appwrite
interface Activity {
  id: string
  type: 'buy' | 'launch' | 'vote' | 'comment' | 'milestone' | 'clip'
  user: {
    name: string
    avatar: string
  }
  project?: {
    name: string
    ticker: string
  }
  amount?: number
  timestamp: number
  value?: number // USD value for sorting by importance
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'buy',
    user: { name: 'CryptoWhale', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=whale' },
    project: { name: 'LaunchOS Platform', ticker: 'LOS' },
    amount: 15.5,
    timestamp: Date.now() - 1000 * 30,
    value: 2500
  },
  {
    id: '2',
    type: 'launch',
    user: { name: 'BuilderDao', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=builder' },
    project: { name: 'DeFi Protocol', ticker: 'DFP' },
    timestamp: Date.now() - 1000 * 60 * 2,
    value: 5000
  },
  {
    id: '3',
    type: 'buy',
    user: { name: 'MegaInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mega' },
    project: { name: 'GameFi Arena', ticker: 'GFA' },
    amount: 22.3,
    timestamp: Date.now() - 1000 * 60 * 4,
    value: 3600
  },
  {
    id: '4',
    type: 'milestone',
    user: { name: 'GameFi Arena', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=game' },
    project: { name: 'GameFi Arena', ticker: 'GFA' },
    timestamp: Date.now() - 1000 * 60 * 6,
    value: 3000
  },
  {
    id: '5',
    type: 'vote',
    user: { name: 'CommunityMod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mod' },
    project: { name: 'DeFi Protocol', ticker: 'DFP' },
    timestamp: Date.now() - 1000 * 60 * 8,
    value: 200
  },
  {
    id: '6',
    type: 'buy',
    user: { name: 'VCInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vc' },
    project: { name: 'SolPump', ticker: 'PUMP' },
    amount: 8.2,
    timestamp: Date.now() - 1000 * 60 * 10,
    value: 1300
  },
  {
    id: '7',
    type: 'clip',
    user: { name: 'ContentCreator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator' },
    project: { name: 'LaunchOS Platform', ticker: 'LOS' },
    timestamp: Date.now() - 1000 * 60 * 12,
    value: 800
  },
  {
    id: '8',
    type: 'buy',
    user: { name: 'DegenTrader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=degen' },
    project: { name: 'SolPump', ticker: 'PUMP' },
    amount: 5.1,
    timestamp: Date.now() - 1000 * 60 * 15,
    value: 820
  },
  {
    id: '9',
    type: 'clip',
    user: { name: 'VideoMaker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=video' },
    project: { name: 'DeFi Protocol', ticker: 'DFP' },
    timestamp: Date.now() - 1000 * 60 * 18,
    value: 650
  },
  {
    id: '10',
    type: 'buy',
    user: { name: 'EarlyAdopter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=early' },
    project: { name: 'GameFi Arena', ticker: 'GFA' },
    amount: 3.7,
    timestamp: Date.now() - 1000 * 60 * 20,
    value: 600
  },
  {
    id: '11',
    type: 'vote',
    user: { name: 'Believer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=belief' },
    project: { name: 'LaunchOS Platform', ticker: 'LOS' },
    timestamp: Date.now() - 1000 * 60 * 22,
    value: 150
  },
  {
    id: '12',
    type: 'buy',
    user: { name: 'SmartMoney', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=smart' },
    project: { name: 'DeFi Protocol', ticker: 'DFP' },
    amount: 12.8,
    timestamp: Date.now() - 1000 * 60 * 25,
    value: 2050
  }
]

function ActivityStream() {
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'buy': return DollarSign
      case 'launch': return Sparkles
      case 'vote': return ArrowUp
      case 'comment': return MessageSquare
      case 'milestone': return Trophy
      case 'clip': return Video
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'buy': return 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/30'
      case 'launch': return 'text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/30'
      case 'vote': return 'text-[#00FFFF] bg-[#00FFFF]/10 border-[#00FFFF]/30'
      case 'comment': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'milestone': return 'text-[#D1FD0A] bg-[#D1FD0A]/10 border-[#D1FD0A]/30'
      case 'clip': return 'text-pink-400 bg-pink-400/10 border-pink-400/30'
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'buy':
        return (
          <>
            bought <span className="font-bold text-[#00FF88]">◎{activity.amount}</span> of{' '}
            <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'launch':
        return (
          <>
            launched <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'milestone':
        return (
          <>
            <span className="font-bold">{activity.project?.name}</span> reached graduation milestone
          </>
        )
      case 'clip':
        return (
          <>
            created a clip for <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      case 'vote':
        return (
          <>
            upvoted <span className="font-bold">{activity.project?.name}</span>
          </>
        )
      default:
        return 'performed an action'
    }
  }

  return (
    <>
      {mockActivities.map((activity) => {
        const Icon = getActivityIcon(activity.type)
        const colorClass = getActivityColor(activity.type)

        return (
          <div
            key={activity.id}
            className="glass-premium p-2 md:p-2 rounded-lg md:rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center gap-2 md:gap-2">
              {/* Activity Icon */}
              <div className={`w-10 h-10 md:w-8 md:h-8 rounded-lg md:rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 md:gap-1.5 mb-0.5">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-4 h-4 md:w-4 md:h-4 rounded-full"
                  />
                  <span className="text-sm md:text-xs font-medium text-white truncate">{activity.user.name}</span>
                  <span className="text-xs md:text-[10px] text-zinc-500 whitespace-nowrap ml-auto">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>

                <p className="text-sm md:text-xs text-zinc-300 truncate">
                  {getActivityText(activity)}
                </p>

                {activity.project && (
                  <div className="flex items-center gap-1.5 md:gap-1.5 mt-1">
                    <span className="text-xs md:text-[10px] px-1.5 md:px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                      ${activity.project.ticker}
                    </span>
                    {activity.value && (
                      <span className="text-xs md:text-[10px] text-zinc-500">
                        ~${activity.value.toLocaleString('en-US')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Live indicator - Mobile Optimized */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
        <span className="text-sm md:text-xs text-zinc-500 font-medium">Live updates</span>
      </div>
    </>
  )
}

interface ProjectFeedProps {
  projects: FeedProject[]
  isLoading?: boolean
  onFilterChange?: (status: string, sortBy: string) => void
}

export function ProjectFeed({ projects, isLoading, onFilterChange }: ProjectFeedProps) {

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <h2 className="text-xl md:text-2xl font-black mb-4 md:mb-6 text-gradient-main">Active Feed</h2>

      {/* 2-Column Layout - Centered, Reversed on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[600px_600px] gap-4 lg:gap-6 mb-8 justify-center">

        {/* RIGHT: Activity Feed - Shows First on Mobile */}
        <div className="lg:col-start-2 lg:row-start-1">
          <div className="mb-3 md:mb-3">
            <h3 className="text-base md:text-base lg:text-lg font-bold text-white mb-1">Platform Activity</h3>
            <p className="text-sm md:text-xs lg:text-sm text-zinc-400">Real-time feed of valuable actions</p>
          </div>

          {/* Activity Stream - Mobile Optimized Spacing */}
          <div className="space-y-2 md:space-y-1 max-h-[400px] md:max-h-[400px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
            <ActivityStream />
          </div>
        </div>

        {/* LEFT: Partnership Opportunities - Shows Second on Mobile */}
        <div className="lg:col-start-1 lg:row-start-1 space-y-2">
          {/* Single Card with All Options */}
          <div className="glass-premium p-3 md:p-4 lg:p-4 rounded-lg lg:rounded-xl border border-zinc-800">

            {/* Incubator - Mobile Optimized */}
            <div className="mb-3 md:mb-3 pb-3 md:pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 md:gap-2 mb-2 md:mb-2">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg md:rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 md:w-4 md:h-4 text-[#00FF88]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-sm text-white">Get Accelerated</h3>
                  <p className="text-xs md:text-[10px] text-zinc-500">Join incubator</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-1.5 md:gap-y-1 mb-2 md:mb-2">
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Guidance & mentorship</span>
                </div>
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">VC network access</span>
                </div>
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Marketing support</span>
                </div>
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Platform spotlight</span>
                </div>
              </div>
              <a href="mailto:partnerships@icmmotion.com" className="block w-full px-4 md:px-3 py-3 md:py-1.5 min-h-[44px] md:min-h-0 flex items-center justify-center rounded-lg md:rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-sm md:text-[11px] font-bold text-center transition-all">
                Apply Now
              </a>
            </div>

            {/* Partner - Mobile Optimized */}
            <div className="mb-3 md:mb-3 pb-3 md:pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 md:gap-2 mb-2 md:mb-2">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg md:rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 md:w-4 md:h-4 text-[#D1FD0A]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-sm text-white">Become a Partner</h3>
                  <p className="text-xs md:text-[10px] text-zinc-500">Collaborate with us</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-1.5 md:gap-y-1 mb-2 md:mb-2">
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D1FD0A] mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Revenue sharing</span>
                </div>
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D1FD0A] mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Co-marketing</span>
                </div>
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D1FD0A] mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">White-label solutions</span>
                </div>
              </div>
              <a href="mailto:partnerships@icmmotion.com" className="block w-full px-4 md:px-3 py-3 md:py-1.5 min-h-[44px] md:min-h-0 flex items-center justify-center rounded-lg md:rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-sm md:text-[11px] font-bold text-center transition-all">
                Partner With Us
              </a>
            </div>

            {/* Curator - Mobile Optimized */}
            <div className="mb-3 md:mb-3 pb-3 md:pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 md:gap-2 mb-2 md:mb-2">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg md:rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 md:w-4 md:h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-sm text-white">Become a Curator</h3>
                  <p className="text-xs md:text-[10px] text-zinc-500">Earn rewards</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-1.5 md:gap-y-1 mb-2 md:mb-2">
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Curate projects</span>
                </div>
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Earn platform fees</span>
                </div>
                <div className="flex items-start gap-1.5 md:gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-xs md:text-[10px] text-zinc-400 leading-tight">Build reputation</span>
                </div>
              </div>
              <a href="mailto:partnerships@icmmotion.com" className="block w-full px-4 md:px-3 py-3 md:py-1.5 min-h-[44px] md:min-h-0 flex items-center justify-center rounded-lg md:rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-sm md:text-[11px] font-bold text-center transition-all">
                Apply as Curator
              </a>
            </div>

            {/* Contact - Mobile Optimized */}
            <div className="pt-2 md:pt-2">
              <p className="text-xs md:text-[10px] text-zinc-500 mb-1.5 font-medium">Contact</p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                <a href="mailto:partnerships@icmmotion.com" className="text-sm md:text-[10px] text-[#00FF88] hover:text-[#00FFFF] active:text-[#00FFFF] transition-colors truncate min-h-[44px] md:min-h-0 flex items-center">
                  partnerships@icmmotion.com
                </a>
                <a href="https://twitter.com/icmmotion" target="_blank" rel="noopener noreferrer" className="text-sm md:text-[10px] text-[#00FFFF] hover:text-[#00FF88] active:text-[#00FF88] transition-colors min-h-[44px] md:min-h-0 flex items-center">
                  @icmmotion
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
