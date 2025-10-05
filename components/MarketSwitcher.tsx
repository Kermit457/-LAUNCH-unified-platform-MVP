'use client'

import { Coins, Video, LayoutGrid } from 'lucide-react'
import type { MarketType } from '@/types'

interface MarketSwitcherProps {
  market: MarketType
  onMarketChange: (market: MarketType) => void
}

export function MarketSwitcher({ market, onMarketChange }: MarketSwitcherProps) {
  return (
    <div className="inline-flex items-center glass-launchos rounded-xl p-1 gap-1">
      <button
        onClick={() => onMarketChange('all')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300
          ${
            market === 'all'
              ? 'bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white shadow-neon-fuchsia'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>ALL</span>
      </button>

      <button
        onClick={() => onMarketChange('icm')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300
          ${
            market === 'icm'
              ? 'bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white shadow-neon-fuchsia'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <Coins className="w-4 h-4" />
        <span>ICM</span>
      </button>

      <button
        onClick={() => onMarketChange('ccm')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300
          ${
            market === 'ccm'
              ? 'bg-gradient-to-r from-launchos-violet to-launchos-cyan text-white shadow-neon-cyan'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <Video className="w-4 h-4" />
        <span>CCM</span>
      </button>
    </div>
  )
}
