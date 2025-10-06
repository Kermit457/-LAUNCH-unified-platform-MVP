"use client"

import { createChart, ColorType, CrosshairMode, IChartApi, LineData, HistogramData } from "lightweight-charts"
import { useEffect, useRef, useState } from "react"
import type { Candle, ActivityPoint } from "@/types/launch"
import { MessageSquare, ThumbsUp, Users, GitPullRequest, Activity, Eye, BarChart3, Heart } from "lucide-react"

interface InsightChartProps {
  candles: Candle[]
  activity: ActivityPoint[]
  className?: string
}

type MetricKey = 'comments' | 'upvotes' | 'collabs' | 'contributions' | 'social' | 'views' | 'activityScore' | 'conviction'

const METRICS: { key: MetricKey; label: string; color: string; icon: any; type: 'area' | 'histogram' }[] = [
  { key: 'comments', label: 'Comments', color: '#60a5fa', icon: MessageSquare, type: 'area' },
  { key: 'upvotes', label: 'Upvotes', color: '#f59e0b', icon: ThumbsUp, type: 'area' },
  { key: 'collabs', label: 'Collaborations', color: '#22d3ee', icon: Users, type: 'area' },
  { key: 'contributions', label: 'Contributions', color: '#10b981', icon: GitPullRequest, type: 'area' },
  { key: 'social', label: 'Network Activity', color: '#fb7185', icon: Activity, type: 'area' },
  { key: 'views', label: 'Views', color: '#a855f7', icon: Eye, type: 'area' },
  { key: 'activityScore', label: 'Overall Activity', color: '#22d3ee', icon: BarChart3, type: 'histogram' },
  { key: 'conviction', label: 'Conviction', color: '#a855f7', icon: Heart, type: 'area' },
]

