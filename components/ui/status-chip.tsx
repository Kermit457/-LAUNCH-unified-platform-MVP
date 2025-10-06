import * as React from "react"
import { cn } from "@/lib/cn"

interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: 'live' | 'upcoming' | 'ended' | 'icm' | 'ccm'
}

export function StatusChip({ type, className, ...props }: StatusChipProps) {
  const styles = {
    live: 'bg-emerald-500/10 text-emerald-500 border-emerald-600/30',
    upcoming: 'bg-amber-500/10 text-amber-500 border-amber-600/30',
    ended: 'bg-gray-500/10 text-gray-500 border-gray-600/30',
    icm: 'bg-cyan-500/10 text-cyan-500 border-cyan-600/30',
    ccm: 'bg-purple-500/10 text-purple-500 border-purple-600/30',
  }

  const labels = {
    live: 'LIVE',
    upcoming: 'UPCOMING',
    ended: 'ENDED',
    icm: 'ICM',
    ccm: 'CCM',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border',
        styles[type],
        className
      )}
      {...props}
    >
      {type === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {labels[type]}
    </span>
  )
}
