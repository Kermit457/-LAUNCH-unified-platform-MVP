"use client"

import { useRealtimeActivities } from '@/hooks/useRealtimeActivities'
import { useUser } from '@/hooks/useUser'
import { ActivityCard } from './ActivityCard'
import { markActivityAsRead } from '@/lib/appwrite/services/activities'
import { useState } from 'react'

export function ActivitiesFeed() {
  const { userId } = useUser()
  const { activities, loading, error, unreadCount } = useRealtimeActivities(
    userId || '',
    20  // Show last 20 activities
  )
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const handleMarkAsRead = async (activityId: string) => {
    try {
      await markActivityAsRead(activityId)
      // Real-time subscription will update the UI
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const filteredActivities = filter === 'unread'
    ? activities.filter(a => !a.read)
    : activities

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">Activity</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-lime-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-green-400 ml-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-lime-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-lime-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/40">
            {filter === 'unread' ? 'No unread activities' : 'No activities yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredActivities.map(activity => (
            <ActivityCard
              key={activity.$id}
              activity={activity}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}
