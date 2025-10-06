'use client'

import Link from 'next/link'
import { Rocket, Activity, Trophy } from 'lucide-react'

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="glass-launchos border-t border-white/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
            {/* Start Launch */}
            <Link href="/explore">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-neon-fuchsia hover:shadow-neon-violet"
                data-cta="sticky-start-launch"
              >
                <Rocket className="w-4 h-4" />
                <span className="hidden sm:inline">Start Launch</span>
              </button>
            </Link>

            {/* View Live Feed */}
            <Link href="/explore">
              <button
                className="flex items-center gap-2 px-6 py-3 neon-border-fuchsia bg-transparent text-white font-semibold rounded-xl hover:bg-white/5 hover:scale-105 transition-all duration-300"
                data-cta="sticky-live-feed"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">View Live Feed</span>
              </button>
            </Link>

            {/* Boost Leaderboard */}
            <Link href="/community">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white/80 hover:text-white font-semibold rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                data-cta="sticky-leaderboard"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Boost Leaderboard</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
