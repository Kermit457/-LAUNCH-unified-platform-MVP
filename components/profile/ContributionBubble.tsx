"use client"

import { useState } from 'react'
import { ProfileContribution } from '@/types/profile'

interface ContributionBubbleProps {
  contribution: ProfileContribution
}

export function ContributionBubble({ contribution }: ContributionBubbleProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Bubble */}
      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 hover:border-lime-500/50 hover:scale-110 transition-all cursor-pointer">
        <img
          src={contribution.logo}
          alt={contribution.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-black/90 border border-white/20 text-xs text-white whitespace-nowrap z-10 animate-in fade-in duration-200">
          <div className="font-semibold">{contribution.role}</div>
          <div className="text-zinc-400">on {contribution.name}</div>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/20 rotate-45" />
        </div>
      )}
    </div>
  )
}
