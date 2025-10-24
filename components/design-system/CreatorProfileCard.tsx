"use client"

import { motion } from 'framer-motion'
import { Users, Share2, Eye, CheckCircle2, Globe, Twitter, Zap, Bell } from 'lucide-react'

interface CreatorProfileCardProps {
  creator: {
    id: string
    name: string
    handle: string
    bio: string
    avatarUrl?: string
    isVerified?: boolean
    badges?: string[]
    followers?: number
    viewCount?: number
    projectsCount?: number
    twitter?: string
    website?: string
    // Curve/Keys data
    keyPrice?: number
    keyHolders?: number
    convictionPct?: number
  }
  onBuyKeys?: () => void
  onInvite: () => void
  onDetails: () => void
  onNotify?: () => void
  onShare?: () => void
}

export const CreatorProfileCard = ({
  creator,
  onBuyKeys,
  onInvite,
  onDetails,
  onNotify,
  onShare
}: CreatorProfileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      {/* Animated Glow Effect - Lime gradient for creators */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))',
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
          background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.03), transparent 70%)'
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
        {/* Top Right Actions: Notification Bell & Share */}
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
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

        {/* Card Content */}
        <div className="p-5 flex gap-4">
        {/* Left: Social Links (matching vote/comment column position) */}
        <div className="flex flex-col items-center gap-1">
          {/* Twitter Link */}
          {creator.twitter && (
            <motion.a
              whileTap={{ scale: 0.9 }}
              href={creator.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-lg bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-blue-500/50 hover:text-blue-400 border transition-all w-14 h-14"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
          )}

          {/* Website Link */}
          {creator.website && (
            <motion.a
              whileTap={{ scale: 0.95 }}
              href={creator.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all w-14 h-14"
            >
              <Globe className="w-5 h-5" />
            </motion.a>
          )}
        </div>

        {/* Right: Main Content */}
        <div className="flex-1">
          {/* Header with Avatar and Name */}
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar - Same size as vote button (56px = w-14 h-14) */}
            <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
              {creator.avatarUrl ? (
                <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-xl font-bold text-zinc-600">
                  {creator.name.charAt(0)}
                </div>
              )}
              {/* Verified checkmark overlay */}
              {creator.isVerified && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-zinc-950">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Name and Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">
                  {creator.name}
                </h3>
                {/* Badges */}
                {creator.badges && creator.badges.map((badge, i) => (
                  <div
                    key={i}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 bg-lime-500/10 text-lime-400 border border-lime-500/20"
                  >
                    {badge}
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-500 mb-1">
                {creator.handle}
              </p>
              <p className="text-sm text-zinc-400 line-clamp-2">
                {creator.bio}
              </p>
            </div>
          </div>

          {/* Compact Stats Row - Followers, Projects, Views, Key Holders - All in one line */}
          <div className="flex items-center gap-2 mb-4 text-[10px]">
            {/* Followers */}
            {creator.followers !== undefined && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-lime-500/10 border border-lime-500/20">
                <Users className="w-3 h-3 text-lime-400" />
                <span className="text-lime-400 font-medium">{creator.followers}</span>
                <span className="text-zinc-600 ml-0.5">followers</span>
              </div>
            )}

            {/* Projects Count */}
            {creator.projectsCount !== undefined && creator.projectsCount > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-cyan-400 font-medium">{creator.projectsCount}</span>
                <span className="text-zinc-600 ml-0.5">projects</span>
              </div>
            )}

            {/* Key Holders Count */}
            {creator.keyHolders !== undefined && creator.keyHolders > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                <Zap className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 font-medium">{creator.keyHolders}</span>
              </div>
            )}

            {/* Views */}
            {creator.viewCount !== undefined && creator.viewCount > 0 && (
              <div className="flex items-center gap-1 text-zinc-600">
                <Eye className="w-3 h-3" />
                <span>{creator.viewCount}</span>
              </div>
            )}
          </div>

          {/* Conviction Bar */}
          {creator.convictionPct !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-600">Conviction</span>
                <span className="text-xs text-zinc-400 font-medium">{creator.convictionPct}%</span>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-lime-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${creator.convictionPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Buy Keys Button - Shows price with SOL symbol */}
            {creator.keyPrice !== undefined && onBuyKeys && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onBuyKeys}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white border border-zinc-800 hover:border-orange-500 transition-all text-xs"
                title="Buy Alpha Keys"
              >
                <span>Buy Keys</span>
                <span className="text-[10px] opacity-70">◎{creator.keyPrice.toFixed(3)}</span>
              </motion.button>
            )}

            {/* Invite Button (replaces Collaborate) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onInvite}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-gradient-to-r hover:from-lime-500 hover:to-pink-500 hover:text-white border border-zinc-800 hover:border-lime-500 transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">Invite</span>
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
