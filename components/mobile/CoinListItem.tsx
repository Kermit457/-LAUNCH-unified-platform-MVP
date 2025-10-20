"use client"

import Link from 'next/link'
import { MessageCircle, Eye, TrendingUp, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CoinListItemProps {
  // Basic Info
  id: string
  name: string
  ticker: string
  logoUrl?: string
  status?: 'live' | 'active' | 'frozen' | 'launched' | 'upcoming' | 'ended'

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
}

export function CoinListItem({
  name,
  ticker,
  logoUrl,
  status = 'active',
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
}: CoinListItemProps) {
  const isPositive = (priceChange || 0) >= 0

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
    <Link
      href={href}
      className="flex flex-col gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 active:scale-[0.98] transition-all"
    >
      {/* Top Row: Icon + Name + Status */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-cyan/20 to-primary-cyan/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary-cyan">
                {ticker.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Name + Ticker */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white truncate">{name}</h3>
            <span className="text-xs font-medium text-zinc-500 uppercase">
              {ticker}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn(
          "px-2 py-1 rounded-md text-xs font-semibold uppercase border",
          statusColors[status]
        )}>
          {status}
        </div>
      </div>

      {/* Middle Row: Motion Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all"
            style={{ width: `${motion}%` }}
          />
        </div>
        <span className="text-xs font-bold text-yellow-500 min-w-[3ch]">
          {motion}
        </span>
      </div>

      {/* Bottom Row: Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {/* Upvotes + Age */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-primary-cyan">
            <TrendingUp className="w-3 h-3" />
            <span className="font-semibold">{upvotes}</span>
          </div>
          <span className="text-zinc-500">{age}</span>
        </div>

        {/* Comments + Views */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-zinc-400">
            <MessageCircle className="w-3 h-3" />
            <span className="font-medium">{comments}</span>
          </div>
          {views && (
            <div className="flex items-center gap-1 text-zinc-500">
              <Eye className="w-3 h-3" />
              <span>{(views / 1000).toFixed(1)}k</span>
            </div>
          )}
        </div>

        {/* Holders */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-zinc-400">
            <Users className="w-3 h-3" />
            <span className="font-medium">{holders}</span>
          </div>
        </div>
      </div>

      {/* Price + Creator Row */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            {price.toFixed(4)} SOL
          </span>
          {typeof priceChange === 'number' && (
            <span className={cn(
              "text-xs font-semibold",
              isPositive ? "text-green-400" : "text-red-400"
            )}>
              {isPositive ? '+' : ''}{priceChange.toFixed(1)}%
            </span>
          )}
        </div>

        {/* Creator */}
        <div className="flex items-center gap-1.5">
          <img
            src={creatorAvatar}
            alt={creatorName}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-xs text-zinc-400 truncate max-w-[80px]">
            {creatorName}
          </span>
        </div>
      </div>
    </Link>
  )
}
