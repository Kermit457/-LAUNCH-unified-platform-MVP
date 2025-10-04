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
            StreamWidgets
          </h1>

          <p className="text-2xl text-white/60 mb-4">
            Add live engagement widgets to your stream in seconds
          </p>

          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Interactive OBS overlays for predictions, social actions, and ads.
            Boost viewer engagement and monetize your content effortlessly.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16 flex-wrap">
            <Link href="/predictions">
              <Button size="lg" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Preview Prediction Widget
              </Button>
            </Link>
            <Link href="/social">
              <Button size="lg" variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Preview Social Widget
              </Button>
            </Link>
            <Link href="/ads">
              <Button size="lg" variant="outline" className="gap-2">
                <Zap className="w-4 h-4" />
                Preview Ads Widget
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Why StreamWidgets?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">Real-time Engagement</h3>
            <p className="text-white/60">
              Keep viewers engaged with live predictions, polls, and interactive elements
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">Community Growth</h3>
            <p className="text-white/60">
              Drive social media follows and community participation with goal tracking
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">Monetization</h3>
            <p className="text-white/60">
              Generate revenue through sponsored ads and brand partnerships
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
