"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Eye, Radio, Send, Sparkles, Play } from 'lucide-react'
import { useLive, type LiveLaunch } from '@/hooks/useLive'
import { PaginationControls } from '@/components/PaginationControls'
import { StreamModal } from '@/components/StreamModal'
import { GlassCard } from '@/components/design-system'

// Chat message type for live chat feature
interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: string
}

export default function LivePage() {
  const { page, setPage, pagesTotal, items, totals, loading, error } = useLive(48)
  const [selectedCoin, setSelectedCoin] = useState<LiveLaunch | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatMessage, setChatMessage] = useState('')

  // Mock chat messages for featured stream
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      { id: '1', user: 'crypto_trader', message: 'This launch is pumping! 🚀', timestamp: '2s' },
      { id: '2', user: 'degen_mike', message: 'Just aped in with 5 SOL', timestamp: '5s' },
      { id: '3', user: 'whale_watcher', message: 'Volume looking good', timestamp: '8s' },
      { id: '4', user: 'moon_hunter', message: 'LFG! To the moon! 🌙', timestamp: '12s' },
    ]
    setChatMessages(mockMessages)
  }, [])

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1_000_000) {
      return `$${(marketCap / 1_000_000).toFixed(2)}M`
    }
    if (marketCap >= 1_000) {
      return `$${(marketCap / 1_000).toFixed(2)}K`
    }
    return `$${marketCap.toFixed(2)}`
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(pagesTotal, p + 1))
  const handleJumpToPage = (targetPage: number) => setPage(targetPage)

  const showingStart = (page - 1) * 48 + 1
  const showingEnd = Math.min(page * 48, totals.liveCount)
  const showViewersKPI = totals.viewerCount > 0

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: chatMessage,
        timestamp: 'now'
      }
      setChatMessages(prev => [...prev, newMessage])
      setChatMessage('')
    }
  }

  // Get featured launch (highest market cap)
  const featuredLaunch = items[0]

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-500/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-2xl"
              />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              LIVE LAUNCHES
            </h1>
          </div>
          <p className="text-zinc-400">
            Real-time token launches on pump.fun • {totals.liveCount} launches streaming now
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <GlassCard className="p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-zinc-500 font-medium">Live Now</span>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {totals.liveCount > 0 ? totals.liveCount.toLocaleString() : items.length}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {showViewersKPI && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <GlassCard className="p-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-violet-400" />
                    <span className="text-xs text-zinc-500 font-medium">Total Viewers</span>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {totals.viewerCount.toLocaleString()}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <GlassCard className="p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-zinc-500 font-medium">Showing</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {totals.liveCount > 0 ? `${showingStart}–${showingEnd}` : `${items.length}`}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <GlassCard className="p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-zinc-500 font-medium">24h Volume</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  $0M
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Featured Stream/Launch with Live Chat */}
        {featuredLaunch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard className="p-0 overflow-hidden">
              <div className="grid lg:grid-cols-[1fr_380px]">
                {/* Featured Launch */}
                <div className="relative bg-gradient-to-br from-red-900/20 via-zinc-900/50 to-orange-900/20 p-8">
                  {/* LIVE Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-md">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">FEATURED</span>
                    </div>
                  </div>

                  {/* Launch Info */}
                  <div className="flex items-start gap-6 mt-12">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl font-bold text-white">
                      {featuredLaunch.symbol?.charAt(0) || 'T'}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{featuredLaunch.name}</h2>
                      <div className="flex items-center gap-2 text-zinc-400 mb-4">
                        <span className="text-lg font-medium">${featuredLaunch.symbol}</span>
                        <span>•</span>
                        <span>Launched {formatTime(featuredLaunch.created_timestamp)}</span>
                      </div>
                      <p className="text-zinc-300 mb-6">{featuredLaunch.description || 'No description available'}</p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">Market Cap</div>
                          <div className="text-xl font-bold text-green-400">
                            {formatMarketCap(featuredLaunch.market_cap)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">Age</div>
                          <div className="text-xl font-bold text-blue-400">
                            {Math.floor(featuredLaunch.ageSec / 3600)}h
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">Replies</div>
                          <div className="text-xl font-bold text-violet-400">
                            {featuredLaunch.reply_count || 0}
                          </div>
                        </div>
                      </div>

                      {/* View Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCoin(featuredLaunch)}
                        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Live Chat */}
                <div className="bg-zinc-900/60 backdrop-blur-xl flex flex-col h-[400px]">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">Live Chat</span>
                    </div>
                    <span className="text-xs text-zinc-500">{Math.floor(Math.random() * 100) + 50} online</span>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <AnimatePresence>
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                            {msg.user.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-semibold text-violet-400 truncate">{msg.user}</span>
                              <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                            </div>
                            <p className="text-sm text-zinc-300 break-words">{msg.message}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-1 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage()
                          }
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Pagination */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl py-4 -mx-4 px-4 mb-6 border-b border-zinc-800">
          <PaginationControls
            page={page}
            totalPages={pagesTotal}
            onPrev={handlePrev}
            onNext={handleNext}
            onJumpToPage={handleJumpToPage}
          />
        </div>

        {/* Active Streams Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Active Launches</h2>
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <GlassCard key={i} className="h-48 animate-pulse">
                  <div className="p-4">
                    <div className="h-4 bg-zinc-800 rounded mb-4" />
                    <div className="h-3 bg-zinc-800 rounded mb-2" />
                    <div className="h-3 bg-zinc-800 rounded w-2/3" />
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : error ? (
            <GlassCard className="p-8 text-center">
              <p className="text-red-400">Error loading launches: {error}</p>
            </GlassCard>
          ) : items.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Zap className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No live launches</h3>
              <p className="text-sm text-zinc-400">Check back soon for new launches</p>
            </GlassCard>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((launch, index) => (
                <motion.div
                  key={launch.mint}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedCoin(launch)}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <GlassCard className="relative h-full p-0 overflow-hidden border-zinc-800 group-hover:border-red-500/30 transition-all">
                    {/* Header with Live Badge */}
                    <div className="relative p-4 bg-gradient-to-br from-red-900/20 via-zinc-900/50 to-orange-900/20">
                      {/* LIVE Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500 rounded-md">
                          <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                          />
                          <span className="text-[10px] font-bold text-white">LIVE</span>
                        </div>
                      </div>

                      {/* Market Cap Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded-md">
                        <span className="text-xs font-bold text-green-400">
                          {formatMarketCap(launch.market_cap)}
                        </span>
                      </div>

                      {/* Logo/Symbol */}
                      <div className="flex items-center gap-3 mt-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-lg font-bold text-white">
                          {launch.symbol?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm group-hover:text-red-300 transition-colors">
                            {launch.name}
                          </h3>
                          <p className="text-xs text-zinc-500">${launch.symbol}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Market Cap</span>
                        <span className="text-zinc-300 font-medium">{formatMarketCap(launch.mcap)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Replies</span>
                        <span className="text-zinc-300 font-medium">{launch.reply_count || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Launched</span>
                        <span className="text-zinc-300">{formatTime(launch.created_timestamp)}</span>
                      </div>
                    </div>

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all">
                        <Play className="w-6 h-6 text-black ml-1" />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Pagination */}
        <div className="mt-8">
          <PaginationControls
            page={page}
            totalPages={pagesTotal}
            onPrev={handlePrev}
            onNext={handleNext}
            onJumpToPage={handleJumpToPage}
          />
        </div>
      </div>

      {/* Stream Modal */}
      {selectedCoin && (
        <StreamModal
          isOpen={true}
          onClose={() => setSelectedCoin(null)}
          coin={selectedCoin}
          formatMarketCap={formatMarketCap}
          formatTime={formatTime}
        />
      )}
    </div>
  )
}

// Add missing import
import { TrendingUp } from 'lucide-react'