'use client'

import { useState, useEffect } from 'react'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { HeroSection } from '@/components/HeroSection'
import { LiveTicker } from '@/components/LiveTicker'
import { Flywheel } from '@/components/Flywheel'
import { MarketsSplit } from '@/components/MarketsSplit'
import { LiveFeedGrid } from '@/components/LiveFeedGrid'
import { StickyCTA } from '@/components/StickyCTA'
import { getDataLaunches } from '@/lib/data-source'

export default function HomePage() {
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError('Failed to load launches. Please try again later.')
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

      {/* Live Feed Grid */}
      {error ? (
        <div className="container mx-auto px-4 py-16">
          <div className="glass-launchos p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-launchos-fuchsia/20 hover:bg-launchos-fuchsia/30 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-launchos p-4 animate-pulse">
                <div className="h-12 w-12 bg-white/10 rounded-lg mb-3"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <LiveFeedGrid projects={launches} limit={6} />
      )}

      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  )
}
