'use client'

import { useState } from 'react'
import { Zap, Share2, Globe, Github, Star, Film, Video, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import type { AdvancedListingData } from '@/lib/advancedTradingData'
import { cn } from '@/lib/cn'
import { IconPriceUp, IconPriceDown, IconSolana, IconTwitter, IconTelegram, IconLab, IconTopPerformer, IconCult, IconUpvote } from '@/lib/icons'
import { LiveBadge } from '@/lib/components/StatusBadge'
import { UnifiedCard } from '@/components/UnifiedCard'
import type { UnifiedCardData } from '@/components/UnifiedCard'

interface AdvancedTableViewBTDemoProps {
  listings: AdvancedListingData[]
  onBuyClick?: (listing: AdvancedListingData, amount: number) => void
  onCollaborateClick?: (listing: AdvancedListingData) => void
  onRowClick?: (listing: AdvancedListingData) => void
  onClipClick?: (listing: AdvancedListingData) => void
}

export function AdvancedTableViewBTDemo({
  listings,
  onBuyClick,
  onCollaborateClick,
  onRowClick,
  onClipClick
}: AdvancedTableViewBTDemoProps): JSX.Element {
  return (
    <>
      {/* Mobile: Card View */}
      <div className="md:hidden space-y-2 p-2">
        {listings.map((listing, index) => (
          <UnifiedCard
            key={listing.id}
            data={{
              ...listing,
              keyHolders: [],
              contributors: listing.metrics?.contributors || [],
              contributorsCount: listing.metrics?.contributorsCount || 0,
              onVote: async () => {},
              onComment: () => onRowClick?.(listing),
              onCollaborate: () => onCollaborateClick?.(listing),
              onBuyKeys: () => onBuyClick?.(listing, 1),
              onClipClick: () => onClipClick?.(listing),
              onDetails: () => onRowClick?.(listing),
              onNotificationToggle: () => {},
              onShare: () => {},
              myKeys: 0,
              mySharePct: 0
            } as UnifiedCardData}
          />
        ))}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full">
        <thead className="border-b border-zinc-800">
          <tr className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            <th className="px-2 py-3 text-left">Rank</th>
            <th className="px-2 py-3 text-left min-w-[200px]">Token</th>
            <th className="px-2 py-3 text-center">Motion</th>
            <th className="px-2 py-3 text-center">Upvote</th>
            <th className="px-2 py-3 text-center">Views</th>
            <th className="px-2 py-3 text-center">Holders</th>
            <th className="px-2 py-3 text-left">Contributors</th>
            <th className="px-2 py-3 text-right">Price</th>
            <th className="px-2 py-3 text-center">Creator</th>
            <th className="px-2 py-3 text-center">Actions</th>
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
              onRowClick={onRowClick}
              onClipClick={onClipClick}
            />
          ))}
        </tbody>
      </table>
      </div>
    </>
  )
}

interface TableRowProps {
  listing: AdvancedListingData
  index: number
  rank: number
  onBuyClick?: (listing: AdvancedListingData, amount: number) => void
  onCollaborateClick?: (listing: AdvancedListingData) => void
  onRowClick?: (listing: AdvancedListingData) => void
  onClipClick?: (listing: AdvancedListingData) => void
}

