"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Radio, Eye, Send, Sparkles, Zap, DollarSign, MessageCircle,
  Bell, Play, Calendar, Rocket, Gift
} from 'lucide-react'
import { GlassCard } from '@/components/design-system'
import {
  mockLiveStats,
  getFeaturedPitch,
  getLivePitches,
  getUpcomingPitches,
  type LivePitchData
} from '@/lib/livePitchMockData'

export default function LivePage() {
  const [chatMessage, setChatMessage] = useState('')
  const [sortBy, setSortBy] = useState<'viewers' | 'recent' | 'trending'>('viewers')
  const [typeFilter, setTypeFilter] = useState<'all' | 'icm' | 'ccm' | 'meme'>('all')

  const featuredPitch = getFeaturedPitch()
  const livePitches = getLivePitches()
  const upcomingPitches = getUpcomingPitches()

  const filteredPitches = livePitches.filter(pitch =>
    typeFilter === 'all' || pitch.curve.type === typeFilter
  ).sort((a, b) => {
    if (sortBy === 'viewers') return b.viewerCount - a.viewerCount
    if (sortBy === 'recent') return b.startedAt - a.startedAt
    return b.liveStats.volumeTraded - a.liveStats.volumeTraded
  })

  const handleSendMessage = () => {
    if (chatMessage.trim()) setChatMessage('')
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  const formatCountdown = (timestamp: number) => {
    const diff = timestamp - Date.now()
    const hours = Math.floor(diff / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-500/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-red-500 rounded-2xl" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              PITCH YOUR PROJECT LIVE
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Reach thousands of investors in real-time • {mockLiveStats.totalLiveNow} pitches streaming now
          </p>
        </motion.div>

        {/* Featured Pitch */}
        {featuredPitch && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <GlassCard className="p-0 overflow-hidden">
              <div className="grid lg:grid-cols-[1fr_380px]">
                <div className="relative bg-gradient-to-br from-red-900/20 via-zinc-900/50 to-orange-900/20 p-8">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-md">
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-xs font-bold text-white uppercase">FEATURED LIVE</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                      <Eye className="w-3 h-3 text-violet-400" />
                      <span className="text-xs font-bold text-white">{featuredPitch.viewerCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                      <DollarSign className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-bold text-white">{featuredPitch.liveStats.volumeTraded.toFixed(1)} SOL</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 mt-12">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl">{featuredPitch.curve.avatar}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{featuredPitch.curve.title}</h2>
                      <div className="flex items-center gap-2 text-zinc-400 mb-4">
                        <span>{featuredPitch.curve.symbol}</span><span>•</span><span>by {featuredPitch.creatorName}</span><span>•</span><span>Live for {formatTime(featuredPitch.startedAt)}</span>
                      </div>
                      <p className="text-zinc-300 mb-6">{featuredPitch.pitchDescription}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold">💰 Buy Keys</button>
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold">🎁 Send Gift</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl flex flex-col justify-center h-[500px] p-8">
                  <div className="text-center mb-8">
                    <div className="text-7xl mb-4">🎬</div>
                    <h2 className="text-3xl font-bold text-white mb-3">🎤 Want to pitch your project to thousands?</h2>
                  </div>
                  <div className="space-y-3 mb-8">
                    {['Reach 1000+ potential investors instantly', 'Real-time key purchases during your pitch', 'Live Q&A with your audience', 'Build hype and momentum'].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 text-zinc-300 text-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xl hover:shadow-lg hover:shadow-red-500/50 transition-all">
                      🚀 GO LIVE NOW
                    </button>
                    <button className="w-full px-6 py-4 rounded-xl bg-zinc-800 text-white font-semibold text-lg hover:bg-zinc-700 transition-colors">
                      📅 Schedule Stream
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Live Now', value: mockLiveStats.totalLiveNow, color: 'text-red-400' },
            { label: 'Total Viewers', value: mockLiveStats.totalViewers.toLocaleString(), color: 'text-violet-400' },
            { label: 'Raised Today', value: `${mockLiveStats.totalRaisedToday.toFixed(1)} SOL`, color: 'text-green-400' },
            { label: 'Your Streams', value: mockLiveStats.yourActiveStreams, color: 'text-orange-400' }
          ].map((stat, i) => (
            <GlassCard key={i} className="p-4">
              <div className="text-xs text-zinc-500 mb-2">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </GlassCard>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            {(['all', 'icm', 'ccm', 'meme'] as const).map(type => (
              <button key={type} onClick={() => setTypeFilter(type)} className={`px-4 py-3 rounded-xl font-semibold text-sm ${typeFilter === type ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800'}`}>
                {type === 'all' ? 'All' : type === 'icm' ? '💼 Projects' : type === 'ccm' ? '🟣 Creators' : '🟠 Memes'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['viewers', 'recent', 'trending'] as const).map(sort => (
              <button key={sort} onClick={() => setSortBy(sort)} className={`px-4 py-3 rounded-xl font-semibold text-sm ${sortBy === sort ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800'}`}>
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Live Pitches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-400" />Live Now ({filteredPitches.length})
          </h2>
          {filteredPitches.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Zap className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No live pitches</h3>
              <p className="text-sm text-zinc-400">Check back soon!</p>
            </GlassCard>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPitches.map((pitch) => (
                <motion.div key={pitch.id} whileHover={{ y: -4 }} className="cursor-pointer">
                  <GlassCard className="p-0 overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900">
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500 rounded-lg">
                          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-white rounded-full" />
                          <span className="text-xs font-bold text-white">LIVE</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <div className="px-2.5 py-1.5 bg-black/60 rounded-lg flex items-center gap-1">
                          <Eye className="w-3 h-3 text-violet-400" />
                          <span className="text-xs font-bold text-white">{pitch.viewerCount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-3">
                        <div className="text-4xl">{pitch.curve.avatar}</div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{pitch.curve.title}</h3>
                          <p className="text-xs text-white/80">by {pitch.creatorName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Live for</span>
                        <span className="text-zinc-300">{formatTime(pitch.startedAt)}</span>
                      </div>
                      <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />Watch Live
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        {upcomingPitches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />Starting Soon
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingPitches.map((pitch) => (
                <div key={pitch.id} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{pitch.curve.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-white">{pitch.curve.title}</h3>
                      <p className="text-sm text-zinc-400">by {pitch.creatorName}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs text-zinc-500 mb-1">Starts in</div>
                    <div className="text-2xl font-bold text-orange-400">{formatCountdown(pitch.scheduledFor!)}</div>
                  </div>
                  <button className="w-full px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />Set Reminder
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}