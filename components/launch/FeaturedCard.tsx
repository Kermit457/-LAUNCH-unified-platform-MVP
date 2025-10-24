"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Users, Video, Bell, Share2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  IconUpvote,
  IconMessage,
  IconAim,
  IconNotification,
  IconPriceUp,
  IconPriceDown,
  IconSolana,
  IconLab,
  IconTopPerformer,
  IconMotion,
  IconRocket,
  IconCash,
  IconCult,
  IconTrophy
} from '@/lib/icons'
import type { UnifiedCardData } from '../UnifiedCard'

interface FeaturedCardProps {
  data: UnifiedCardData
  onBuyKeys?: (project: UnifiedCardData) => void
  onClipClick?: (project: UnifiedCardData) => void
  onCollaborate?: (project: UnifiedCardData) => void
  index?: number
  rank?: number // Position in featured list (1, 2, 3)
}

/**
 * FeaturedCard - Compact vertical card for 3-column grid
 *
 * Design Philosophy:
 * - Compact height (~450-500px) for 3-across display
 * - Single vertical column (no 2-column internal grid)
 * - Logo reduced from 192px to 80px
 * - Tight spacing (p-4 instead of p-8)
 * - BTDemo style: Lime (#D1FD0A), LED dot font, glass-premium
 * - Horizontal metrics row instead of vertical stack
 * - Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
 */
