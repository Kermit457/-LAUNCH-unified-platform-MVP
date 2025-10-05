import { Trophy, Medal } from 'lucide-react'
import { HallOfFameEntry } from '@/types/leaderboard'
import { cn } from '@/lib/cn'

interface HallOfFameProps {
  entries: HallOfFameEntry[]
}

export function HallOfFame({ entries }: HallOfFameProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Trophy, color: 'from-yellow-400 to-yellow-600', text: 'text-yellow-900' }
    if (rank === 2) return { icon: Medal, color: 'from-gray-300 to-gray-500', text: 'text-gray-900' }
    if (rank === 3) return { icon: Medal, color: 'from-orange-400 to-orange-600', text: 'text-orange-900' }
    return { icon: Medal, color: 'from-purple-500 to-pink-600', text: 'text-white' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Hall of Fame</h2>
          <p className="text-white/60">Last Season Top 10 Champions</p>
        </div>
        <a
          href="/season-history"
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
        >
          View Full History
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {entries.map((entry) => {
          const badge = getRankBadge(entry.rank)
          const Icon = badge.icon

          return (
            <div
              key={entry.rank}
              className={cn(
                'relative rounded-xl p-4 border transition-all',
                entry.rank <= 3
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              )}
            >
              {/* Rank Badge */}
              <div className={cn(
                'absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center',
                badge.color
              )}>
                <span className={cn('text-xs font-bold', badge.text)}>#{entry.rank}</span>
              </div>

              {/* Avatar */}
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                {entry.avatar || entry.handle.slice(0, 2).toUpperCase()}
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-bold text-white text-sm truncate mb-0.5">{entry.name}</h3>
                <p className="text-xs text-white/60 truncate mb-2">{entry.handle}</p>

                {/* Score */}
                <div className="flex items-center justify-center gap-1 text-xs">
                  <Icon className="w-3 h-3 text-yellow-400" />
                  <span className="font-bold text-yellow-400">{entry.finalScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
