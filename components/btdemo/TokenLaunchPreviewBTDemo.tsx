'use client'

import { Rocket, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconRocket, IconClose } from '@/lib/icons'

interface TokenLaunchPreviewProps {
  onDismiss?: () => void
  initialExpanded?: boolean
}

export function TokenLaunchPreviewBTDemo({
  onDismiss,
  initialExpanded = false
}: TokenLaunchPreviewProps): JSX.Element {
  const [expanded, setExpanded] = useState<boolean>(initialExpanded)
  const [dismissed, setDismissed] = useState<boolean>(false)

  const handleDismiss = (): void => {
    setDismissed(true)
    onDismiss?.()
  }

  const handleToggleExpand = (): void => {
    setExpanded(!expanded)
  }

  if (dismissed) return <></>

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="container mx-auto px-4 pt-24 pb-4"
      >
        <div className="glass-interactive border border-white/10 rounded-2xl overflow-hidden">
          {/* Header - Always Visible */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon with idle pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  filter: [
                    'drop-shadow(0 0 0px rgba(209, 253, 10, 0.4))',
                    'drop-shadow(0 0 8px rgba(209, 253, 10, 0.6))',
                    'drop-shadow(0 0 0px rgba(209, 253, 10, 0.4))'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <IconRocket className="icon-primary" size={32} />
              </motion.div>

              <div>
                <h3 className="font-semibold text-sm sm:text-base">
                  Launch Your Token
                </h3>
                <p className="text-xs text-zinc-400">
                  Quick setup • No code required
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Expand/Collapse Button */}
              <motion.button
                onClick={handleToggleExpand}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="icon-interactive p-2 rounded-lg hover:bg-white/5"
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </motion.button>

              {/* Dismiss Button */}
              <motion.button
                onClick={handleDismiss}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="icon-interactive p-2 rounded-lg hover:bg-white/5"
                aria-label="Dismiss"
              >
                <IconClose size={20} />
              </motion.button>
            </div>
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2 }
                }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1 */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-interactive p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#D1FD0A] text-black
                          flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <h4 className="text-sm font-semibold">Token Info</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Name, symbol, and supply
                      </p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-interactive p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#D1FD0A] text-black
                          flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <h4 className="text-sm font-semibold">Bonding Curve</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Set price and liquidity
                      </p>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass-interactive p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#D1FD0A] text-black
                          flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <h4 className="text-sm font-semibold">Deploy</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Launch on Solana
                      </p>
                    </motion.div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{
                      y: -2,
                      boxShadow: '0 8px 24px rgba(209, 253, 10, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 flex items-center justify-center gap-2
                      px-6 py-3 bg-[#D1FD0A] hover:bg-[#E0FF1A] text-black font-semibold
                      rounded-xl transition-all duration-200 shadow-lg"
                  >
                    <IconRocket size={20} />
                    <span>Start Launch Process</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
