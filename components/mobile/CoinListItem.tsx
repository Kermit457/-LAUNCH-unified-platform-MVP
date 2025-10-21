"use client"

import Link from 'next/link'
import { MessageCircle, Eye, TrendingUp, Users, ShoppingCart, UserPlus, Bell, Share2, Globe, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { X as TwitterIcon } from 'lucide-react'

export interface CoinListItemProps {
  // Basic Info
  id: string
  name: string
  ticker: string
  logoUrl?: string
  status?: 'live' | 'active' | 'frozen' | 'launched' | 'upcoming' | 'ended'
  type?: 'icm' | 'ccm' | 'meme' // Add type field

  // Social Links
  twitterUrl?: string
  websiteUrl?: string
  telegramUrl?: string

  // Core Metrics (matching desktop table)
  age: string // "305d ago"
  motion: number // 0-100 progress percentage
  upvotes: number
  comments: number
  views?: number
  price: number // SOL price
  priceChange?: number // +23.1%
  holders: number

  // Creator
  creatorName: string
  creatorAvatar: string

  // Link
  href: string

  // Callbacks for actions
  onBuy?: () => void
  onInvite?: () => void
  onUpvote?: () => void
  onComment?: () => void
  onNotify?: () => void
  onShare?: () => void
}

export function CoinListItem({
  name,
  ticker,
  logoUrl,
  status = 'active',
  type = 'meme',
  twitterUrl,
  websiteUrl,
  telegramUrl,
  age,
  motion,
  upvotes,
  comments,
  views,
  price,
  priceChange,
  holders,
  creatorName,
  creatorAvatar,
  href,
  onBuy,
  onInvite,
  onUpvote,
  onComment,
  onNotify,
  onShare,
}: CoinListItemProps) {
  const isPositive = (priceChange || 0) >= 0

  // Type badge config - TEXT labels instead of emojis
  const typeConfig = {
    icm: { label: 'ICM', bg: 'bg-[#00FF88]/15', border: 'border-[#00FF88]/40', text: 'text-[#00FF88]' },
    ccm: { label: 'CCM', bg: 'bg-[#00FFFF]/15', border: 'border-[#00FFFF]/40', text: 'text-[#00FFFF]' },
    meme: { label: 'MEME', bg: 'bg-[#FFD700]/15', border: 'border-[#FFD700]/40', text: 'text-[#FFD700]' },
  }

  // Status badge color
  const statusColors = {
    live: 'bg-red-500/20 text-red-400 border-red-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    frozen: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    launched: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ended: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  }

  return (
    <Link href={href} className="block">
      <div className="flex flex-col gap-1 p-1.5 rounded-md bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 active:scale-[0.99] transition-all">
        {/* Top Row: Icon + Name/Ticker + Type Badge + Status Badges + Actions */}
        <div className="flex items-center gap-1.5">
          {/* Icon - Tiny */}
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-7 h-7 rounded object-cover flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded bg-gradient-to-br from-primary-cyan/20 to-primary-cyan/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary-cyan">{ticker.charAt(0)}</span>
            </div>
          )}

          {/* Name + Ticker + Type - Tiny */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-white truncate leading-none">{name}</h3>
              {/* Type Badge - Text Label */}
              <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase", typeConfig[type].bg, typeConfig[type].border, typeConfig[type].text)}>
                {typeConfig[type].label}
              </span>
            </div>
            {/* Ticker + Social Links Row */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-zinc-500 uppercase font-medium">${ticker}</span>

              {/* Social Link Icons - Micro - Always show for demo */}
              <a
                href={twitterUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.stopPropagation(); if (!twitterUrl) e.preventDefault(); }}
                className="hover:scale-110 transition-transform"
                title="Twitter"
              >
                <TwitterIcon className="w-3 h-3 text-zinc-500 hover:text-[#1DA1F2]" />
              </a>
              <a
                href={websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.stopPropagation(); if (!websiteUrl) e.preventDefault(); }}
                className="hover:scale-110 transition-transform"
                title="Website"
              >
                <Globe className="w-3 h-3 text-zinc-500 hover:text-white" />
              </a>
              <a
                href={telegramUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.stopPropagation(); if (!telegramUrl) e.preventDefault(); }}
                className="hover:scale-110 transition-transform"
                title="Telegram"
              >
                <Send className="w-3 h-3 text-zinc-500 hover:text-[#0088CC]" />
              </a>
            </div>
          </div>

          {/* Right Side: Status + Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Status Badge - Micro (only show Active or Live) */}
            {(status === 'active' || status === 'live') && (
              <div className={cn("px-1 py-0.5 rounded text-[8px] font-bold uppercase border", statusColors[status])}>
                {status}
              </div>
            )}

            {/* Notification Bell - Micro */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onNotify?.() }}
              className="p-0.5 rounded hover:bg-zinc-800 active:scale-95 transition-all"
              title="Notifications"
            >
              <Bell className="w-3 h-3 text-zinc-500" />
            </button>

            {/* Share Button - Micro */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare?.() }}
              className="p-0.5 rounded hover:bg-zinc-800 active:scale-95 transition-all"
              title="Share"
            >
              <Share2 className="w-3 h-3 text-zinc-500" />
            </button>
          </div>
        </div>

      {/* Motion Progress Bar - Ultra Slim */}
      <div className="flex items-center gap-1">
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" style={{ width: `${motion}%` }} />
        </div>
        <span className="text-[9px] font-bold text-yellow-500 w-5 text-right">{motion}</span>
      </div>

      {/* Stats Row - Micro */}
      <div className="flex items-center justify-between text-[9px]">
        {/* Price + Change */}
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-bold text-white">{price < 0.0001 ? price.toExponential(2) : price.toFixed(4)}</span>
          {typeof priceChange === 'number' && (
            <span className={cn("text-[8px] font-semibold", isPositive ? "text-green-400" : "text-red-400")}>
              {isPositive ? '+' : ''}{priceChange.toFixed(1)}%
            </span>
          )}
        </div>

        {/* Mini Stats */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <div className="flex items-center gap-0.5">
            <TrendingUp className="w-2 h-2" />
            <span>{upvotes}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <MessageCircle className="w-2 h-2" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Users className="w-2 h-2" />
            <span>{holders}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row - 3 Buttons Only: Buy, Upvote, Comment */}
      <div className="grid grid-cols-3 gap-1 pt-1 border-t border-zinc-800/50">
        {/* Buy Button - Primary Green */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBuy?.() }}
          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-[#00FF88]/15 hover:bg-[#00FF88]/25 border border-[#00FF88]/40 active:scale-95 transition-all"
          title="Buy"
        >
          <ShoppingCart className="w-3 h-3 text-[#00FF88]" />
          <span className="text-[9px] font-bold text-[#00FF88]">Buy</span>
        </button>

        {/* Upvote Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpvote?.() }}
          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/60 active:scale-95 transition-all"
          title="Upvote"
        >
          <TrendingUp className="w-3 h-3 text-[#00FFFF]" />
          <span className="text-[9px] font-medium text-zinc-400">{upvotes}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onComment?.() }}
          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/60 active:scale-95 transition-all"
          title="Comment"
        >
          <MessageCircle className="w-3 h-3 text-zinc-400" />
          <span className="text-[9px] font-medium text-zinc-400">{comments}</span>
        </button>
      </div>
      </div>
    </Link>
  )
}
