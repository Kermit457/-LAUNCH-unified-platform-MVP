"use client"

import { FeaturedCard } from './FeaturedCard'
import type { UnifiedCardData } from '../UnifiedCard'

interface FeaturedProjectsCarouselProps {
  projects: UnifiedCardData[]
  onBuyKeys?: (project: UnifiedCardData) => void
  onClipClick?: (project: UnifiedCardData) => void
  onCollaborate?: (project: UnifiedCardData) => void
}

/**
 * FeaturedProjectsCarousel - Standout hero section for top launches
 *
 * Responsive Layout:
 * - Mobile (< 768px): Horizontal swipe carousel, 1 card visible (85vw), snap scroll
 * - Tablet (768-1024px): 2 column grid
 * - Desktop (> 1024px): 3 column grid
 * - Gap: 4-6 spacing units (16-24px)
 * - Container: max-width with proper padding
 *
 * Performance Optimizations:
 * - Staggered animations for smooth entrance
 * - Snap scrolling for better mobile UX
 * - Hidden scrollbar for cleaner appearance
 * - Lazy-loaded images in cards
 * - Hardware-accelerated transforms
 * - Touch-friendly tap targets (44px minimum)
 */
export function FeaturedProjectsCarousel({
  projects,
  onBuyKeys,
  onClipClick,
  onCollaborate
}: FeaturedProjectsCarouselProps) {
  // Show top 3 projects
  const featuredProjects = projects.slice(0, 3)

  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <section
      className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12"
      aria-labelledby="featured-heading"
    >
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <h2
          id="featured-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-black text-[#D1FD0A] mb-2 btdemo-text-glow-intense"
        >
          Spotlight
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl">
          Community favorites with the highest motion scores and strongest backing
        </p>
      </header>

      {/* Mobile: Horizontal Swipe Carousel, Desktop: Grid */}
      <div className="flex overflow-x-auto gap-4 sm:gap-5 md:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:auto-rows-fr snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {featuredProjects.map((project, index) => (
          <div key={project.id} className="min-w-[85vw] sm:min-w-0 flex-shrink-0 md:flex-shrink snap-center">
            <FeaturedCard
              data={project}
              index={index}
              rank={index + 1}
              onBuyKeys={onBuyKeys}
              onClipClick={onClipClick}
              onCollaborate={onCollaborate}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

