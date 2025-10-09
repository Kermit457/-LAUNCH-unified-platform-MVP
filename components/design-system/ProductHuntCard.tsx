"use client"

import { motion } from 'framer-motion'
import {
  ChevronUp, MessageSquare, Share2, ExternalLink,
  Trophy, Medal, Award, Sparkles, User, Clock,
  TrendingUp, Users, Eye, Zap
} from 'lucide-react'
import { GlassCard } from './DesignSystemShowcase'

interface ProductHuntCardProps {
  launch: {
    id: string
    rank?: number
    title: string
    subtitle: string
    logoUrl?: string
    upvotes: number
    commentsCount: number
    viewCount: number
    hunterName?: string
    hunterAvatar?: string
    makerName?: string
    makerAvatar?: string
    featured?: boolean
    isNew?: boolean
    hasVoted?: boolean
    postedAt?: string
  }
  onVote: () => void
  onComment: () => void
  onShare: () => void
  onVisit?: () => void
}

export const ProductHuntCard = ({
  launch,
  onVote,
  onComment,
  onShare,
  onVisit
}: ProductHuntCardProps) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: Trophy, color: 'from-yellow-400 to-amber-500' }
    if (rank === 2) return { icon: Medal, color: 'from-gray-300 to-gray-400' }
    if (rank === 3) return { icon: Award, color: 'from-orange-400 to-orange-500' }
    return null
  }

  const rankInfo = launch.rank ? getRankIcon(launch.rank) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group relative"
    >
      <GlassCard className="p-0 overflow-hidden">
        {/* Top Banner for Featured/New */}
        {(launch.featured || launch.isNew) && (
          <div className={`
            px-4 py-2 text-xs font-bold text-white flex items-center gap-2
            ${launch.featured
              ? 'bg-gradient-to-r from-violet-500 to-purple-600'
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
            }
          `}>
            <Sparkles className="w-3 h-3" />
            {launch.featured ? 'FEATURED TODAY' : 'NEW LAUNCH'}
          </div>
        )}

        <div className="p-6">
          {/* Main Content Grid */}
          <div className="flex gap-4">
            {/* Left: Upvote Button */}
            <div className="flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onVote}
                className={`
                  group/vote flex flex-col items-center gap-1 px-3 py-4 rounded-xl
                  border-2 transition-all
                  ${launch.hasVoted
                    ? 'bg-gradient-to-b from-orange-500 to-red-500 border-orange-400 shadow-lg shadow-orange-500/30'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/50'
                  }
                `}
              >
                <ChevronUp className={`
                  w-6 h-6 transition-all
                  ${launch.hasVoted
                    ? 'text-white'
                    : 'text-zinc-400 group-hover/vote:text-orange-500'
                  }
                `} />
                <span className={`
                  text-lg font-bold
                  ${launch.hasVoted ? 'text-white' : 'text-white'}
                `}>
                  {launch.upvotes}
                </span>
                <span className={`
                  text-[10px] uppercase tracking-wider
                  ${launch.hasVoted ? 'text-white/80' : 'text-zinc-500'}
                `}>
                  {launch.hasVoted ? 'Voted' : 'Vote'}
                </span>
              </motion.button>
            </div>

            {/* Middle: Product Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="relative">
                  {launch.rank && launch.rank <= 3 && rankInfo && (
                    <div className={`
                      absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full
                      bg-gradient-to-br ${rankInfo.color}
                      flex items-center justify-center shadow-lg
                    `}>
                      <rankInfo.icon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="w-20 h-20 rounded-2xl bg-zinc-800 overflow-hidden border-2 border-zinc-700 group-hover:border-zinc-600 transition-colors">
                    {launch.logoUrl ? (
                      <img
                        src={launch.logoUrl}
                        alt={launch.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  {/* Rank Badge */}
                  {launch.rank && launch.rank > 3 && (
                    <div className="absolute -bottom-1 -right-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-0.5">
                      <span className="text-xs font-bold text-zinc-400">#{launch.rank}</span>
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 transition-all">
                        {launch.title}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                        {launch.subtitle}
                      </p>
                    </div>
                    {/* Visit Button */}
                    {onVisit && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onVisit}
                        className="ml-4 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-zinc-400" />
                      </motion.button>
                    )}
                  </div>

                  {/* Tags/Attribution Row */}
                  <div className="flex items-center gap-4 mb-3">
                    {launch.hunterName && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 overflow-hidden">
                          {launch.hunterAvatar ? (
                            <img src={launch.hunterAvatar} alt={launch.hunterName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-3 h-3 text-zinc-500" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500">
                          Hunted by <span className="text-zinc-400 font-medium">{launch.hunterName}</span>
                        </span>
                      </div>
                    )}
                    {launch.makerName && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 overflow-hidden">
                          {launch.makerAvatar ? (
                            <img src={launch.makerAvatar} alt={launch.makerName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-3 h-3 text-zinc-500" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500">
                          Made by <span className="text-zinc-400 font-medium">{launch.makerName}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Engagement Metrics */}
                  <div className="flex items-center gap-3">
                    {/* Comments */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={onComment}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 transition-all group/comment"
                    >
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 text-zinc-400 group-hover/comment:text-blue-400 transition-colors" />
                        {launch.commentsCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-zinc-300">
                        {launch.commentsCount} {launch.commentsCount === 1 ? 'comment' : 'comments'}
                      </span>
                    </motion.button>

                    {/* Views */}
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <Eye className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-500">{launch.viewCount} views</span>
                    </div>

                    {/* Time Posted */}
                    {launch.postedAt && (
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-500">{launch.postedAt}</span>
                      </div>
                    )}

                    {/* Share */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={onShare}
                      className="ml-auto p-2 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 transition-all"
                    >
                      <Share2 className="w-4 h-4 text-zinc-400" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Live Activity Indicator */}
          {launch.commentsCount > 5 && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-900" />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <TrendingUp className="w-3 h-3" />
                  <span>Active discussion with {launch.commentsCount} comments</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5" />
        </div>
      </GlassCard>
    </motion.div>
  )
}