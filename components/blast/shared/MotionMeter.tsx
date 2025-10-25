/**
 * MotionMeter - Display Motion Score with live updates
 */

'use client'

import { Zap, TrendingUp, TrendingDown } from 'lucide-react'
import { useMotionScore } from '@/hooks/blast/useMotionScore'
import { cn } from '@/lib/utils'

interface MotionMeterProps {
  userId: string
  className?: string
  showBreakdown?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function MotionMeter({
  userId,
  className,
  showBreakdown = false,
  size = 'md'
}: MotionMeterProps) {
  const { data: score, isLoading } = useMotionScore(userId)

  if (isLoading || !score) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-6 w-12 bg-zinc-800 rounded" />
      </div>
    )
  }

  const current = score.current
  const decay = score.decay

  // Color based on score
  const getColor = () => {
    if (current >= 80) return 'text-[#00FF88]'
    if (current >= 60) return 'text-yellow-400'
    if (current >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getBgColor = () => {
    if (current >= 80) return 'bg-[#00FF88]/10'
    if (current >= 60) return 'bg-yellow-400/10'
    if (current >= 40) return 'bg-orange-400/10'
    return 'bg-red-400/10'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Score display */}
      <div className={cn(
        'inline-flex items-center gap-2 rounded-lg',
        getBgColor(),
        sizeClasses[size]
      )}>
        <Zap className={cn('w-3 h-3', getColor())} />
        <span className={cn('font-black', getColor())}>
          {current}
        </span>
        {size !== 'sm' && (
          <span className="text-xs text-zinc-400">Motion</span>
        )}

        {/* Decay indicator */}
        {decay > 0 && size !== 'sm' && (
          <span className="text-xs text-red-400 flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3" />
            {Math.round(decay)}
          </span>
        )}
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>Base Score:</span>
            <span className="text-white">{Math.round(score.base)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Decay (72h):</span>
            <span className="text-red-400">-{Math.round(score.decay)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Peak Score:</span>
            <span className="text-[#00FF88]">{score.peak}</span>
          </div>
        </div>
      )}

      {/* Signal breakdown */}
      {showBreakdown && score.signals && (
        <div className="space-y-1 text-xs pt-2 border-t border-zinc-800">
          {Object.entries(score.signals)
            .filter(([_, value]) => value > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // Top 5 signals
            .map(([signal, value]) => (
              <div key={signal} className="flex justify-between">
                <span className="text-zinc-400 capitalize">
                  {signal.replace(/_/g, ' ')}:
                </span>
                <span className="text-green-400">+{value}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

/**
 * Compact inline motion score
 */
export function InlineMotionScore({
  score,
  className
}: {
  score: number
  className?: string
}) {
  const getColor = () => {
    if (score >= 80) return 'text-[#00FF88]'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <span className={cn('inline-flex items-center gap-1 font-bold', getColor(), className)}>
      <Zap className="w-3 h-3" />
      {score}
    </span>
  )
}
