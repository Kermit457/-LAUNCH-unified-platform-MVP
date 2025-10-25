'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconClose,
  IconTwitter,
  IconTelegram,
  IconDiscord,
  IconCopy,
  IconVerified,
} from '@/lib/icons'
import { usePrivy } from '@privy-io/react-auth'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  roomTitle: string
  roomType: string
  roomDescription?: string
  referralCode?: string
}

export function ShareModal({
  isOpen,
  onClose,
  roomId,
  roomTitle,
  roomType,
  roomDescription,
  referralCode,
}: ShareModalProps) {
  const { user } = usePrivy()
  const [copied, setCopied] = useState(false)

  const roomUrl = `https://blast.app/room/${roomId}`
  const referralUrl = referralCode
    ? `${roomUrl}?ref=${referralCode}`
    : roomUrl

  // Generate share text
  const shareText = `Check out this ${roomType} on BLAST: ${roomTitle}

${roomDescription ? roomDescription.slice(0, 100) + '...' : ''}

${referralUrl}`

  const twitterText = encodeURIComponent(`Check out this ${roomType} on BLAST: ${roomTitle}

${referralUrl}`)

  const telegramText = encodeURIComponent(shareText)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${twitterText}`,
      '_blank',
      'width=550,height=420'
    )
  }

  const handleShareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${telegramText}`,
      '_blank'
    )
  }

  const handleShareDiscord = () => {
    // Discord doesn't have a direct share URL, so copy to clipboard
    navigator.clipboard.writeText(shareText)
    alert('Link copied! Paste it in Discord.')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-premium p-8 rounded-3xl border-2 border-primary/50 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <IconClose size={24} className="text-zinc-400" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Share Room</h2>
                <p className="text-sm text-zinc-400">
                  Spread the word and earn referral rewards
                </p>
              </div>

              {/* Preview Card */}
              <div className="glass-interactive p-5 rounded-xl mb-6 border-2 border-primary/50">
                <div className="badge-primary mb-3">{roomType.toUpperCase()}</div>
                <h3 className="text-white font-bold text-lg mb-2">{roomTitle}</h3>
                {roomDescription && (
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {roomDescription}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <div className="text-xs text-zinc-500">blast.app/room/{roomId.slice(0, 8)}...</div>
                </div>
              </div>

              {/* Copy Link */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">
                  Referral Link
                </label>
                <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50 flex items-center gap-3">
                  <div className="flex-1 text-sm text-white truncate font-mono">
                    {referralUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  >
                    {copied ? (
                      <IconVerified size={20} className="text-primary" />
                    ) : (
                      <IconCopy size={20} className="text-zinc-400" />
                    )}
                  </button>
                </div>
                {copied && (
                  <div className="text-xs text-primary mt-2 px-2">
                    ✓ Link copied to clipboard!
                  </div>
                )}
              </div>

              {/* Share Buttons */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-3">
                  Share on Social
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* Twitter */}
                  <button
                    onClick={handleShareTwitter}
                    className="glass-interactive p-4 rounded-xl hover:bg-white/10 transition-all group flex flex-col items-center gap-2"
                  >
                    <IconTwitter size={32} className="text-[#1DA1F2]" />
                    <span className="text-xs text-zinc-400 group-hover:text-white">
                      Twitter
                    </span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={handleShareTelegram}
                    className="glass-interactive p-4 rounded-xl hover:bg-white/10 transition-all group flex flex-col items-center gap-2"
                  >
                    <IconTelegram size={32} className="text-[#0088cc]" />
                    <span className="text-xs text-zinc-400 group-hover:text-white">
                      Telegram
                    </span>
                  </button>

                  {/* Discord */}
                  <button
                    onClick={handleShareDiscord}
                    className="glass-interactive p-4 rounded-xl hover:bg-white/10 transition-all group flex flex-col items-center gap-2"
                  >
                    <IconDiscord size={32} className="text-[#5865F2]" />
                    <span className="text-xs text-zinc-400 group-hover:text-white">
                      Discord
                    </span>
                  </button>
                </div>
              </div>

              {/* Referral Rewards */}
              {referralCode && (
                <div className="glass-interactive p-4 rounded-xl mb-6">
                  <div className="text-xs font-bold text-primary mb-2">
                    🎁 REFERRAL REWARDS
                  </div>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Earn <strong className="text-primary">+3 Motion</strong> per successful referral</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Get <strong className="text-primary">0.5 keys</strong> when they join their first room</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Track all referrals in your Dashboard</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-6 py-4 bg-[#D1FD0A] hover:bg-[#B8E309] rounded-xl font-bold text-black transition-all"
              >
                Done
              </button>

              {/* Info */}
              <div className="mt-4 p-3 glass-interactive rounded-xl">
                <p className="text-xs text-zinc-400 leading-relaxed text-center">
                  Share this room to help fill the slots faster!
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
