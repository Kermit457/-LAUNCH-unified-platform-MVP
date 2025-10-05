import { cn } from '@/lib/cn'

interface RankBadgeProps {
  rank: number
  className?: string
}

export function RankBadge({ rank, className }: RankBadgeProps) {
  const getBadgeStyle = () => {
    if (rank === 1) {
      return {
        gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
        shadow: 'shadow-yellow-500/50',
        ring: 'ring-2 ring-yellow-400/30',
        text: 'text-yellow-900'
      }
    }
    if (rank === 2) {
      return {
        gradient: 'from-gray-300 via-gray-400 to-gray-500',
        shadow: 'shadow-gray-400/50',
        ring: 'ring-2 ring-gray-300/30',
        text: 'text-gray-900'
      }
    }
    if (rank === 3) {
      return {
        gradient: 'from-orange-400 via-orange-500 to-orange-600',
        shadow: 'shadow-orange-500/50',
        ring: 'ring-2 ring-orange-400/30',
        text: 'text-orange-900'
      }
    }
    if (rank <= 10) {
      return {
        gradient: 'from-purple-500 to-pink-600',
        shadow: 'shadow-purple-500/30',
        ring: 'ring-1 ring-white/20',
        text: 'text-white'
      }
    }
    return {
      gradient: 'from-neutral-700 to-neutral-800',
      shadow: '',
      ring: 'ring-1 ring-white/10',
      text: 'text-white/90'
    }
  }

  const style = getBadgeStyle()

  return (
    <div
      className={cn(
        'flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg',
        style.gradient,
        style.shadow,
        style.ring,
        className
      )}
      aria-label={`Rank ${rank}`}
    >
      <span className={cn('text-lg font-bold', style.text)}>
        #{rank}
      </span>
    </div>
  )
}
