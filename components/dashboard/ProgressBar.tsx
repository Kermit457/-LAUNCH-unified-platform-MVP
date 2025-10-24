import { cn } from '@/lib/cn'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({ value, max, label, showPercentage = true, className }: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100)

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-white/70">{label}</span>}
          {showPercentage && (
            <span className="text-white font-medium">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            percentage >= 90 ? 'bg-red-500' :
            percentage >= 70 ? 'bg-yellow-500' :
            'bg-gradient-to-r from-[#D1FD0A] to-[#B8E008]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}