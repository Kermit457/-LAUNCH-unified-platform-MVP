'use client'

import { memo } from 'react'
import { type Clip } from '@/lib/appwrite/services/clips'
import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ClipCardGridProps {
  clip: Clip
  isSelected: boolean
  isHovered: boolean
  embedUrl: string | null
  onSelect: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onPlayClip: () => void
  onReact: () => void
  onShare: () => void
}

function ClipCardGridComponent({
  clip,
  isSelected,
  isHovered,
  embedUrl,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  onPlayClip,
  onReact,
  onShare
}: ClipCardGridProps) {
  const router = useRouter()

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group rounded-lg md:rounded-2xl overflow-hidden border bg-white/5 transition-all cursor-pointer",
        isSelected
          ? "border-lime-500 ring-2 ring-lime-500/50 scale-[1.02]"
          : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="relative aspect-[9/16] bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
        {/* Thumbnail - hidden on hover if video available */}
        {clip.thumbnailUrl ? (
          <img
            src={clip.thumbnailUrl}
            alt={clip.title || 'Clip'}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isHovered && embedUrl ? "opacity-0" : "opacity-100"
            )}
          />
        ) : (
          <div className={cn(
            "text-white/30 text-sm transition-opacity duration-300",
            isHovered && embedUrl ? "opacity-0" : "opacity-100"
          )}>
            {clip.platform.toUpperCase()} Clip
          </div>
        )}

        {/* Video Embed - shown on hover */}
        {embedUrl && isHovered && (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        )}

        {/* Creator & Project Branding - Top Overlay */}
        <div className="absolute top-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10">
          <div className="flex items-start gap-1.5 md:gap-2">
            {/* Creator Avatar - Clickable to profile */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/profile/${clip.submittedBy}`)
              }}
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white/20 bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] flex items-center justify-center overflow-hidden hover:border-white/40 transition-all hover:scale-105"
              aria-label={`View ${clip.creatorUsername || clip.submittedBy}'s profile`}
            >
              <img
                src={clip.creatorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${clip.submittedBy}`}
                alt={clip.creatorUsername || clip.submittedBy}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>

            <div className="flex-1 min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/profile/${clip.submittedBy}`)
                }}
                className="text-[10px] md:text-xs font-medium text-white/90 truncate hover:text-white hover:underline transition-colors flex items-center gap-0.5 md:gap-1"
              >
                {clip.creatorUsername ? (
                  <>
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 fill-[#1DA1F2]" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>@{clip.creatorUsername}</span>
                  </>
                ) : (
                  <span>@{clip.submittedBy.slice(0, 12)}</span>
                )}
              </button>
            </div>

            {/* Platform Logo Badge - Top Right */}
            <div className={cn(
              "w-7 h-7 md:w-9 md:h-9 rounded-md md:rounded-lg flex items-center justify-center",
              clip.platform === 'youtube' && "bg-red-600",
              clip.platform === 'tiktok' && "bg-black",
              clip.platform === 'twitter' && "bg-black",
              clip.platform === 'twitch' && "bg-lime-600",
              clip.platform === 'instagram' && "bg-gradient-to-br from-lime-500 via-lime-500 to-orange-500"
            )}>
              {clip.platform === 'twitter' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              )}
              {clip.platform === 'tiktok' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              )}
              {clip.platform === 'youtube' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              )}
              {clip.platform === 'twitch' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              )}
              {clip.platform === 'instagram' && (
                <svg className="w-4 h-4 md:w-5 md:h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Play button - only show when NOT hovering or no embed available */}
        {!(embedUrl && isHovered) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlayClip()
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
          >
            <Play className="w-12 h-12 text-white drop-shadow-lg" />
          </button>
        )}

        {isSelected && (
          <div className="absolute top-3 right-3 bg-lime-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Selected
          </div>
        )}

        {/* Metrics Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div className="flex flex-col gap-0.5">
              <div className="text-[10px] md:text-xs font-semibold font-led-dot">{clip.views.toLocaleString()}</div>
              <div className="text-[8px] md:text-[10px] text-white/60">views</div>
            </div>
            <div className="flex flex-col gap-0.5 items-center">
              <div className="text-[10px] md:text-xs font-semibold font-led-dot">{clip.likes.toLocaleString()}</div>
              <div className="text-[8px] md:text-[10px] text-white/60">likes</div>
            </div>
            <div className="flex flex-col gap-0.5 items-center">
              <div className="text-[10px] md:text-xs font-semibold font-led-dot">{clip.comments.toLocaleString()}</div>
              <div className="text-[8px] md:text-[10px] text-white/60">cmnt</div>
            </div>
            <div className="flex flex-col gap-0.5 items-end">
              <div className="text-[10px] md:text-xs font-semibold text-[#D1FD0A] font-led-dot">{clip.engagement.toFixed(1)}%</div>
              <div className="text-[8px] md:text-[10px] text-white/60">eng</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-3 space-y-2 md:space-y-2">
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Project Logo */}
          {(clip.projectLogo || clip.projectName) && (
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              {clip.projectLogo ? (
                <img
                  src={clip.projectLogo}
                  alt={clip.projectName || 'Project'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[9px] md:text-[10px] font-bold text-white/80">
                  {clip.projectName?.slice(0, 3).toUpperCase()}
                </div>
              )}
            </div>
          )}
          <div className="text-[11px] md:text-sm font-semibold truncate flex-1">
            {clip.projectName || clip.title || `Clip #${clip.clipId.slice(-6)}`}
          </div>
        </div>

        <div className="flex gap-1.5 md:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onReact()
            }}
            className="flex-1 rounded-md md:rounded-lg border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10 transition active:scale-95"
          >
            Like
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onShare()
            }}
            className="flex-1 rounded-md md:rounded-lg border border-white/10 bg-white/5 text-[10px] md:text-xs hover:bg-white/10 transition active:scale-95"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

export const ClipCardGrid = memo(ClipCardGridComponent, (prev, next) => {
  // Only re-render if these specific props change
  return (
    prev.clip.$id === next.clip.$id &&
    prev.clip.views === next.clip.views &&
    prev.clip.likes === next.clip.likes &&
    prev.clip.comments === next.clip.comments &&
    prev.isSelected === next.isSelected &&
    prev.isHovered === next.isHovered &&
    prev.embedUrl === next.embedUrl
  )
})
