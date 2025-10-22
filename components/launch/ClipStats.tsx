import { Video, Eye, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClipStatsProps {
  clipCount: number
  totalViews: number
  avgCTR: number
  className?: string
  variant?: 'inline' | 'detailed'
}

export function ClipStats({
  clipCount,
  totalViews,
  avgCTR,
  className,
  variant = 'inline'
}: ClipStatsProps) {
  const formatViews = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  if (variant === 'inline') {
    return (
      <div className={cn(
        'flex items-center gap-3 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20',
        className
      )}>
        <Video className="w-4 h-4 text-purple-400" />
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Clips:</span>
          <span className="font-bold text-purple-400">{clipCount}</span>
          <div className="w-px h-3 bg-zinc-700" />
          <span className="text-zinc-400">Views:</span>
          <span className="font-bold">{formatViews(totalViews)}</span>
          <div className="w-px h-3 bg-zinc-700" />
          <span className="text-zinc-400">CTR:</span>
          <span className={cn(
            'font-bold',
            avgCTR >= 1 ? 'text-[#00FF88]' : avgCTR >= 0.5 ? 'text-yellow-400' : 'text-zinc-400'
          )}>
            {avgCTR.toFixed(1)}%
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
        <Video className="w-4 h-4" />
        Clip Performance
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-xs text-zinc-500 mb-1">Clips</div>
          <div className="text-lg font-bold text-purple-400">{clipCount}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-zinc-500 mb-1">Total Views</div>
          <div className="text-lg font-bold">{formatViews(totalViews)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-zinc-500 mb-1">Avg CTR</div>
          <div className={cn(
            'text-lg font-bold',
            avgCTR >= 1 ? 'text-[#00FF88]' : avgCTR >= 0.5 ? 'text-yellow-400' : 'text-zinc-400'
          )}>
            {avgCTR.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  )
}
