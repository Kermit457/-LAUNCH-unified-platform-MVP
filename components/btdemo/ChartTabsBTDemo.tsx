"use client"

import { useState } from "react"
import { DexChartEmbed } from "../launch/DexChartEmbed"
import { InsightChart } from "../launch/InsightChart"
import { BarChart3, TrendingUp } from "lucide-react"
import type { Candle, ActivityPoint } from "@/types/launch"

interface ChartTabsBTDemoProps {
  pairId: string
  candles?: Candle[]
  activity?: ActivityPoint[]
  className?: string
}

export function ChartTabsBTDemo({
  pairId,
  candles = [],
  activity = [],
  className = ''
}: ChartTabsBTDemoProps): JSX.Element {
  const [view, setView] = useState<'dex' | 'insights'>('insights')

  return (
    <div className={className}>
      {/* Tabs Header - BTDEMO Glass Morphism */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('insights')}
          className={`
            group relative flex items-center gap-2 px-6 py-3 rounded-xl
            font-semibold text-sm transition-all duration-200
            ${view === 'insights'
              ? 'glass-premium border border-[#D1FD0A]/30 text-white shadow-lg shadow-[#D1FD0A]/10'
              : 'glass-interactive border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }
          `}
        >
          <BarChart3 className={`w-4 h-4 transition-colors ${
            view === 'insights' ? 'text-[#D1FD0A]' : 'text-zinc-400 group-hover:text-zinc-300'
          }`} />
          <span>Insights</span>
          {view === 'insights' && (
            <div className="absolute inset-0 rounded-xl bg-[#D1FD0A]/5 animate-pulse-subtle"></div>
          )}
        </button>

        <button
          onClick={() => setView('dex')}
          className={`
            group relative flex items-center gap-2 px-6 py-3 rounded-xl
            font-semibold text-sm transition-all duration-200
            ${view === 'dex'
              ? 'glass-premium border border-[#D1FD0A]/30 text-white shadow-lg shadow-[#D1FD0A]/10'
              : 'glass-interactive border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }
          `}
        >
          <TrendingUp className={`w-4 h-4 transition-colors ${
            view === 'dex' ? 'text-[#D1FD0A]' : 'text-zinc-400 group-hover:text-zinc-300'
          }`} />
          <span>Chart</span>
          {view === 'dex' && (
            <div className="absolute inset-0 rounded-xl bg-[#D1FD0A]/5 animate-pulse-subtle"></div>
          )}
        </button>
      </div>

      {/* Tab Content - BTDEMO Glass Container */}
      <div className="relative glass-premium rounded-2xl border border-zinc-800/50 overflow-hidden">
        {view === 'dex' && (
          <DexChartEmbed
            pairId={pairId}
            className="w-full h-[420px]"
          />
        )}
        {view === 'insights' && (
          <InsightChart
            candles={candles}
            activity={activity}
            className="w-full h-[420px]"
          />
        )}
      </div>
    </div>
  )
}
