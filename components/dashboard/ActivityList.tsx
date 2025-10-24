'use client'

import { Upload, Zap, DollarSign, CheckCircle2, PlusCircle, LucideIcon } from 'lucide-react'

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

export type Activity = {
  id: string
  kind: 'submission' | 'campaign_live' | 'payout' | 'approval' | 'topup'
  title: string
  source?: string
  ts: number
}

interface ActivityListProps {
  activities: Activity[]
}

const iconMap: Record<Activity['kind'], LucideIcon> = {
  submission: Upload,
  campaign_live: Zap,
  payout: DollarSign,
  approval: CheckCircle2,
  topup: PlusCircle,
}

const colorMap: Record<Activity['kind'], string> = {
  submission: 'from-lime-500/20 to-pink-500/20 text-lime-400 border-lime-500/30',
  campaign_live: 'from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30',
  payout: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
  approval: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
  topup: 'from-lime-500/20 to-lime-500/20 text-lime-400 border-lime-500/30',
}

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/60 text-sm">No activity yet. Start by creating a campaign.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = iconMap[activity.kind]
          const colorClass = colorMap[activity.kind]
          const timeAgoStr = timeAgo(activity.ts)

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colorClass} border flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm text-white font-medium">{activity.title}</p>
                  {activity.source && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/20">
                      {activity.source}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50">{timeAgoStr}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Loading skeleton
export function ActivityListSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      <div className="h-6 w-32 bg-white/10 rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
            <div className="w-9 h-9 rounded-lg bg-white/10" />
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
              <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
