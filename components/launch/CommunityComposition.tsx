"use client"

import { Users, Briefcase, TrendingUp, Megaphone, Heart, Code, DollarSign, Lightbulb, Flame, Rocket, Target, UserPlus, Sparkles, Star, Zap } from 'lucide-react'
import { Skeleton } from '@/components/design-system/Skeleton'

interface CommunityStats {
  traders: number
  advisors: number
  vcs: number
  believers: number
  cultists: number
  contributors: number
  developers: number
  incubators: number
  scouts: number
  influencers: number
  builders: number
  marketers: number
  kols: number
  founders: number
  rizzers: number
  degens: number
  total: number
}

interface CommunityCompositionProps {
  stats: CommunityStats | null
  isLoading?: boolean
}

export function CommunityComposition({ stats, isLoading }: CommunityCompositionProps) {
  if (isLoading) {
    return (
      <div className="glass-premium p-6 rounded-2xl">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  // Calculate all roles with their counts
  const allRoles = [
    { id: 'traders', label: 'Trader', count: stats.traders, icon: TrendingUp, color: 'text-[#00FF88]', bgColor: 'bg-[#00FF88]/10' },
    { id: 'believers', label: 'Believer', count: stats.believers, icon: Heart, color: 'text-red-400', bgColor: 'bg-red-400/10' },
    { id: 'builders', label: 'Builder', count: stats.builders, icon: Users, color: 'text-teal-400', bgColor: 'bg-teal-400/10' },
    { id: 'degens', label: 'Degen', count: stats.degens, icon: Zap, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { id: 'contributors', label: 'Contributor', count: stats.contributors, icon: UserPlus, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
    { id: 'developers', label: 'Developer', count: stats.developers, icon: Code, color: 'text-green-400', bgColor: 'bg-green-400/10' },
    { id: 'founders', label: 'Founder', count: stats.founders, icon: Briefcase, color: 'text-amber-400', bgColor: 'bg-amber-400/10' },
    { id: 'cultists', label: 'Cultist', count: stats.cultists, icon: Flame, color: 'text-orange-400', bgColor: 'bg-orange-400/10' },
    { id: 'rizzers', label: 'Rizzer', count: stats.rizzers, icon: Star, color: 'text-rose-400', bgColor: 'bg-rose-400/10' },
    { id: 'influencers', label: 'Influencer', count: stats.influencers, icon: Megaphone, color: 'text-[#D1FD0A]', bgColor: 'bg-[#D1FD0A]/10' },
    { id: 'marketers', label: 'Marketer', count: stats.marketers, icon: Sparkles, color: 'text-[#D1FD0A]', bgColor: 'bg-[#D1FD0A]/10' },
    { id: 'advisors', label: 'Advisor', count: stats.advisors, icon: Lightbulb, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
    { id: 'scouts', label: 'Scout', count: stats.scouts, icon: Target, color: 'text-pink-400', bgColor: 'bg-pink-400/10' },
    { id: 'kols', label: 'KOL', count: stats.kols, icon: Users, color: 'text-violet-400', bgColor: 'bg-violet-400/10' },
    { id: 'vcs', label: 'VC', count: stats.vcs, icon: DollarSign, color: 'text-[#00FFFF]', bgColor: 'bg-[#00FFFF]/10' },
    { id: 'incubators', label: 'Incubator', count: stats.incubators, icon: Rocket, color: 'text-indigo-400', bgColor: 'bg-indigo-400/10' }
  ]

  // Sort by count descending and take top 8
  const roles = allRoles
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <div className="glass-premium p-3 md:p-3 rounded-xl border border-zinc-800">
      <div
        className="flex gap-3 md:gap-2 overflow-x-auto snap-x snap-mandatory -mx-3 px-3 md:mx-0 md:px-0"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* ICMX Network Badge - First Item - Mobile Optimized */}
        <div className="snap-start shrink-0 flex items-center gap-2 md:gap-1.5 px-4 md:px-3 py-3 md:py-2 rounded-lg bg-zinc-900 border border-zinc-800 whitespace-nowrap">
          <Users className="w-5 h-5 md:w-3.5 md:h-3.5 text-zinc-400" />
          <span className="text-sm md:text-[11px] font-medium text-zinc-400">ICMX Network</span>
        </div>
        {roles.map((role) => {
          const Icon = role.icon
          const percentage = stats.total > 0 ? ((role.count / stats.total) * 100).toFixed(1) : '0.0'

          return (
            <div
              key={role.id}
              className={`snap-start shrink-0 flex items-center gap-2 md:gap-1.5 px-4 md:px-3 py-3 md:py-2 rounded-lg ${role.bgColor} border border-zinc-800 whitespace-nowrap`}
            >
              <Icon className={`w-5 h-5 md:w-3.5 md:h-3.5 ${role.color}`} />
              <div className="flex flex-col">
                <span className="text-xs md:text-[10px] text-zinc-400">{role.label}</span>
                <div className="flex items-baseline gap-2 md:gap-1.5">
                  <span className="text-base md:text-sm font-bold">{role.count.toLocaleString()}</span>
                  <span className="text-xs md:text-[10px] text-zinc-500">{percentage}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
