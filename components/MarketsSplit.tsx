'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coins, Video, TrendingUp, Users, Zap, Target } from 'lucide-react'

export function MarketsSplit() {
  const icmFeatures = [
    { icon: Coins, text: 'Token launches' },
    { icon: TrendingUp, text: 'Belief-driven investing' },
    { icon: Zap, text: 'Boost with $LAUNCH' },
  ]

  const ccmFeatures = [
    { icon: Video, text: 'Campaigns & raids' },
    { icon: Users, text: 'Attention-driven engagement' },
    { icon: Target, text: 'Earn from creator fees' },
  ]

  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold gradient-text-launchos mb-4">
          Two Markets. One Engine.
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Whether you're launching capital or creating content, LaunchOS powers your growth
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* ICM - Internet Capital Market */}
        <div className="glass-launchos p-8 rounded-2xl neon-glow-hover transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-launchos-lime to-launchos-violet flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Internet Capital Market</h3>
              <p className="text-sm text-white/60">ICM</p>
            </div>
          </div>

          <p className="text-white/70 mb-6">
            Launch tokens, attract believers, and build liquidity through social proof and community engagement.
          </p>

          <div className="space-y-3 mb-8">
            {icmFeatures.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-launchos-lime/20 to-launchos-violet/20 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-launchos-lime" />
                </div>
                <span className="text-white/80">{feature.text}</span>
              </div>
            ))}
          </div>

          <Link href="/discover?market=icm">
            <Button
              className="w-full bg-gradient-to-r from-launchos-lime to-launchos-violet text-white font-semibold py-6 rounded-xl hover:scale-105 transition-all duration-300 neon-glow-hover"
            >
              Launch Token
            </Button>
          </Link>
        </div>

        {/* CCM - Creator Capital Market */}
        <div className="glass-launchos p-8 rounded-2xl neon-glow-hover transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-launchos-violet to-launchos-cyan flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Creator Capital Market</h3>
              <p className="text-sm text-white/60">CCM</p>
            </div>
          </div>

          <p className="text-white/70 mb-6">
            Create campaigns, run raids, and monetize attention through interactive viewer experiences.
          </p>

          <div className="space-y-3 mb-8">
            {ccmFeatures.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-launchos-violet/20 to-launchos-cyan/20 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-launchos-cyan" />
                </div>
                <span className="text-white/80">{feature.text}</span>
              </div>
            ))}
          </div>

          <Link href="/discover?market=ccm">
            <Button
              className="w-full bg-gradient-to-r from-launchos-violet to-launchos-cyan text-white font-semibold py-6 rounded-xl hover:scale-105 transition-all duration-300 neon-glow-hover"
            >
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
