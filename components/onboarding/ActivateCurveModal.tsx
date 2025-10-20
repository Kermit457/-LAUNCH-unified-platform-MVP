"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, Twitter, MessageCircle, Users, Coins, ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ActivateCurveModalProps {
  isOpen: boolean
  onClose: () => void
  onActivate: () => void
  userId: string
  progress: {
    hasMinKeys: boolean // Owns 10+ keys from other projects
    currentKeys: number // Total keys owned from other projects
    minKeysRequired: number // Default: 10
  }
}

export function ActivateCurveModal({
  isOpen,
  onClose,
  onActivate,
  userId,
  progress
}: ActivateCurveModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const allComplete = progress.hasMinKeys
  const completedSteps = progress.hasMinKeys ? 1 : 0

  const steps = [
    {
      id: 'keys',
      icon: Coins,
      title: 'Buy 10 of Your Own Keys',
      description: `Invest in yourself! Buy ${progress.minKeysRequired} keys of your own curve to activate it and unlock the platform`,
      completed: progress.hasMinKeys,
      action: progress.currentKeys > 0 ? `Buy ${progress.minKeysRequired - progress.currentKeys} More Keys` : 'Buy My Keys',
      color: 'green',
      progress: (progress.currentKeys / progress.minKeysRequired) * 100
    }
  ]

  // Auto-advance to next incomplete step
  useEffect(() => {
    const nextIncomplete = steps.findIndex(s => !s.completed)
    if (nextIncomplete !== -1) {
      setCurrentStep(nextIncomplete)
    }
  }, [progress])

  if (!isOpen) return null

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
          className="w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-900/20 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-zinc-800">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-1">
                  Your Curve is Ready!
                </h2>
                <p className="text-zinc-400">
                  Buy 10 of your own keys to activate and unlock the platform
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Keys Owned</span>
                <span className="text-white font-bold">{progress.currentKeys}/{progress.minKeysRequired}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.currentKeys / progress.minKeysRequired) * 100}%` }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="p-8 space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === index
              const colors = {
                purple: 'from-purple-500 to-violet-500',
                blue: 'from-blue-500 to-cyan-500',
                green: 'from-green-500 to-emerald-500'
              }

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative p-6 rounded-2xl border-2 transition-all cursor-pointer",
                    step.completed
                      ? "bg-green-500/5 border-green-500/30"
                      : isActive
                      ? "bg-zinc-800/50 border-zinc-700"
                      : "bg-zinc-900/50 border-zinc-800"
                  )}
                  onClick={() => setCurrentStep(index)}
                >
                  {/* Checkmark */}
                  {step.completed && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      step.completed
                        ? "bg-green-500"
                        : `bg-gradient-to-br ${colors[step.color as keyof typeof colors]}`
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-4">
                        {step.description}
                      </p>

                      {/* Progress bar for keys */}
                      {step.id === 'keys' && !step.completed && progress.currentKeys > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-zinc-500">Keys Owned</span>
                            <span className="text-white font-medium">
                              {progress.currentKeys}/{progress.minKeysRequired}
                            </span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${step.progress}%` }}
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {!step.completed && (
                        <button
                          onClick={() => {
                            // TODO: Wire up to actual curve creation + key purchase
                            alert(`🚧 Coming Soon!\n\nThis will:\n1. Create your curve on Solana (if it doesn't exist)\n2. Open Buy/Sell modal with 10 keys pre-filled\n3. Sign transaction with your Privy wallet\n4. Activate your account\n\nFor now, this is a placeholder.`)
                            console.log('Buy My Keys clicked - TODO: Implement curve creation + purchase')
                          }}
                          className={cn(
                            "px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all",
                            `bg-gradient-to-r ${colors[step.color as keyof typeof colors]} hover:shadow-lg hover:scale-105`
                          )}
                        >
                          {step.action}
                          <ArrowRight className="w-4 h-4 inline ml-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-8 pt-0">
            {allComplete ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onActivate}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Activate & Enter Platform
                <Zap className="w-5 h-5" />
              </motion.button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-4">
                  Buy {progress.minKeysRequired} of your own keys to unlock the platform
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-all"
                >
                  I'll Do This Later
                </button>
              </div>
            )}

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-3">What unlocks when you activate:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  '💬 Comment & Upvote on projects',
                  '🤝 Collaborate on launches',
                  '🚀 Launch your own projects',
                  '💰 Participate in Earn campaigns',
                  '📊 Visible in Discover feed',
                  '🎁 Receive airdrops & rewards'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}