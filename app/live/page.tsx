"use client"

import { useState } from 'react'
import { Zap, Eye } from 'lucide-react'
import { useLive, type LiveLaunch } from '@/hooks/useLive'
import { PaginationControls } from '@/components/PaginationControls'
import { StreamModal } from '@/components/StreamModal'

export default function LivePage() {
  const { page, setPage, pagesTotal, items, totals, loading, error, useMockData } = useLive(48)
  const [selectedCoin, setSelectedCoin] = useState<LiveLaunch | null>(null)

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

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl animate-pulse">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Live Launches</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Real-time token launches on pump.fun - sorted by market cap
        </p>
      </div>

      {/* Top Pagination - Sticky */}
      <div className="sticky top-0 z-10 bg-[#0D1220]/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-6 border-b border-white/10">
        <PaginationControls
          page={page}
          totalPages={pagesTotal}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpToPage={handleJumpToPage}
        />
      </div>

      {/* KPI Tiles */}
      <div className={`grid ${showViewersKPI ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-4 mb-8`}>
        {/* Live Now - Total across all pages */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
          <div className="text-zinc-500 text-sm mb-1">Live Now</div>
          <div className="text-2xl font-bold text-red-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {totals.liveCount > 0 ? totals.liveCount.toLocaleString('en-US') : items.length}
          </div>
        </div>

        {/* Total Viewers - Only show if > 0 */}
        {showViewersKPI && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
            <div className="text-zinc-500 text-sm mb-1">Total Viewers</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              {totals.viewerCount.toLocaleString('en-US')}
            </div>
          </div>
        )}

        {/* Showing - Current page range */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
          <div className="text-zinc-500 text-sm mb-1">Showing</div>
          <div className="text-2xl font-bold text-cyan-400">
            {totals.liveCount > 0 ? `${showingStart}–${showingEnd}` : `${items.length}`}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
          <div className="text-zinc-500 text-sm mb-1">Status</div>
          <div className="text-2xl font-bold text-green-400">
            {loading ? 'Loading...' : 'Live'}
          </div>
        </div>
      </div>

      {/* Mock Data Warning */}
      {useMockData && (
        <div className="rounded-2xl bg-yellow-950/40 border border-yellow-500/20 p-4 text-center mb-6">
          <p className="text-yellow-400 text-sm">
            ⚠️ API unavailable - showing demo data
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl bg-red-950/40 border border-red-500/20 p-6 text-center mb-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => setPage(1)}
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
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-2.5 animate-pulse backdrop-blur-xl">
              <div className="w-full aspect-square bg-white/5 rounded-lg mb-2" />
              <div className="h-3 bg-white/5 rounded mb-1.5" />
              <div className="h-2.5 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Coins Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 mb-8">
          {items.map((coin) => (
            <CoinCard
              key={coin.id}
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
      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center backdrop-blur-xl">
          <Zap className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
          <p className="text-zinc-500">No live launches found</p>
        </div>
      )}

      {/* Bottom Pagination */}
      {!loading && !error && items.length > 0 && (
        <PaginationControls
          page={page}
          totalPages={pagesTotal}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpToPage={handleJumpToPage}
        />
      )}
    </div>
  )
}

function CoinCard({
  coin,
  formatMarketCap,
  formatTime,
  onClick,
}: {
  coin: LiveLaunch
  formatMarketCap: (mc: number) => string
  formatTime: (ts: number) => string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl bg-white/5 border border-white/10 p-2.5 hover:border-white/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-150 group cursor-pointer backdrop-blur-xl"
    >
      {/* Image */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-800">
        {coin.image_uri ? (
          <img
            src={coin.image_uri}
            alt={coin.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3C/svg%3E'
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
          <h3 className="font-bold text-white text-sm truncate group-hover:bg-gradient-to-r group-hover:from-fuchsia-500 group-hover:via-purple-500 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-150">
            {coin.name}
          </h3>
          <p className="text-xs text-zinc-500 truncate">${coin.symbol}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-white/10">
          <div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide">MCap</div>
            <div className="text-xs font-bold text-green-400">{formatMarketCap(coin.usd_market_cap)}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide">Age</div>
            <div className="text-xs font-bold text-zinc-300">{formatTime(coin.created_timestamp)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
