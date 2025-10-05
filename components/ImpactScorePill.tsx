import { cn } from '@/lib/cn'

interface ImpactScorePillProps {
  score: number
  className?: string
}

export function ImpactScorePill({ score, className }: ImpactScorePillProps) {
  const getScoreColor = () => {
    if (score >= 90) return 'from-yellow-400 to-orange-500'
    if (score >= 75) return 'from-purple-500 to-pink-600'
    if (score >= 60) return 'from-blue-500 to-cyan-600'
    if (score >= 45) return 'from-green-500 to-emerald-600'
    return 'from-gray-500 to-gray-600'
  }

  return (
    <div
      className={cn(
        'px-3 py-1.5 rounded-full bg-gradient-to-r shadow-lg flex items-center gap-2',
        getScoreColor(),
        className
      )}
      aria-label={`Impact Score ${score.toFixed(1)}`}
    >
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="text-sm font-bold text-white">
        {score.toFixed(1)}
      </span>
    </div>
  )
}
