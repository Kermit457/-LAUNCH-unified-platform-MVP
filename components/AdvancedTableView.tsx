"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  IconUpvote,
  IconAim,
  IconPriceUp,
  IconPriceDown,
  IconTwitter,
  IconWeb,
  IconTelegram,
  IconSolana,
  IconLightning,
  IconLab,
  IconTopPerformer,
  IconNetwork
} from '@/lib/icons'
import { cn } from '@/lib/cn'
import type { AdvancedListingData } from '@/lib/advancedTradingData'
import { formatTimeAgo, formatSOL } from '@/lib/advancedTradingData'

interface AdvancedTableViewProps {
  listings: AdvancedListingData[]
  onBuyClick?: (listing: AdvancedListingData, amount: number) => void
  onCollaborateClick?: (listing: AdvancedListingData) => void
  onCommentClick?: (listing: AdvancedListingData) => void
  onRowClick?: (listing: AdvancedListingData) => void
}

export function AdvancedTableView({ listings, onBuyClick, onCollaborateClick, onCommentClick, onRowClick }: AdvancedTableViewProps) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar">
      <table className="w-full min-w-[600px] md:min-w-[900px] border-separate border-spacing-0">
        <thead>
          <tr className="text-[10px] md:text-xs font-medium text-zinc-400 uppercase tracking-wider">
            <th className="px-2 md:px-4 py-2 md:py-3 text-left border-b border-zinc-800 min-w-[40px] md:min-w-[60px]">
              Rank
            </th>
            <th className="sticky left-0 z-10 bg-black/90 backdrop-blur-xl px-2 md:px-4 py-2 md:py-3 text-left border-b border-zinc-800 min-w-[140px] md:min-w-[280px]">
              Token
            </th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-center border-b border-zinc-800 min-w-[70px] md:min-w-[100px]">Motion</th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-center border-b border-zinc-800 min-w-[60px] md:min-w-[100px]">
              Upvote
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-center border-b border-zinc-800 min-w-[80px]">
              Views
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-center border-b border-zinc-800 min-w-[100px]">
              Comments
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-center border-b border-zinc-800 min-w-[100px]">
              Holders
            </th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-right border-b border-zinc-800 min-w-[80px] md:min-w-[120px]">Price</th>
            <th className="hidden sm:table-cell px-2 md:px-4 py-2 md:py-3 text-left border-b border-zinc-800 min-w-[100px] md:min-w-[150px]">Creator</th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-center border-b border-zinc-800 min-w-[100px] md:min-w-[150px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing, index) => (
            <TableRow
              key={listing.id}
              listing={listing}
              index={index}
              rank={index + 1}
              onBuyClick={onBuyClick}
              onCollaborateClick={onCollaborateClick}
              onCommentClick={onCommentClick}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableRow({
  listing,
  index,
  rank,
  onBuyClick,
  onCollaborateClick,
  onCommentClick,
  onRowClick
}: {
  listing: AdvancedListingData
  index: number
  rank: number
  onBuyClick?: (listing: AdvancedListingData, amount: number) => void
  onCollaborateClick?: (listing: AdvancedListingData) => void
  onCommentClick?: (listing: AdvancedListingData) => void
  onRowClick?: (listing: AdvancedListingData) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasVoted, setHasVoted] = useState(listing.hasVoted || false)
  const [upvotes, setUpvotes] = useState(listing.upvotes)

  // Type-based styling - btdemo design
  const typeColors = {
    icm: {
      bg: 'from-[#D1FD0A]/10 to-[#D1FD0A]/5',
      border: 'border-[#D1FD0A]/30',
      text: 'text-[#D1FD0A]',
      glow: 'shadow-[#D1FD0A]/20',
      badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30'
    },
    ccm: {
      bg: 'from-[#D1FD0A]/10 to-[#D1FD0A]/5',
      border: 'border-[#D1FD0A]/30',
      text: 'text-[#D1FD0A]',
      glow: 'shadow-[#D1FD0A]/20',
      badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30'
    },
    meme: {
      bg: 'from-[#D1FD0A]/10 to-[#D1FD0A]/5',
      border: 'border-[#D1FD0A]/30',
      text: 'text-[#D1FD0A]',
      glow: 'shadow-[#D1FD0A]/20',
      badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30'
    }
  }

  const colors = typeColors[listing.type]
  const timeAgo = formatTimeAgo(listing.metrics.createdAt)
  const isPositive = (listing.priceChange24h ?? 0) >= 0

  const handleVote = async () => {
    if (listing.onVote) {
      await listing.onVote()
    }
    setHasVoted(!hasVoted)
    setUpvotes(prev => hasVoted ? prev - 1 : prev + 1)
  }

  // Status badge colors - btdemo design
  const statusColors = {
    live: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/40',        // Lime
    active: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/40',      // Lime
    upcoming: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',       // Zinc
    frozen: 'bg-orange-500/20 text-orange-400 border-orange-500/40',   // Orange
    ended: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',          // Zinc
    launched: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/40'     // Lime
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onRowClick?.(listing)}
      className={cn(
        "group transition-all duration-200 cursor-pointer",
        isHovered && "bg-zinc-900/50"
      )}
    >
      {/* Rank Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <span className="font-led-dot text-[#D1FD0A] text-base">#{rank}</span>
      </td>

      {/* Token Column */}
      <td className={cn(
        "sticky left-0 z-10 px-2 md:px-4 py-3 border-b border-zinc-800/50",
        isHovered ? "bg-zinc-900/90 backdrop-blur-xl" : "bg-black/90 backdrop-blur-xl"
      )}>
        <div className="flex items-center gap-2 md:gap-3 min-w-[180px] md:min-w-[280px]">
          {/* Token Icon */}
          <div className={cn(
            "relative w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 flex-shrink-0 overflow-hidden",
            colors.border,
            colors.glow
          )}>
            {listing.logoUrl ? (
              <img
                src={listing.logoUrl}
                alt={listing.ticker}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={cn(
                "w-full h-full flex items-center justify-center bg-gradient-to-br text-lg md:text-xl font-bold",
                colors.bg,
                colors.text
              )}>
                {listing.ticker?.[0] || '?'}
              </div>
            )}
          </div>

          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
              <h3 className="font-bold text-white text-xs md:text-sm truncate">
                {listing.title}
              </h3>
              {listing.ticker && (
                <span className="font-led-dot text-xs md:text-sm text-[#D1FD0A] tracking-wider">
                  ${listing.ticker}
                </span>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-1 md:gap-2">
              <span className={cn(
                "px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs font-medium border",
                statusColors[listing.status || 'active']
              )}>
                {(listing.status || 'ACTIVE').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Motion Score Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <div className="flex flex-col items-center gap-0.5 md:gap-1">
          <div className="font-led-dot text-xl md:text-2xl text-primary">
            {listing.beliefScore}
          </div>
          <div className="w-12 md:w-16 h-1 md:h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${listing.beliefScore}%` }}
              transition={{ duration: 0.8, delay: index * 0.02 }}
              className="h-full rounded-full bg-[#D1FD0A]"
            />
          </div>
        </div>
      </td>

      {/* Upvotes Column with Button - Toggles Vote */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setHasVoted(!hasVoted)
            setUpvotes(hasVoted ? upvotes - 1 : upvotes + 1)
          }}
          className={cn(
            "flex flex-col items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-all group/vote mx-auto cursor-pointer",
            hasVoted
              ? "bg-[#D1FD0A]/20 border-[#D1FD0A]/40 border"
              : "bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700"
          )}
        >
          <IconUpvote className={cn(
            "w-3 h-3 md:w-4 md:h-4 transition-all",
            hasVoted ? "text-[#D1FD0A]" : "text-zinc-400 group-hover/vote:text-[#D1FD0A] group-hover/vote:-translate-y-0.5"
          )} />
          <span className={cn(
            "font-led-dot text-lg",
            hasVoted ? "text-[#D1FD0A]" : "text-primary"
          )}>
            {upvotes}
          </span>
        </button>
      </td>

      {/* Views Column */}
      <td className="hidden md:table-cell px-4 py-3 border-b border-zinc-800/50 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="font-led-dot text-sm text-primary">
            {listing.viewCount ? (listing.viewCount / 1000).toFixed(1) : '0'}k
          </span>
        </div>
      </td>

      {/* Comments Column */}
      <td className="hidden md:table-cell px-4 py-3 border-b border-zinc-800/50 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCommentClick?.(listing)
          }}
          className="font-led-dot text-sm text-primary hover:text-[#D1FD0A] transition-colors cursor-pointer"
        >
          {listing.commentsCount || 0}
        </button>
      </td>

      {/* Holders Column */}
      <td className="hidden md:table-cell px-4 py-3 border-b border-zinc-800/50 text-center">
        <span className="font-led-dot text-lg text-primary" suppressHydrationWarning>
          {listing.holders || 0}
        </span>
      </td>

      {/* Price Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50 text-right">
        <div className="space-y-0.5">
          <div className="flex items-center justify-end gap-1">
            <IconSolana className="w-3.5 h-3.5 text-[#D1FD0A]" />
            <span className="font-led-dot text-lg md:text-xl text-primary">
              {(listing.currentPrice || 0).toFixed(3)}
            </span>
          </div>
          {listing.priceChange24h !== undefined && (
            <div className={cn(
              "flex items-center justify-end gap-0.5 md:gap-1 text-[10px] md:text-xs",
              isPositive ? "text-[#D1FD0A]" : "text-red-400"
            )}>
              {isPositive ? (
                <IconPriceUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
              ) : (
                <IconPriceDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
              )}
              <span className="font-led-dot text-sm">
                {isPositive ? '+' : ''}{listing.priceChange24h.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Creator Column */}
      <td className="hidden sm:table-cell px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <div className="relative group flex items-center justify-center">
          <img
            src={listing.metrics.creatorAvatar}
            alt={listing.metrics.creatorName}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#D1FD0A]/30 hover:border-[#D1FD0A] transition-all cursor-pointer"
          />
          {/* Tooltip on hover */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-black/95 border border-[#D1FD0A]/30 rounded-lg text-xs font-bold text-[#D1FD0A] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {listing.metrics.creatorName}
          </div>
        </div>
      </td>

      {/* Actions Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex items-stretch gap-1 md:gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBuyClick?.(listing, 0.1)
              }}
              className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-300 text-[11px] md:text-sm whitespace-nowrap hover:shadow-lg hover:shadow-primary/50 flex items-center gap-1"
            >
              <span>BUY</span>
              <IconSolana size={14} className="text-black opacity-80" />
            </button>

            {/* View Details Button - btdemo styled */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCollaborateClick?.(listing)
              }}
              className="px-3 py-2 rounded-lg transition-all duration-300 bg-zinc-800 hover:bg-zinc-700 border-2 border-[#D1FD0A] flex items-center justify-center"
              title="View Details"
            >
              <span className="text-[#D1FD0A] text-sm font-semibold">Details</span>
            </button>
          </div>

          {listing.myKeys && listing.myKeys > 0 && (
            <div className="text-xs text-center">
              <span className={cn("font-medium", colors.text)}>
                You own {listing.myKeys}
              </span>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  )
}