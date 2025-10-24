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
 * Responsive Grid Layout:
 * - Mobile (< 768px): 1 column, full width cards
 * - Tablet (768-1024px): 2 columns
 * - Desktop (> 1024px): 3 columns
 * - Gap: 4-6 spacing units (16-24px)
 * - Container: max-width with proper padding
 *
 * Performance Optimizations:
 * - Staggered animations for smooth entrance
 * - Cards have consistent heights via flex
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
          Featured Projects
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl">
          Top performing launches with the highest motion scores
        </p>
      </header>

      {/* Responsive Grid with Consistent Heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
        {featuredProjects.map((project, index) => (
          <FeaturedCard
            key={project.id}
            data={project}
            index={index}
            onBuyKeys={onBuyKeys}
            onClipClick={onClipClick}
            onCollaborate={onCollaborate}
          />
        ))}
      </div>
    </section>
  )
}

