import { Video, TrendingUp, Target, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreatorMomentumProps {
  totalViews: number
  viewsChange24h: number
  avgEngagement: number
  activeCampaigns: number
  className?: string
}

export function CreatorMomentum({
  totalViews,
  viewsChange24h,
  avgEngagement,
  activeCampaigns,
  className
}: CreatorMomentumProps) {
  const formatViews = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  const metrics = [
    {
      label: 'Clipping Volume',
      value: formatViews(totalViews),
      change: viewsChange24h,
      icon: Video,
      color: 'text-purple-400'
    },
    {
      label: 'Engagement Rate',
      value: `${avgEngagement.toFixed(2)}%`,
      suffix: 'avg',
      icon: Zap,
      color: 'text-yellow-400'
    },
    {
      label: 'Active Campaigns',
      value: activeCampaigns,
      icon: Target,
      color: 'text-[#00FFFF]'
    }
  ]

  return (
    <div className={cn(
      'glass-premium p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5',
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Video className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-bold text-purple-400">Creator Momentum</h3>
        <div className="ml-auto text-xs text-zinc-500">
          Powered by <span className="text-purple-400">/clip</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900/50">
                <Icon className={cn('w-5 h-5', metric.color)} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-400">{metric.label}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{metric.value}</span>
                  {metric.change !== undefined && (
                    <span className={cn(
                      'text-xs font-medium flex items-center gap-1',
                      metric.change >= 0 ? 'text-[#00FF88]' : 'text-red-400'
                    )}>
                      <TrendingUp className="w-3 h-3" />
                      {metric.change >= 0 ? '+' : ''}{metric.change}% 24h
                    </span>
                  )}
                  {metric.suffix && (
                    <span className="text-xs text-zinc-500">{metric.suffix}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
