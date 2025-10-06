"use client"

import { useState, useEffect } from 'react'
import { Bell, TrendingUp, Eye, Heart, Clock } from 'lucide-react'
import { BaseLaunchCard } from './BaseLaunchCard'
import { LaunchCardData } from '@/types/launch'
import { fmtTimeUntil, fmtDateTime } from '@/lib/format'

interface UpcomingLaunchCardProps {
  data: LaunchCardData
  onUpvote?: (id: string) => void
  onComment?: (id: string) => void
  onBoost?: (id: string) => void
  onFollow?: (id: string) => void
  onView?: (id: string) => void
  onSetReminder?: (id: string) => void
}

export function UpcomingLaunchCard({
  data,
  onUpvote,
  onComment,
  onBoost,
  onFollow,
  onView,
  onSetReminder,
}: UpcomingLaunchCardProps) {
  const [countdown, setCountdown] = useState<string>('')
  const [reminderSet, setReminderSet] = useState(false)

  // Update countdown every second
  useEffect(() => {
    if (!data.tgeAt) return

    const updateCountdown = () => {
      setCountdown(fmtTimeUntil(data.tgeAt!))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [data.tgeAt])

  const handleSetReminder = () => {
    setReminderSet(true)
    onSetReminder?.(data.id)
    // Reset after 2 seconds
    setTimeout(() => setReminderSet(false), 2000)
  }

  return (
    <BaseLaunchCard data={data} onUpvote={onUpvote} onComment={onComment}>
      {/* TGE Countdown */}
      {data.tgeAt && (
        <div className="mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-300">
                  TGE {countdown}
                </span>
                {/* Tooltip with exact datetime */}
                <div
                  className="text-xs text-white/50 hidden sm:block"
                  title={fmtDateTime(data.tgeAt)}
                >
                  ({fmtDateTime(data.tgeAt)})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Boost */}
        <button
          onClick={() => onBoost?.(data.id)}
          className="flex-1 min-w-[100px] h-9 px-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 flex items-center justify-center gap-1.5"
          data-cta="card-boost-upcoming"
        >
          <TrendingUp className="w-4 h-4" />
          Boost
        </button>

        {/* Follow */}
        <button
          onClick={() => onFollow?.(data.id)}
          className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-1.5"
          data-cta="card-follow-upcoming"
        >
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline">Follow</span>
        </button>

        {/* View Launch */}
        <button
          onClick={() => onView?.(data.id)}
          className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-1.5"
          data-cta="card-view-upcoming"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">View Launch</span>
        </button>

        {/* Set Reminder */}
        <button
          onClick={handleSetReminder}
          disabled={reminderSet}
          className="h-9 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          data-cta="card-set-reminder"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">{reminderSet ? 'Reminder Set!' : 'Set Reminder'}</span>
        </button>
      </div>
    </BaseLaunchCard>
  )
}
