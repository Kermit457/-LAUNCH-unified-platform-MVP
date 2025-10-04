'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PredictionWidgetDemo from '@/components/widgets/PredictionWidgetDemo'
import SocialWidgetDemo from '@/components/widgets/SocialWidgetDemo'
import AdsWidgetDemo from '@/components/widgets/AdsWidgetDemo'
import { Sparkles, TrendingUp, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/70">Interactive OBS Overlays</span>
          </div>

          <h1 className="text-6xl font-bold mb-6 gradient-text">
            From Twitch to Rich
          </h1>

          <p className="text-2xl text-white/60 mb-4">
            Turn entertainment into finance
          </p>

          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Connect streamers, clippers, and agencies. Launch tokens, run campaigns, predictions, raids, and more.
            All-in-one platform for content monetization.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16 flex-wrap">
            <Link href="/explore">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Explore Projects
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="gap-2">
                <Zap className="w-4 h-4" />
                Creator Tools
              </Button>
            </Link>
          </div>

          {/* Widget Previews */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="transform scale-75 origin-top">
                <PredictionWidgetDemo />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white mb-1">Predictions</h3>
                <p className="text-sm text-white/50">Live voting & outcomes</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="transform scale-75 origin-top">
                <SocialWidgetDemo />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white mb-1">Social Actions</h3>
                <p className="text-sm text-white/50">Community goals & tracking</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="transform scale-75 origin-top">
                <AdsWidgetDemo />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white mb-1">Sponsored Ads</h3>
                <p className="text-sm text-white/50">Monetize your content</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-2">Daily Active Users</div>
            <div className="text-4xl font-bold gradient-text mb-1">1,284</div>
            <div className="text-xs text-green-400">+12% from yesterday</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-2">Total Payouts</div>
            <div className="text-4xl font-bold gradient-text mb-1">$12,430</div>
            <div className="text-xs text-green-400">+$2,340 this week</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-sm text-white/60 mb-2">Live Projects</div>
            <div className="text-4xl font-bold gradient-text mb-1">42</div>
            <div className="text-xs text-white/50">18 campaigns active</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Why $LAUNCH?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">Content Monetization</h3>
            <p className="text-white/60">
              Earn from clips, streams, predictions, and more. Turn views into revenue.
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">Community Engagement</h3>
            <p className="text-white/60">
              Raids, predictions, quests - keep your audience engaged and growing
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">All-in-One Platform</h3>
            <p className="text-white/60">
              Launches, campaigns, ads, widgets - everything you need in one place
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
