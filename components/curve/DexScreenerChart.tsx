'use client'

import { useEffect, useRef } from 'react'
import { TrendingUp, ExternalLink } from 'lucide-react'

interface DexScreenerChartProps {
  tokenMint: string
  height?: number
}

export const DexScreenerChart = ({ tokenMint, height = 500 }: DexScreenerChartProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Adjust iframe height if needed
    const iframe = iframeRef.current
    if (iframe) {
      iframe.style.height = `${height}px`
    }
  }, [height])

  // DexScreener embed URL
  const dexScreenerUrl = `https://dexscreener.com/solana/${tokenMint}?embed=1&theme=dark&trades=0&info=0`

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="font-bold text-white">Live Trading Chart</h3>
        </div>
        <a
          href={`https://dexscreener.com/solana/${tokenMint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          Open in DexScreener
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Chart Embed */}
      <div className="relative" style={{ height: `${height}px` }}>
        <iframe
          ref={iframeRef}
          src={dexScreenerUrl}
          title="DexScreener Chart"
          className="w-full h-full border-0"
          allow="clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-black/30 border-t border-white/10">
        <p className="text-xs text-gray-400 text-center">
          Real-time price data from DEX aggregators
        </p>
      </div>
    </div>
  )
}
