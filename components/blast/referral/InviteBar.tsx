/**
 * InviteBar - Referral system with BTDemo design
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import {
  IconGift,
  IconCopy,
  IconCheckCircle,
  IconContributorBubble,
  IconCash,
  IconMotion,
  IconLightning,
  IconShare,
  IconTwitter,
  IconTelegram,
  IconDiscord
} from '@/lib/icons'

interface InviteBarProps {
  className?: string
}

export function InviteBar({ className }: InviteBarProps) {
  const { user } = usePrivy()
  const [copied, setCopied] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  // Mock referral stats - Replace with real data
  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 240, // in SOL or points
    pendingRewards: 45
  }

  const referralLink = user
    ? `https://blast.app/invite/${user.id}`
    : 'https://blast.app/invite'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: 'twitter' | 'telegram' | 'discord') => {
    const text = 'Join BLAST Network Hub - Discover exclusive deals, airdrops, jobs & funding opportunities!'
    const url = referralLink

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'discord':
        // Discord doesn't have direct share URL, copy to clipboard instead
        handleCopyLink()
        break
    }
    setShareOpen(false)
  }

  return (
    <div className={className}>
      <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <IconGift className="icon-primary" size={32} />
          <div>
            <h3 className="text-xl font-black text-white">Invite & Earn</h3>
            <p className="text-sm text-zinc-400">Get rewards for every referral</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-interactive p-3 rounded-xl border border-primary/50">
            <div className="flex items-center gap-2 mb-1">
              <IconContributorBubble size={14} className="icon-muted" />
              <span className="stat-label text-xs">Referrals</span>
            </div>
            <div className="font-led-dot text-2xl text-primary">{referralStats.totalReferrals}</div>
            <div className="text-xs text-zinc-400">{referralStats.activeReferrals} active</div>
          </div>

          <div className="glass-interactive p-3 rounded-xl border border-primary/50">
            <div className="flex items-center gap-2 mb-1">
              <IconCash size={14} className="icon-muted" />
              <span className="stat-label text-xs">Earned</span>
            </div>
            <div className="font-led-dot text-2xl text-primary">{referralStats.totalEarnings}</div>
            <div className="text-xs text-zinc-400">{referralStats.pendingRewards} pending</div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="glass-interactive p-4 rounded-xl border border-primary/50 mb-4">
          <div className="stat-label mb-2">YOUR REFERRAL LINK</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-zinc-300 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-lg transition-all ${
                copied
                  ? 'bg-primary/20 text-primary'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
              }`}
              title="Copy link"
            >
              {copied ? (
                <IconCheckCircle size={20} className="text-primary" />
              ) : (
                <IconCopy size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCopyLink}
            className="w-full bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <IconCheckCircle size={20} className="text-black" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <IconCopy size={20} className="text-black" />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 font-semibold px-6 py-3 rounded-xl transition-all border-2 border-[#D1FD0A] flex items-center justify-center gap-2"
            >
              <IconShare size={20} className="text-[#D1FD0A]" />
              <span className="text-[#D1FD0A]">Share on Social</span>
            </button>

            {shareOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 right-0 mb-2 glass-premium rounded-xl p-2 border border-primary/50"
              >
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full list-item flex items-center gap-2 text-left"
                >
                  <IconTwitter size={16} className="text-[#1DA1F2]" />
                  <span>Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="w-full list-item flex items-center gap-2 text-left"
                >
                  <IconTelegram size={16} className="text-[#0088cc]" />
                  <span>Share on Telegram</span>
                </button>
                <button
                  onClick={() => handleShare('discord')}
                  className="w-full list-item flex items-center gap-2 text-left"
                >
                  <IconDiscord size={16} className="text-[#5865F2]" />
                  <span>Copy for Discord</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Rewards Info */}
        <div className="mt-4 p-4 rounded-xl glass-interactive border border-primary/50">
          <div className="flex items-start gap-3">
            <IconLightning className="icon-primary flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-white mb-1">Earn Rewards</h4>
              <ul className="text-xs text-zinc-400 space-y-1">
                <li>• <span className="font-led-dot text-primary">3%</span> of all fees from referrals</li>
                <li>• <span className="font-led-dot text-primary">+10</span> Motion Score boost per active referral</li>
                <li>• Unlock exclusive high-tier rooms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
