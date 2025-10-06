'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket, Eye, Sparkles } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

export function HeroSection() {
  const launches = useCountUp({ end: 132, duration: 2000 })
  const boosted = useCountUp({ end: 42700, duration: 2500, prefix: '$' })
  const users = useCountUp({ end: 8931, duration: 2000 })

  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span className="text-sm text-zinc-300">The Engine of the Internet Capital Market</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            The Viral Launchpad
          </span>
          <br />
          <span className="text-white">
            for Builders, Creators, and Degens
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-zinc-300 mb-4 max-w-3xl mx-auto">
          Launch tokens, clip campaigns, or prediction markets.
        </p>
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
          <span className="text-fuchsia-500 font-semibold">$LAUNCH</span> connects belief, liquidity, and attention — one click from <span className="text-cyan-500 font-semibold">Pump.fun</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-1">
                {launches}
              </div>
              <div className="text-sm text-zinc-500">Launches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-1">
                {boosted}
              </div>
              <div className="text-sm text-zinc-500">Boosted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-1">
                {users}
              </div>
              <div className="text-sm text-zinc-500">Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
