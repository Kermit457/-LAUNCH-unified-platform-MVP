import { PieChart, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HolderSpreadProps {
  top10Percentage: number
  giniCoefficient: number
  className?: string
  showLabel?: boolean
}

export function HolderSpread({
  top10Percentage,
  giniCoefficient,
  className,
  showLabel = false
}: HolderSpreadProps) {
  // Gini: 0 = perfect equality, 1 = perfect inequality
  // <0.3 = Fair, 0.3-0.5 = Moderate, >0.5 = Concentrated
  const getFairnessLevel = (gini: number) => {
    if (gini < 0.3) return { label: 'Fair', color: 'text-[#00FF88]', bgColor: 'bg-[#00FF88]/10' }
    if (gini < 0.5) return { label: 'Moderate', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' }
    return { label: 'Concentrated', color: 'text-red-400', bgColor: 'bg-red-400/10' }
  }

  const fairness = getFairnessLevel(giniCoefficient)

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {showLabel && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <PieChart className="w-3.5 h-3.5" />
          <span>Distribution:</span>
        </div>
      )}

      <div className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border',
        fairness.bgColor,
        'border-zinc-800'
      )}>
        <div className="flex items-center gap-1">
          <span className="text-zinc-400">Top 10:</span>
          <span className={fairness.color}>{top10Percentage.toFixed(1)}%</span>
        </div>
        <div className="w-px h-3 bg-zinc-700" />
        <div className="flex items-center gap-1">
          <span className="text-zinc-400">Gini:</span>
          <span className={fairness.color}>{giniCoefficient.toFixed(2)}</span>
        </div>
        <div className={cn(
          'ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase',
          fairness.bgColor,
          fairness.color
        )}>
          {fairness.label}
        </div>
      </div>
    </div>
  )
}
