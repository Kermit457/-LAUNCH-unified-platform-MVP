"use client"
// Live streaming page integrated with pump.fun API

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Radio, Eye, Send, Sparkles, Zap, DollarSign, MessageCircle,
  Bell, Play, Calendar, Rocket, Gift
} from 'lucide-react'
import { GlassCard } from '@/components/design-system'
import { useLive, type LiveLaunch } from '@/hooks/useLive'
import { StreamModal } from '@/components/StreamModal'

export default function LivePage() {
  const { items, totals, loading, page, setPage, pagesTotal, useMockData } = useLive(48)
  const [selectedCoin, setSelectedCoin] = useState<LiveLaunch | null>(null)
  const [sortBy, setSortBy] = useState<'mcap' | 'recent' | 'viewers'>('mcap')

  // Sort items based on selected sort option
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'mcap') return b.usd_market_cap - a.usd_market_cap
    if (sortBy === 'recent') return b.created_timestamp - a.created_timestamp
    if (sortBy === 'viewers') return (b.viewers || 0) - (a.viewers || 0)
    return 0
  })

  const featuredCoin = sortedItems[0]

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  const formatMarketCap = (mc: number) => {
    if (mc >= 1000000) return `$${(mc / 1000000).toFixed(1)}M`
    if (mc >= 1000) return `$${(mc / 1000).toFixed(1)}K`
    return `$${mc.toFixed(0)}`
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
            Reach thousands of investors in real-time • {totals.liveCount || items.length} streams live now
          </p>
        </motion.div>

        {/* Featured Live Stream */}
        {featuredCoin && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <GlassCard className="p-0 overflow-hidden">
              <div className="grid lg:grid-cols-[2fr_1fr]">
                {/* Live Stream Embed */}
                <div className="relative bg-black min-h-[500px] flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-md shadow-lg">
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-xs font-bold text-white uppercase">FEATURED LIVE</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {featuredCoin.viewers && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
                        <Eye className="w-3 h-3 text-violet-400" />
                        <span className="text-xs font-bold text-white">{featuredCoin.viewers.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
                      <DollarSign className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-bold text-white">{formatMarketCap(featuredCoin.usd_market_cap)}</span>
                    </div>
                  </div>
                  <iframe
                    src={`https://pump.fun/${featuredCoin.mint}`}
                    className="w-full h-full min-h-[500px] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${featuredCoin.name} live stream`}
                  />
                </div>

                {/* Info Sidebar */}
                <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl p-6 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    {featuredCoin.image_uri ? (
                      <img src={featuredCoin.image_uri} alt={featuredCoin.name} className="w-16 h-16 rounded-xl object-cover" onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3C/svg%3E'
                      }} />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold text-white">{featuredCoin.symbol.slice(0, 2)}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white mb-1">{featuredCoin.name}</h2>
                      <p className="text-sm text-white/70">${featuredCoin.symbol}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                    {featuredCoin.username && <><span>by {featuredCoin.username}</span><span>•</span></>}
                    <span>Live for {formatTime(featuredCoin.created_timestamp)}</span>
                  </div>

                  <p className="text-sm text-zinc-300 mb-6 line-clamp-3">{featuredCoin.description}</p>

                  <div className="mt-auto space-y-3">
                    <a
                      href={`https://pump.fun/${featuredCoin.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-center hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                    >
                      🚀 Trade on Pump.fun
                    </a>
                    <button
                      onClick={() => setSelectedCoin(featuredCoin)}
                      className="w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all"
                    >
                      View Details
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
            { label: 'Live Now', value: totals.liveCount || items.length, color: 'text-red-400' },
            { label: 'Total Viewers', value: (totals.viewerCount || 0).toLocaleString(), color: 'text-violet-400' },
            { label: 'Page', value: `${page} / ${pagesTotal}`, color: 'text-green-400' },
            { label: 'Data Source', value: useMockData ? 'Mock' : 'Live API', color: 'text-orange-400' }
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
            {(['mcap', 'recent', 'viewers'] as const).map(sort => (
              <button key={sort} onClick={() => setSortBy(sort)} className={`px-4 py-3 rounded-xl font-semibold text-sm ${sortBy === sort ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800'}`}>
                {sort === 'mcap' ? 'Market Cap' : sort === 'recent' ? 'Recent' : 'Viewers'}
              </button>
            ))}
          </div>
          {pagesTotal > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-3 rounded-xl font-semibold text-sm bg-zinc-900/60 text-zinc-400 border border-zinc-800 disabled:opacity-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(Math.min(pagesTotal, page + 1))}
                disabled={page === pagesTotal}
                className="px-4 py-3 rounded-xl font-semibold text-sm bg-zinc-900/60 text-zinc-400 border border-zinc-800 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Live Streams */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-400" />Live Now ({sortedItems.length})
          </h2>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <GlassCard key={i} className="p-4 animate-pulse">
                  <div className="h-32 bg-zinc-800 rounded-lg mb-3" />
                  <div className="h-4 bg-zinc-800 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </GlassCard>
              ))}
            </div>
          ) : sortedItems.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Zap className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No live streams</h3>
              <p className="text-sm text-zinc-400">Check back soon!</p>
            </GlassCard>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.map((coin) => (
                <motion.div
                  key={coin.mint}
                  whileHover={{ y: -4 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCoin(coin)}
                >
                  <GlassCard className="p-0 overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      {coin.image_uri ? (
                        <img src={coin.image_uri} alt={coin.name} className="w-full h-full object-cover" onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }} />
                      ) : (
                        <div className="text-6xl">{coin.symbol.slice(0, 2)}</div>
                      )}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500 rounded-lg">
                          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-white rounded-full" />
                          <span className="text-xs font-bold text-white">LIVE</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {coin.viewers && (
                          <div className="px-2.5 py-1.5 bg-black/60 rounded-lg flex items-center gap-1">
                            <Eye className="w-3 h-3 text-violet-400" />
                            <span className="text-xs font-bold text-white">{coin.viewers.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="px-2.5 py-1.5 bg-black/60 rounded-lg flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-400" />
                          <span className="text-xs font-bold text-white">{formatMarketCap(coin.usd_market_cap)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{coin.name}</h3>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Live for</span>
                        <span className="text-zinc-300">{formatTime(coin.created_timestamp)}</span>
                      </div>
                      <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />Watch Stream
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stream Modal */}
      {selectedCoin && (
        <StreamModal
          isOpen={!!selectedCoin}
          onClose={() => setSelectedCoin(null)}
          coin={selectedCoin}
          formatMarketCap={formatMarketCap}
          formatTime={formatTime}
        />
      )}
    </div>
  )
}