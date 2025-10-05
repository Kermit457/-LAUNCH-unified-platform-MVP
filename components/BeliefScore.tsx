'use client'

interface BeliefScoreProps {
  score: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function BeliefScore({ score, size = 'md', showLabel = true }: BeliefScoreProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'belief-score-high'
    if (score >= 40) return 'belief-score-medium'
    return 'belief-score-low'
  }

  const getScoreText = (score: number) => {
    if (score >= 70) return 'High Confidence'
    if (score >= 40) return 'Med Confidence'
    return 'Low Confidence'
  }

  const sizeClasses = {
    sm: 'w-16 h-2',
    md: 'w-24 h-3',
    lg: 'w-32 h-4',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className="flex items-center gap-3">
      {/* Score Bar */}
      <div className={`relative ${sizeClasses[size]} bg-white/10 rounded-full overflow-hidden`}>
        <div
          className={`absolute left-0 top-0 h-full ${getScoreColor(score)} transition-all duration-500 animate-belief-pulse`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Score Label */}
      {showLabel && (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${textSizeClasses[size]} gradient-text-launchos`}>
            {score}%
          </span>
          <span className={`${textSizeClasses[size]} text-white/60`}>
            {getScoreText(score)}
          </span>
        </div>
      )}
    </div>
  )
}
