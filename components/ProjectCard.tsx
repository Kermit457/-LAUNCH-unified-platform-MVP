"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Share2, Eye, Clock, Users, MessageCircle, Zap, Bookmark, DollarSign, TrendingUp, Radio, Trophy, Target, ArrowBigUp, MessageSquare, ExternalLink, Rocket, Twitter, Coins, Video } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Project, Comment } from '@/types';
import { VoteButton } from './VoteButton';
import { BoostButton } from './BoostButton';
import { CommentsDrawer } from './CommentsDrawer';
import { BeliefScore } from './BeliefScore';

interface ProjectCardProps extends Project {
  onUpdateProject?: (updatedProject: Project) => void;
}

export function ProjectCard(props: ProjectCardProps) {
  const router = useRouter();
  const { onUpdateProject, ...p } = props;
  const [project, setProject] = useState<Project>(p);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(project.upvotes || 0);

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

  // Launch card layout
  if (project.type === 'launch') {
    const confidencePct = project.beliefScore || 0;
    const isCCM = project.marketType === 'ccm';
    const borderColor = isCCM ? 'border-purple-500/40 hover:border-purple-500/60' : 'border-yellow-500/40 hover:border-yellow-500/60';
    const focusRing = isCCM ? 'focus:ring-purple-400' : 'focus:ring-yellow-400';
    const marketLabel = isCCM ? 'CCM' : 'ICM';
    const MarketIcon = isCCM ? Video : Coins;

    return (
      <>
        <div className={cn("w-full h-[220px] rounded-2xl border bg-neutral-950 text-neutral-100 shadow-md overflow-hidden transition-all", borderColor)}>
          <div className="flex h-full">
            {/* Left rail */}
            <div className="w-16 p-2 flex flex-col items-center gap-2 bg-neutral-900/60">
              <button
                onClick={() => setLocalUpvotes(localUpvotes + 1)}
                className={cn("flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 transition-colors", focusRing)}
                aria-label="Upvote"
              >
                <ArrowBigUp className="w-5 h-5" />
                <span className="text-xs mt-0.5">{localUpvotes}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className={cn("w-12 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 flex flex-col items-center justify-center transition-colors", focusRing)}
                aria-label="Comments"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">{project.comments?.length || 0}</span>
              </button>

              <div
                className="w-12 h-12 rounded-xl bg-neutral-800 flex flex-col items-center justify-center"
                aria-label={`${marketLabel} Market`}
              >
                <MarketIcon className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">{marketLabel}</span>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 grid grid-cols-[64px_1fr] gap-4">
              {/* Token tile + stats */}
              <div className="flex flex-col gap-1.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold shadow-lg overflow-hidden">
                  {project.logoUrl || project.tokenLogo ? (
                    <img
                      src={project.logoUrl || project.tokenLogo}
                      alt={project.ticker || project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-white text-sm">${project.ticker ? project.ticker.slice(0, 2).replace('$', '').toUpperCase() : project.title.slice(0, 2).toUpperCase()}</span>`
                      }}
                    />
                  ) : (
                    <span className="text-white text-sm">
                      {project.ticker ? project.ticker.slice(0, 2).replace('$', '').toUpperCase() : project.title.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Stats badges */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-neutral-900 rounded text-[10px] text-fuchsia-400">
                    <TrendingUp className="w-3 h-3" />
                    {localUpvotes}
                  </div>
                  {project.boosted && (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-500/20 rounded text-[10px] text-yellow-400">
                      <Zap className="w-3 h-3 fill-yellow-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Text + controls */}
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold leading-tight">{project.title}</h3>
                      {project.status === 'live' && (
                        <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded text-[10px] font-bold text-green-400 uppercase">
                          Live
                        </span>
                      )}
                      {project.status === 'upcoming' && (
                        <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-[10px] font-bold text-amber-400 uppercase">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400">{project.subtitle || 'Token Launch'}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {project.platforms?.includes('twitter') && project.socials?.twitter && (
                      <a
                        href={project.socials.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className={cn("p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2", focusRing)}
                        aria-label="Twitter"
                        data-cta="card-twitter-link"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2",
                        focusRing,
                        isBookmarked
                          ? isCCM
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-yellow-500/20 text-yellow-400"
                          : "bg-neutral-800 hover:bg-neutral-700 text-white/70"
                      )}
                      aria-label="Bookmark"
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && (isCCM ? "fill-purple-400" : "fill-yellow-400"))} />
                    </button>
                    <button
                      className={cn("p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white/70 transition-colors focus:outline-none focus:ring-2", focusRing)}
                      aria-label="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Conviction */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Conviction</span>
                    <span className="font-semibold">{Math.round(confidencePct)}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, confidencePct))}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-2.5 flex items-center gap-2">
                  <button
                    onClick={handleBoost}
                    className={cn(
                      "px-2.5 h-9 rounded-xl font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 text-xs whitespace-nowrap",
                      isCCM
                        ? "bg-purple-500 hover:bg-purple-400 text-white focus:ring-purple-400"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black focus:ring-yellow-400"
                    )}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    Boost (10 $LAUNCH)
                  </button>

                  <button
                    className={cn("px-3 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs transition-colors focus:outline-none focus:ring-2 whitespace-nowrap", focusRing)}
                  >
                    Follow
                  </button>

                  <button
                    onClick={() => router.push(`/launch/${project.id}`)}
                    className={cn(
                      "px-3 h-9 rounded-xl bg-gradient-to-r inline-flex items-center gap-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 whitespace-nowrap",
                      isCCM
                        ? "from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 focus:ring-purple-400"
                        : "from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 focus:ring-blue-400"
                    )}
                  >
                    View Launch <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
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

  // Original card layout for other types
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
              {/* Token Logo with LIVE indicator */}
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "h-16 w-16 rounded-xl flex items-center justify-center text-xl font-bold bg-gradient-to-br border-2 border-white/10 overflow-hidden",
                  typeColors[project.type],
                  "token-logo-glow"
                )}>
                  {project.tokenLogo ? (
                    <img
                      src={project.tokenLogo}
                      alt={project.ticker || project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-xl font-bold">${project.ticker ? project.ticker.slice(0, 3).replace('$', '') : (project.title[0] || '?').toUpperCase()}</span>`
                      }}
                    />
                  ) : (
                    <span>{project.ticker ? project.ticker.slice(0, 3).replace('$', '') : (project.title[0] || '?').toUpperCase()}</span>
                  )}
                </div>
                {/* LIVE Badge for streaming projects */}
                {project.isLiveStreaming && (
                  <div className="absolute -top-1 -right-1 flex items-center gap-1 px-1.5 py-0.5 bg-red-500 rounded-md text-[9px] font-bold text-white uppercase live-badge border border-red-400">
                    <Radio size={8} className="fill-white" />
                    LIVE
                  </div>
                )}
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

      {/* Unified Key Metric - Show Belief Score OR Main Info Badge */}
      {project.beliefScore !== undefined ? (
        <div className="mb-3">
          <BeliefScore score={project.beliefScore} size="sm" showLabel={true} />
        </div>
      ) : project.pill ? (
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-launchos-fuchsia/20 to-launchos-violet/20 rounded-lg border border-launchos-fuchsia/30">
            <span className="text-sm font-bold gradient-text-launchos">{project.pill.label}</span>
          </div>
        </div>
      ) : null}

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
            <span>${project.progress.paid.toLocaleString('en-US')} paid</span>
            <span>{pct}% of ${project.progress.pool.toLocaleString('en-US')}</span>
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
              <span>{project.stats.views.toLocaleString('en-US')}</span>
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
