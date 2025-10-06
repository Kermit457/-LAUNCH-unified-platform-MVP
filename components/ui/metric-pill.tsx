import * as React from "react"
import { cn } from "@/lib/cn"

interface MetricPillProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  variant?: 'default' | 'positive' | 'negative'
}

export function MetricPill({
  label,
  value,
  change,
  icon,
  variant = 'default',
  className,
  ...props
}: MetricPillProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-3 border transition-all duration-150',
        variant === 'default' && 'bg-white/5 border-zinc-800',
        variant === 'positive' && 'bg-emerald-500/10 border-emerald-600/30',
        variant === 'negative' && 'bg-red-500/10 border-red-600/30',
        'hover:border-white/20',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-white/60">{icon}</span>}
        <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-white">{value}</span>
        {change !== undefined && (
          <span
            className={cn(
              'text-xs font-medium',
              change >= 0 ? 'text-emerald-500' : 'text-red-500'
            )}
          >
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  )
}
