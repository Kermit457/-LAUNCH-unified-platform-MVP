"use client"

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'

interface InactiveCurveBannerProps {
  onActivate: () => void
  currentKeys: number
  minKeysRequired: number
}

export function InactiveCurveBanner({
  onActivate,
  currentKeys,
  minKeysRequired
}: InactiveCurveBannerProps) {
  const progress = (currentKeys / minKeysRequired) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-zinc-900/50 to-pink-900/20 backdrop-blur-xl mb-8"
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative p-8">
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                  Unlock the Platform
                  <span className="px-2 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold">
                    LOCKED
                  </span>
                </h3>
                <p className="text-zinc-400">
                  Buy {minKeysRequired} of your own keys to activate your curve and access all features
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={onActivate}
                className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2"
              >
                Buy Keys
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Keys Owned</span>
                <span className="text-white font-bold">{currentKeys}/{minKeysRequired}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>

            {/* Locked Features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                '💬 Comment & Upvote',
                '🤝 Collaborate',
                '🚀 Launch Projects',
                '💰 Earn Campaigns',
                '📊 Discover Feed',
                '🎁 Airdrops'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Compact version for smaller spaces
 */
export function InactiveCurveBannerCompact({
  onActivate,
  currentKeys,
  minKeysRequired
}: Pick<InactiveCurveBannerProps, 'onActivate' | 'currentKeys' | 'minKeysRequired'>) {
  const progress = (currentKeys / minKeysRequired) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Sparkles className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              Unlock platform ({currentKeys}/{minKeysRequired} keys)
            </p>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={onActivate}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold hover:shadow-lg transition-all flex-shrink-0"
        >
          Buy Keys
        </button>
      </div>
    </motion.div>
  )
}