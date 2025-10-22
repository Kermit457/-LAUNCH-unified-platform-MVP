import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: number // Percentage change
  className?: string
  valueClassName?: string
  animated?: boolean
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
  valueClassName,
  animated = true
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend || trend === 0) return Minus
    return trend > 0 ? TrendingUp : TrendingDown
  }

  const getTrendColor = () => {
    if (!trend || trend === 0) return 'text-zinc-500'
    return trend > 0 ? 'text-[#00FF88]' : 'text-red-400'
  }

  const TrendIcon = getTrendIcon()

  return (
    <div
      className={cn(
        'glass-premium p-4 rounded-xl md:p-4',
        'snap-start shrink-0 w-[120px] md:w-auto', // Mobile: fixed width, snap scroll
        animated && 'transition-all hover:scale-[1.02]',
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] md:text-xs font-medium text-zinc-400 whitespace-nowrap">{label}</span>
        {Icon && (
          <div className="p-1 md:p-1.5 rounded-lg bg-zinc-900/50">
            <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-400" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className={cn('text-lg md:text-2xl font-black', valueClassName)}>
          {value}
        </div>

        {trend !== undefined && trend !== 0 && (
          <div className={cn('flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-medium', getTrendColor())}>
            <TrendIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span>{Math.abs(trend).toFixed(2)}%</span>
            <span className="text-zinc-500 text-[9px] md:text-[10px]">24h</span>
          </div>
        )}
      </div>
    </div>
  )
}
