"use client"

import { XSnapshot } from '@/types/network'

interface StatsBarProps {
  x?: XSnapshot
}

export function StatsBar({ x }: StatsBarProps) {
  // Hide if all stats are undefined
  if (!x || (x.followers === undefined && x.following === undefined && x.posts === undefined)) {
    return null
  }

  const formatNumber = (num?: number): string => {
    if (num === undefined) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString('en-US')
  }

  return (
    <div className="flex items-center justify-around py-3 border-t border-b border-white/10 bg-white/[0.02]">
      {/* Followers */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="text-lg font-bold text-white">
          {formatNumber(x.followers)}
        </div>
        <div className="text-xs text-white/50">Followers</div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-white/10" />

      {/* Following */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="text-lg font-bold text-white">
          {formatNumber(x.following)}
        </div>
        <div className="text-xs text-white/50">Following</div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-white/10" />

      {/* Posts */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="text-lg font-bold text-white">
          {formatNumber(x.posts)}
        </div>
        <div className="text-xs text-white/50">Posts</div>
      </div>
    </div>
  )
}
