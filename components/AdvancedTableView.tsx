"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Twitter, MessageCircle, Globe, TrendingUp, TrendingDown, ArrowUp, Eye, MessageSquare, Users } from 'lucide-react'
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
            <th className="sticky left-0 z-10 bg-black/90 backdrop-blur-xl px-2 md:px-4 py-2 md:py-3 text-left border-b border-zinc-800 min-w-[140px] md:min-w-[280px]">
              Token
            </th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-left border-b border-zinc-800 min-w-[50px] md:min-w-[80px]">Age</th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-center border-b border-zinc-800 min-w-[70px] md:min-w-[100px]">Motion</th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-center border-b border-zinc-800 min-w-[60px] md:min-w-[100px]">
              <ArrowUp className="w-3 h-3 md:w-4 md:h-4 mx-auto" />
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-center border-b border-zinc-800 min-w-[80px]">
              <Eye className="w-4 h-4 mx-auto" />
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-center border-b border-zinc-800 min-w-[80px]">
              <MessageSquare className="w-4 h-4 mx-auto" />
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-center border-b border-zinc-800 min-w-[100px]">Holders</th>
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
  onBuyClick,
  onCollaborateClick,
  onCommentClick,
  onRowClick
}: {
  listing: AdvancedListingData
  index: number
  onBuyClick?: (listing: AdvancedListingData, amount: number) => void
  onCollaborateClick?: (listing: AdvancedListingData) => void
  onCommentClick?: (listing: AdvancedListingData) => void
  onRowClick?: (listing: AdvancedListingData) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasVoted, setHasVoted] = useState(listing.hasVoted || false)
  const [upvotes, setUpvotes] = useState(listing.upvotes)

  // Type-based styling - ICM Motion Color Palette
  const typeColors = {
    icm: {
      bg: 'from-[#00FF88]/10 to-[#00FF88]/5',
      border: 'border-[#00FF88]/30',
      text: 'text-[#00FF88]',
      glow: 'shadow-[#00FF88]/20',
      badge: 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30'
    },
    ccm: {
      bg: 'from-[#00FFFF]/10 to-[#00FFFF]/5',
      border: 'border-[#00FFFF]/30',
      text: 'text-[#00FFFF]',
      glow: 'shadow-[#00FFFF]/20',
      badge: 'bg-[#00FFFF]/20 text-[#00FFFF] border-[#00FFFF]/30'
    },
    meme: {
      bg: 'from-[#FFD700]/10 to-[#FFD700]/5',
      border: 'border-[#FFD700]/30',
      text: 'text-[#FFD700]',
      glow: 'shadow-[#FFD700]/20',
      badge: 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30'
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

  // Status badge colors - ICM Motion Palette
  const statusColors = {
    live: 'bg-[#FF0040]/20 text-[#FF0040] border-[#FF0040]/40',        // Red
    active: 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40',      // Green
    upcoming: 'bg-[#0088FF]/20 text-[#0088FF] border-[#0088FF]/40',    // Blue
    frozen: 'bg-[#00FFFF]/20 text-[#00FFFF] border-[#00FFFF]/40',      // Cyan
    ended: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',          // Zinc (neutral)
    launched: 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/40'     // Yellow
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
              <span className={cn("text-[10px] md:text-xs font-mono", colors.text)}>
                {listing.ticker}
              </span>
            </div>

            {/* Status Badge + Social Links */}
            <div className="flex items-center gap-1 md:gap-2">
              <span className={cn(
                "px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs font-medium border",
                statusColors[listing.status || 'active']
              )}>
                {(listing.status || 'ACTIVE').toUpperCase()}
              </span>

              {listing.twitterUrl && (
                <a
                  href={listing.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-blue-400 transition-colors hidden md:inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {listing.metrics.telegram && (
                <a
                  href={listing.metrics.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-blue-400 transition-colors hidden md:inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              )}
              {listing.metrics.website && (
                <a
                  href={listing.metrics.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-blue-400 transition-colors hidden md:inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Age Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <div className="text-xs md:text-sm font-medium text-zinc-300 whitespace-nowrap">
          {timeAgo}
        </div>
      </td>

      {/* Belief Score Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <div className="flex flex-col items-center gap-0.5 md:gap-1">
          <div className={cn("text-lg md:text-2xl font-bold", colors.text)}>
            {listing.beliefScore}
          </div>
          <div className="w-12 md:w-16 h-1 md:h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${listing.beliefScore}%` }}
              transition={{ duration: 0.8, delay: index * 0.02 }}
              className={cn(
                "h-full rounded-full",
                listing.type === 'icm' && "bg-[#00FF88]",
                listing.type === 'ccm' && "bg-[#00FFFF]",
                listing.type === 'meme' && "bg-[#FFD700]"
              )}
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
              ? cn("bg-gradient-to-br", colors.bg, colors.border, "border")
              : "bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700"
          )}
        >
          <ArrowUp className={cn(
            "w-3 h-3 md:w-4 md:h-4 transition-all",
            hasVoted ? colors.text : "text-zinc-400 group-hover/vote:text-white group-hover/vote:-translate-y-0.5"
          )} />
          <span className={cn(
            "text-xs md:text-sm font-bold",
            hasVoted ? colors.text : "text-white"
          )}>
            {upvotes}
          </span>
        </button>
      </td>

      {/* Views Column */}
      <td className="px-4 py-3 border-b border-zinc-800/50 text-center">
        <div className="flex items-center justify-center gap-1 text-zinc-400">
          <span className="text-sm font-medium text-white">
            {listing.viewCount ? (listing.viewCount / 1000).toFixed(1) : '0'}k
          </span>
        </div>
      </td>

      {/* Comments Column */}
      <td className="px-4 py-3 border-b border-zinc-800/50 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCommentClick?.(listing)
          }}
          className="flex items-center justify-center gap-1 text-zinc-400 hover:text-white transition-colors mx-auto cursor-pointer"
        >
          <span className="text-sm font-medium">
            {listing.commentsCount || 0}
          </span>
        </button>
      </td>

      {/* Holders Column */}
      <td className="px-4 py-3 border-b border-zinc-800/50 text-center">
        <div className="flex items-center justify-center gap-1">
          <Users className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-sm font-medium text-white" suppressHydrationWarning>
            {listing.holders?.toLocaleString() || '0'}
          </span>
        </div>
      </td>

      {/* Price Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50 text-right">
        <div className="space-y-0.5">
          <div className="font-semibold text-white text-xs md:text-sm">
            {formatSOL(listing.currentPrice || 0)}
          </div>
          {listing.priceChange24h !== undefined && (
            <div className={cn(
              "flex items-center justify-end gap-0.5 md:gap-1 text-[10px] md:text-xs font-medium",
              isPositive ? "text-green-400" : "text-red-400"
            )}>
              {isPositive ? (
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
              )}
              {isPositive ? '+' : ''}{listing.priceChange24h.toFixed(1)}%
            </div>
          )}
        </div>
      </td>

      {/* Creator Column */}
      <td className="px-2 md:px-4 py-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-1.5 md:gap-2">
          <img
            src={listing.metrics.creatorAvatar}
            alt={listing.metrics.creatorName}
            className="w-6 h-6 md:w-8 md:h-8 rounded-full"
          />
          <div className="min-w-0">
            <div className="text-xs md:text-sm font-medium text-white truncate">
              {listing.metrics.creatorName}
            </div>
            <div className="text-[10px] md:text-xs text-zinc-500 font-mono truncate hidden md:block">
              {listing.metrics.creatorWallet}
            </div>
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
              className={cn(
                "px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-[11px] md:text-sm transition-all whitespace-nowrap hover:scale-105",
                listing.type === 'icm' && "bg-[#00FF88] text-black",
                listing.type === 'ccm' && "bg-[#00FFFF] text-black",
                listing.type === 'meme' && "bg-[#FFD700] text-black"
              )}
            >
              Buy Keys
            </button>

            {/* Collaborate / DM Icon Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCollaborateClick?.(listing)
              }}
              className="px-2 py-2 rounded-lg transition-all bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#8800FF]/50 text-zinc-400 hover:text-[#8800FF] flex items-center justify-center"
              title="Collaborate"
            >
              <MessageCircle className="w-4 h-4" />
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