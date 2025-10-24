'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AdvancedFiltersProps {
  platforms: string[]
  minEngagement: number | undefined
  dateFrom: string | undefined
  dateTo: string | undefined
  onPlatformsChange: (platforms: string[]) => void
  onMinEngagementChange: (value: number | undefined) => void
  onDateFromChange: (date: string | undefined) => void
  onDateToChange: (date: string | undefined) => void
  onClearFilters: () => void
}

const AVAILABLE_PLATFORMS = [
  { value: 'youtube', label: 'YouTube', color: 'bg-red-600' },
  { value: 'tiktok', label: 'TikTok', color: 'bg-black' },
  { value: 'twitter', label: 'Twitter', color: 'bg-black' },
  { value: 'twitch', label: 'Twitch', color: 'bg-purple-600' },
  { value: 'instagram', label: 'Instagram', color: 'bg-pink-600' }
]

export function AdvancedFilters({
  platforms,
  minEngagement,
  dateFrom,
  dateTo,
  onPlatformsChange,
  onMinEngagementChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const togglePlatform = (platform: string) => {
    if (platforms.includes(platform)) {
      onPlatformsChange(platforms.filter(p => p !== platform))
    } else {
      onPlatformsChange([...platforms, platform])
    }
  }

  const hasActiveFilters = platforms.length > 0 || minEngagement !== undefined || dateFrom || dateTo

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Advanced Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full bg-[#D1FD0A] text-black text-xs font-bold">
              {[platforms.length, minEngagement ? 1 : 0, dateFrom ? 1 : 0, dateTo ? 1 : 0].filter(Boolean).reduce((a, b) => a + b, 0)}
            </span>
          )}
        </div>
        <svg className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Options */}
      {isExpanded && (
        <div className="space-y-4 p-4 rounded-xl border border-white/10 bg-white/5">
          {/* Platform Filter */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PLATFORMS.map(platform => (
                <button
                  key={platform.value}
                  onClick={() => togglePlatform(platform.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    platforms.includes(platform.value)
                      ? "bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-black"
                      : "border border-white/10 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          {/* Engagement Filter */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Minimum Engagement %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={minEngagement || ''}
              onChange={(e) => onMinEngagementChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="e.g., 5.0"
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]"
            />
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom || ''}
                onChange={(e) => onDateFromChange(e.target.value || undefined)}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateTo || ''}
                onChange={(e) => onDateToChange(e.target.value || undefined)}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm text-white/80 hover:text-white"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
