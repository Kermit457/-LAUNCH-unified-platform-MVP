import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface KpiProps {
  icon: LucideIcon
  label: string
  value: string | number
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
  className?: string
}

export function Kpi({ icon: Icon, label, value, trend, className }: KpiProps) {
  return (
    <div className={cn(
      'rounded-2xl bg-neutral-900/70 border border-white/10 p-5',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon className="w-5 h-5 text-white/70" />
        </div>
        {trend && (
          <div className={cn(
            'text-xs font-semibold',
            trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
          )}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-sm text-white/60">{label}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
    </div>
  )
}
