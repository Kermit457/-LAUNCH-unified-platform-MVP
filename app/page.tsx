'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PredictionWidgetDemo from '@/components/widgets/PredictionWidgetDemo'
import SocialWidgetDemo from '@/components/widgets/SocialWidgetDemo'
import AdsWidgetDemo from '@/components/widgets/AdsWidgetDemo'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { TrendingCarousel } from '@/components/TrendingCarousel'
import { UserJourneyCards } from '@/components/UserJourneyCards'
import { Sparkles, TrendingUp, Users, Zap, Rocket, ArrowRight } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { sampleProjects } from '@/lib/sampleData'

export default function HomePage() {
  const dailyUsers = useCountUp({ end: 1284, duration: 2000 })
  const totalPayouts = useCountUp({ end: 12430, duration: 2500, prefix: '$', decimals: 0 })
  const liveProjects = useCountUp({ end: 42, duration: 1500 })
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/70">Interactive OBS Overlays</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text-shimmer">
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
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105"
              >
                <Rocket className="w-4 h-4" />
                Explore Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
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
          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-sm text-white/60 mb-2">Daily Active Users</div>
            <div className="text-4xl font-bold gradient-text-shimmer mb-1">{dailyUsers}</div>
            <div className="flex items-center justify-center gap-1 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              +12% from yesterday
            </div>
          </div>
          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-sm text-white/60 mb-2">Total Payouts</div>
            <div className="text-4xl font-bold gradient-text-shimmer mb-1">{totalPayouts}</div>
            <div className="flex items-center justify-center gap-1 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              +$2,340 this week
            </div>
          </div>
          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-sm text-white/60 mb-2">Live Projects</div>
            <div className="text-4xl font-bold gradient-text-shimmer mb-1">{liveProjects}</div>
            <div className="text-xs text-white/50">18 campaigns active</div>
          </div>
        </div>
      </section>

      {/* Trending Carousel */}
      <TrendingCarousel projects={sampleProjects} />

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

      {/* User Journey Cards */}
      <UserJourneyCards />
    </div>
  )
}
