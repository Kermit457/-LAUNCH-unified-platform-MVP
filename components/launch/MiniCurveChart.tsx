"use client"

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricePoint {
  timestamp: number
  price: number
}

interface MiniCurveChartProps {
  data: PricePoint[]
  currentPrice: number
  change24h: number
  className?: string
}

export function MiniCurveChart({ data, currentPrice, change24h, className }: MiniCurveChartProps) {
  if (data.length === 0) {
    return (
      <div className={cn('h-12 flex items-center justify-center text-xs text-zinc-600', className)}>
        No price data
      </div>
    )
  }

  const minPrice = Math.min(...data.map(d => d.price))
  const maxPrice = Math.max(...data.map(d => d.price))
  const range = maxPrice - minPrice || 1

  // Normalize to 0-100 range for SVG
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((point.price - minPrice) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const isPositive = change24h >= 0

  return (
    <div className={cn('relative', className)}>
      {/* Chart */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-12"
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? '#00FF88' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#00FF88' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#curveGradient)"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? '#00FF88' : '#ef4444'}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Current position dot */}
        <circle
          cx="100"
          cy={100 - ((currentPrice - minPrice) / range) * 100}
          r="3"
          fill={isPositive ? '#00FF88' : '#ef4444'}
          className="animate-pulse"
        />
      </svg>

      {/* Price label */}
      <div className="absolute top-0 right-0 flex items-center gap-1 px-2 py-0.5 bg-black/80 rounded text-xs font-medium">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-[#00FF88]" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-400" />
        )}
        <span className={isPositive ? 'text-[#00FF88]' : 'text-red-400'}>
          {isPositive ? '+' : ''}{change24h.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}
