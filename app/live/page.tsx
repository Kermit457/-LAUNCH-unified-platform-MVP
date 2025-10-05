"use client"

import { useState, useEffect } from 'react'
import { Zap, TrendingUp, Users, DollarSign, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { StreamModal } from '@/components/StreamModal'

interface PumpCoin {
  mint: string
  name: string
  symbol: string
  description: string
  image_uri: string
  metadata_uri: string
  twitter: string | null
  telegram: string | null
  bonding_curve: string
  associated_bonding_curve: string
  creator: string
  created_timestamp: number
  raydium_pool: string | null
  complete: boolean
  virtual_sol_reserves: number
  virtual_token_reserves: number
  total_supply: number
  website: string | null
  show_name: boolean
  king_of_the_hill_timestamp: number | null
  market_cap: number
  reply_count: number
  last_reply: number
  nsfw: boolean
  market_id: string | null
  inverted: boolean | null
  is_currently_live: boolean
  username: string | null
  profile_image: string | null
  usd_market_cap: number
}

interface ApiResponse {
  coins: PumpCoin[]
  hasMore: boolean
}

const LIMIT = 48

export default function LivePage() {
  const [coins, setCoins] = useState<PumpCoin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState<PumpCoin | null>(null)

  const offset = (page - 1) * LIMIT

  useEffect(() => {
    fetchCoins()
  }, [page])

  const fetchCoins = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://frontend-api-v3.pump.fun/coins/currently-live?offset=${offset}&limit=${LIMIT}&sort=market_cap&order=ASC&includeNsfw=false`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch coins')
      }

      const data: PumpCoin[] = await response.json()
      setCoins(data)
      setHasMore(data.length === LIMIT)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl animate-pulse">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Live Launches</h1>
        </div>
        <p className="text-white/60 text-lg">
          Real-time token launches on pump.fun - sorted by market cap
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Live Now</div>
          <div className="text-2xl font-bold text-red-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {coins.length}
          </div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Current Page</div>
          <div className="text-2xl font-bold gradient-text-launchos">{page}</div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Showing</div>
          <div className="text-2xl font-bold text-cyan-400">{offset + 1}-{offset + coins.length}</div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Status</div>
          <div className="text-2xl font-bold text-green-400">
            {loading ? 'Loading...' : 'Live'}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl bg-red-950/40 border border-red-500/20 p-6 text-center mb-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchCoins}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-neutral-900/70 border border-white/10 p-2.5 animate-pulse">
              <div className="w-full aspect-square bg-white/5 rounded-lg mb-2" />
              <div className="h-3 bg-white/5 rounded mb-1.5" />
              <div className="h-2.5 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Coins Grid */}
      {!loading && !error && coins.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 mb-8">
          {coins.map(coin => (
            <CoinCard
              key={coin.mint}
              coin={coin}
              formatMarketCap={formatMarketCap}
              formatTime={formatTime}
              onClick={() => setSelectedCoin(coin)}
            />
          ))}
        </div>
      )}

      {/* Stream Modal */}
      {selectedCoin && (
        <StreamModal
          isOpen={selectedCoin !== null}
          onClose={() => setSelectedCoin(null)}
          coin={selectedCoin}
          formatMarketCap={formatMarketCap}
          formatTime={formatTime}
        />
      )}

      {/* Empty State */}
      {!loading && !error && coins.length === 0 && (
        <div className="rounded-2xl bg-neutral-900/70 border border-white/10 p-12 text-center">
          <Zap className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-white/40">No live launches found</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && coins.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              page === 1
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold">
            Page {page}
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              !hasMore
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function CoinCard({ coin, formatMarketCap, formatTime, onClick }: {
  coin: PumpCoin
  formatMarketCap: (mc: number) => string
  formatTime: (ts: number) => string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 border border-white/10 p-2.5 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all group cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-800">
        {coin.image_uri ? (
          <img
            src={coin.image_uri}
            alt={coin.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3C/svg%3E'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-4xl">
            {coin.symbol.slice(0, 2)}
          </div>
        )}
        {/* Live Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div>
          <h3 className="font-bold text-white text-sm truncate group-hover:text-purple-300 transition-colors">
            {coin.name}
          </h3>
          <p className="text-xs text-white/60 truncate">${coin.symbol}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-white/10">
          <div>
            <div className="text-[10px] text-white/40">MCap</div>
            <div className="text-xs font-bold text-green-400">{formatMarketCap(coin.usd_market_cap)}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40">Age</div>
            <div className="text-xs font-bold text-white/80">{formatTime(coin.created_timestamp)}</div>
          </div>
        </div>

      </div>
    </div>
  )
}
