'use client'

import { TrendingUp, Zap, Radio } from 'lucide-react'
import type { Project } from '@/types'
import { BeliefScore } from './BeliefScore'
import { cn } from '@/lib/cn'

interface LiveFeedGridProps {
  projects: Project[]
  limit?: number
}

export function LiveFeedGrid({ projects, limit = 6 }: LiveFeedGridProps) {
  // Sort by upvotes and take the top projects
  const topProjects = [...projects]
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    .slice(0, limit)

  const typeColors = {
    launch: 'from-blue-500 to-cyan-500',
    campaign: 'from-purple-500 to-pink-500',
    raid: 'from-red-500 to-orange-500',
    prediction: 'from-green-500 to-emerald-500',
    ad: 'from-yellow-500 to-amber-500',
    quest: 'from-indigo-500 to-violet-500',
    spotlight: 'from-fuchsia-500 to-pink-500'
  }

  const typeEmoji = {
    launch: '🚀',
    campaign: '📹',
    raid: '⚔️',
    prediction: '🎯',
    ad: '💰',
    quest: '🎮',
    spotlight: '⭐'
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text-launchos">Live Feed</span>
        </h2>
        <p className="text-white/60">Top trending projects right now</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topProjects.map((project) => (
          <div
            key={project.id || (project as any).launchId || (project as any).$id}
            className="glass-launchos p-4 hover:border-launchos-fuchsia/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-neon-fuchsia group cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              {/* Token Logo with LIVE indicator */}
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "h-12 w-12 rounded-lg flex items-center justify-center text-sm font-bold bg-gradient-to-br border-2 border-white/10",
                  typeColors[project.type],
                  "token-logo-glow"
                )}>
                  {project.ticker ? project.ticker.slice(0, 3).replace('$', '') : typeEmoji[project.type]}
                </div>
                {/* LIVE Badge for streaming projects */}
                {project.isLiveStreaming && (
                  <div className="absolute -top-1 -right-1 flex items-center gap-0.5 px-1 py-0.5 bg-red-500 rounded text-[8px] font-bold text-white uppercase live-badge border border-red-400">
                    <Radio size={6} className="fill-white" />
                    LIVE
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm line-clamp-1 mb-0.5 group-hover:gradient-text-launchos transition-all">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-xs text-white/60 line-clamp-1">
                    {project.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Unified Key Metric - Belief Score OR Main Badge */}
            {project.beliefScore !== undefined ? (
              <div className="mb-3">
                <BeliefScore score={project.beliefScore} size="sm" showLabel={false} />
              </div>
            ) : project.pill ? (
              <div className="mb-3">
                <div className="text-xs font-bold gradient-text-launchos">{project.pill.label}</div>
              </div>
            ) : null}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp size={12} className="text-launchos-fuchsia" />
                  <span className="font-bold text-white">{project.upvotes || 0}</span>
                </div>
                {project.boosted && (
                  <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <span className={cn(
                'px-2 py-0.5 rounded text-xs font-bold',
                project.status === 'live' && 'bg-green-500/20 text-green-300',
                project.status === 'upcoming' && 'bg-amber-500/20 text-amber-300',
                project.status === 'ended' && 'bg-gray-500/20 text-gray-400'
              )}>
                {project.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
