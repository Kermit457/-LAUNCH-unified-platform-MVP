"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Copy, Check, Share2 } from 'lucide-react'

interface InviteTreeProps {
  compact?: boolean
}

export function InviteTree({ compact = false }: InviteTreeProps) {
  const [copied, setCopied] = useState(false)
  const totalInvited: number = 12
  const totalEarnings = '$480'

  // Mock referral link (replace with actual user's link)
  const refLink = 'launch.os/ref/crypto_mike'

  // Simple list of recent invites
  const recentInvites = [
    { handle: 'crypto_mike', status: 'active', invited: '2d ago' },
    { handle: 'sarah_dev', status: 'active', invited: '4d ago' },
    { handle: 'alex_builder', status: 'pending', invited: '1w ago' },
    { handle: 'degen_trader', status: 'active', invited: '2w ago' }
  ]

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${refLink}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Compact version for hero section
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
        <Users className="w-4 h-4 text-[#8800FF]" />
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Invites</span>
          <span className="font-bold text-white">{totalInvited}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Earned</span>
          <span className="font-bold text-[#00FF88]">{totalEarnings}</span>
        </div>
        <button
          onClick={handleCopyLink}
          className="ml-1 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
          title="Copy referral link"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#00FF88]" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#8800FF]" />
          Your Invites
        </h2>
        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 rounded-lg bg-[#8800FF]/10 hover:bg-[#8800FF]/20 text-[#8800FF] text-xs font-bold transition-all border border-[#8800FF]/30 flex items-center gap-1"
        >
          <Share2 className="w-3 h-3" />
          Share Link
        </button>
      </div>

      {/* Referral Link */}
      <div className="mb-4 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
        <div className="text-xs text-zinc-400 mb-2">Your Referral Link</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs text-[#00FF88] font-mono truncate">
            {refLink}
          </code>
          <button
            onClick={handleCopyLink}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#00FF88]" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <div className="text-xs text-zinc-400">Total Invited</div>
          <div className="text-lg font-bold text-white">{totalInvited}</div>
        </div>
        <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <div className="text-xs text-zinc-400">Earned</div>
          <div className="text-lg font-bold text-[#00FF88]">{totalEarnings}</div>
        </div>
      </div>

      {/* Recent Invites List - Compact */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-zinc-400 mb-2">Recent Activity</h3>
        <div className="grid grid-cols-2 gap-2">
          {recentInvites.slice(0, 4).map((invite, index) => (
            <motion.div
              key={invite.handle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${invite.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-xs font-bold text-white truncate">@{invite.handle}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Incentive Banner */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[#8800FF]/10 to-[#00FF88]/10 border border-[#8800FF]/30">
        <div className="flex items-start gap-2">
          <UserPlus className="w-4 h-4 text-[#8800FF] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-white mb-1">2% on every trade</p>
            <p className="text-[10px] text-zinc-400">
              Your invites trade, you earn forever.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalInvited === 0 && (
        <div className="py-8 text-center">
          <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500 mb-3">No invites yet. Start growing your network.</p>
          <button className="px-4 py-2 rounded-lg bg-[#8800FF] hover:bg-[#9910FF] text-white font-bold text-sm transition-all">
            Invite Now
          </button>
        </div>
      )}
    </div>
  )
}
