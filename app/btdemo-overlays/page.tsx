'use client'

import { useState, useRef } from 'react'
import { Rocket, Zap, MessageCircle, UserPlus, Bell } from 'lucide-react'
import { SubmitLaunchDrawer } from '@/components/btdemo/overlays/SubmitLaunchDrawer'
import { TradeModal } from '@/components/btdemo/overlays/TradeModal'
import { CommentsDrawer } from '@/components/btdemo/overlays/CommentsDrawer'
import { CollaborateModal } from '@/components/btdemo/overlays/CollaborateModal'
import { NotificationDropdown } from '@/components/btdemo/overlays/NotificationDropdown'

export default function OverlaysDemo(): JSX.Element {
  // Overlay states
  const [submitDrawerOpen, setSubmitDrawerOpen] = useState(false)
  const [tradeModalOpen, setTradeModalOpen] = useState(false)
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false)
  const [collaborateModalOpen, setCollaborateModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const bellButtonRef = useRef<HTMLButtonElement>(null)

  const mockProject = {
    id: '1',
    name: 'LaunchOS Platform',
    ticker: 'LOS',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=launchos',
    motionScore: 847
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#D1FD0A] to-[#00FF88] bg-clip-text text-transparent">
            BTDEMO Overlays
          </h1>
          <p className="text-zinc-400 text-lg">
            Complete overlay system with LED numerals, animations, and accessibility
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Submit Launch Drawer */}
          <button
            onClick={() => setSubmitDrawerOpen(true)}
            className="glass-premium p-8 rounded-3xl border border-zinc-800 hover:border-[#D1FD0A] transition-all group"
          >
            <Rocket className="w-12 h-12 text-[#D1FD0A] mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Submit Launch Drawer</h3>
            <p className="text-sm text-zinc-400">
              Right slide drawer with form validation, file upload, and social links
            </p>
            <div className="mt-4 text-xs text-zinc-500">
              Features: Auto-focus, Escape key, Drag & drop
            </div>
          </button>

          {/* Trade Modal */}
          <button
            onClick={() => setTradeModalOpen(true)}
            className="glass-premium p-8 rounded-3xl border border-zinc-800 hover:border-[#D1FD0A] transition-all group"
          >
            <Zap className="w-12 h-12 text-[#00FF88] mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Trade Modal</h3>
            <p className="text-sm text-zinc-400">
              Buy/sell modal with LED price breakdown and live calculations
            </p>
            <div className="mt-4 text-xs text-zinc-500">
              Features: LED numerals, Quick amounts, MAX button
            </div>
          </button>

          {/* Comments Drawer */}
          <button
            onClick={() => setCommentsDrawerOpen(true)}
            className="glass-premium p-8 rounded-3xl border border-zinc-800 hover:border-[#D1FD0A] transition-all group"
          >
            <MessageCircle className="w-12 h-12 text-[#00FFFF] mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Comments Drawer</h3>
            <p className="text-sm text-zinc-400">
              Real-time comments with upvote functionality and timestamps
            </p>
            <div className="mt-4 text-xs text-zinc-500">
              Features: Upvotes, Real-time updates, Character counter
            </div>
          </button>

          {/* Collaborate Modal */}
          <button
            onClick={() => setCollaborateModalOpen(true)}
            className="glass-premium p-8 rounded-3xl border border-zinc-800 hover:border-[#D1FD0A] transition-all group"
          >
            <UserPlus className="w-12 h-12 text-[#D1FD0A] mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Collaborate Modal</h3>
            <p className="text-sm text-zinc-400">
              Partnership proposal form with multiple collaboration types
            </p>
            <div className="mt-4 text-xs text-zinc-500">
              Features: Type selector, Validation, Budget & timeline
            </div>
          </button>
        </div>

        {/* Notification Dropdown Demo */}
        <div className="glass-premium p-8 rounded-3xl border border-zinc-800 text-center">
          <h3 className="text-xl font-bold mb-4">Notification Dropdown</h3>
          <p className="text-sm text-zinc-400 mb-6">
            Anchored dropdown with type-colored badges and unread count
          </p>
          <div className="relative inline-block">
            <button
              ref={bellButtonRef}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-[#D1FD0A] transition-all"
            >
              <Bell className="w-6 h-6 text-[#D1FD0A]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D1FD0A] rounded-full flex items-center justify-center">
                <span className="text-black text-xs font-led-15">3</span>
              </span>
            </button>

            <NotificationDropdown
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              anchorRef={bellButtonRef}
            />
          </div>
          <div className="mt-4 text-xs text-zinc-500">
            Features: Click outside to close, Mark as read, Type colors
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-12 glass-premium p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#D1FD0A] rounded-full mt-2" />
              <div>
                <h4 className="font-semibold text-sm">LED Numerals</h4>
                <p className="text-xs text-zinc-400">DSEG14 font for all amounts and counts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#D1FD0A] rounded-full mt-2" />
              <div>
                <h4 className="font-semibold text-sm">Focus Management</h4>
                <p className="text-xs text-zinc-400">Auto-focus first input on open</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#D1FD0A] rounded-full mt-2" />
              <div>
                <h4 className="font-semibold text-sm">Keyboard Navigation</h4>
                <p className="text-xs text-zinc-400">Escape to close, Tab to navigate</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#D1FD0A] rounded-full mt-2" />
              <div>
                <h4 className="font-semibold text-sm">Framer Motion</h4>
                <p className="text-xs text-zinc-400">Smooth spring animations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#D1FD0A] rounded-full mt-2" />
              <div>
                <h4 className="font-semibold text-sm">ARIA Attributes</h4>
                <p className="text-xs text-zinc-400">Full screen reader support</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#D1FD0A] rounded-full mt-2" />
              <div>
                <h4 className="font-semibold text-sm">Body Scroll Lock</h4>
                <p className="text-xs text-zinc-400">Prevent background scroll</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-12 glass-premium p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Usage Example</h2>
          <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-xs text-zinc-300">
{`import { SubmitLaunchDrawer } from '@/components/btdemo/overlays/SubmitLaunchDrawer'

const [drawerOpen, setDrawerOpen] = useState(false)

<SubmitLaunchDrawer
  isOpen={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  onSubmit={(data) => console.log('Submitted:', data)}
/>`}
          </pre>
        </div>
      </div>

      {/* Overlays */}
      <SubmitLaunchDrawer
        isOpen={submitDrawerOpen}
        onClose={() => setSubmitDrawerOpen(false)}
        onSubmit={(data) => {
          console.log('Launch submitted:', data)
          setSubmitDrawerOpen(false)
        }}
      />

      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        project={mockProject}
        mode="buy"
      />

      <CommentsDrawer
        isOpen={commentsDrawerOpen}
        onClose={() => setCommentsDrawerOpen(false)}
        project={mockProject}
      />

      <CollaborateModal
        isOpen={collaborateModalOpen}
        onClose={() => setCollaborateModalOpen(false)}
        project={mockProject}
      />
    </div>
  )
}
