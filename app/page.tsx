'use client'

import { useState, useEffect } from 'react'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { HeroSection } from '@/components/HeroSection'
import { LiveTicker } from '@/components/LiveTicker'
import { Flywheel } from '@/components/Flywheel'
import { MarketsSplit } from '@/components/MarketsSplit'
import { TrendingCarousel } from '@/components/TrendingCarousel'
import { LiveFeedGrid } from '@/components/LiveFeedGrid'
import { StickyCTA } from '@/components/StickyCTA'
import { getDataLaunches } from '@/lib/data-source'

export default function HomePage() {
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLaunches() {
      try {
        const data = await getDataLaunches({ limit: 12 })
        console.log('📊 Homepage fetched launches:', data)
        if (data && data.length > 0) {
          setLaunches(data)
        }
      } catch (error) {
        console.error('Failed to fetch launches:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLaunches()
  }, [])

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
      <TrendingCarousel projects={launches} />

      {/* Live Feed Grid */}
      <LiveFeedGrid projects={launches} limit={6} />

      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  )
}