function TableRow({
  listing,
  index,
  rank,
  onBuyClick,
  onCollaborateClick,
  onRowClick,
  onClipClick
}: TableRowProps): JSX.Element {
  const [hasVoted, setHasVoted] = useState(listing.hasVoted || false)
  const [upvotes, setUpvotes] = useState(listing.upvotes)

  const handleVote = (e: React.MouseEvent): void => {
    e.stopPropagation()
    setHasVoted(!hasVoted)
    setUpvotes(prev => hasVoted ? prev - 1 : prev + 1)
  }

  const isPositive = (listing.priceChange24h ?? 0) >= 0

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ backgroundColor: 'rgba(209, 253, 10, 0.05)' }}
      onClick={() => onRowClick?.(listing)}
      className="border-b border-zinc-800/50 transition-all cursor-pointer group"
    >
      {/* Rank */}
      <td className="px-2 py-2">
        <span className="font-led-dot text-white text-sm">#{rank}</span>
      </td>

      {/* Token */}
      <td className="px-2 py-2">
        <div className="flex items-center gap-2">
          <img
            src={listing.logoUrl}
            alt={listing.title}
            className="w-8 h-8 rounded-lg object-cover border border-[#D1FD0A]/20 flex-shrink-0"
          />
          <div>
            <div className="font-bold text-white text-sm">{listing.title}</div>
            <div className="flex items-center gap-1">
              {listing.status === 'live' && <LiveBadge />}

              {/* Status Icons */}
              {/* Lab Icon - for experimental projects */}
              {listing.metrics?.isLab && (
                <IconLab className="w-3 h-3 text-[#D1FD0A]" title="Lab Project" />
              )}

              {/* Top Performer Icon */}
              {listing.beliefScore >= 90 && (
                <IconTopPerformer className="w-3 h-3 text-[#D1FD0A]" title="Top Performer" />
              )}

              {/* Creator Icon */}
              {listing.type === 'ccm' && (
                <Star className="w-3 h-3 text-[#D1FD0A]" title="Creator Project" />
              )}

              {/* CULT Icon for meme projects */}
              {listing.type === 'meme' && (
                <IconCult className="w-3 h-3 text-[#D1FD0A]" title="CULT" />
              )}

              {listing.ticker && (
                <span className="font-led-dot text-[#D1FD0A] text-xs">
                  ${listing.ticker}
                </span>
              )}

              {/* Social Icons - Clickable when URLs exist */}
              <div className="flex items-center gap-0.5">
                {listing.metrics?.websiteUrl ? (
                  <Globe
                    className="w-3 h-3 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(listing.metrics.websiteUrl, '_blank')
                    }}
                    title={listing.metrics.websiteUrl}
                  />
                ) : (
                  <Globe className="w-3 h-3 text-zinc-600 opacity-30" />
                )}

                {listing.metrics?.telegramUrl ? (
                  <IconTelegram
                    className="w-3 h-3 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(listing.metrics.telegramUrl, '_blank')
                    }}
                    title={listing.metrics.telegramUrl}
                  />
                ) : (
                  <IconTelegram className="w-3 h-3 text-zinc-600 opacity-30" />
                )}

                {listing.metrics?.twitterUrl ? (
                  <IconTwitter
                    className="w-3 h-3 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(listing.metrics.twitterUrl, '_blank')
                    }}
                    title={listing.metrics.twitterUrl}
                  />
                ) : (
                  <IconTwitter className="w-3 h-3 text-zinc-600 opacity-30" />
                )}

                {listing.metrics?.githubUrl ? (
                  <Github
                    className="w-3 h-3 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(listing.metrics.githubUrl, '_blank')
                    }}
                    title={listing.metrics.githubUrl}
                  />
                ) : (
                  <Github className="w-3 h-3 text-zinc-600 opacity-30" />
                )}
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* Motion Score */}
      <td className="px-2 py-2">
        <div className="flex flex-col items-center gap-0.5">
          <div className="font-led-dot text-lg text-white">
            {listing.beliefScore || 0}
          </div>
          <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${listing.beliefScore || 0}%` }}
              transition={{ duration: 0.8, delay: index * 0.02 }}
              className="h-full rounded-full bg-[#D1FD0A]"
            />
          </div>
        </div>
      </td>

      {/* Upvote */}
      <td className="px-2 py-2">
        <div className="flex flex-col items-center">
          <button
            onClick={handleVote}
            className={cn(
              "w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-all relative",
              hasVoted
                ? "bg-[#D1FD0A]/20 border border-[#D1FD0A]/50"
                : "bg-zinc-800 border border-[#D1FD0A]/30 hover:bg-zinc-700 hover:border-[#D1FD0A]/50"
            )}
          >
            <IconUpvote className={cn(
              "mb-0.5",
              hasVoted ? "text-[#D1FD0A]" : "text-white"
            )} size={16} />
            <span className={cn(
              "font-led-dot text-sm leading-none",
              hasVoted ? "text-[#D1FD0A]" : "text-white"
            )}>
              {upvotes}
            </span>
          </button>
        </div>
      </td>

      {/* Views */}
      <td className="px-2 py-2 text-center">
        <span className="font-led-dot text-white text-sm">
          {listing.viewCount ? (listing.viewCount / 1000).toFixed(1) : '0'}k
        </span>
      </td>

      {/* Holders */}
      <td className="px-2 py-2 text-center">
        <span className="font-led-dot text-white text-sm">
          {listing.metrics?.totalHolders || 0}
        </span>
      </td>

      {/* Contributors */}
      <td className="px-2 py-2">
        <div className="flex items-center gap-1">
          <span className="font-led-dot text-[#D1FD0A] text-xs">
            {listing.metrics?.contributorsCount || 12}
          </span>
          <div className="flex -space-x-1.5">
            {/* Display actual contributor Twitter avatars from network/invites */}
            {listing.metrics?.contributors && listing.metrics.contributors.length > 0 ? (
              listing.metrics.contributors.slice(0, 4).map((contributor: any, i: number) => (
                <img
                  key={contributor.id || i}
                  src={
                    contributor.twitterAvatar ||
                    contributor.avatar ||
                    `https://unavatar.io/twitter/${contributor.twitterHandle || contributor.handle}` ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.id || i}`
                  }
                  alt={contributor.name || contributor.handle || `Contributor ${i + 1}`}
                  title={contributor.name || contributor.handle || `@${contributor.twitterHandle}`}
                  className="w-5 h-5 rounded-full border border-black bg-zinc-800 cursor-pointer hover:scale-110 transition-transform"
                  style={{ zIndex: 4 - i }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (contributor.twitterHandle) {
                      window.open(`https://twitter.com/${contributor.twitterHandle}`, '_blank')
                    }
                  }}
                />
              ))
            ) : (
              // Fallback to generated avatars if no real contributors data
              Array.from({ length: Math.min(4, listing.metrics?.contributorsCount || 12) }).map((_, i) => (
                <img
                  key={i}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=contributor${listing.id}${i}`}
                  alt={`Contributor ${i + 1}`}
                  className="w-5 h-5 rounded-full border border-black bg-zinc-800"
                  style={{ zIndex: 4 - i }}
                />
              ))
            )}
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-2 py-2 text-right">
        <div className="space-y-0.5">
          <div className="flex items-center justify-end gap-0.5">
            <IconSolana className="w-3 h-3 text-[#D1FD0A]" />
            <span className="font-led-dot text-white text-sm">
              {(listing.currentPrice || 0).toFixed(3)}
            </span>
          </div>
          {listing.priceChange24h !== undefined && (
            <div className="flex items-center justify-end gap-0.5 text-xs">
              {isPositive ? (
                <IconPriceUp className="w-2 h-2 text-[#D1FD0A]" />
              ) : (
                <IconPriceDown className="w-2 h-2 text-[#D1FD0A]" />
              )}
              <span className="font-led-dot text-[#D1FD0A] text-[10px]">
                {isPositive ? '+' : ''}{listing.priceChange24h.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Creator */}
      <td className="px-2 py-2">
        <div className="relative group flex items-center justify-center">
          <img
            src={listing.metrics.creatorAvatar}
            alt={listing.metrics.creatorName}
            className="w-6 h-6 rounded-full border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/50 transition-all cursor-pointer"
          />
          {/* Tooltip on hover */}
          <div className="absolute bottom-full mb-2 px-2 py-1 bg-black/95 border border-[#D1FD0A]/30 rounded-lg text-xs font-bold text-[#D1FD0A] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {listing.metrics.creatorName}
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-2 py-2">
        <div className="flex items-center justify-center gap-1">
          {/* Clips Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClipClick?.(listing)
            }}
            className="flex items-center justify-center gap-0.5 px-2 py-1 rounded-md bg-zinc-800/50 hover:bg-[#D1FD0A]/20 border border-zinc-700 hover:border-[#D1FD0A]/50 transition-all group text-xs font-medium text-zinc-400 hover:text-[#D1FD0A]"
            title="Submit Clip"
          >
            <span className="leading-none">+</span>
            <Video className="w-3 h-3" />
          </button>

          {/* Collaborate Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCollaborateClick?.(listing)
            }}
            className="flex items-center justify-center gap-0.5 px-2 py-1 rounded-md bg-zinc-800/50 hover:bg-[#D1FD0A]/20 border border-zinc-700 hover:border-[#D1FD0A]/50 transition-all group text-xs font-medium text-zinc-400 hover:text-[#D1FD0A]"
            title="Collaborate"
          >
            <span className="leading-none">+</span>
            <Users className="w-3 h-3" />
          </button>

          {/* Buy Button - Primary Action */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onBuyClick?.(listing, 0.1)
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-md font-bold text-xs bg-[#D1FD0A] hover:bg-[#B8E309] text-black hover:shadow-[0_0_20px_rgba(209,253,10,0.5)] hover:scale-105 transition-all"
          >
            <Zap className="w-3 h-3" />
            <span>Buy</span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (navigator.share) {
                navigator.share({
                  title: listing.title,
                  text: listing.subtitle || '',
                  url: window.location.origin + `/launch/${listing.id}`
                })
              }
            }}
            className="p-1 rounded-md bg-zinc-800/50 hover:bg-[#D1FD0A]/20 border border-zinc-700 hover:border-[#D1FD0A]/50 transition-all group"
            title="Share"
          >
            <Share2 className="w-3 h-3 text-zinc-400 group-hover:text-[#D1FD0A]" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}
