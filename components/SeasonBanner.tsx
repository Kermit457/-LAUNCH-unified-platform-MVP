import { Calendar, DollarSign, ExternalLink } from 'lucide-react'
import { SeasonInfo } from '@/types/leaderboard'

interface SeasonBannerProps {
  season: SeasonInfo
}

export function SeasonBanner({ season }: SeasonBannerProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatPrizePool = (amount: number) => {
    return `$${(amount / 1000).toLocaleString('en-US')}K`
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-950/60 via-pink-950/40 to-neutral-900/60 border border-lime-500/30 p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative">
        {/* Season Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 rounded-full bg-lime-500/20 border border-lime-400/30 text-lime-300 text-xs font-bold">
                SEASON {season.number}
              </div>
              <h2 className="text-3xl font-bold text-white">{season.name}</h2>
            </div>
            <p className="text-white/70 text-lg max-w-3xl">
              Earn points from earnings, verified views, approved submissions, live hours, conviction gains, and boosts.
            </p>
          </div>

          {/* Prize Pool */}
          <div className="flex-shrink-0 px-6 py-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Prize Pool</span>
            </div>
            <div className="text-3xl font-bold text-white">{formatPrizePool(season.prizePoolUsd)}</div>
          </div>
        </div>

        {/* Season Info Row */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {formatDate(season.startDate)} → {formatDate(season.endDate)}
            </span>
          </div>

          <a
            href={season.rulesUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium text-sm transition-all"
          >
            View Season Rules
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
