"use client"

import { motion } from 'framer-motion'
import {
  ChevronUp, MessageSquare, Users, Share2, Eye, Zap, Bell, TrendingUp, TrendingDown
} from 'lucide-react'

interface CleanLaunchCardProps {
  launch: {
    id: string
    title: string
    subtitle: string
    logoUrl?: string
    scope: string
    status: 'LIVE' | 'UPCOMING'
    upvotes: number
    commentsCount: number
    viewCount?: number
    convictionPct?: number
    boostCount?: number
    contributionPoolPct?: number
    feesSharePct?: number
    contributors?: Array<{ id: string; name: string; avatar?: string }>
    // Curve/Keys data
    keyPrice?: number
    keyHolders?: number
    keysSold?: number  // Total supply of keys sold
    priceChange24h?: number | null  // 24h price change percentage
  }
  hasVoted: boolean
  onVote: () => void
  onComment: () => void
  onCollaborate: () => void
  onDetails: () => void
  onBuyKeys?: () => void
  onNotify?: () => void
  onShare?: () => void
}

export const CleanLaunchCard = ({
  launch,
  hasVoted,
  onVote,
  onComment,
  onCollaborate,
  onDetails,
  onBuyKeys,
  onNotify,
  onShare
}: CleanLaunchCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      {/* Animated Glow Effect */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${
            launch.scope === 'ICM'
              ? 'rgba(139, 92, 246, 0.15), rgba(217, 70, 239, 0.15)'
              : 'rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15)'
          })`,
          filter: 'blur(8px)'
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Faint Pulse Animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${
            launch.scope === 'ICM'
              ? 'rgba(139, 92, 246, 0.03)'
              : 'rgba(6, 182, 212, 0.03)'
          }, transparent 70%)`
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors">
        {/* Top Right Actions: Notification Bell, Share & 24h Price Change */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          <div className="flex items-center gap-1">
            {/* Notification Bell Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onNotify}
              className="p-1.5 rounded-lg bg-zinc-900/80 backdrop-blur-sm text-zinc-400 hover:bg-blue-500 hover:text-white border border-zinc-800 hover:border-blue-500 transition-all"
              title="Notify"
            >
              <Bell className="w-3.5 h-3.5" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="p-1.5 rounded-lg bg-zinc-900/80 backdrop-blur-sm text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* 24h Price Change */}
          {launch.priceChange24h !== undefined && launch.priceChange24h !== null && typeof launch.priceChange24h === 'number' && (
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg backdrop-blur-sm text-[10px] font-semibold border ${
              launch.priceChange24h >= 0
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {launch.priceChange24h >= 0 ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              <span>{launch.priceChange24h >= 0 ? '+' : ''}{launch.priceChange24h.toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 flex gap-4">
        {/* Left: Vote and Comment Buttons */}
        <div className="flex flex-col items-center gap-1">
          {/* Vote Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onVote}
            className={`
              flex flex-col items-center justify-center gap-0 rounded-lg
              border transition-all w-14 h-14
              ${hasVoted
                ? 'bg-orange-500 border-orange-400 text-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-orange-500/50 hover:text-orange-400'
              }
            `}
          >
            <ChevronUp className="w-4 h-4 -mb-0.5" />
            <span className="text-lg font-bold">
              {launch.upvotes}
            </span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onComment}
            className="flex flex-col items-center justify-center gap-0 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all w-14 h-14"
          >
            <MessageSquare className="w-4 h-4 -mb-0.5" />
            <span className="text-sm font-semibold">{launch.commentsCount}</span>
          </motion.button>
        </div>

        {/* Right: Main Content */}
        <div className="flex-1">
          {/* Header with Logo and Title */}
          <div className="flex items-start gap-3 mb-4">
            {/* Logo - Same size as Vote button */}
            <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              {launch.logoUrl ? (
                <img src={launch.logoUrl} alt={launch.title} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <div className="text-xl font-bold text-zinc-600">
                  {launch.title.charAt(0)}
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">
                  {launch.title}
                </h3>
                {/* Status Badge */}
                <div className={`
                  px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider flex-shrink-0
                  ${launch.status === 'LIVE'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                `}>
                  {launch.status}
                </div>
                {/* Scope Badge */}
                <div className={`
                  px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0
                  ${launch.scope === 'ICM'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}
                `}>
                  {launch.scope}
                </div>
              </div>
              <p className="text-sm text-zinc-500 line-clamp-2">
                {launch.subtitle}
              </p>
            </div>
          </div>

          {/* Compact Stats Row - Contributors, Views, Boost, Pool & Fees - All in one line */}
          <div className="flex items-center gap-2 mb-3 text-[10px]">
            {/* Contributors */}
            {launch.contributors && launch.contributors.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {launch.contributors.slice(0, 3).map((contributor, i) => (
                    <div
                      key={contributor.id}
                      className="w-4 h-4 rounded-full border border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden"
                      style={{ zIndex: launch.contributors!.length - i }}
                    >
                      {contributor.avatar ? (
                        <img src={contributor.avatar} alt={contributor.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] text-zinc-500">
                          {contributor.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-zinc-600">+{launch.contributors.length}</span>
              </div>
            )}

            {/* Views */}
            {launch.viewCount !== undefined && launch.viewCount > 0 && (
              <div className="flex items-center gap-1 text-zinc-600">
                <Eye className="w-3 h-3" />
                <span>{launch.viewCount}</span>
              </div>
            )}

            {/* Total Keys Sold (Supply) */}
            {launch.keysSold !== undefined && launch.keysSold > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                <Zap className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 font-medium">{launch.keysSold}</span>
              </div>
            )}

            {/* Contribution Pool */}
            {launch.contributionPoolPct !== undefined && (
              <div className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                <span className="text-purple-400 font-medium">{launch.contributionPoolPct}%</span>
                <span className="text-zinc-600 ml-0.5">pool</span>
              </div>
            )}

            {/* Fees Share */}
            {launch.feesSharePct !== undefined && (
              <div className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-cyan-400 font-medium">{launch.feesSharePct}%</span>
                <span className="text-zinc-600 ml-0.5">fees</span>
              </div>
            )}
          </div>

          {/* Conviction Bar */}
          {launch.convictionPct !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-600">Conviction</span>
                <span className="text-xs text-zinc-400 font-medium">{launch.convictionPct}%</span>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${launch.convictionPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Buy Keys Button - Permanently Orange */}
            {launch.keyPrice !== undefined && onBuyKeys && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onBuyKeys}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white border border-orange-500 hover:from-orange-600 hover:to-red-600 transition-all text-xs font-medium"
                title="Buy Alpha Keys"
              >
                <span>Buy Keys</span>
                <span className="text-[10px] opacity-80">◎{launch.keyPrice.toFixed(3)}</span>
              </motion.button>
            )}

            {/* Collaborate Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onCollaborate}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">Collaborate</span>
            </motion.button>

            {/* Details Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDetails}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all text-xs"
              title="Details"
            >
              Details
            </motion.button>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  )
}