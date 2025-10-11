'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Users, Calendar, DollarSign, TrendingUp, Target, Award, Share2, Bell } from 'lucide-react'
import { PremiumButton } from '../design-system'

interface ProjectDetailsModalProps {
  open: boolean
  onClose: () => void
  project: {
    id: string
    title: string
    subtitle: string
    description?: string
    logoUrl?: string
    scope: string
    status: 'LIVE' | 'UPCOMING' | 'ENDED'
    upvotes: number
    commentsCount: number
    viewCount?: number
    convictionPct?: number
    boostCount?: number
    contributionPoolPct?: number
    feesSharePct?: number
    contributors?: Array<{ id: string; name: string; avatar?: string }>
    creator?: string
    createdAt?: string
    platforms?: string[]
    budget?: number
    endTime?: string
    url?: string
  }
}

export function ProjectDetailsModal({ open, onClose, project }: ProjectDetailsModalProps) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    if (open) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-design-zinc-950/95 backdrop-blur-xl rounded-2xl border border-design-zinc-800 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* Header with Banner */}
          <div className="relative">
            {/* Banner Gradient */}
            <div className="absolute inset-0 h-32 bg-gradient-to-br from-design-purple-500/20 via-design-pink-500/20 to-design-purple-600/20 rounded-t-2xl" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-design-zinc-900/80 hover:bg-design-zinc-800 transition-colors z-10"
            >
              <X className="w-5 h-5 text-design-zinc-400" />
            </button>

            {/* Logo and Title */}
            <div className="relative pt-20 pb-6 px-6">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-20 h-20 rounded-2xl bg-design-zinc-900 border-2 border-design-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {project.logoUrl ? (
                    <img src={project.logoUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-design-zinc-600">
                      {project.title.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Title and Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                      project.status === 'LIVE'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : project.status === 'UPCOMING'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        : 'bg-design-zinc-700/50 text-design-zinc-400 border border-design-zinc-700'
                    }`}>
                      {project.status}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.scope === 'ICM'
                        ? 'bg-design-purple-500/20 text-design-purple-300 border border-design-purple-500/40'
                        : 'bg-design-pink-500/20 text-design-pink-300 border border-design-pink-500/40'
                    }`}>
                      {project.scope}
                    </div>
                  </div>
                  <p className="text-design-zinc-400 mb-3">{project.subtitle}</p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-design-zinc-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{project.upvotes} upvotes</span>
                    </div>
                    <div className="flex items-center gap-1 text-design-zinc-400">
                      <Users className="w-4 h-4" />
                      <span>{project.contributors?.length || 0} contributors</span>
                    </div>
                    {project.viewCount && (
                      <div className="flex items-center gap-1 text-design-zinc-400">
                        <span>{project.viewCount} views</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-design-zinc-900 hover:bg-design-zinc-800 border border-design-zinc-800 transition-colors">
                    <Share2 className="w-5 h-5 text-design-zinc-400" />
                  </button>
                  <button className="p-2 rounded-lg bg-design-zinc-900 hover:bg-blue-500 hover:border-blue-500 border border-design-zinc-800 transition-colors">
                    <Bell className="w-5 h-5 text-design-zinc-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Description */}
            {project.description && (
              <div className="bg-design-zinc-900/50 rounded-xl p-4 border border-design-zinc-800">
                <h3 className="text-sm font-semibold text-white mb-2">About</h3>
                <p className="text-design-zinc-400 text-sm leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Conviction */}
              {project.convictionPct !== undefined && (
                <div className="bg-design-zinc-900/50 rounded-xl p-4 border border-design-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-design-purple-400" />
                    <span className="text-xs text-design-zinc-500">Conviction</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.convictionPct}%</div>
                  <div className="mt-2 h-1 bg-design-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-design-purple-500 to-design-pink-500 rounded-full"
                      style={{ width: `${project.convictionPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Pool Share */}
              {project.contributionPoolPct !== undefined && (
                <div className="bg-design-zinc-900/50 rounded-xl p-4 border border-design-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-design-purple-400" />
                    <span className="text-xs text-design-zinc-500">Pool Share</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.contributionPoolPct}%</div>
                </div>
              )}

              {/* Fees Share */}
              {project.feesSharePct !== undefined && (
                <div className="bg-design-zinc-900/50 rounded-xl p-4 border border-design-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-design-pink-400" />
                    <span className="text-xs text-design-zinc-500">Fees Share</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.feesSharePct}%</div>
                </div>
              )}

              {/* Boost Count */}
              {project.boostCount !== undefined && project.boostCount > 0 && (
                <div className="bg-design-zinc-900/50 rounded-xl p-4 border border-design-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-design-zinc-500">Boosts</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.boostCount}</div>
                </div>
              )}
            </div>

            {/* Contributors */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="bg-design-zinc-900/50 rounded-xl p-4 border border-design-zinc-800">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Contributors ({project.contributors.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.contributors.map((contributor) => (
                    <div key={contributor.id} className="flex items-center gap-2 px-3 py-2 bg-design-zinc-800/50 rounded-lg border border-design-zinc-700">
                      {contributor.avatar ? (
                        <img src={contributor.avatar} alt={contributor.name} className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-design-purple-500/20 flex items-center justify-center">
                          <span className="text-xs text-design-purple-400">{contributor.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="text-sm text-design-zinc-300">{contributor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platforms */}
            {project.platforms && project.platforms.length > 0 && (
              <div className="bg-design-zinc-900/50 rounded-xl p-4 border border-design-zinc-800">
                <h3 className="text-sm font-semibold text-white mb-3">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {project.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-design-zinc-800 text-design-zinc-300 rounded-full text-xs font-medium capitalize border border-design-zinc-700"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="flex flex-wrap gap-4 text-xs text-design-zinc-500">
              {project.creator && (
                <div className="flex items-center gap-1">
                  <span>Created by</span>
                  <span className="text-design-zinc-300 font-medium">{project.creator}</span>
                </div>
              )}
              {project.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{project.createdAt}</span>
                </div>
              )}
              {project.endTime && (
                <div className="flex items-center gap-1">
                  <span>Ends in</span>
                  <span className="text-design-zinc-300 font-medium">{project.endTime}</span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t border-design-zinc-800">
              <PremiumButton variant="primary" className="flex-1">
                <Users size={16} />
                Collaborate
              </PremiumButton>
              <PremiumButton variant="secondary" className="flex-1">
                <TrendingUp size={16} />
                Boost & Burn
              </PremiumButton>
              {project.url && (
                <PremiumButton variant="ghost" onClick={() => window.open(project.url, '_blank')}>
                  <ExternalLink size={16} />
                  Visit
                </PremiumButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
