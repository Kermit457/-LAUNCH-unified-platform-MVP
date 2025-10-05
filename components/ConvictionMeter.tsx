import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ConvictionMeterProps {
  convictionPct: number
  delta7d: number
  className?: string
}

export function ConvictionMeter({ convictionPct, delta7d, className }: ConvictionMeterProps) {
  const getDeltaIcon = () => {
    if (delta7d > 0) return <ArrowUp className="w-3 h-3" />
    if (delta7d < 0) return <ArrowDown className="w-3 h-3" />
    return <Minus className="w-3 h-3" />
  }

  const getDeltaColor = () => {
    if (delta7d > 0) return 'text-green-400'
    if (delta7d < 0) return 'text-red-400'
    return 'text-white/40'
  }

  const getConvictionColor = () => {
    if (convictionPct >= 80) return 'text-green-400'
    if (convictionPct >= 60) return 'text-cyan-400'
    if (convictionPct >= 40) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex flex-col">
        <span className="text-[10px] text-white/40 uppercase tracking-wide">Conviction</span>
        <span className={cn('text-lg font-bold', getConvictionColor())}>
          {convictionPct}%
        </span>
      </div>
      <div className={cn('flex items-center gap-0.5 text-xs font-semibold', getDeltaColor())}>
        {getDeltaIcon()}
        <span>{Math.abs(delta7d).toFixed(1)}%</span>
      </div>
    </div>
  )
}
