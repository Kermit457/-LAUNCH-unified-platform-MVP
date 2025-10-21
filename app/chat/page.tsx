"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Users, Inbox, Lock, Zap } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { useCurveActivation } from '@/contexts/CurveActivationContext'
import { RoomsList } from '@/components/chat/RoomsList'
import { ChatDrawer } from '@/components/chat/ChatDrawer'

export default function ChatPage() {
  const { ready, authenticated, login } = usePrivy()
  const { isActivated } = useCurveActivation()
  const [activeTab, setActiveTab] = useState<'all' | 'dms' | 'groups' | 'invites'>('all')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-connect on mobile if not authenticated
  useEffect(() => {
    if (ready && !authenticated && isMobile) {
      console.log('🔐 Auto-connecting on mobile...')
      login()
    }
  }, [ready, authenticated, isMobile, login])

  // Development bypass
  const skipGating = process.env.NEXT_PUBLIC_SKIP_CURVE_GATING === 'true'

  // If user doesn't have a curve, show gating overlay (unless bypassed)
  if (!isActivated && !skipGating) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          {/* Lock Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8800FF]/20 to-[#00FFFF]/20 border border-[#8800FF]/30 flex items-center justify-center">
              <Lock className="w-10 h-10 text-[#8800FF]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#8800FF] to-[#00FFFF] bg-clip-text text-transparent">
            Activate Your Curve
          </h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            To start chatting and collaborating, you need to activate your personal curve. Hold at least <span className="text-white font-bold">10 keys</span> of your own curve to unlock messaging.
          </p>

          {/* CTA */}
          <button
            onClick={() => window.location.href = '/launch'}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#8800FF] to-[#9910FF] hover:from-[#9910FF] hover:to-[#AA20FF] text-white font-bold transition-all hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <Zap className="w-5 h-5" />
            Activate Curve
          </button>

          {/* Info */}
          <p className="text-xs text-zinc-500 mt-6">
            Once activated, you'll unlock DMs, group chats, and project collaboration rooms.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-6">
      {/* Header - Mobile Optimized */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 pb-1.5 md:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base md:text-2xl font-bold flex items-center gap-1.5 md:gap-3">
                <MessageCircle className="w-5 h-5 md:w-7 md:h-7 text-[#8800FF]" />
                Chat
              </h1>
              <p className="text-[10px] md:text-sm text-zinc-400 mt-0.5 md:mt-1">Connect with builders</p>
            </div>
          </div>

          {/* Tabs - Mobile Optimized */}
          <div className="flex gap-1 md:gap-2 mt-2 md:mt-4 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'All', icon: MessageCircle },
              { id: 'dms', label: 'DMs', icon: MessageCircle },
              { id: 'groups', label: 'Groups', icon: Users },
              { id: 'invites', label: 'Invites', icon: Inbox },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-2 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap ${
                    active
                      ? 'text-[#8800FF] bg-[#8800FF]/10 border border-[#8800FF]/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-3 h-3 md:w-4 md:h-4" />
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#8800FF]/5 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 md:py-6">
        {activeTab === 'invites' ? (
          <div className="text-center py-8 md:py-12">
            <Inbox className="w-8 h-8 md:w-12 md:h-12 text-zinc-600 mx-auto mb-2 md:mb-4" />
            <p className="text-sm md:text-base text-zinc-400">No new invites</p>
            <p className="text-[10px] md:text-xs text-zinc-600 mt-1 md:mt-2">Collaboration requests will appear here</p>
          </div>
        ) : (
          <RoomsList
            onThreadClick={(threadId) => setSelectedThreadId(threadId)}
            filterType={activeTab === 'all' ? undefined : activeTab === 'dms' ? 'dm' : 'group'}
          />
        )}
      </div>

      {/* Chat Drawer */}
      {selectedThreadId && (
        <ChatDrawer
          threadId={selectedThreadId}
          isOpen={!!selectedThreadId}
          onClose={() => setSelectedThreadId(null)}
        />
      )}
    </div>
  )
}
