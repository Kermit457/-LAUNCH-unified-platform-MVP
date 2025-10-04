'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, Users } from 'lucide-react'
import { VoteButton } from './VoteButton'
import type { Project } from '@/types'

interface TrendingCarouselProps {
  projects: Project[]
}

export function TrendingCarousel({ projects }: TrendingCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Sort projects by upvotes and take top 6
  const trendingProjects = [...projects]
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    .slice(0, 6)

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || trendingProjects.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingProjects.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, trendingProjects.length])

  // Scroll to current index
  useEffect(() => {
    if (!scrollContainerRef.current) return
    const cardWidth = scrollContainerRef.current.scrollWidth / trendingProjects.length
    scrollContainerRef.current.scrollTo({
      left: cardWidth * currentIndex,
      behavior: 'smooth'
    })
  }, [currentIndex, trendingProjects.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + trendingProjects.length) % trendingProjects.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingProjects.length)
  }

  if (trendingProjects.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-16 border-t border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text-shimmer">Trending Now</h2>
            <p className="text-sm text-white/50">Most upvoted projects this week</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {trendingProjects.map((project) => (
          <div
            key={project.id}
            className="min-w-[320px] md:min-w-[400px] snap-start glass-card p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <VoteButton
                initialVotes={project.upvotes || 0}
                projectId={project.id}
                size="md"
                orientation="vertical"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-300 border border-pink-500/30">
                    {project.type}
                  </span>
                  {project.boosted && (
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      🚀 Boosted
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{project.creator}</span>
              </div>
              {project.comments && (
                <div className="flex items-center gap-1">
                  💬 {project.comments.length}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {trendingProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 w-8'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
