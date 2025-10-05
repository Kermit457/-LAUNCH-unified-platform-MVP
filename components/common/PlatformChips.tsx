'use client'

import { Twitter, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Platform } from '@/types/quest'

interface PlatformChipsProps {
  selected: Platform[]
  onChange: (platforms: Platform[]) => void
}

const VideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
)

const platforms: { value: Platform; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'x', label: 'X', Icon: Twitter },
  { value: 'youtube', label: 'YouTube', Icon: VideoIcon },
  { value: 'twitch', label: 'Twitch', Icon: VideoIcon },
  { value: 'tiktok', label: 'TikTok', Icon: Music2 },
]

export function PlatformChips({ selected, onChange }: PlatformChipsProps) {
  const togglePlatform = (platform: Platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter(p => p !== platform))
    } else {
      onChange([...selected, platform])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Platforms <span className="text-fuchsia-400">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {platforms.map(({ value, label, Icon }) => {
          const isSelected = selected.includes(value)

          return (
            <button
              key={value}
              type="button"
              onClick={() => togglePlatform(value)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80",
                "flex items-center gap-2 text-sm font-medium",
                isSelected
                  ? "bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-300"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          )
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-red-400 mt-1">At least one platform required</p>
      )}
    </div>
  )
}
