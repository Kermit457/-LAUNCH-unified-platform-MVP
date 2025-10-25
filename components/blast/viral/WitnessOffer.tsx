'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconLightning, IconClose } from '@/lib/icons'
import { checkWitnessOffer, WITNESS_TO_SPEAK } from '@/lib/blast/viral-mechanics'
import { BuyKeyModal } from '../modals/BuyKeyModal'

interface WitnessOfferProps {
  watchTime: number // seconds
  keyBalance: number
  onDismiss: () => void
}

export function WitnessOffer({ watchTime, keyBalance, onDismiss }: WitnessOfferProps) {
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const { showOffer, progress } = checkWitnessOffer(watchTime, keyBalance)

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss()
  }

  if (dismissed || !showOffer) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4"
      >
        <div className="glass-premium p-6 rounded-3xl border-2 border-primary relative">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <IconClose size={20} className="text-zinc-400" />
          </button>

          {/* Content */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <IconLightning size={32} className="text-primary" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              🎤 Ready to Speak?
            </h3>

            <p className="text-sm text-zinc-300 mb-1">
              You've watched for {Math.floor(watchTime / 60)} minutes!
            </p>

            <p className="text-xs text-zinc-400">
              Buy <strong className="text-primary">{WITNESS_TO_SPEAK.keysOffered} key</strong> to
              get <strong className="text-primary">{WITNESS_TO_SPEAK.micDuration / 60} minutes</strong> of
              mic access in this room
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setShowBuyModal(true)}
            className="w-full px-6 py-4 bg-[#D1FD0A] hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all flex items-center justify-center gap-2"
          >
            <IconLightning size={20} className="text-black" />
            <span>Buy {WITNESS_TO_SPEAK.keysOffered} Key for Mic Access</span>
          </button>

          {/* Info */}
          <div className="mt-3 text-xs text-zinc-400 text-center">
            Limited time offer • {Math.floor(WITNESS_TO_SPEAK.offerDuration / 60)} minute window
          </div>
        </div>
      </motion.div>

      {/* Buy Modal */}
      <BuyKeyModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        minKeys={WITNESS_TO_SPEAK.keysOffered}
        currentKeys={keyBalance}
      />
    </AnimatePresence>
  )
}
