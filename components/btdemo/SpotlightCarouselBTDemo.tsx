'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Award, Gem, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SpotlightProject } from '@/lib/appwrite/services/metrics'

interface SpotlightCarouselBTDemoProps {
  projects: SpotlightProject[]
}

export function SpotlightCarouselBTDemo({ projects }: SpotlightCarouselBTDemoProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false) // Disabled by default

  // Auto-scroll disabled to prevent continuous refreshing
  // Uncomment to enable auto-scroll
  /*
  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, projects.length])
  */

  const handlePrev = (): void => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const handleNext = (): void => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  // Get visible projects based on screen size
  const getVisibleProjects = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % projects.length
      visible.push(projects[index])
    }
    return visible
  }

  if (projects.length === 0) return <></>

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white">Featured Projects</h2>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="icon-interactive p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="icon-interactive p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {getVisibleProjects().map((project, idx) => (
              <SpotlightCard key={`${project.id}-${currentIndex}-${idx}`} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

interface SpotlightCardProps {
  project: SpotlightProject
}

function SpotlightCard({ project }: SpotlightCardProps): JSX.Element {
  // Use a stable motion score based on project ID to prevent re-renders
  const getStableScore = (id: string): number => {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i)
      hash = hash & hash // Convert to 32bit integer
    }
    return 70 + Math.abs(hash) % 30 // Returns 70-99
  }

  const motionScore = getStableScore(project.id)
  const isHighScore = motionScore > 80

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-premium p-6 rounded-2xl border border-zinc-800 hover:border-[#D1FD0A]/30 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(209,253,10,0.15)] transition-all duration-300 cursor-pointer group"
    >
      {/* Header: Logo + Status Badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <img
            src={project.logoUrl}
            alt={project.title}
            className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(209,253,10,0.4)] transition-all duration-300"
          />

          {/* Motion Score Badge - Hexagonal */}
          <div
            className={`absolute -bottom-2 -right-2 w-[30px] h-[30px] flex items-center justify-center text-xs font-bold rounded-md ${
              isHighScore
                ? 'bg-[#D1FD0A] text-black animate-pulse'
                : 'bg-zinc-800 text-[#D1FD0A]'
            }`}
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
            }}
          >
            {motionScore}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          {project.status === 'live' && (
            <Star className="w-4 h-4 text-[#D1FD0A]" />
          )}
          <Award className="w-4 h-4 text-yellow-400" />
          <Gem className="w-4 h-4 text-cyan-400" />
        </div>
      </div>

      {/* Title + Description */}
      <h3 className="text-lg font-bold mb-2 group-hover:text-[#D1FD0A] transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-interactive p-3 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1">Market Cap</div>
          <div className="font-led-16 text-[#00FF88]">
            ${(project.tvl / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="glass-interactive p-3 rounded-xl">
          <div className="text-xs text-zinc-500 mb-1">Holders</div>
          <div className="font-led-16 text-white">
            {project.holders.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-zinc-800">
        {project.twitterUrl && (
          <a
            href={project.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-interactive-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="w-5 h-5" />
          </a>
        )}
        <a href="#" className="icon-interactive-primary">
          <Globe className="w-5 h-5" />
        </a>
      </div>
    </motion.div>
  )
}
