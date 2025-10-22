import { Flame, MessageCircle, Eye, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialHeatProps {
  clipsPerMin?: number
  mentionsPerMin?: number
  viewsPerMin?: number
  className?: string
  variant?: 'compact' | 'full'
}

export function SocialHeat({
  clipsPerMin = 0,
  mentionsPerMin = 0,
  viewsPerMin = 0,
  className,
  variant = 'compact'
}: SocialHeatProps) {
  const getHeatLevel = (value: number) => {
    if (value >= 10) return { level: 'hot', icon: '🔥', color: 'text-red-400', bgColor: 'bg-red-400/10' }
    if (value >= 5) return { level: 'warm', icon: '⚡', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' }
    if (value >= 1) return { level: 'cool', icon: '💬', color: 'text-[#00FFFF]', bgColor: 'bg-[#00FFFF]/10' }
    return { level: 'cold', icon: '❄️', color: 'text-zinc-500', bgColor: 'bg-zinc-900/30' }
  }

  const totalActivity = clipsPerMin + mentionsPerMin + (viewsPerMin / 10)
  const heat = getHeatLevel(totalActivity)

  const metrics = [
    { label: 'Clips', value: clipsPerMin, icon: Flame, suffix: '/min' },
    { label: 'Mentions', value: mentionsPerMin, icon: MessageCircle, suffix: '/min' },
    { label: 'Views', value: viewsPerMin, icon: Eye, suffix: '/min' }
  ]

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
          heat.bgColor,
          'border-zinc-800'
        )}>
          <span className="text-lg leading-none">{heat.icon}</span>
          <span className={heat.color}>{totalActivity.toFixed(1)}</span>
          <span className="text-zinc-500 text-[10px]">activity/min</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-300">Social Heat</span>
        <div className={cn(
          'ml-auto px-2 py-0.5 rounded text-xs font-bold uppercase',
          heat.bgColor,
          heat.color
        )}>
          {heat.icon} {heat.level}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className="glass-premium p-3 rounded-lg text-center"
            >
              <Icon className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
              <div className="text-lg font-bold">{metric.value.toFixed(1)}</div>
              <div className="text-[10px] text-zinc-500">{metric.label} {metric.suffix}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
