"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Rocket, Coins, Users2, MessageCircle, Activity,
  Search, Filter, ArrowUpRight, ArrowDownRight, Gift, Zap, Clock, Video, CheckCircle, XCircle
} from 'lucide-react'
import { NetWorthHero } from '@/components/dashboard/NetWorthHero'
import { UnifiedCard } from '@/components/UnifiedCard'
import { useCurveActivationV6 } from '@/hooks/useCurveActivationV6'
import { ActivateCurveModal } from '@/components/onboarding/ActivateCurveModal'
import { InactiveCurveBanner } from '@/components/onboarding/InactiveCurveBanner'
import { useUser } from '@/hooks/useUser'
// Removed mock data imports - using real blockchain data

type TabId = 'holdings' | 'my-curves' | 'earnings' | 'collaborations' | 'messages' | 'network' | 'activity' | 'submissions'

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<TabId>('holdings')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'conviction'>('value')

  // 🆕 V6 Curve Activation System (Blockchain-based)
  const { userId } = useUser()
  const {
    progress,
    loading,
    showActivationModal,
    setShowActivationModal,
    activateCurve,
    isActivated,
    needsCreation
  } = useCurveActivationV6()

  // TODO: Replace with real blockchain data
  const activeCollabs: any[] = []
  const pendingCollabs: any[] = []
  const unreadCount = 0
  const sortedHoldings: any[] = []

  const tabs = [
    {
      id: 'holdings' as TabId,
      label: 'Holdings',
      icon: TrendingUp,
      count: 0,
      color: 'text-[#8800FF]' // Purple
    },
    {
      id: 'my-curves' as TabId,
      label: 'My Curves',
      icon: Rocket,
      count: isActivated ? 1 : 0, // User has 1 curve if activated
      color: 'text-[#00FF88]' // Green
    },
    {
      id: 'earnings' as TabId,
      label: 'Earnings',
      icon: Coins,
      value: '0 SOL',
      color: 'text-[#FFD700]' // Yellow
    },
    {
      id: 'collaborations' as TabId,
      label: 'Collaborations',
      icon: Users2,
      count: 0,
      badge: 0,
      color: 'text-[#0088FF]' // Blue
    },
    {
      id: 'messages' as TabId,
      label: 'Messages',
      icon: MessageCircle,
      count: 0,
      badge: false,
      color: 'text-[#FF0040]' // Red
    },
    {
      id: 'activity' as TabId,
      label: 'Activity',
      icon: Activity,
      color: 'text-[#00FFFF]' // Cyan
    },
    {
      id: 'submissions' as TabId,
      label: 'Submissions',
      icon: Video,
      count: 0,
      badge: 0, // Number of pending submissions
      color: 'text-[#FF00FF]' // Magenta
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-purple-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-pink-600/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Stats */}
        <NetWorthHero
          stats={{
            totalValue: 0,
            change24h: 0,
            changePercent: 0,
            totalEarned: {
              lifetime: 0,
              thisWeek: 0,
              thisMonth: 0
            }
          }}
          holdingsCount={0}
          curvesOwnedCount={isActivated ? 1 : 0}
          collaborationsCount={0}
          pendingCollabsCount={0}
          unreadMessagesCount={0}
          networkSize={0}
        />

        {/* 🆕 Curve Creation Banner (shows if curve doesn't exist on-chain) */}
        {!loading && needsCreation && progress.twitterHandle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-orange-900/40 to-zinc-900/60 border border-orange-500/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Create Your Curve</h3>
            </div>
            <p className="text-zinc-400 mb-4">
              Initialize your bonding curve on Solana to start trading and unlock platform features.
            </p>
            <p className="text-sm text-zinc-500 mb-4">
              Your Twitter handle: <span className="text-white font-medium">@{progress.twitterHandle}</span>
            </p>
            <button
              onClick={() => setShowActivationModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Create My Curve
            </button>
          </motion.div>
        )}

        {/* 🆕 Activation Banner (shows if curve exists but is inactive) */}
        {!loading && !needsCreation && !isActivated && (
          <InactiveCurveBanner
            onActivate={() => setShowActivationModal(true)}
            currentKeys={progress.currentKeys}
            minKeysRequired={progress.minKeysRequired}
          />
        )}

        {/* Portfolio Breakdown Chart - Hidden until user has holdings */}
        {sortedHoldings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800"
          >
            <h2 className="text-xl font-bold text-white mb-4">Portfolio Distribution</h2>
            <div className="text-center py-8 text-zinc-500">
              No holdings yet. Start by buying keys to build your portfolio.
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            // Get background color based on tab color when active
            const getActiveClass = () => {
              if (activeTab !== tab.id) return ''

              switch(tab.id) {
                case 'holdings': return 'bg-[#8800FF]/20 border-[#8800FF]'
                case 'my-curves': return 'bg-[#00FF88]/20 border-[#00FF88]'
                case 'earnings': return 'bg-[#FFD700]/20 border-[#FFD700]'
                case 'collaborations': return 'bg-[#0088FF]/20 border-[#0088FF]'
                case 'messages': return 'bg-[#FF0040]/20 border-[#FF0040]'
                case 'activity': return 'bg-[#00FFFF]/20 border-[#00FFFF]'
                case 'submissions': return 'bg-[#FF00FF]/20 border-[#FF00FF]'
                default: return 'bg-zinc-800/50 border-zinc-700'
              }
            }

            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all border-2 ${
                  activeTab === tab.id
                    ? `${getActiveClass()} text-white shadow-lg`
                    : 'bg-zinc-900/60 text-white border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-xs opacity-75">({tab.count})</span>
                )}
                {tab.value && (
                  <span className="text-xs opacity-75">{tab.value}</span>
                )}
                {tab.badge && typeof tab.badge === 'number' && tab.badge > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white"
                  >
                    {tab.badge}
                  </motion.div>
                )}
                {tab.badge === true && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Holdings Tab */}
          {activeTab === 'holdings' && (
            <motion.div
              key="holdings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search holdings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  {(['value', 'pnl', 'conviction'] as const).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                        sortBy === sort
                          ? 'bg-[#FF00FF]/20 border-[#FF00FF] text-white'
                          : 'bg-zinc-900/60 text-white border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700'
                      }`}
                    >
                      {sort === 'value' && 'Value'}
                      {sort === 'pnl' && 'P&L'}
                      {sort === 'conviction' && 'Conviction'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Holdings Grid */}
              {sortedHoldings.length === 0 ? (
                <div className="text-center py-16">
                  <TrendingUp className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Holdings Yet</h3>
                  <p className="text-zinc-400 mb-6">Start by buying keys from projects you believe in</p>
                  {!isActivated && (
                    <p className="text-sm text-orange-400">
                      💡 Tip: Activate your curve first by buying 10 of your own keys
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedHoldings.map((holding, index) => (
                    <motion.div
                      key={holding.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <UnifiedCard data={holding} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* My Curves Tab */}
          {activeTab === 'my-curves' && (
            <motion.div
              key="my-curves"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {!isActivated ? (
                <div className="text-center py-16">
                  <Rocket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Activate Your Curve</h3>
                  <p className="text-zinc-400 mb-6">
                    Buy 10 of your own keys to activate your personal bonding curve
                  </p>
                  <button
                    onClick={() => setShowActivationModal(true)}
                    className="px-6 py-3 rounded-xl bg-[#00FF88] text-black font-bold hover:bg-[#00FF88]/90 transition-all"
                  >
                    Activate Now
                  </button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Rocket className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your Curve is Active!</h3>
                  <p className="text-zinc-400 mb-2">
                    Twitter: @{progress.twitterHandle}
                  </p>
                  <p className="text-zinc-400 mb-6">
                    Keys Owned: {progress.currentKeys}
                  </p>
                  <div className="inline-block px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                    Status: Active
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Total Earnings Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-900/40 to-zinc-900/60 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <Coins className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Total Earnings</h3>
                </div>
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  0 SOL
                </div>
                <div className="text-zinc-400">Lifetime earnings across all sources</div>
              </div>

              {/* Empty State */}
              <div className="text-center py-16">
                <Coins className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Earnings Yet</h3>
                <p className="text-zinc-400 mb-6">
                  Earn SOL through referrals, trading fees, and collaborations
                </p>
                {!isActivated && (
                  <p className="text-sm text-orange-400">
                    💡 Activate your curve to start earning
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Collaborations Tab */}
          {activeTab === 'collaborations' && (
            <motion.div
              key="collaborations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center py-16">
                <Users2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Collaborations Yet</h3>
                <p className="text-zinc-400 mb-6">
                  Connect with other creators and projects to collaborate
                </p>
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Messages Yet</h3>
                <p className="text-zinc-400 mb-6">
                  Start conversations with project creators and collaborators
                </p>
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center py-16">
                <Activity className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Activity Yet</h3>
                <p className="text-zinc-400 mb-6">
                  Your trading activity and transactions will appear here
                </p>
              </div>
            </motion.div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Submissions Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Campaign Submissions</h2>
                  <p className="text-zinc-400">Review and approve video submissions from creators</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white text-sm font-semibold hover:border-zinc-700 transition-all">
                    All
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-sm font-semibold hover:border-zinc-700 transition-all">
                    Pending
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-sm font-semibold hover:border-zinc-700 transition-all">
                    Approved
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-sm font-semibold hover:border-zinc-700 transition-all">
                    Rejected
                  </button>
                </div>
              </div>

              {/* Empty State */}
              <div className="text-center py-16">
                <Video className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Submissions Yet</h3>
                <p className="text-zinc-400 mb-6">
                  When creators submit videos for your campaigns, they'll appear here for review
                </p>
              </div>

              {/* Example of what submissions will look like (commented for now) */}
              {/* <div className="grid gap-4">
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Video className="w-12 h-12 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-white">Campaign Name</h4>
                          <p className="text-sm text-zinc-400">By @username • 2 hours ago</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-zinc-300 mb-4">Video description goes here...</p>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 font-semibold hover:bg-green-500/30 transition-all">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-semibold hover:bg-red-500/30 transition-all">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🆕 Activation Modal */}
        <ActivateCurveModal
          isOpen={showActivationModal}
          onClose={() => setShowActivationModal(false)}
          onActivate={activateCurve}
          userId={userId || ''}
          progress={progress}
        />
      </div>
    </div>
  )
}