"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Clock, CheckCircle2, Share2, Flame, DollarSign } from 'lucide-react'
import { useCurveActivation } from '@/contexts/CurveActivationContext'
import { useToast } from '@/hooks/useToast'
import { usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'

const mockDeals = [
  {
    id: '1',
    title: 'Need Rust developer for DeFi protocol',
    reward: '$1,200',
    skills: ['Rust', 'Solana', 'DeFi'],
    closingIn: '2 days',
    verified: true,
    applicants: 8,
    urgency: 'high'
  },
  {
    id: '2',
    title: 'UI/UX designer for NFT marketplace',
    reward: '$800',
    skills: ['Figma', 'UI/UX', 'Web3'],
    closingIn: '5 days',
    verified: true,
    applicants: 12,
    urgency: 'medium'
  },
  {
    id: '3',
    title: 'Growth hacker for meme coin launch',
    reward: '$500',
    skills: ['Marketing', 'Twitter', 'Community'],
    closingIn: '3 days',
    verified: false,
    applicants: 23,
    urgency: 'medium'
  },
  {
    id: '4',
    title: 'Smart contract auditor needed ASAP',
    reward: '$2,000',
    skills: ['Security', 'Solana', 'Auditing'],
    closingIn: '1 day',
    verified: true,
    applicants: 4,
    urgency: 'high'
  }
]

export function Dealflow() {
  const { isActivated } = useCurveActivation()
  const { user } = usePrivy()
  const { success, error: showError, warning } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApply = (dealId: string) => {
    if (!user?.id) {
      showError('Not Authenticated', 'Please log in to apply for deals')
      return
    }

    if (!isActivated) {
      warning('Keys Required', 'You need to own keys to apply for deals. Buy keys to unlock access.')
      return
    }

    // TODO: Wire to Appwrite dealflow application
    success('Applied!', 'Your application has been submitted')
    console.log('Apply to deal:', dealId)
  }

  const handleJoinRoom = (dealId: string) => {
    if (!user?.id) {
      showError('Not Authenticated', 'Please log in to join rooms')
      return
    }

    if (!isActivated) {
      warning('Keys Required', 'You need to own keys to join deal rooms. Buy keys to unlock access.')
      return
    }

    // TODO: Wire to chat room creation
    success('Joining Room', 'Opening deal discussion room...')
    console.log('Join room:', dealId)
  }

  const handleShare = (dealId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this deal on LaunchOS',
        url: `${window.location.origin}/dealflow/${dealId}`,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/dealflow/${dealId}`)
      success('Link Copied', 'Deal link copied to clipboard')
    }
    console.log('Share deal:', dealId)
  }

  return (
    <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00FF88]" />
            Dealflow
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Live opportunities. Fast execution.</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-[#00FF88]/10 hover:bg-[#00FF88]/20 text-[#00FF88] text-xs font-bold transition-all border border-[#00FF88]/30">
          Post Deal
        </button>
      </div>

      <div className="space-y-3">
        {mockDeals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-lg border bg-zinc-800/50 border-zinc-700 hover:border-[#00FF88]/50 transition-all hover:scale-[1.01] cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              {/* Urgency Indicator */}
              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center flex-shrink-0">
                {deal.urgency === 'high' ? (
                  <Flame className="w-5 h-5 text-[#00FF88]" />
                ) : (
                  <DollarSign className="w-5 h-5 text-[#00FF88]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm leading-tight">{deal.title}</h3>
                  {deal.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88] flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  <span>{deal.closingIn}</span>
                  <span>•</span>
                  <span className="text-zinc-400 font-bold">{deal.applicants} applied</span>
                </div>
              </div>

            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {deal.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-700/50 text-zinc-300 border border-zinc-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleApply(deal.id)
                }}
                className="px-3 py-2 rounded-lg bg-[#00FF88] hover:bg-[#00FF99] text-black font-bold text-xs transition-all"
              >
                Apply Now
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleJoinRoom(deal.id)
                }}
                className="px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs transition-all"
              >
                Join Room
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare(deal.id)
                }}
                className="px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-bold text-xs transition-all flex items-center justify-center gap-1"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {mockDeals.length === 0 && (
        <div className="py-8 text-center">
          <TrendingUp className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">No active deals. Post what you need.</p>
        </div>
      )}
    </div>
  )
}
