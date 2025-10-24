'use client'

import { IconSearch } from '@/lib/icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onCreateCampaign: () => void
  onSubmitClip: () => void
  viewMode: 'scroll' | 'grid'
  isMobile: boolean
}

export function SearchBar({
  value,
  onChange,
  onCreateCampaign,
  onSubmitClip,
  viewMode,
  isMobile
}: SearchBarProps) {
  // Only show search bar in Grid mode OR on desktop
  if (viewMode !== 'grid' && isMobile) {
    return null
  }

  return (
    <div className="mx-auto max-w-7xl px-3 md:px-4 py-2 md:py-3">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search clips, creators, projects..."
            aria-label="Search clips, creators, and projects"
            className="w-full rounded-lg md:rounded-xl glass-premium border border-[#D1FD0A]/20 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A] placeholder:text-zinc-500 transition-all text-white"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-2 md:right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-[10px] md:text-xs transition"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          {!value && (
            <IconSearch className="absolute right-2 md:right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          )}
        </div>
        <button
          onClick={onCreateCampaign}
          className="hidden md:flex flex-shrink-0 rounded-lg md:rounded-xl bg-[#D1FD0A] hover:bg-[#B8E309] text-black px-4 md:px-5 py-2.5 md:py-2.5 text-sm md:text-sm font-bold min-h-[44px] items-center justify-center transition-all hover:scale-105"
        >
          Start Campaign
        </button>
        <button
          onClick={onSubmitClip}
          className="flex-shrink-0 rounded-lg md:rounded-xl bg-[#D1FD0A] hover:bg-[#B8E309] text-black px-4 md:px-5 py-2.5 md:py-2.5 text-sm md:text-sm font-bold min-h-[44px] flex items-center justify-center transition-all hover:scale-105"
        >
          + Clip
        </button>
      </div>
    </div>
  )
}
