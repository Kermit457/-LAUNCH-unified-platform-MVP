"use client"

import { LaunchTimeseriesPoint } from '@/types/launch'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface LaunchSparkProps {
  points: LaunchTimeseriesPoint[]
}

export function LaunchSpark({ points }: LaunchSparkProps) {
  // Last 7 days only
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const last7Days = points.filter(p => p.ts >= sevenDaysAgo).sort((a, b) => a.ts - b.ts)

  if (last7Days.length < 2) {
    return (
      <div className="w-[110px] h-6 rounded bg-white/5 flex items-center justify-center">
        <span className="text-[9px] text-white/40">No data</span>
      </div>
    )
  }

  // Determine color: green if latest conviction > prior day, else neutral
  const latest = last7Days[last7Days.length - 1]
  const prior = last7Days[last7Days.length - 2]
  const isUp = latest.convictionPct > prior.convictionPct
  const color = isUp ? 'rgb(16, 185, 129)' : 'rgba(255, 255, 255, 0.4)'

  return (
    <div className="w-[110px] h-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={last7Days}>
          <Line
            type="monotone"
            dataKey="convictionPct"
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