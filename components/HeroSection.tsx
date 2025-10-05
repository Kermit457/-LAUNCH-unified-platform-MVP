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
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-launchos rounded-full mb-8 neon-glow-hover">
          <Sparkles className="w-4 h-4 neon-text-cyan" />
          <span className="text-sm text-white/80">The Engine of the Internet Capital Market</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="gradient-text-launchos">
            The Viral Launchpad
          </span>
          <br />
          <span className="text-white">
            for Builders, Creators, and Degens
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/70 mb-4 max-w-3xl mx-auto">
          Launch tokens, clip campaigns, or prediction markets.
        </p>
        <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
          <span className="neon-text-fuchsia">$LAUNCH</span> connects belief, liquidity, and attention — one click from <span className="neon-text-cyan">Pump.fun</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/explore">
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 bg-gradient-primary text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-neon-fuchsia hover:shadow-neon-violet transition-all duration-300 hover:scale-105 neon-glow-hover"
            >
              <Rocket className="w-5 h-5" />
              Start a Launch
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto gap-2 border-2 neon-border-fuchsia bg-transparent text-white font-semibold px-8 py-6 text-lg rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-105"
            >
              Explore Projects
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto gap-2 text-white/70 hover:text-white font-semibold px-8 py-6 text-lg rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              <Eye className="w-5 h-5" />
              See Live Feed
            </Button>
          </Link>
        </div>

        {/* Live Metrics Bar */}
        <div className="glass-launchos rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text-launchos mb-1">
                {launches}
              </div>
              <div className="text-sm text-white/60">Launches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text-launchos mb-1">
                {boosted}
              </div>
              <div className="text-sm text-white/60">Boosted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text-launchos mb-1">
                {users}
              </div>
              <div className="text-sm text-white/60">Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
