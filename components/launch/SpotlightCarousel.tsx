"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Share2, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/design-system/Badge'
import { ProjectCardSkeleton } from '@/components/design-system/Skeleton'
import { FollowButton } from '@/components/launch/FollowButton'
import { ClipStats } from '@/components/launch/ClipStats'
import type { SpotlightProject } from '@/lib/appwrite/services/metrics'
import Link from 'next/link'

interface SpotlightCarouselProps {
  projects: SpotlightProject[]
  isLoading?: boolean
}

export function SpotlightCarousel({ projects, isLoading }: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-black mb-6 text-gradient-main">Spotlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-black mb-6 text-gradient-main">Spotlight</h2>
        <div className="glass-premium p-12 rounded-2xl text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2 text-zinc-300">No Featured Projects Yet</h3>
          <p className="text-zinc-500">Be the first to launch and get featured!</p>
        </div>
      </section>
    )
  }

  const formatCurrency = (num: number) => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  const next = () => setCurrentIndex((i) => (i + 1) % projects.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + projects.length) % projects.length)

  return (
    <section className="container mx-auto px-4 py-4 md:py-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-black text-gradient-main">Spotlight</h2>

        {/* Mobile Navigation - Touch Optimized */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={prev}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-zinc-900/50 hover:bg-zinc-800 active:scale-95 transition-all"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-zinc-500 font-medium">
            {currentIndex + 1} / {projects.length}
          </span>
          <button
            onClick={next}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-zinc-900/50 hover:bg-zinc-800 active:scale-95 transition-all"
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop: Grid of all 3 */}
      <div className="hidden md:grid md:grid-cols-3 gap-2 md:gap-3">
        {projects.map((project, index) => (
          <SpotlightCard key={project.id} project={project} rank={index + 1} />
        ))}
      </div>

      {/* Mobile: Swipeable Carousel */}
      <div
        className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-2 md:gap-3 -mx-4 px-4 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {projects.map((project, index) => (
          <div key={project.id} className="snap-center shrink-0 w-[85vw]">
            <SpotlightCard project={project} rank={index + 1} />
          </div>
        ))}
      </div>
    </section>
  )
}

function SpotlightCard({ project, rank }: { project: SpotlightProject; rank: number }) {
  const formatCurrency = (num: number) => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toFixed(2)}`
  }

  // Mock data for new features (will be replaced with real data)
  const mockPriceData = Array.from({ length: 60 }, (_, i) => ({
    timestamp: Date.now() - (60 - i) * 60000,
    price: project.currentPrice * (1 + (Math.random() - 0.5) * 0.1)
  }))

  return (
    <div className="glass-premium p-3 md:p-4 rounded-lg md:rounded-xl hover:scale-[1.02] hover:z-10 transition-all border border-zinc-800 hover:border-[#00FF88]/30 relative">
      {/* Header: Rank + Logo + Actions */}
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="text-xl md:text-2xl font-black text-zinc-700">#{rank}</div>
          <img
            src={project.logoUrl}
            alt={project.title}
            className="w-10 h-10 md:w-12 md:h-12 rounded-md md:rounded-lg object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <Badge variant={project.status === 'live' ? 'live' : 'frozen'}>
            {project.status}
          </Badge>
          <FollowButton
            entityId={project.id}
            entityType="project"
            variant="compact"
          />
          <button
            className="p-1.5 md:p-2 rounded-md md:rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Title + Description - Mobile Optimized Text */}
      <h3 className="text-base md:text-lg font-bold mb-1 group-hover:text-[#00FF88] transition-colors">
        {project.title}
      </h3>
      <p className="text-sm md:text-xs text-zinc-400 mb-2 md:mb-3 line-clamp-2">{project.description}</p>

      {/* Motion Score + 24h Price Change */}
      <div className="mb-2 md:mb-3">
        <div className="flex items-center justify-between text-[10px] md:text-xs mb-1">
          <span className="text-zinc-400">Motion</span>
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="font-semibold text-xs md:text-sm">{95 - rank * 10}%</span>
            <div className={`flex items-center gap-0.5 text-[9px] md:text-[10px] ${
              project.tvlChange24h >= 0 ? 'text-[#00FF88]' : 'text-red-400'
            }`}>
              <TrendingUp className="w-2 h-2 md:w-2.5 md:h-2.5" />
              {project.tvlChange24h >= 0 ? '+' : ''}{project.tvlChange24h.toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="h-1 md:h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${95 - rank * 10}%` }}
          />
        </div>
      </div>

      {/* Clip Stats + Holders - Mobile Optimized Text */}
      <div className="mb-2 md:mb-3 flex items-center gap-2 md:gap-3 text-xs md:text-xs">
        <div className="flex items-center gap-1 text-zinc-400">
          <span className="text-zinc-500">Clips:</span>
          <span className="font-semibold text-white">{40 - rank * 8}</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <span className="text-zinc-500">Views:</span>
          <span className="font-semibold text-white">{formatCurrency(54200 - rank * 10000).replace('$', '')}</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <span className="text-zinc-500">Holders:</span>
          <span className="font-semibold text-white">{project.holders}</span>
        </div>
      </div>

      {/* Intent CTAs - 3 buttons - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-2 md:gap-2">
        <Link
          href={`/curve/${project.id}`}
          className="px-2 md:px-2 min-h-[44px] md:h-9 rounded-lg md:rounded-lg bg-zinc-800 hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-500 active:scale-95 inline-flex items-center justify-center text-xs md:text-[11px] font-medium transition-all whitespace-nowrap"
        >
          Buy Keys
        </Link>
        <button className="px-2 md:px-2 min-h-[44px] md:h-9 rounded-lg md:rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs md:text-[11px] transition-all whitespace-nowrap">
          Collaborate
        </button>
        <Link
          href={`/launch/${project.id}`}
          className="px-2 md:px-2 min-h-[44px] md:h-9 rounded-lg md:rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs md:text-[11px] transition-all whitespace-nowrap text-center inline-flex items-center justify-center"
        >
          Details
        </Link>
      </div>
    </div>
  )
}
