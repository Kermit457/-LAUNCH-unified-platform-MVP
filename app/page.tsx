'use client'

import { AnimatedBackground } from '@/components/AnimatedBackground'
import { HeroSection } from '@/components/HeroSection'
import { LiveTicker } from '@/components/LiveTicker'
import { Flywheel } from '@/components/Flywheel'
import { MarketsSplit } from '@/components/MarketsSplit'
import { TrendingCarousel } from '@/components/TrendingCarousel'
import { LiveFeedGrid } from '@/components/LiveFeedGrid'
import { StickyCTA } from '@/components/StickyCTA'
import { launchProjects } from '@/lib/sampleData'

export default function HomePage() {
  return (
    <div className="min-h-screen relative pb-24">
      <AnimatedBackground />

      {/* Hero Section */}
      <HeroSection />

      {/* Live Ticker */}
      <LiveTicker />

      {/* Flywheel Section */}
      <Flywheel />

      {/* Markets Split - ICM vs CCM */}
      <MarketsSplit />

      {/* Trending Carousel */}
      <TrendingCarousel projects={launchProjects} />

      {/* Live Feed Grid */}
      <LiveFeedGrid projects={launchProjects} limit={6} />

      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  )
}
