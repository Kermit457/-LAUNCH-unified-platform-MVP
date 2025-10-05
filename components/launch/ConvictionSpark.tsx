"use client"

import { LaunchTimeseriesPoint } from '@/types/launch'
import { convictionSeries } from '@/utils/health'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

interface ConvictionSparkProps {
  points: LaunchTimeseriesPoint[]
}

export function ConvictionSpark({ points }: ConvictionSparkProps) {
  // Last 7 days only
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const last7Days = points
    .filter(p => p.ts >= sevenDaysAgo)
    .sort((a, b) => a.ts - b.ts)

  // Need at least 2 points to show a sparkline
  if (last7Days.length < 2) {
    return (
      <div className="w-[110px] h-6 flex items-center justify-center">
        <span className="text-[10px] text-white/40">No data</span>
      </div>
    )
  }

  // Compute conviction values for last 7 days
  const convictionValues = convictionSeries(last7Days)
  const sparkData = last7Days.map((p, i) => ({
    ts: p.ts,
    conviction: convictionValues[i],
  }))

  // Color logic: green if latest > first, else neutral
  const latest = sparkData[sparkData.length - 1]?.conviction ?? 0
  const first = sparkData[0]?.conviction ?? 0
  const isUp = latest > first
  const color = isUp ? 'rgb(34, 197, 94)' : 'rgba(255, 255, 255, 0.4)'

  return (
    <div className="w-[110px] h-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sparkData}>
          <Line
            type="monotone"
            dataKey="conviction"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}