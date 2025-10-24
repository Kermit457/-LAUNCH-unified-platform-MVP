'use client'

import { memo } from 'react'
import { type Clip } from '@/lib/appwrite/services/clips'
import { useRouter } from 'next/navigation'

interface ClipCardScrollProps {
  clip: Clip
  index: number
  onReact: () => void
  onShare: () => void
}

function ClipCardScrollComponent({
  clip,
  index,
  onReact,
  onShare
}: ClipCardScrollProps) {
  const router = useRouter()

  return (
    <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] snap-start snap-always flex items-center justify-center relative bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {clip.thumbnailUrl ? (
          <img
            src={clip.thumbnailUrl}
            alt={clip.title || 'Clip'}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800">
            <div className="text-zinc-600 text-lg">{clip.platform.toUpperCase()} Clip</div>
          </div>
        )}
      </div>

      {/* Glass Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push(`/profile/${clip.submittedBy}`)}
            className="w-10 h-10 rounded-full border-2 border-white/20 bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] flex items-center justify-center overflow-hidden hover:border-white/40 transition-all hover:scale-105"
          >
            <img
              src={clip.creatorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${clip.submittedBy}`}
              alt={clip.creatorUsername || clip.submittedBy}
              className="w-full h-full object-cover"
            />
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => router.push(`/profile/${clip.submittedBy}`)}
              className="text-sm font-medium text-white hover:text-[#D1FD0A] transition-colors flex items-center gap-1"
            >
              @{clip.creatorUsername || clip.submittedBy.slice(0, 12)}
            </button>
            {clip.projectName && (
              <div className="text-xs text-zinc-400 truncate">{clip.projectName}</div>
            )}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-led-dot">{clip.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-led-dot">{clip.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-led-dot">{clip.comments}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#D1FD0A]">
            <span className="text-xs uppercase tracking-wider">Eng</span>
            <span className="text-sm font-led-dot">{clip.engagement.toFixed(1)}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onReact}
            className="flex-1 rounded-lg glass-premium border border-[#D1FD0A]/60 text-sm text-white hover:bg-zinc-800 transition-all active:scale-95 min-h-[48px]"
          >
            Like
          </button>
          <button
            onClick={onShare}
            className="flex-1 rounded-lg glass-premium border border-[#D1FD0A]/60 text-sm text-white hover:bg-zinc-800 transition-all active:scale-95 min-h-[48px]"
          >
            Share
          </button>
        </div>
      </div>

      {/* Swipe Hint - Only on first clip */}
      {index === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D1FD0A]/40">
            <svg className="w-6 h-6 text-[#D1FD0A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export const ClipCardScroll = memo(ClipCardScrollComponent, (prev, next) => {
  // Only re-render if clip data changes
  return (
    prev.clip.$id === next.clip.$id &&
    prev.clip.views === next.clip.views &&
    prev.clip.likes === next.clip.likes &&
    prev.clip.comments === next.clip.comments &&
    prev.index === next.index
  )
})
