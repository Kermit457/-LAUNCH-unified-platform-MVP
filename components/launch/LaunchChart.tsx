"use client"

import { useState } from 'react'
import { LaunchTimeseriesPoint } from '@/types/launch'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'

interface LaunchChartProps {
  data: LaunchTimeseriesPoint[]
}

export function LaunchChart({ data }: LaunchChartProps) {
  const [visibleSeries, setVisibleSeries] = useState({
    conviction: true,
    fees: false,
    contributors: true,
    boosts: false,
    buybacks: false,
    views: true,
    networkInteractions: true,
    liveMinutes: true,
    chatMessages: true,
    upvotes: true,
  })

  // Empty state
  if (data.length < 2) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-8 flex items-center justify-center">
        <p className="text-white/40 text-sm">Not enough data points to display chart (minimum 2 required)</p>
      </div>
    )
  }

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Event markers
  const events = data.filter(d => d.event).map(d => ({
    ts: d.ts,
    event: d.event,
    label: d.event === 'live' ? 'Live' : d.event === 'tge' ? 'TGE' : 'Milestone'
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null

    const point = payload[0].payload as LaunchTimeseriesPoint
    const date = new Date(point.ts).toISOString().split('T')[0]

    return (
      <div className="rounded-xl bg-[#0D1220] border border-white/20 p-3 shadow-xl">
        <p className="text-xs text-white/60 mb-2">{date}</p>
        <div className="space-y-1 text-xs">
          {(point as any).convictionPct > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Conviction:</span>
              <span className="text-fuchsia-400 font-semibold">{(point as any).convictionPct.toFixed(1)}%</span>
            </div>
          )}
          {(point as any).feesUsd > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Fees:</span>
              <span className="text-emerald-400 font-semibold">${(point as any).feesUsd.toLocaleString()}</span>
            </div>
          )}
          {(point as any).contributors > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Contributors:</span>
              <span className="text-cyan-400 font-semibold">{(point as any).contributors}</span>
            </div>
          )}
          {(point as any).boostsUsd > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Boosts:</span>
              <span className="text-amber-400 font-semibold">${(point as any).boostsUsd.toLocaleString()}</span>
            </div>
          )}
          {(point as any).buybacksUsd > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Buybacks:</span>
              <span className="text-purple-400 font-semibold">${(point as any).buybacksUsd.toLocaleString()}</span>
            </div>
          )}
          {point.views > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Views:</span>
              <span className="text-blue-400 font-semibold">{point.views.toLocaleString()}</span>
            </div>
          )}
          {(point as any).networkInteractions > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Network Activity:</span>
              <span className="text-pink-400 font-semibold">{(point as any).networkInteractions.toLocaleString()}</span>
            </div>
          )}
          {(point as any).liveMinutes > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Live Time:</span>
              <span className="text-orange-400 font-semibold">{Math.round((point as any).liveMinutes / 60)}h</span>
            </div>
          )}
          {(point as any).chatMessages > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Chat:</span>
              <span className="text-indigo-400 font-semibold">{(point as any).chatMessages.toLocaleString()}</span>
            </div>
          )}
          {point.upvotes > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">Upvotes:</span>
              <span className="text-yellow-400 font-semibold">{point.upvotes.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Launch Metrics</h3>

        {/* Legend with toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => toggleSeries('conviction')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.conviction ? 'text-fuchsia-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.conviction ? 'bg-fuchsia-400' : 'bg-white/40'}`} />
            Conviction
          </button>
          <button
            onClick={() => toggleSeries('fees')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.fees ? 'text-emerald-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-3 ${visibleSeries.fees ? 'bg-emerald-400/30 border border-emerald-400' : 'bg-white/10 border border-white/40'}`} />
            Fees
          </button>
          <button
            onClick={() => toggleSeries('contributors')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.contributors ? 'text-cyan-400' : 'text-white/40'
            }`}
          >
            <div className={`w-2 h-3 ${visibleSeries.contributors ? 'bg-cyan-400' : 'bg-white/40'}`} />
            Contributors
          </button>
          <button
            onClick={() => toggleSeries('boosts')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.boosts ? 'text-amber-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.boosts ? 'bg-amber-400' : 'bg-white/40'}`} />
            Boosts
          </button>
          <button
            onClick={() => toggleSeries('buybacks')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.buybacks ? 'text-purple-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.buybacks ? 'bg-purple-400' : 'bg-white/40'}`} />
            Buybacks
          </button>
          <button
            onClick={() => toggleSeries('views')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.views ? 'text-blue-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.views ? 'bg-blue-400' : 'bg-white/40'}`} />
            Views
          </button>
          <button
            onClick={() => toggleSeries('networkInteractions')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.networkInteractions ? 'text-pink-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.networkInteractions ? 'bg-pink-400' : 'bg-white/40'}`} />
            Network
          </button>
          <button
            onClick={() => toggleSeries('liveMinutes')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.liveMinutes ? 'text-orange-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.liveMinutes ? 'bg-orange-400' : 'bg-white/40'}`} />
            Live Time
          </button>
          <button
            onClick={() => toggleSeries('chatMessages')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.chatMessages ? 'text-indigo-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.chatMessages ? 'bg-indigo-400' : 'bg-white/40'}`} />
            Chat
          </button>
          <button
            onClick={() => toggleSeries('upvotes')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.upvotes ? 'text-yellow-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.upvotes ? 'bg-yellow-400' : 'bg-white/40'}`} />
            Upvotes
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="ts"
            tickFormatter={(ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: 11 }}
          />

          {/* Left Y-axis: Conviction % and Contributors */}
          <YAxis
            yAxisId="left"
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: 11 }}
            domain={[0, 100]}
          />

          {/* Right Y-axis: USD values */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: 11 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Event markers */}
          {events.map((evt, idx) => (
            <ReferenceLine
              key={idx}
              x={evt.ts}
              yAxisId="left"
              stroke="rgba(255,255,255,0.3)"
              strokeDasharray="3 3"
              label={{
                value: evt.label,
                position: 'top',
                fill: 'rgba(255,255,255,0.6)',
                fontSize: 10,
              }}
            />
          ))}

          {/* Series */}
          {visibleSeries.fees && (
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="feesUsd"
              fill="rgba(16, 185, 129, 0.2)"
              stroke="rgb(16, 185, 129)"
              strokeWidth={1}
            />
          )}

          {visibleSeries.contributors && (
            <Bar
              yAxisId="left"
              dataKey="contributors"
              fill="rgba(6, 182, 212, 0.6)"
              barSize={12}
            />
          )}

          {visibleSeries.conviction && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="convictionPct"
              stroke="rgb(217, 70, 239)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}

          {visibleSeries.boosts && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="boostsUsd"
              stroke="rgb(245, 158, 11)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}

          {visibleSeries.buybacks && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="buybacksUsd"
              stroke="rgb(168, 85, 247)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}

          {visibleSeries.views && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="views"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}

          {visibleSeries.networkInteractions && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="networkInteractions"
              stroke="rgb(236, 72, 153)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}

          {visibleSeries.liveMinutes && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="liveMinutes"
              fill="rgba(251, 146, 60, 0.2)"
              stroke="rgb(251, 146, 60)"
              strokeWidth={1}
            />
          )}

          {visibleSeries.chatMessages && (
            <Bar
              yAxisId="left"
              dataKey="chatMessages"
              fill="rgba(129, 140, 248, 0.6)"
              barSize={10}
            />
          )}

          {visibleSeries.upvotes && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="upvotes"
              stroke="rgb(250, 204, 21)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
