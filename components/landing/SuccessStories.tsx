"use client"

import { SuccessStoryCard } from './SuccessStoryCard'
import { landingData } from '@/lib/landingData'

export function SuccessStories() {
  const { stories } = landingData

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            CCM Success Stories: From Clips to Capital
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Real launches, real results. See how creators and builders are winning together on LaunchOS.
          </p>
        </div>

        {/* Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <SuccessStoryCard key={story.id} {...story} />
          ))}
        </div>
      </div>
    </section>
  )
}
