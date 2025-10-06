"use client"

import { FeatureCard } from './FeatureCard'
import { landingData } from '@/lib/landingData'

export function PlatformFeatures() {
  const { features } = landingData

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            One Platform. Infinite Possibilities.
          </h2>
          <p className="text-lg text-zinc-400">
            Everything you need to launch, grow, and monetize in one place
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
