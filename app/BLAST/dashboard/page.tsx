/**
 * Creator Dashboard - BTDemo design
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import { useMyRooms } from '@/hooks/blast/useMyRooms'
import { useCreatorAnalytics } from '@/hooks/blast/useCreatorAnalytics'
import { CreatorInsights } from '@/components/blast/analytics/CreatorInsights'
import { RoomManagementCard } from '@/components/blast/dashboard/RoomManagementCard'
import {
  IconNavArrowLeft,
  IconLightning,
  IconRocket,
  IconChartAnimation,
  IconAttention,
  IconFreeze,
  IconMotion,
  IconCap,
  IconCash,
  IconContributorBubble
} from '@/lib/icons'

type RoomStatusFilter = 'all' | 'open' | 'hot' | 'closing' | 'closed'

export default function CreatorDashboardPage() {
  const router = useRouter()
  const { user } = usePrivy()
  const [statusFilter, setStatusFilter] = useState<RoomStatusFilter>('all')

  const { data: rooms = [], isLoading: roomsLoading } = useMyRooms()
  const { data: analytics, isLoading: analyticsLoading } = useCreatorAnalytics()

  const filteredRooms =
    statusFilter === 'all' ? rooms : rooms.filter((room: any) => room.status === statusFilter)

  const activeRooms = rooms.filter((r: any) => r.status === 'open' || r.status === 'hot').length
  const hotRooms = rooms.filter((r: any) => r.status === 'hot').length
  const closingSoon = rooms.filter((r: any) => r.status === 'closing').length

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Please sign in to access the dashboard</p>
          <button
            onClick={() => router.push('/BLAST')}
            className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl"
          >
            Back to Feed
          </button>
        </div>
      </div>
    )
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/BLAST')}
                className="icon-interactive-primary"
              >
                <IconNavArrowLeft size={24} />
              </button>

              <div>
                <h1 className="text-3xl font-black gradient-text-launchos">
                  Creator Dashboard
                </h1>
                <p className="text-sm text-zinc-400">Manage all your rooms</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/BLAST?composer=open')}
              className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              <IconLightning size={20} className="text-black" />
              Create Room
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="glass-interactive p-6 rounded-2xl border-2 border-primary/50 hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">Active Rooms</span>
                <IconRocket size={24} className="icon-primary" />
              </div>
              <div className="font-led-dot text-5xl text-primary">{activeRooms}</div>
              <div className="text-xs text-zinc-400">Currently open</div>
            </div>

            <div className="glass-interactive p-6 rounded-2xl border-2 border-primary/50 hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">Hot Rooms</span>
                <IconChartAnimation size={24} className="text-orange-400" />
              </div>
              <div className="font-led-dot text-5xl text-orange-400">{hotRooms}</div>
              <div className="text-xs text-zinc-400">High engagement</div>
            </div>

            <div className="glass-interactive p-6 rounded-2xl border-2 border-primary/50 hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="stat-label">Closing Soon</span>
                <IconAttention size={24} className="text-yellow-400" />
              </div>
              <div className="font-led-dot text-5xl text-yellow-400">{closingSoon}</div>
              <div className="text-xs text-zinc-400">Less than 6h</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-6 pt-48 pb-12 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Room List */}
          <div className="xl:col-span-2 space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { value: 'all', label: 'All Rooms', count: rooms.length },
                { value: 'open', label: 'Open', count: rooms.filter((r: any) => r.status === 'open').length },
                { value: 'hot', label: 'Hot', count: rooms.filter((r: any) => r.status === 'hot').length },
                { value: 'closing', label: 'Closing', count: rooms.filter((r: any) => r.status === 'closing').length },
                { value: 'closed', label: 'Closed', count: rooms.filter((r: any) => r.status === 'closed').length },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value as RoomStatusFilter)}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                    statusFilter === filter.value
                      ? 'glass-premium border border-primary text-primary'
                      : 'glass-interactive text-zinc-400 hover:text-primary'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className="font-led-dot text-sm">{filter.count}</span>
                </button>
              ))}
            </div>

            {/* Room List */}
            {roomsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 glass-premium rounded-3xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="glass-premium rounded-3xl p-12 text-center border-2 border-primary/50">
                <IconMotion className="icon-primary mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-black text-white mb-2">
                  {statusFilter === 'all' ? 'No Rooms Yet' : `No ${statusFilter} rooms`}
                </h3>
                <p className="text-zinc-400 mb-6">
                  {statusFilter === 'all'
                    ? 'Create your first room to get started'
                    : `You don't have any ${statusFilter} rooms`}
                </p>
                {statusFilter === 'all' && (
                  <button
                    onClick={() => router.push('/BLAST?composer=open')}
                    className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl"
                  >
                    Create First Room
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRooms.map((room: any) => (
                  <RoomManagementCard key={room.$id} room={room} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-6">
            {analyticsLoading ? (
              <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50 h-96 animate-pulse" />
            ) : analytics ? (
              <CreatorInsights analytics={analytics} />
            ) : (
              <div className="glass-premium rounded-3xl p-6 border-2 border-primary/50">
                <h3 className="section-heading mb-4">Creator Insights</h3>
                <div className="space-y-4">
                  <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="stat-label">Total Rooms</span>
                      <IconMotion size={16} className="icon-muted" />
                    </div>
                    <div className="font-led-dot text-4xl text-primary">{rooms.length}</div>
                  </div>

                  <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="stat-label">Total Applicants</span>
                      <IconContributorBubble size={16} className="icon-muted" />
                    </div>
                    <div className="font-led-dot text-4xl text-primary">
                      {rooms.reduce((sum: number, r: any) => sum + (r.filledSlots || 0), 0)}
                    </div>
                  </div>

                  <div className="glass-interactive p-4 rounded-xl border-2 border-primary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="stat-label">Avg Motion Score</span>
                      <IconChartAnimation size={16} className="icon-muted" />
                    </div>
                    <div className="font-led-dot text-4xl text-primary">
                      {rooms.length > 0
                        ? Math.round(
                            rooms.reduce((sum: number, r: any) => sum + (r.motionScore || 0), 0) /
                              rooms.length
                          )
                        : 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
