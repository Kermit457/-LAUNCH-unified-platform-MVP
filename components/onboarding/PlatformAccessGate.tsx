"use client"

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PlatformAccessGateProps {
  isLocked: boolean
  children: ReactNode
  feature?: string // e.g., "comment", "upvote", "launch", "collaborate"
  onUnlock?: () => void
  className?: string
  variant?: 'overlay' | 'replace' | 'disable'
}

/**
 * Gate component that locks platform features until user activates their curve
 *
 * Usage:
 * ```tsx
 * <PlatformAccessGate isLocked={!isActivated} feature="comment" onUnlock={openActivationModal}>
 *   <CommentButton />
 * </PlatformAccessGate>
 * ```
 *
 * Variants:
 * - overlay: Shows content but overlays a lock message when clicked
 * - replace: Replaces content entirely with lock message
 * - disable: Shows content but disables interactions
 */
export function PlatformAccessGate({
  isLocked,
  children,
  feature = 'this feature',
  onUnlock,
  className,
  variant = 'overlay'
}: PlatformAccessGateProps) {
  // If not locked, just render children
  if (!isLocked) {
    return <>{children}</>
  }

  // Replace variant - completely replace content with lock message
  if (variant === 'replace') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm",
          className
        )}
      >
        <div className="flex items-center gap-3 text-zinc-400">
          <Lock className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white mb-1">
              Activate your curve to unlock {feature}
            </p>
            <p className="text-xs text-zinc-500">
              Buy 10 of your own keys to access all platform features
            </p>
          </div>
          {onUnlock && (
            <button
              onClick={onUnlock}
              className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold transition-all flex items-center gap-1"
            >
              Unlock
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  // Disable variant - show content but make it non-interactive
  if (variant === 'disable') {
    return (
      <div className={cn("relative", className)}>
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg flex items-center gap-2"
          >
            <Lock className="w-3 h-3 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-400">
              Locked
            </span>
          </motion.div>
        </div>
      </div>
    )
  }

  // Overlay variant (default) - show content but intercept clicks
  return (
    <div className={cn("relative group", className)}>
      {/* Content (clickable but will trigger overlay) */}
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onUnlock?.()
        }}
        className="cursor-pointer"
      >
        {children}
      </div>

      {/* Lock indicator (hover) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="p-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30">
          <Lock className="w-3 h-3 text-orange-400" />
        </div>
      </div>
    </div>
  )
}

/**
 * Inline lock message for buttons/actions
 */
export function LockedButton({
  feature = 'this action',
  onUnlock,
  className
}: {
  feature?: string
  onUnlock?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onUnlock}
      className={cn(
        "px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-orange-500/50 transition-all flex items-center gap-2 text-zinc-400 hover:text-orange-400",
        className
      )}
    >
      <Lock className="w-4 h-4" />
      <span className="text-sm font-medium">
        Unlock to {feature}
      </span>
    </button>
  )
}

/**
 * Modal overlay that appears when user tries to access locked feature
 */
export function LockedFeatureModal({
  isOpen,
  onClose,
  onUnlock,
  feature = 'this feature',
  currentKeys = 0,
  minKeysRequired = 10
}: {
  isOpen: boolean
  onClose: () => void
  onUnlock: () => void
  feature?: string
  currentKeys?: number
  minKeysRequired?: number
}) {
  if (!isOpen) return null

  const progress = (currentKeys / minKeysRequired) * 100

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-900/20 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden"
        >
          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-black text-white text-center mb-3">
              Feature Locked
            </h2>
            <p className="text-zinc-400 text-center mb-6">
              Activate your curve to unlock <span className="text-white font-semibold">{feature}</span>
            </p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Keys Owned</span>
                <span className="text-white font-bold">{currentKeys}/{minKeysRequired}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>

            {/* Features List */}
            <div className="bg-zinc-900/50 rounded-2xl p-4 mb-6">
              <p className="text-xs text-zinc-500 mb-3">Unlock all features:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '💬 Comments',
                  '👍 Upvotes',
                  '🤝 Collaborate',
                  '🚀 Launch',
                  '💰 Earn',
                  '📊 Discover'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                onClose()
                onUnlock()
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 mb-3"
            >
              <Sparkles className="w-5 h-5" />
              Buy {minKeysRequired} Keys to Unlock
              <Sparkles className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-medium transition-all"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}