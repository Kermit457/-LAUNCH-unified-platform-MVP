import * as React from "react"
import { cn } from "@/lib/cn"

interface ConvictionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number
  label?: string
  showPercentage?: boolean
}

export function ConvictionBar({
  percentage,
  label = 'Conviction',
  showPercentage = true,
  className,
  ...props
}: ConvictionBarProps) {
  return (
    <div className={className} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>}
          {showPercentage && <span className="text-sm font-bold text-white">{percentage}%</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
