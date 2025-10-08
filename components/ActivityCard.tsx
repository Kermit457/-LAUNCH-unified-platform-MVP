"use client"

import { Activity } from '@/lib/appwrite/services/activities'
import {
  MessageSquare,
  Rocket,
  DollarSign,
  CheckCircle,
  Users,
  TrendingUp,
  Coins
} from 'lucide-react'

const activityIcons = {
  submission: MessageSquare,
  campaign_live: Rocket,
  payout: DollarSign,
  approval: CheckCircle,
  topup: Coins,
  network: Users,
  launch: TrendingUp,
}

const activityColors = {
  submission: 'text-cyan-400',
  campaign_live: 'text-fuchsia-400',
  payout: 'text-green-400',
  approval: 'text-emerald-400',
  topup: 'text-amber-400',
  network: 'text-purple-400',
  launch: 'text-orange-400',
}

interface ActivityCardProps {
  activity: Activity
  onMarkAsRead?: (id: string) => void
}

export function ActivityCard({ activity, onMarkAsRead }: ActivityCardProps) {
  const Icon = activityIcons[activity.type] || MessageSquare
  const iconColor = activityColors[activity.type] || 'text-white'

  const timeAgo = getTimeAgo(new Date(activity.$createdAt))

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer
        ${activity.read
          ? 'bg-white/[0.02] border-white/5'
          : 'bg-fuchsia-500/5 border-fuchsia-500/20 hover:bg-fuchsia-500/10'
        }
      `}
      onClick={() => !activity.read && onMarkAsRead?.(activity.$id)}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{activity.title}</p>
        {activity.message && (
          <p className="text-xs text-white/60 mt-0.5">{activity.message}</p>
        )}
        <p className="text-xs text-white/40 mt-1">{timeAgo}</p>
      </div>

      {/* Unread indicator */}
      {!activity.read && (
        <div className="w-2 h-2 bg-fuchsia-500 rounded-full flex-shrink-0 animate-pulse"></div>
      )}
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}