export function FeaturedCard({
  data,
  onBuyKeys,
  onClipClick,
  onCollaborate,
  index = 0,
  rank
}: FeaturedCardProps) {
  const router = useRouter()
  const [imageLoaded, setImageLoaded] = useState(false)

  // Color schemes by type
  const colorSchemes = {
    icm: {
      badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
      border: 'border-[#D1FD0A]/60',
      icon: IconRocket
    },
    ccm: {
      badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
      border: 'border-[#D1FD0A]/60',
      icon: IconCash
    },
    meme: {
      badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
      border: 'border-[#D1FD0A]/60',
      icon: IconCult
    }
  }

  const scheme = colorSchemes[data.type]
  const IconComponent = scheme.icon

  // Format numbers
  const formatCompact = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.1
      }}
      className={cn(
        "glass-premium p-2 rounded-xl group relative",
        "transition-all duration-500",
        "border-2 border-[#D1FD0A]/50 hover:border-[#D1FD0A]",
        "bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80",
        "flex flex-col h-full",
        "animate-border-glow"
      )}
      role="article"
      aria-label={`Featured project: ${data.title}`}
      style={{
        animation: 'border-glow 3s ease-in-out infinite',
        boxShadow: '0 0 0 2px rgba(209, 253, 10, 0.1), 0 0 20px rgba(209, 253, 10, 0.1)'
      } as any}
    >
      {/* Top Left Ranking Badge */}
      {rank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-br from-[#D1FD0A]/30 to-[#B8E309]/30 border border-[#D1FD0A] backdrop-blur-sm"
        >
          <IconTrophy className="w-3 h-3 text-[#D1FD0A]" />
          <span className="font-led-dot text-[10px] font-black text-[#D1FD0A]">
            #{rank}
          </span>
        </motion.div>
      )}

      {/* Top Right Action Buttons - Notification & Share */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <motion.button
          onClick={data.onNotificationToggle}
          className={cn(
            "p-1.5 rounded-lg transition-all backdrop-blur-sm",
            data.notificationEnabled
              ? "bg-[#D1FD0A]/20 border border-[#D1FD0A]"
              : "bg-zinc-900/60 border border-zinc-700 hover:border-[#D1FD0A]/50"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle notifications"
        >
          <Bell
            className={cn(
              "w-3 h-3",
              data.notificationEnabled ? 'text-[#D1FD0A] fill-[#D1FD0A]' : "text-zinc-400"
            )}
          />
        </motion.button>

        <motion.button
          className="p-1.5 rounded-lg transition-all backdrop-blur-sm bg-zinc-900/60 border border-zinc-700 hover:border-[#D1FD0A]/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share project"
        >
          <Share2 className="w-3 h-3 text-zinc-400 hover:text-[#D1FD0A]" />
        </motion.button>
      </div>

      {/* Logo Section - Centered, Compact (64px) */}
      <div className="relative flex justify-center mb-2">
        <motion.div
          className={cn(
            "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-500",
            scheme.border
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {data.logoUrl ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
              )}
              <img
                src={data.logoUrl}
                alt={`${data.title} logo`}
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {data.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </motion.div>

        {/* Motion Score Badge Overlay - No Glow */}
        <motion.div
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-[#D1FD0A] flex flex-col items-center justify-center border-2 border-black"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          aria-label={`Motion score: ${Math.round(data.beliefScore)}`}
        >
          <div className="text-[7px] font-bold text-black uppercase leading-none">Motion</div>
          <div className="font-led-dot text-base text-black leading-none mt-0.5">
            {Math.round(data.beliefScore)}
          </div>
        </motion.div>

        {/* Top Badges */}
        <div className="absolute -top-1 -right-1 flex gap-1">
          {data.isLab && (
            <IconLab className="w-4 h-4 text-[#D1FD0A] drop-shadow-lg" aria-label="Lab project" />
          )}
          {data.beliefScore >= 90 && (
            <IconTopPerformer className="w-4 h-4 text-[#D1FD0A] drop-shadow-lg" aria-label="Top performer" />
          )}
        </div>
      </div>

      {/* Title + Ticker - Centered */}
      <div className="text-center mb-1.5">
        <h3 className="text-base font-black text-white tracking-tight mb-0.5 line-clamp-1">
          {data.title}
        </h3>
        {data.ticker && (
          <span className="font-led-dot text-xs text-[#D1FD0A]">
            ${data.ticker}
          </span>
        )}
      </div>

      {/* Status + Type Badges - Horizontal */}
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        <span className={cn(
          'px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border',
          data.status === 'live'
            ? 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/40'
            : 'bg-zinc-800/50 text-zinc-400 border-zinc-700'
        )}>
          {data.status}
        </span>

        <div className={cn(
          'flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border text-[9px]',
          scheme.badge
        )}>
          <IconComponent className="w-2.5 h-2.5" aria-hidden="true" />
          <span className="font-bold uppercase">
            {data.type}
          </span>
        </div>
      </div>

      {/* Key Metrics - Single Horizontal Line */}
      <div className="glass-interactive p-1 rounded-lg border border-zinc-800 hover:border-[#D1FD0A]/30 transition-all mb-1.5">
        <div className="flex items-center justify-center gap-2 text-center">
          {/* Market Cap */}
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-zinc-500 uppercase tracking-wider">MCap</span>
            <span className="font-led-dot text-[10px] text-[#00FF88]">
              ${formatCompact(2500000)}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-3 bg-zinc-700" />

          {/* Holders */}
          <div className="flex items-center gap-1">
            <Users className="w-2 h-2 text-zinc-500" aria-hidden="true" />
            <span className="text-[7px] text-zinc-500 uppercase tracking-wider">Hold</span>
            <span className="font-led-dot text-[10px] text-white">
              {formatCompact(data.holders || data.keyHolders?.length || 124)}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-3 bg-zinc-700" />

          {/* Price */}
          <div className="flex items-center gap-1">
            <IconSolana size={7} aria-hidden="true" className="text-zinc-500" />
            <span className="text-[7px] text-zinc-500 uppercase tracking-wider">Price</span>
            <span className="font-led-dot text-[10px] text-[#D1FD0A]">
              {(data.contractPrice || data.currentPrice || 0).toFixed(3)}
            </span>
            {/* 24h Change Inline */}
            {data.priceChange24h !== undefined && (
              <span className={cn(
                'flex items-center gap-0.5 text-[7px] font-bold ml-1',
                data.priceChange24h >= 0 ? 'text-[#00FF88]' : 'text-red-400'
              )}>
                {data.priceChange24h >= 0 ? (
                  <IconPriceUp className="w-1.5 h-1.5" aria-hidden="true" />
                ) : (
                  <IconPriceDown className="w-1.5 h-1.5" aria-hidden="true" />
                )}
                <span className="font-led-dot">
                  {data.priceChange24h >= 0 ? '+' : ''}
                  {data.priceChange24h.toFixed(1)}%
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Community Motion Bar - Compact */}
      <div className="mb-1.5">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-0.5">
            <IconMotion className="w-2 h-2 text-[#D1FD0A]" aria-hidden="true" />
            <span className="text-[7px] font-bold text-zinc-400 uppercase tracking-wider">
              Motion
            </span>
          </div>
          <span className="font-led-dot text-[10px] text-[#D1FD0A]">
            {Math.round(data.beliefScore)}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 relative"
          role="progressbar"
          aria-valuenow={Math.round(data.beliefScore)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Community motion score"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#00FF88] shadow-lg shadow-[#D1FD0A]/50"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, data.beliefScore))}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
          />
        </div>
      </div>

      {/* Secondary Stats - Compact Grid */}
      <div className="grid grid-cols-3 gap-0.5 mb-1.5">
        <div className="glass-interactive p-0.5 rounded border border-zinc-800 text-center">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <IconAim className="w-2 h-2 text-zinc-500" aria-hidden="true" />
            <span className="text-[7px] text-zinc-500">Views</span>
          </div>
          <div className="font-led-dot text-[10px] text-[#D1FD0A]">
            {formatCompact(data.clipViews || data.viewCount || 0)}
          </div>
        </div>

        <div className="glass-interactive p-0.5 rounded border border-zinc-800 text-center">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <IconUpvote className="w-2 h-2 text-zinc-500" aria-hidden="true" />
            <span className="text-[7px] text-zinc-500">Votes</span>
          </div>
          <div className="font-led-dot text-[10px] text-white">
            {data.upvotes}
          </div>
        </div>

        <div className="glass-interactive p-0.5 rounded border border-zinc-800 text-center">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <IconMessage className="w-2 h-2 text-zinc-500" aria-hidden="true" />
            <span className="text-[7px] text-zinc-500">Chat</span>
          </div>
          <div className="font-led-dot text-[10px] text-white">
            {data.commentsCount}
          </div>
        </div>
      </div>

      {/* Contributors - Compact Avatar Row */}
      {data.contributors && data.contributors.length > 0 && (
        <div className="mb-1.5">
          <div className="flex items-center justify-center -space-x-1.5">
            {data.contributors.slice(0, 4).map((contributor, idx) => (
              <motion.div
                key={contributor.id || idx}
                className="relative w-4 h-4 rounded-full border border-zinc-900 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden hover:z-10 transition-transform cursor-pointer"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                title={contributor.name || `@${contributor.twitterHandle}`}
              >
                <img
                  src={
                    contributor.twitterAvatar ||
                    contributor.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.id || idx}`
                  }
                  alt={contributor.name || `@${contributor.twitterHandle}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
            {data.contributorsCount && data.contributorsCount > 4 && (
              <div className="w-4 h-4 rounded-full border border-zinc-900 bg-zinc-800 flex items-center justify-center text-zinc-400 text-[6px] font-bold">
                +{data.contributorsCount - 4}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons - All 4 in One Row */}
      <div className="mt-auto grid grid-cols-4 gap-0.5">
        {/* Buy Keys Button */}
        <motion.button
          onClick={() => onBuyKeys?.(data)}
          className={cn(
            "bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-black",
            "px-0.5 py-1 rounded-md",
            "transition-all duration-300",
            "hover:shadow-xl hover:shadow-[#D1FD0A]/50",
            "flex items-center justify-center gap-0.5",
            "text-[8px]"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Buy keys for ${data.title}`}
        >
          <span>BUY</span>
          {(data.contractPrice || data.currentPrice) && (
            <span className="font-led-dot text-[9px]">
              {(data.contractPrice || data.currentPrice || 0).toFixed(3)}
            </span>
          )}
        </motion.button>

        {/* Clips Button with Video Icon */}
        <motion.button
          onClick={() => onClipClick?.(data)}
          className={cn(
            "bg-zinc-800 hover:bg-zinc-700 font-bold",
            "px-0.5 py-1 rounded-md",
            "transition-all duration-300",
            "border border-[#D1FD0A]",
            "flex items-center justify-center gap-0.5",
            "hover:shadow-lg hover:shadow-[#D1FD0A]/30",
            "text-[8px]"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`View clips for ${data.title}`}
        >
          <Video className="w-2 h-2 text-[#D1FD0A]" aria-hidden="true" />
          <span className="text-[#D1FD0A]">Clips</span>
        </motion.button>

        {/* Collab Button */}
        <motion.button
          onClick={() => onCollaborate?.(data)}
          className={cn(
            "bg-zinc-800 hover:bg-zinc-700 font-bold",
            "px-0.5 py-1 rounded-md",
            "transition-all duration-300",
            "border border-zinc-700 hover:border-[#D1FD0A]/50",
            "flex items-center justify-center gap-0.5",
            "text-zinc-300 hover:text-white",
            "text-[8px]"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Collaborate on ${data.title}`}
        >
          <Users className="w-2 h-2" aria-hidden="true" />
          <span>Collab</span>
        </motion.button>

        {/* Details Button */}
        <motion.button
          onClick={() => router.push(`/launch/${data.id}`)}
          className={cn(
            "bg-zinc-800 hover:bg-zinc-700 font-semibold",
            "px-0.5 py-1 rounded-md",
            "transition-all duration-300",
            "border border-zinc-700 hover:border-[#D1FD0A]/50",
            "text-zinc-300 hover:text-white",
            "text-[8px]"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`View details for ${data.title}`}
        >
          Details
        </motion.button>
      </div>
    </motion.article>
  )
}
