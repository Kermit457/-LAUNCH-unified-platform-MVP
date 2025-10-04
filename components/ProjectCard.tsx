"use client"

import { Heart, Share2, Eye, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Project } from '@/types';

export function ProjectCard(p: Project) {
  const pct = p.progress
    ? Math.min(100, Math.round(100 * (p.progress.paid || 0) / Math.max(1, p.progress.pool || 0)))
    : null;

  // Type-specific styling
  const typeColors = {
    launch: 'from-blue-500 to-cyan-500',
    campaign: 'from-purple-500 to-pink-500',
    raid: 'from-red-500 to-orange-500',
    prediction: 'from-green-500 to-emerald-500',
    ad: 'from-yellow-500 to-amber-500',
    quest: 'from-indigo-500 to-violet-500',
    spotlight: 'from-fuchsia-500 to-pink-500'
  };

  const typeLabels = {
    launch: '🚀 Launch',
    campaign: '📹 Campaign',
    raid: '⚔️ Raid',
    prediction: '🎯 Prediction',
    ad: '💰 Ad',
    quest: '🎮 Quest',
    spotlight: '⭐ Spotlight'
  };

  return (
    <div className="glass-card p-5 hover:border-white/30 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold bg-gradient-to-br flex-shrink-0",
            typeColors[p.type]
          )}>
            {(p.title[0] || '?').toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-white text-base line-clamp-1 mb-0.5">
              {p.title}
            </div>
            {p.subtitle && (
              <div className="text-white/60 text-sm line-clamp-1">
                {p.subtitle}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pills and Status */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/80">
          {typeLabels[p.type]}
        </span>

        {p.pill && (
          <span className="px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-xs font-bold text-pink-300">
            {p.pill.label}
          </span>
        )}

        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-bold ml-auto',
          p.status === 'live' && 'bg-green-500/20 text-green-300 border border-green-500/30',
          p.status === 'upcoming' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          p.status === 'ended' && 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        )}>
          {p.status.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      {pct !== null && p.progress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/60 mb-1.5">
            <span>${p.progress.paid.toLocaleString()} paid</span>
            <span>{pct}% of ${p.progress.pool.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={cn("h-full bg-gradient-to-r transition-all duration-500", typeColors[p.type])}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-white/60 mb-4">
        <div className="flex items-center gap-3">
          {p.stats?.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{p.stats.views.toLocaleString()}</span>
            </div>
          )}
          {p.stats?.participants !== undefined && (
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{p.stats.participants}</span>
            </div>
          )}
          {p.endTime && (
            <div className="flex items-center gap-1 text-orange-400">
              <Clock size={14} />
              <span>{p.endTime}</span>
            </div>
          )}
        </div>
        <button className="text-white/50 hover:text-white transition-colors">
          <Share2 size={14} />
        </button>
      </div>

      {/* Platforms */}
      {p.platforms && p.platforms.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {p.platforms.map(platform => (
            <span
              key={platform}
              className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/70 capitalize"
            >
              {platform}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium text-white transition-all">
          View
        </button>
        <button className={cn(
          "flex-1 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all bg-gradient-to-r",
          typeColors[p.type],
          "hover:shadow-lg"
        )}>
          {p.cta?.label || 'Join'}
        </button>
      </div>
    </div>
  );
}

// TODO: Add click tracking analytics
// TODO: Implement share functionality
// TODO: Add like/bookmark features
// TODO: Connect CTA buttons to actual actions (wallet connect, Supabase mutations)
