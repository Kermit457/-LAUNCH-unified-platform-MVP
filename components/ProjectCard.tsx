"use client"

import { useState } from 'react';
import { Heart, Share2, Eye, Clock, Users, MessageCircle, Zap, Bookmark } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Project, Comment } from '@/types';
import { VoteButton } from './VoteButton';
import { BoostButton } from './BoostButton';
import { CommentsDrawer } from './CommentsDrawer';

interface ProjectCardProps extends Project {
  onUpdateProject?: (updatedProject: Project) => void;
}

export function ProjectCard(props: ProjectCardProps) {
  const { onUpdateProject, ...p } = props;
  const [project, setProject] = useState<Project>(p);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleAddComment = (comment: Comment) => {
    const updated = {
      ...project,
      comments: [comment, ...(project.comments || [])],
    };
    setProject(updated);
    if (onUpdateProject) onUpdateProject(updated);
  };

  const handleBoost = () => {
    const updated = {
      ...project,
      boosted: true,
      boostCount: (project.boostCount || 0) + 1,
    };
    setProject(updated);
    if (onUpdateProject) onUpdateProject(updated);
  };

  const pct = project.progress
    ? Math.min(100, Math.round(100 * (project.progress.paid || 0) / Math.max(1, project.progress.pool || 0)))
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
    <>
      <div className={cn(
        "glass-card p-5 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl",
        project.boosted && "ring-2 ring-yellow-500/50 shadow-yellow-500/20"
      )}>
        <div className="flex gap-3">
          {/* Vote Button */}
          <div className="flex-shrink-0">
            <VoteButton
              initialVotes={project.upvotes || 0}
              projectId={project.id}
              size="md"
              orientation="vertical"
            />
          </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold bg-gradient-to-br flex-shrink-0",
                typeColors[project.type]
              )}>
                {(project.title[0] || '?').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-white text-base line-clamp-1 mb-0.5">
                    {project.title}
                  </div>
                  {project.boosted && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400">
                      <Zap size={12} className="fill-yellow-400" />
                      {project.boostCount || 1}
                    </div>
                  )}
                </div>
                {project.subtitle && (
                  <div className="text-white/60 text-sm line-clamp-1">
                    {project.subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>

      {/* Pills and Status */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/80">
          {typeLabels[project.type]}
        </span>

        {project.pill && (
          <span className="px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-xs font-bold text-pink-300">
            {project.pill.label}
          </span>
        )}

        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-bold ml-auto',
          project.status === 'live' && 'bg-green-500/20 text-green-300 border border-green-500/30',
          project.status === 'upcoming' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          project.status === 'ended' && 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        )}>
          {project.status.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      {pct !== null && project.progress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/60 mb-1.5">
            <span>${project.progress.paid.toLocaleString()} paid</span>
            <span>{pct}% of ${project.progress.pool.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={cn("h-full bg-gradient-to-r transition-all duration-500", typeColors[project.type])}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats & Engagement */}
      <div className="flex items-center justify-between text-xs text-white/60 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {project.stats?.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{project.stats.views.toLocaleString()}</span>
            </div>
          )}
          {project.stats?.participants !== undefined && (
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{project.stats.participants}</span>
            </div>
          )}
          {project.endTime && (
            <div className="flex items-center gap-1 text-orange-400">
              <Clock size={14} />
              <span>{project.endTime}</span>
            </div>
          )}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <MessageCircle size={14} />
            <span>{project.comments?.length || 0}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={cn(
              "transition-colors",
              isBookmarked ? "text-yellow-400" : "text-white/50 hover:text-white"
            )}
          >
            <Bookmark size={14} className={cn(isBookmarked && "fill-yellow-400")} />
          </button>
          <button className="text-white/50 hover:text-white transition-colors">
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Platforms */}
      {project.platforms && project.platforms.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {project.platforms.map(platform => (
            <span
              key={platform}
              className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/70 capitalize"
            >
              {platform}
            </span>
          ))}
        </div>
      )}

      {/* Boost Button */}
      <div className="mb-4">
        <BoostButton
          projectId={project.id}
          onBoost={handleBoost}
          size="sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium text-white transition-all">
          View
        </button>
        <button className={cn(
          "flex-1 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all bg-gradient-to-r",
          typeColors[project.type],
          "hover:shadow-lg hover:scale-105"
        )}>
          {project.cta?.label || 'Join'}
        </button>
      </div>
        </div>
      </div>
    </div>

    {/* Comments Drawer */}
    <CommentsDrawer
      project={project}
      open={showComments}
      onClose={() => setShowComments(false)}
      onAddComment={handleAddComment}
    />
    </>
  );
}

// TODO: Add click tracking analytics
// TODO: Implement share functionality
// TODO: Connect CTA buttons to actual actions (wallet connect, Supabase mutations)
