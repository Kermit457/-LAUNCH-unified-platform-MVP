"use client"

import { useState } from 'react'
import { LaunchTimeseriesPoint } from '@/types/launch'
import { convictionSeries, activityUSD } from '@/utils/health'
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
  ReferenceLine,
} from 'recharts'

interface HealthChartProps {
  data: LaunchTimeseriesPoint[]
}

type ChartDataPoint = LaunchTimeseriesPoint & {
  conviction: number
  activity_usd: number
}

export function HealthChart({ data }: HealthChartProps) {
  const [visibleSeries, setVisibleSeries] = useState({
    conviction: true,
    activity_usd: true,
    fees_usd: true,
    boosts_usd: false,
    buybacks_usd: false,
    contributors: false,
    chat_msgs: false,
    dms: false,
    network_mentions: false,
    collaborations: false,
    campaigns: false,
    social_score: false,
  })

  // Empty state
  if (data.length < 2) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-8 flex items-center justify-center">
        <p className="text-white/40 text-sm">Not enough data points to display chart (minimum 2 required)</p>
      </div>
    )
  }

  // Compute conviction and activity values
  const convictionValues = convictionSeries(data)
  const chartData: ChartDataPoint[] = data.map((point, i) => ({
    ...point,
    conviction: convictionValues[i],
    activity_usd: activityUSD(point),
  }))

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

    const point = payload[0].payload as ChartDataPoint
    const date = new Date(point.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
      <div className="rounded-xl bg-[#0D1220] border border-white/20 p-3 shadow-xl max-w-xs">
        <p className="text-xs text-white/60 mb-2 font-semibold">{date}</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-6 pb-1 border-b border-white/10">
            <span className="text-white/70">Conviction:</span>
            <span className="text-fuchsia-400 font-bold">{point.conviction.toFixed(1)}%</span>
          </div>

          {point.activity_usd > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Activity USD:</span>
              <span className="text-sky-400 font-semibold">${Math.round(point.activity_usd).toLocaleString('en-US')}</span>
            </div>
          )}
          {point.fees_usd > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Fees:</span>
              <span className="text-emerald-400 font-semibold">${point.fees_usd.toLocaleString('en-US')}</span>
            </div>
          )}
          {point.boosts_usd > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Boosts:</span>
              <span className="text-amber-400 font-semibold">${point.boosts_usd.toLocaleString('en-US')}</span>
            </div>
          )}
          {point.buybacks_usd > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Buybacks:</span>
              <span className="text-purple-400 font-semibold">${point.buybacks_usd.toLocaleString('en-US')}</span>
            </div>
          )}
          {point.contributors > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Contributors:</span>
              <span className="text-cyan-400 font-semibold">{point.contributors}</span>
            </div>
          )}
          {point.chat_msgs > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Chat Messages:</span>
              <span className="text-indigo-400 font-semibold">{point.chat_msgs.toLocaleString('en-US')}</span>
            </div>
          )}
          {point.dms > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">DMs:</span>
              <span className="text-violet-400 font-semibold">{point.dms.toLocaleString('en-US')}</span>
            </div>
          )}
          {point.network_mentions > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Network Activity:</span>
              <span className="text-pink-400 font-semibold">{point.network_mentions.toLocaleString('en-US')}</span>
            </div>
          )}
          {point.collaborations > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Collaborations:</span>
              <span className="text-orange-400 font-semibold">{point.collaborations}</span>
            </div>
          )}
          {point.campaigns > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Campaigns:</span>
              <span className="text-rose-400 font-semibold">{point.campaigns}</span>
            </div>
          )}
          {point.social_score > 0 && (
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/70">Social Score:</span>
              <span className="text-teal-400 font-semibold">{point.social_score}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Launch Health</h3>

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
            onClick={() => toggleSeries('activity_usd')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.activity_usd ? 'text-sky-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-3 ${visibleSeries.activity_usd ? 'bg-sky-400/30 border border-sky-400' : 'bg-white/10 border border-white/40'}`} />
            Activity
          </button>
          <button
            onClick={() => toggleSeries('fees_usd')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.fees_usd ? 'text-emerald-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-3 ${visibleSeries.fees_usd ? 'bg-emerald-400/30 border border-emerald-400' : 'bg-white/10 border border-white/40'}`} />
            Fees
          </button>
          <button
            onClick={() => toggleSeries('boosts_usd')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.boosts_usd ? 'text-amber-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-3 ${visibleSeries.boosts_usd ? 'bg-amber-400/30 border border-amber-400' : 'bg-white/10 border border-white/40'}`} />
            Boosts
          </button>
          <button
            onClick={() => toggleSeries('buybacks_usd')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.buybacks_usd ? 'text-purple-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-3 ${visibleSeries.buybacks_usd ? 'bg-purple-400/30 border border-purple-400' : 'bg-white/10 border border-white/40'}`} />
            Buybacks
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
            onClick={() => toggleSeries('chat_msgs')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.chat_msgs ? 'text-indigo-400' : 'text-white/40'
            }`}
          >
            <div className={`w-2 h-3 ${visibleSeries.chat_msgs ? 'bg-indigo-400' : 'bg-white/40'}`} />
            Chat
          </button>
          <button
            onClick={() => toggleSeries('dms')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.dms ? 'text-violet-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.dms ? 'bg-violet-400' : 'bg-white/40'}`} />
            DMs
          </button>
          <button
            onClick={() => toggleSeries('network_mentions')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.network_mentions ? 'text-pink-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.network_mentions ? 'bg-pink-400' : 'bg-white/40'}`} />
            Network
          </button>
          <button
            onClick={() => toggleSeries('collaborations')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.collaborations ? 'text-orange-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.collaborations ? 'bg-orange-400' : 'bg-white/40'}`} />
            Collabs
          </button>
          <button
            onClick={() => toggleSeries('campaigns')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.campaigns ? 'text-rose-400' : 'text-white/40'
            }`}
          >
            <div className={`w-2 h-3 ${visibleSeries.campaigns ? 'bg-rose-400' : 'bg-white/40'}`} />
            Campaigns
          </button>
          <button
            onClick={() => toggleSeries('social_score')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              visibleSeries.social_score ? 'text-teal-400' : 'text-white/40'
            }`}
          >
            <div className={`w-3 h-0.5 ${visibleSeries.social_score ? 'bg-teal-400' : 'bg-white/40'}`} />
            Social
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="ts"
            tickFormatter={(ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: 11 }}
          />

          {/* Left Y-axis: Conviction 0-100 */}
          <YAxis
            yAxisId="L"
            domain={[0, 100]}
            orientation="left"
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: 11 }}
            label={{ value: 'Conviction %', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255,255,255,0.5)', fontSize: 11 } }}
          />

          {/* Right Y-axis: USD values */}
          <YAxis
            yAxisId="R"
            orientation="right"
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: 11 }}
            tickFormatter={(value) => `$${Math.round(value).toLocaleString('en-US')}`}
            label={{ value: 'USD Value', angle: 90, position: 'insideRight', style: { fill: 'rgba(255,255,255,0.5)', fontSize: 11 } }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Event markers */}
          {events.map((evt, idx) => (
            <ReferenceLine
              key={idx}
              x={evt.ts}
              yAxisId="L"
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

          {/* Stacked USD Areas */}
          {visibleSeries.fees_usd && (
            <Area
              stackId="usd"
              yAxisId="R"
              type="monotone"
              dataKey="fees_usd"
              fill="rgba(16, 185, 129, 0.6)"
              stroke="rgb(16, 185, 129)"
              strokeWidth={1}
            />
          )}

          {visibleSeries.boosts_usd && (
            <Area
              stackId="usd"
              yAxisId="R"
              type="monotone"
              dataKey="boosts_usd"
              fill="rgba(245, 158, 11, 0.6)"
              stroke="rgb(245, 158, 11)"
              strokeWidth={1}
            />
          )}

          {visibleSeries.buybacks_usd && (
            <Area
              stackId="usd"
              yAxisId="R"
              type="monotone"
              dataKey="buybacks_usd"
              fill="rgba(168, 85, 247, 0.6)"
              stroke="rgb(168, 85, 247)"
              strokeWidth={1}
            />
          )}

          {visibleSeries.activity_usd && (
            <Area
              stackId="usd"
              yAxisId="R"
              type="monotone"
              dataKey="activity_usd"
              fill="rgba(56, 189, 248, 0.6)"
              stroke="rgb(56, 189, 248)"
              strokeWidth={1}
            />
          )}

          {/* Contributors Bar (optional) */}
          {visibleSeries.contributors && (
            <Bar
              yAxisId="R"
              dataKey="contributors"
              fill="rgba(6, 182, 212, 0.7)"
              barSize={12}
            />
          )}

          {/* Chat Messages Bar */}
          {visibleSeries.chat_msgs && (
            <Bar
              yAxisId="R"
              dataKey="chat_msgs"
              fill="rgba(99, 102, 241, 0.7)"
              barSize={12}
            />
          )}

          {/* DMs Line */}
          {visibleSeries.dms && (
            <Line
              yAxisId="R"
              type="monotone"
              dataKey="dms"
              stroke="rgb(139, 92, 246)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'rgb(139, 92, 246)' }}
            />
          )}

          {/* Network Mentions Line */}
          {visibleSeries.network_mentions && (
            <Line
              yAxisId="R"
              type="monotone"
              dataKey="network_mentions"
              stroke="rgb(236, 72, 153)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'rgb(236, 72, 153)' }}
            />
          )}

          {/* Collaborations Line */}
          {visibleSeries.collaborations && (
            <Line
              yAxisId="R"
              type="monotone"
              dataKey="collaborations"
              stroke="rgb(249, 115, 22)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'rgb(249, 115, 22)' }}
            />
          )}

          {/* Campaigns Bar */}
          {visibleSeries.campaigns && (
            <Bar
              yAxisId="R"
              dataKey="campaigns"
              fill="rgba(244, 63, 94, 0.7)"
              barSize={12}
            />
          )}

          {/* Social Score Line (on left axis 0-100) */}
          {visibleSeries.social_score && (
            <Line
              yAxisId="L"
              type="monotone"
              dataKey="social_score"
              stroke="rgb(20, 184, 166)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'rgb(20, 184, 166)' }}
              strokeDasharray="5 5"
            />
          )}

          {/* Conviction Line (always on top) */}
          {visibleSeries.conviction && (
            <Line
              yAxisId="L"
              type="monotone"
              dataKey="conviction"
              stroke="rgb(217, 70, 239)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'rgb(217, 70, 239)' }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
