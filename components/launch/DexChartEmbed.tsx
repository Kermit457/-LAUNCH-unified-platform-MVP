"use client"

import { useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'

interface DexChartEmbedProps {
  pairId: string // e.g. "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  className?: string
}

export function DexChartEmbed({ pairId, className = '' }: DexChartEmbedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Try direct Dexscreener URL without /embed path
  const embedUrl = `https://dexscreener.com/solana/${pairId}?embed=1&theme=dark&trades=0&info=0`
  const fullUrl = `https://dexscreener.com/solana/${pairId}`

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  if (error) {
    return (
      <div className={`relative ${className} flex items-center justify-center bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-xl`}>
        <div className="text-center p-8">
          <p className="text-white/60 mb-4">Chart embed unavailable</p>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            View on Dexscreener
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl z-10">
          <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={embedUrl}
        title="Dexscreener Chart"
        className="w-full h-full rounded-xl"
        frameBorder="0"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups"
        onLoad={() => setLoading(false)}
        onError={handleError}
      />

      {/* Open in New Tab Link */}
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 z-20
                   h-8 px-3 rounded-lg bg-black/80 hover:bg-black/90
                   border border-white/10 hover:border-white/20
                   text-white/70 hover:text-white text-xs font-medium
                   transition-all flex items-center gap-1.5
                   backdrop-blur-sm"
        aria-label="View on Dexscreener"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dexscreener</span>
      </a>
    </div>
  )
}
