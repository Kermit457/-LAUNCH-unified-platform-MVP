'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket, Eye } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

export function HeroSection() {
  const launches = useCountUp({ end: 132, duration: 2000 })
  const boosted = useCountUp({ end: 42700, duration: 2500, prefix: '$' })
  const users = useCountUp({ end: 8931, duration: 2000 })

  return (
    <section className="container mx-auto px-4 pt-12 pb-8 md:pt-16 md:pb-12">
      <div className="text-center max-w-5xl mx-auto space-y-6">
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/discover">
            <Button variant="boost" size="lg" className="w-full sm:w-auto">
              <Rocket className="w-5 h-5" />
              Start a Launch
            </Button>
          </Link>
          <Link href="/discover">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Explore Projects
            </Button>
          </Link>
          <Link href="/discover">
            <Button size="lg" variant="ghost" className="w-full sm:w-auto">
              <Eye className="w-5 h-5" />
              See Live Feed
            </Button>
          </Link>
        </div>

        {/* Live Metrics Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-4xl mx-auto backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D1FD0A] via-[#D1FD0A] to-cyan-500 bg-clip-text text-transparent mb-1">
                {launches}
              </div>
              <div className="text-xs text-zinc-500">Launches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D1FD0A] via-[#D1FD0A] to-cyan-500 bg-clip-text text-transparent mb-1">
                {boosted}
              </div>
              <div className="text-xs text-zinc-500">Boosted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D1FD0A] via-[#D1FD0A] to-cyan-500 bg-clip-text text-transparent mb-1">
                {users}
              </div>
              <div className="text-xs text-zinc-500">Users</div>
            </div>
          </div>
        </div>

        {/* App Logos Section - Made more prominent */}
        <div className="max-w-5xl mx-auto pt-6 pb-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center mb-5">
            The only apps you need!
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
              {/* LaunchOS */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-lime-500 flex items-center justify-center shadow-lg">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">LaunchOS</span>
              </div>

              {/* Twitter/X */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-zinc-700 shadow-lg">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
                <span className="text-xs font-medium">X</span>
              </div>

              {/* Solana */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xs font-medium">Solana</span>
              </div>

              {/* Pump.fun */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xs font-medium">Pump.fun</span>
              </div>

              {/* Meteora */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xs font-medium">Meteora</span>
              </div>

              {/* Jupiter */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="text-xs font-medium">Jup.ag</span>
              </div>

              {/* DexScreener */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="text-xs font-medium">DexScreener</span>
              </div>

              {/* Phantom */}
              <div className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">Φ</span>
                </div>
                <span className="text-xs font-medium">Phantom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
