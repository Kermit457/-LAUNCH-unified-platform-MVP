"use client"

import { useEffect, useRef } from 'react'
import { X, ExternalLink, TrendingUp, Users, DollarSign } from 'lucide-react'

interface StreamModalProps {
  isOpen: boolean
  onClose: () => void
  coin: {
    mint: string
    name: string
    symbol: string
    description: string
    image_uri: string
    twitter: string | null
    telegram: string | null
    website: string | null
    creator: string
    created_timestamp: number
    usd_market_cap: number
    username: string | null
    profile_image: string | null
  }
  formatMarketCap: (mc: number) => string
  formatTime: (ts: number) => string
}

export function StreamModal({ isOpen, onClose, coin, formatMarketCap, formatTime }: StreamModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-design-zinc-950/95 backdrop-blur-xl rounded-2xl border border-design-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-all"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Stream/Chart Section */}
          <div className="flex-1 bg-black p-4 lg:p-6 flex items-center justify-center">
            <iframe
              src={`https://pump.fun/${coin.mint}`}
              className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-xl border border-white/10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${coin.name} stream`}
            />
          </div>

          {/* Info Sidebar */}
          <div className="w-full lg:w-96 p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-design-zinc-800">
            {/* Token Header */}
            <div className="flex items-start gap-4 mb-6">
              {coin.image_uri ? (
                <img
                  src={coin.image_uri}
                  alt={coin.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lime-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                  {coin.symbol.slice(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white mb-1">{coin.name}</h2>
                <p className="text-white/60">${coin.symbol}</p>
              </div>
            </div>

            {/* Description */}
            {coin.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white/80 mb-2">Description</h3>
                <p className="text-sm text-white/70 leading-relaxed">{coin.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-design-zinc-900/50 border border-design-zinc-800">
                <div className="flex items-center gap-2 text-design-zinc-400 text-xs mb-1">
                  <DollarSign className="w-3 h-3" />
                  Market Cap
                </div>
                <div className="text-lg font-bold text-green-400">{formatMarketCap(coin.usd_market_cap)}</div>
              </div>
              <div className="p-4 rounded-xl bg-design-zinc-900/50 border border-design-zinc-800">
                <div className="flex items-center gap-2 text-design-zinc-400 text-xs mb-1">
                  <TrendingUp className="w-3 h-3" />
                  Created
                </div>
                <div className="text-lg font-bold text-white/80">{formatTime(coin.created_timestamp)}</div>
              </div>
            </div>

            {/* Creator */}
            {coin.username && (
              <div className="mb-6 p-4 rounded-xl bg-design-zinc-900/50 border border-design-zinc-800">
                <h3 className="text-sm font-semibold text-white/80 mb-3">Creator</h3>
                <div className="flex items-center gap-3">
                  {coin.profile_image ? (
                    <img src={coin.profile_image} alt={coin.username} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-500 to-pink-600 flex items-center justify-center text-white font-bold">
                      {coin.username.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{coin.username}</p>
                    <p className="text-xs text-white/50 truncate font-mono">{coin.creator.slice(0, 8)}...{coin.creator.slice(-6)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Links */}
            {(coin.twitter || coin.telegram || coin.website) && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white/80 mb-3">Links</h3>
                <div className="space-y-2">
                  {coin.twitter && (
                    <a
                      href={coin.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-design-zinc-900/50 hover:bg-design-zinc-800 border border-design-zinc-800 hover:border-design-zinc-700 text-design-zinc-300 hover:text-white transition-all text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {coin.telegram && (
                    <a
                      href={coin.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-design-zinc-900/50 hover:bg-design-zinc-800 border border-design-zinc-800 hover:border-design-zinc-700 text-design-zinc-300 hover:text-white transition-all text-sm"
                    >
                      <Users className="w-4 h-4" />
                      Telegram
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {coin.website && (
                    <a
                      href={coin.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-design-zinc-900/50 hover:bg-design-zinc-800 border border-design-zinc-800 hover:border-design-zinc-700 text-design-zinc-300 hover:text-white transition-all text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      Website
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* View on pump.fun */}
            <a
              href={`https://pump.fun/${coin.mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-design-lime-500 to-design-pink-600 hover:from-design-lime-600 hover:to-design-pink-700 text-white font-bold transition-all shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              View on pump.fun
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
