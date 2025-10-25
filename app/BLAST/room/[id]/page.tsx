/**
 * Room Detail Page - BTDemo design
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useRoom } from '@/hooks/blast/useRoom'
import { useExtendRoom } from '@/hooks/blast/useExtendRoom'
import { useCloseRoom } from '@/hooks/blast/useCloseRoom'
import { usePrivy } from '@privy-io/react-auth'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { Countdown } from '@/components/blast/shared/Countdown'
import { ApplicantQueue } from '@/components/blast/room/ApplicantQueue'
import { RoomAnalyticsPanel } from '@/components/blast/analytics/RoomAnalyticsPanel'
import {
  IconNavArrowLeft,
  IconMenu,
  IconMotionScoreBadge,
  IconLab,
  IconLightning,
  IconCollabExpand,
  IconContributorBubble,
  IconDeposit,
  IconMotion,
  IconRocket,
  IconTrophy,
  IconAttention,
  IconMessage,
  IconUpvote,
  IconCash,
  IconCap,
  IconFreeze,
  IconClose,
  IconGem,
  IconComputer,
  IconNetwork,
  IconChartAnimation,
  IconActivityBadge,
  IconWeb,
  IconTwitter,
  IconTelegram,
  IconDiscord
} from '@/lib/icons'

interface RoomPageProps {
  params: {
    id: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter()
  const { user } = usePrivy()
  const { keyBalance } = useKeyGate()
  const { data: room, isLoading, error } = useRoom(params.id)
  const extendRoomMutation = useExtendRoom(params.id)
  const closeRoomMutation = useCloseRoom(params.id)

  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<'applications' | 'analytics'>('applications')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleExtend = () => {
    extendRoomMutation.mutate()
    setShowMenu(false)
  }

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close this room early? Refunds will be processed.')) {
      closeRoomMutation.mutate()
      setShowMenu(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400">Loading room...</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-black text-white">Room Not Found</h2>
          <p className="text-zinc-400">This room may have been closed or deleted</p>
          <button
            onClick={() => router.push('/BLAST')}
            className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            Back to Feed
          </button>
        </div>
      </div>
    )
  }

  const isCreator = user?.id === room.creatorId
  const hasAccess = keyBalance >= (room.minKeysToApply || 0)
  const fillRate = (room.filledSlots / room.totalSlots) * 100

  const getIcon = () => {
    switch (room.type) {
      case 'deal': return <IconCash className="icon-primary" size={32} />
      case 'airdrop': return <IconGem className="icon-primary" size={32} />
      case 'job': return <IconComputer className="icon-primary" size={32} />
      case 'collab': return <IconNetwork className="icon-primary" size={32} />
      case 'funding': return <IconCash className="icon-primary" size={32} />
      default: return <IconMotion className="icon-primary" size={32} />
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Blob Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[325px] h-[325px] rounded-full bg-primary/20 blur-[125px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[325px] h-[325px] rounded-full bg-primary/15 blur-[125px]" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full glass-premium border-b border-zinc-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/BLAST')}
            className="icon-interactive-primary"
          >
            <IconNavArrowLeft size={24} />
          </button>

          <div className="flex items-center gap-3">
            <Countdown endTime={room.endTime} />
            {isCreator && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="icon-interactive"
                >
                  <IconMenu size={24} />
                </button>

                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 glass-premium rounded-xl p-2"
                  >
                    {room.status === 'hot' && !room.extended && (
                      <button
                        onClick={handleExtend}
                        disabled={extendRoomMutation.isPending}
                        className="list-item w-full text-left"
                      >
                        <IconLightning size={16} className="inline mr-2" />
                        {extendRoomMutation.isPending ? 'Extending...' : 'Extend 24h'}
                      </button>
                    )}
                    <button
                      onClick={handleClose}
                      disabled={closeRoomMutation.isPending}
                      className="list-item w-full text-left text-[#FF005C]"
                    >
                      <IconClose size={16} className="inline mr-2" />
                      {closeRoomMutation.isPending ? 'Closing...' : 'Close Early'}
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Header */}
            <article className="glass-premium p-6 rounded-3xl border-2 border-primary/50">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {room.creatorAvatar ? (
                      <img
                        src={room.creatorAvatar}
                        alt={room.creatorName}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center token-logo-glow">
                        {getIcon()}
                      </div>
                    )}
                    <IconMotionScoreBadge
                      score={room.creatorMotionScore}
                      size={30}
                      className="absolute -bottom-2 -right-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-black text-white">{room.title}</h1>
                      {room.status === 'hot' && <IconLab className="text-[#D1FD0A]" size={20} />}
                    </div>
                    <p className="card-subtitle">{room.creatorName}</p>
                    {isCreator && <span className="text-xs text-primary font-bold">YOU</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="icon-interactive">
                    <IconCollabExpand size={20} />
                  </button>
                  <button className="icon-interactive-primary">
                    <IconLightning size={20} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-300 text-lg mb-4 leading-relaxed">
                {room.description}
              </p>

              {/* Motion Score */}
              <div className="p-4 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary mb-4">
                <div className="flex items-center gap-3">
                  <IconMotion className="icon-primary" size={32} />
                  <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, room.motionScore || 0))}%` }}
                    />
                  </div>
                  <div className="font-led-dot text-3xl text-primary">{room.motionScore || 0}</div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="badge-success flex items-center gap-1">
                  <IconRocket size={12} />
                  <span>{room.status === 'open' ? 'Open' : 'Closed'}</span>
                </div>
                {room.status === 'hot' && (
                  <div className="badge-primary flex items-center gap-1">
                    <IconTrophy size={12} />
                    <span>Hot</span>
                  </div>
                )}
                <div className="badge-primary">
                  <span>{room.type.toUpperCase()}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-800">
                <a href="#" className="icon-interactive-primary">
                  <IconWeb size={20} />
                </a>
                <a href="#" className="icon-interactive">
                  <IconTwitter size={20} />
                </a>
                <a href="#" className="icon-interactive">
                  <IconTelegram size={20} />
                </a>
                <a href="#" className="icon-interactive">
                  <IconDiscord size={20} />
                </a>
              </div>
            </article>

            {/* Creator View: Applications & Analytics */}
            {isCreator ? (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'applications'
                        ? 'glass-premium border border-primary text-primary'
                        : 'glass-interactive text-zinc-400 hover:text-primary'
                    }`}
                  >
                    <IconMessage size={20} />
                    <span>Applications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'analytics'
                        ? 'glass-premium border border-primary text-primary'
                        : 'glass-interactive text-zinc-400 hover:text-primary'
                    }`}
                  >
                    <IconChartAnimation size={20} />
                    <span>Analytics</span>
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'applications' ? (
                  <ApplicantQueue roomId={room.$id} />
                ) : (
                  <RoomAnalyticsPanel roomId={room.$id} />
                )}
              </div>
            ) : hasAccess ? (
              <div className="glass-premium rounded-3xl p-8 border-2 border-primary/50 text-center">
                <IconContributorBubble className="icon-primary mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-black text-white mb-2">
                  Applications Submitted
                </h3>
                <p className="text-zinc-400 mb-6">
                  <span className="font-led-dot text-5xl text-primary">{room.filledSlots}</span> people applied
                </p>
                <p className="text-sm text-zinc-500">
                  The creator will review applications and accept participants
                </p>
              </div>
            ) : (
              <div className="glass-premium rounded-3xl p-8 border-2 border-primary/50 text-center">
                <IconFreeze className="text-[#FF005C] mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-black text-white mb-2">
                  <span className="font-led-dot text-3xl text-primary">{room.minKeysToApply || 0}</span> Keys Required
                </h3>
                <p className="text-zinc-400 mb-6">
                  You need at least {room.minKeysToApply || 0} keys to view applications
                </p>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-8 py-4 rounded-xl transition-all"
                >
                  Buy Keys
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50">
              <h3 className="section-heading mb-4">Room Stats</h3>

              <div className="space-y-4">
                <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="stat-label">Applicants</span>
                    <IconContributorBubble size={16} className="icon-muted" />
                  </div>
                  <div className="font-led-dot text-4xl text-primary">{room.filledSlots}</div>
                  <div className="text-xs text-zinc-400">of {room.totalSlots} slots</div>
                  {room.totalSlots && (
                    <div className="mt-3 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                        style={{ width: `${Math.max(0, Math.min(100, fillRate))}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="stat-label">Min Keys</span>
                    <IconDeposit size={16} className="icon-muted" />
                  </div>
                  <div className="font-led-dot text-4xl text-primary">{room.minKeysToApply || 0}</div>
                </div>

                <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="stat-label">Status</span>
                    <IconRocket size={16} className="icon-muted" />
                  </div>
                  <div className="text-xl font-bold text-primary capitalize">{room.status}</div>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50">
              <h3 className="section-heading mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="list-item flex items-center gap-2">
                  <IconRocket size={16} className="text-green-400" />
                  <span className="text-sm text-zinc-400">
                    Created {new Date(room.$createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="list-item flex items-center gap-2">
                  <IconContributorBubble size={16} className="text-blue-400" />
                  <span className="text-sm text-zinc-400">
                    <span className="font-led-dot text-primary">{room.filledSlots}</span> applications
                  </span>
                </div>
                {room.motionScore > 50 && (
                  <div className="list-item flex items-center gap-2">
                    <IconChartAnimation size={16} className="text-primary" />
                    <span className="text-sm text-zinc-400">High engagement</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
