"use client"

import { useState } from 'react'
import { MutualConnection } from '@/types/profile'

interface MutualAvatarsProps {
  mutuals: MutualConnection[]
  maxVisible?: number
}

export function MutualAvatars({ mutuals, maxVisible = 4 }: MutualAvatarsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const visibleMutuals = mutuals.slice(0, maxVisible)
  const remainingCount = mutuals.length - maxVisible

  if (mutuals.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500">Followed by</span>

      {/* Stacked Avatars */}
      <div className="flex items-center -space-x-3">
        {visibleMutuals.map((mutual, index) => (
          <div
            key={mutual.username}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full border-2 border-[#0d0c1d] overflow-hidden hover:scale-110 hover:z-10 transition-all cursor-pointer">
              <img
                src={mutual.avatar}
                alt={`@${mutual.username}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tooltip */}
            {hoveredIndex === index && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-black/90 border border-white/20 text-xs text-white whitespace-nowrap z-20 animate-in fade-in duration-200">
                <div className="font-semibold">@{mutual.username}</div>
                {mutual.sharedProject && (
                  <div className="text-zinc-400">via {mutual.sharedProject}</div>
                )}
                {/* Arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/20 rotate-45" />
              </div>
            )}
          </div>
        ))}

        {/* Remaining Count */}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full border-2 border-[#0d0c1d] bg-white/10 flex items-center justify-center">
            <span className="text-[10px] text-zinc-400 font-semibold">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}