export function InsightChart({ candles, activity, className = '' }: InsightChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricKey>>(new Set(['contributions'] as MetricKey[]))
  const [chart, setChart] = useState<IChartApi | null>(null)

  const toggleMetric = (key: MetricKey) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (!chartRef.current || candles.length === 0 || activity.length === 0) return

    // Create chart instance
    const newChart = createChart(chartRef.current, {
      height: 380,
      layout: {
        background: { type: ColorType.Solid, color: "#0f0f12" },
        textColor: "#e5e7eb",
      },
      rightPriceScale: {
        borderColor: "#27272a",
        visible: true,
        scaleMargins: {
          top: 0.15,
          bottom: 0.15,
        },
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
        secondsVisible: false,
        visible: false, // Hide default timeline
      },
      grid: {
        vertLines: { color: "#18181b" },
        horzLines: { color: "#18181b" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#6366f1",
          width: 1,
          style: 3,
          labelBackgroundColor: "#6366f1",
        },
        horzLine: {
          color: "#6366f1",
          width: 1,
          style: 3,
          labelBackgroundColor: "#6366f1",
        },
      },
    })

    setChart(newChart)

    // Price line (always visible, prominent smooth line)
    const priceSeries = newChart.addLineSeries({
      color: "#6366f1",
      lineWidth: 3,
      priceScaleId: "right",
      priceLineVisible: false,
      lastValueVisible: true,
      lineStyle: 0, // Solid line
      lineType: 2, // Curved/smooth line (0=simple, 1=step, 2=curved)
    })

    const priceData: LineData[] = candles.map((c) => ({
      time: c.t as any,
      value: c.c,
    }))

    priceSeries.setData(priceData)

    // Add selected metrics
    let scaleOffset = 0
    selectedMetrics.forEach((metricKey, index) => {
      const metric = METRICS.find(m => m.key === metricKey)!

      if (metric.type === 'area') {
        // Conviction gets special treatment - most prominent
        const isConviction = metricKey === 'conviction'

        const series = newChart.addAreaSeries({
          lineWidth: isConviction ? 4 : 2,
          topColor: isConviction ? metric.color + '50' : metric.color + '30',
          bottomColor: metric.color + '00',
          lineColor: metric.color,
          priceScaleId: `metric-${index}`,
          priceLineVisible: false,
          lastValueVisible: false,
          lineStyle: 0,
          lineType: 2, // Curved/smooth line
        })

        const data: LineData[] = activity.map((a) => ({
          time: a.t as any,
          value: a[metricKey] as number || 0,
        }))

        series.setData(data)

        // Configure scale for this metric
        // Conviction gets more vertical space
        const topMargin = isConviction ? 0.15 : (0.2 + (scaleOffset * 0.1))
        const bottomMargin = isConviction ? 0.4 : 0.15

        newChart.priceScale(`metric-${index}`).applyOptions({
          scaleMargins: {
            top: Math.min(topMargin, 0.65),
            bottom: bottomMargin,
          },
          borderColor: "#27272a",
        })
        scaleOffset++
      } else if (metric.type === 'histogram') {
        const series = newChart.addHistogramSeries({
          color: metric.color,
          priceScaleId: `histogram`,
          base: 0,
        })

        const data: HistogramData[] = activity.map((a) => ({
          time: a.t as any,
          value: a.activityScore,
          color: a.activityScore > 200 ? metric.color : metric.color + '88',
        }))

        series.setData(data)

        // Configure histogram scale (bottom)
        newChart.priceScale('histogram').applyOptions({
          scaleMargins: {
            top: 0.8,
            bottom: 0.05,
          },
          borderColor: "#27272a",
        })
      }
    })

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        newChart.applyOptions({ width: chartRef.current.clientWidth })
      }
    })

    resizeObserver.observe(chartRef.current)

    // Auto-fit content
    newChart.timeScale().fitContent()

    return () => {
      resizeObserver.disconnect()
      newChart.remove()
      setChart(null)
    }
  }, [candles, activity, selectedMetrics])

  // Custom tooltip
  useEffect(() => {
    if (!chart || !chartRef.current) return

    const tooltipEl = document.createElement('div')
    tooltipEl.className = 'absolute pointer-events-none z-50 hidden'
    tooltipEl.style.cssText = `
      background: rgba(15, 15, 18, 0.95);
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      color: #e5e7eb;
      backdrop-filter: blur(8px);
      max-width: 250px;
    `
    chartRef.current.appendChild(tooltipEl)

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        tooltipEl.classList.add('hidden')
        return
      }

      const timestamp = param.time as number
      const candle = candles.find((c) => c.t === timestamp)
      const activityPoint = activity.find((a) => a.t === timestamp)

      if (!candle || !activityPoint) {
        tooltipEl.classList.add('hidden')
        return
      }

      let html = `
        <div style="font-weight: 600; margin-bottom: 6px; border-bottom: 1px solid #27272a; padding-bottom: 4px;">
          Price: $${candle.c.toFixed(6)}
        </div>
      `

      // Show selected metrics
      selectedMetrics.forEach((metricKey) => {
        const metric = METRICS.find(m => m.key === metricKey)!
        const value = activityPoint[metricKey]
        html += `<div style="color: ${metric.color}; font-size: 11px; margin-top: 3px;">${metric.label}: ${value}</div>`
      })

      // Show other metrics if not selected
      const otherMetrics = METRICS.filter(m => !selectedMetrics.has(m.key) && m.key !== 'activityScore' && m.key !== 'conviction')
      if (otherMetrics.length > 0) {
        html += '<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #27272a;">'
        otherMetrics.forEach((m) => {
          html += `<div style="font-size: 10px; color: #94a3b8;">${m.label}: ${activityPoint[m.key]}</div>`
        })
        html += '</div>'
      }

      if (activityPoint.notable && activityPoint.notable.length > 0) {
        html += '<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #27272a;">'
        activityPoint.notable.forEach((event) => {
          html += `<div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">• ${event.label}</div>`
        })
        html += '</div>'
      }

      tooltipEl.innerHTML = html
      tooltipEl.classList.remove('hidden')

      const x = param.point.x
      const y = param.point.y

      tooltipEl.style.left = x + 15 + 'px'
      tooltipEl.style.top = y - 15 + 'px'
    })

    return () => {
      tooltipEl.remove()
    }
  }, [chart, candles, activity, selectedMetrics])

  if (candles.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-[#0f0f12] border border-zinc-800 rounded-xl ${className}`}>
        <div className="text-center p-8">
          <p className="text-white/40">No chart data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Metric Selector */}
      <div className="mb-3 flex flex-wrap gap-2">
        {METRICS.map((metric) => {
          const Icon = metric.icon
          const isSelected = selectedMetrics.has(metric.key)
          return (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 border border-transparent'
              }`}
              style={{
                borderColor: isSelected ? metric.color + '40' : undefined,
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? metric.color : undefined }} />
              {metric.label}
            </button>
          )
        })}
      </div>

      {/* Current Price Display */}
      <div className="mb-2 flex items-baseline gap-3">
        <div className="text-2xl font-bold text-white">
          ${candles[candles.length - 1]?.c.toFixed(6) || '0.000000'}
        </div>
        {candles.length > 1 && (() => {
          const lastPrice = candles[candles.length - 1].c
          const prevPrice = candles[candles.length - 2].c
          const change = ((lastPrice - prevPrice) / prevPrice) * 100
          const isPositive = change >= 0
          return (
            <div className={`text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>
          )
        })()}
      </div>

      {/* Chart Container with Contributor Avatars Overlay */}
      <div className="relative">
        <div
          ref={chartRef}
          className="w-full rounded-xl border border-zinc-800 overflow-hidden"
          style={{ height: '380px' }}
        />

        {/* Contributor Avatars positioned on chart */}
        <div className="absolute bottom-2 left-0 right-0 pointer-events-none">
          <div className="flex items-center justify-around px-4">
            {activity
              .filter((a) => a.contributors && a.contributors.length > 0)
              .slice(0, 12)
              .map((point, idx) => (
                <div key={idx} className="flex -space-x-1.5">
                  {point.contributors!.slice(0, 4).map((contributor, cIdx) => (
                    <img
                      key={cIdx}
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-7 h-7 rounded-full border-2 border-[#0f0f12] pointer-events-auto"
                      title={contributor.name}
                    />
                  ))}
                  {point.contributors!.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#0f0f12] flex items-center justify-center text-[9px] text-white/60 font-medium">
                      +{point.contributors!.length - 4}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-white/50 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-indigo-500"></div>
          <span>Price</span>
        </div>
        {Array.from(selectedMetrics).map((key) => {
          const metric = METRICS.find(m => m.key === key)!
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{ background: metric.type === 'histogram' ? metric.color : metric.color + '40' }}
              ></div>
              <span>{metric.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
