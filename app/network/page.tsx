"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Copy, Share2, UserPlus } from 'lucide-react'
import { IconSearch, IconLightning, IconNetwork, IconRocket } from '@/lib/icons'
import { PeopleGrid } from '@/components/network/PeopleGrid'
import { Dealflow } from '@/components/network/Dealflow'
import { NetworkTicker } from '@/components/network/NetworkTicker'
import { DealflowModal, DealflowSubmission } from '@/components/network/DealflowModal'
import { useCurveActivation } from '@/contexts/CurveActivationContext'
import { useToast } from '@/hooks/useToast'
import { usePrivy } from '@privy-io/react-auth'
import { createDealflow } from '@/lib/appwrite/services/dealflow'
import { getNetworkInvites } from '@/lib/appwrite/services/network'
import { CurveService } from '@/lib/appwrite/services/curves'
import { useEffect } from 'react'

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileView, setMobileView] = useState<'users' | 'dealflow'>('users')
  const [showDealflowModal, setShowDealflowModal] = useState(false)
  const { isActivated } = useCurveActivation()
  const { user } = usePrivy()
  const { success, error: showError } = useToast()

  // Real metrics from Appwrite
  const [metrics, setMetrics] = useState({
    onlineNow: 0,
    openTasks: 0,
    holders: 0,
    collaborations: 0,
  })

  // Real referral link with user ID
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${user?.id || 'signup'}`

  // Load metrics from Appwrite
  useEffect(() => {
    if (!user?.id) return

    async function loadMetrics() {
      const userId = user?.id
      if (!userId) return

      try {
        // Get network connections
        const invites = await getNetworkInvites({
          userId,
          status: 'accepted'
        })

        // Get user's curve holders
        const curve = await CurveService.getCurveByOwner('user', userId)

        setMetrics({
          onlineNow: 0, // TODO: Implement real-time presence tracking
          openTasks: 0, // TODO: Connect to quests/tasks system
          holders: curve?.holders || 0,
          collaborations: invites.length,
        })
      } catch (error) {
        console.error('Failed to load network metrics:', error)
      }
    }

    loadMetrics()
  }, [user?.id])

  const handleCopyRefLink = () => {
    navigator.clipboard.writeText(referralLink)
    success('Copied!', 'Referral link copied to clipboard')
  }

  const handleShareRefLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Network on LaunchOS',
          text: 'Connect with me and start collaborating!',
          url: referralLink,
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopyRefLink()
    }
  }

  const handleDealflowSubmit = async (data: DealflowSubmission) => {
    if (!user?.id) {
      throw new Error('Please log in to submit dealflow')
    }

    try {
      await createDealflow({
        userId: user.id,
        ...data
      })
    } catch (error: any) {
      throw new Error(error.message || 'Failed to submit dealflow')
    }
  }

  return (
    <div className="min-h-screen bg-btdemo-canvas text-btdemo-text pb-20 md:pb-6">
      {/* Header - Ultra Compact Mobile */}
      <div className="px-2 sm:px-6 lg:px-8 pt-2 md:pt-6 pb-2 md:pb-3">
        <div className="max-w-7xl mx-auto">
          {/* Title - Much Smaller on Mobile */}
          <div className="mb-2 md:mb-4">
            <h1 className="text-base md:text-4xl font-black text-btdemo-primary btdemo-text-glow">
              Network
            </h1>
            <p className="text-[10px] md:text-base text-btdemo-text-muted">
              Connect, team up, and get deals moving.
            </p>
          </div>

          {/* Search & Quick Actions - Compact Row */}
          <div className="flex gap-1.5 md:gap-3 mb-2 md:mb-3">
            {/* Compact Search */}
            <div className="relative flex-1">
              <IconSearch size={20} className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-btdemo-primary opacity-50" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 md:pl-9 pr-2 md:pr-3 py-3 min-h-[48px] rounded-md md:rounded-lg btdemo-glass text-btdemo-text text-base placeholder:text-btdemo-text-muted focus:outline-none focus:border-btdemo-primary transition-all"
              />
            </div>

            {/* Online Badge - Minimal */}
            <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg btdemo-glass whitespace-nowrap">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-btdemo-secondary animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold text-btdemo-text font-led-dot">{metrics.onlineNow}</span>
            </div>

            {/* Add Dealflow Button - Larger */}
            <button
              onClick={() => setShowDealflowModal(true)}
              className="px-6 py-3 min-h-[48px] rounded-xl btdemo-btn-glow transition-all flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Dealflow</span>
            </button>

            {/* Invite Button - Compact */}
            <button className="px-5 py-2.5 min-h-[44px] rounded-lg btdemo-btn-glow transition-all flex items-center gap-2 whitespace-nowrap text-sm">
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Invite</span>
            </button>
          </div>

          {/* Referral Link & Stats - Combined Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-2 md:mb-3">
            {/* Referral Link - Copy & Share - Half width on desktop */}
            <div className="p-2 md:p-3 rounded-md md:rounded-lg btdemo-glass">
              <div className="flex items-center gap-2 h-full">
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] md:text-xs text-btdemo-text-muted mb-0.5">Your Referral Link</div>
                  <div className="text-[10px] md:text-sm text-btdemo-text font-mono truncate">{referralLink}</div>
                </div>
                <div className="flex gap-1 md:gap-2">
                  <button
                    onClick={handleCopyRefLink}
                    className="px-5 py-2.5 min-h-[44px] rounded-lg btdemo-btn-glass transition-all flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-5 h-5" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                  <button
                    onClick={handleShareRefLink}
                    className="px-5 py-2.5 min-h-[44px] rounded-lg btdemo-btn-glow transition-all flex items-center gap-2 text-sm"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Holders & Collabs - Half width on desktop */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {/* Holders */}
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-3 rounded-md md:rounded-xl bg-gradient-to-br from-[#D1FD0A]/10 to-[#B8E008]/5 border border-[#D1FD0A]/20">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-[#D1FD0A]/20 flex items-center justify-center flex-shrink-0">
                  <IconNetwork size={16} className="text-[#D1FD0A]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] md:text-xs text-zinc-500">Holders</div>
                  <div className="text-sm md:text-xl font-bold text-white font-led-dot">{metrics.holders}</div>
                </div>
              </div>

              {/* Collaborations */}
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-3 rounded-md md:rounded-xl bg-gradient-to-br from-[#D1FD0A]/10 to-[#B8E008]/5 border border-[#D1FD0A]/20">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-[#D1FD0A]/20 flex items-center justify-center flex-shrink-0">
                  <IconRocket size={16} className="text-[#D1FD0A]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] md:text-xs text-zinc-500">Collabs</div>
                  <div className="text-sm md:text-xl font-bold text-white font-led-dot">{metrics.collaborations}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Compact Mobile */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Top Performers - Minimal Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 md:mb-6"
        >
          <div className="flex items-center justify-between mb-1.5 md:mb-3">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-0.5 md:w-1 h-4 md:h-6 bg-gradient-to-b from-[#FFD700] to-[#00FF88] rounded-full" />
              <div>
                <h2 className="text-xs md:text-xl font-bold text-white flex items-center gap-1 md:gap-2">
                  Top Performers
                  <span className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
                    Elite
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <PeopleGrid searchQuery={searchQuery} limit={6} horizontal />
        </motion.div>

        {/* Curve Gate Banner - Minimal Mobile */}
        {!isActivated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 md:mb-6 p-2 md:p-4 rounded-lg md:rounded-xl glass-premium border-2 border-[#D1FD0A]/30"
          >
            <div className="flex items-start gap-1.5 md:gap-3">
              <div className="w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-lg bg-[#D1FD0A]/20 flex items-center justify-center flex-shrink-0">
                <IconLightning size={20} className="text-[#D1FD0A]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[11px] md:text-base font-bold text-white mb-0.5 md:mb-1">Unlock DMs & Collab</h3>
                <p className="text-[9px] md:text-sm text-zinc-400 leading-tight md:leading-normal">
                  Activate your curve to connect with builders.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mobile View Switcher - Only on Mobile */}
        <div className="md:hidden mb-2 flex gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setMobileView('users')}
            className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-md font-bold text-sm active:scale-95 transition-all ${
              mobileView === 'users'
                ? 'bg-[#D1FD0A] text-white'
                : 'text-zinc-400'
            }`}
          >
            Users ({metrics.onlineNow})
          </button>
          <button
            onClick={() => setMobileView('dealflow')}
            className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-md font-bold text-sm active:scale-95 transition-all ${
              mobileView === 'dealflow'
                ? 'bg-[#D1FD0A] text-white'
                : 'text-zinc-400'
            }`}
          >
            Dealflow ({metrics.openTasks})
          </button>
        </div>

        {/* Two Column Layout - Mobile Switchable, Desktop Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-6">
          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={mobileView === 'users' ? 'block' : 'hidden md:block'}
          >
            <div className="flex items-center gap-1.5 md:gap-3 mb-1.5 md:mb-3">
              <div>
                <h2 className="text-xs md:text-xl font-bold text-white">Active Now</h2>
                <p className="text-[9px] md:text-xs text-zinc-500">
                  <span className="text-[#00FF88] font-bold">{metrics.onlineNow}</span> online
                </p>
              </div>
            </div>
            <PeopleGrid searchQuery={searchQuery} limit={10} />
          </motion.div>

          {/* Dealflow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={mobileView === 'dealflow' ? 'block' : 'hidden md:block'}
          >
            <Dealflow />
          </motion.div>
        </div>
      </div>

      {/* Dealflow Submission Modal */}
      <DealflowModal
        isOpen={showDealflowModal}
        onClose={() => setShowDealflowModal(false)}
        onSubmit={handleDealflowSubmit}
      />
    </div>
  )
}
