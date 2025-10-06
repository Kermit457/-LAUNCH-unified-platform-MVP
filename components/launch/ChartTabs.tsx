"use client"

import { useState } from "react"
import { DexChartEmbed } from "./DexChartEmbed"
import { InsightChart } from "./InsightChart"
import type { Candle, ActivityPoint } from "@/types/launch"

interface ChartTabsProps {
  pairId: string
  candles?: Candle[]
  activity?: ActivityPoint[]
  className?: string
}

export function ChartTabs({ pairId, candles = [], activity = [], className = '' }: ChartTabsProps) {
  const [view, setView] = useState<'dex' | 'insights'>('insights')

  return (
    <div className={className}>
      {/* Tabs Header */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('insights')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            view === 'insights'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          Insights
        </button>
        <button
          onClick={() => setView('dex')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            view === 'dex'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          Chart
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative">
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
