import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MotionScoreProps {
  score: number // 0-100
  className?: string
}

export function MotionScore({ score, className }: MotionScoreProps) {
  // Color gradient based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-[#00FF88]'
    if (s >= 60) return 'text-yellow-400'
    if (s >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBgColor = (s: number) => {
    if (s >= 80) return 'bg-[#00FF88]/10 border-[#00FF88]/30'
    if (s >= 60) return 'bg-yellow-400/10 border-yellow-400/30'
    if (s >= 40) return 'bg-orange-400/10 border-orange-400/30'
    return 'bg-red-400/10 border-red-400/30'
  }

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all',
      getScoreBgColor(score),
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={cn('w-4 h-4', getScoreColor(score))} />
          <span className="text-xs text-zinc-400">Motion Score</span>
        </div>
        <div className={cn('text-2xl font-black', getScoreColor(score))}>
          {score}
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-2 h-1.5 bg-zinc-900/50 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500 rounded-full',
            score >= 80 ? 'bg-[#00FF88]' :
            score >= 60 ? 'bg-yellow-400' :
            score >= 40 ? 'bg-orange-400' :
            'bg-red-400'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
