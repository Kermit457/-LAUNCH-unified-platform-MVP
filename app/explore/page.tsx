"use client"

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer';
import { MarketSwitcher } from '@/components/MarketSwitcher';
import { sortProjects } from '@/lib/sampleData';
import type { Project, MarketType } from '@/types';
import { LayoutGrid, Rocket, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import { useLiveLaunches } from '@/hooks/useLiveLaunches';
import { LaunchGridSkeleton } from '@/components/LoadingSkeletons';
import { ErrorBoundary } from '@/components/ErrorBoundary';

type SortOption = 'trending' | 'new' | 'votes' | 'belief' | 'fdv';

export default function ExplorePage() {
  const [market, setMarket] = useState<MarketType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const { success } = useToast();

  // Real-time launches with Appwrite subscriptions
  const { launches, loading, error } = useLiveLaunches(100)
  const projects = launches as any[]

  const filteredAndSortedProjects = useMemo(() => {
    // Filter by market type: ALL, ICM (launches) or CCM (non-launch projects)
    let filtered = market === 'all'
      ? projects.filter(p => p.type === 'launch')
      : market === 'icm'
      ? projects.filter(p => p.type === 'launch' && (!p.marketType || p.marketType === 'icm'))
      : projects.filter(p => p.type === 'launch' && p.marketType === 'ccm');

    return sortProjects(filtered, sortBy);
  }, [projects, market, sortBy]);

  const handleUpdateProject = (updatedProject: Project) => {
    // Real-time updates handled automatically by useLiveLaunches
    console.log('Project updated:', updatedProject)
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <LayoutGrid className="w-8 h-8 neon-text-fuchsia" />
            <h1 className="text-4xl font-bold gradient-text-launchos">Launch</h1>
          </div>
          <p className="text-white/60 text-lg">
            Loading launches...
          </p>
        </div>
        <LaunchGridSkeleton count={6} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <ErrorBoundary
        fallback={
          <div className="min-h-screen pb-24 flex items-center justify-center">
            <div className="glass-card p-8 text-center max-w-md">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        }
      >
        <div>{error}</div>
      </ErrorBoundary>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <LayoutGrid className="w-8 h-8 neon-text-fuchsia" />
            <h1 className="text-4xl font-bold gradient-text-launchos">
              Launch
            </h1>
            <div className="flex items-center gap-1 text-xs text-green-400 px-2 py-1 bg-green-400/10 rounded-full border border-green-400/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <MarketSwitcher market={market} onMarketChange={setMarket} />
            <Button
              onClick={() => {/* TODO: Add launch existing token flow */}}
              variant="outline"
              className="gap-2 hover:scale-105 transition-all w-full"
              data-cta="explore-launch-existing"
              disabled={true}
              title="Feature coming soon"
            >
              <Rocket size={16} />
              Launch Existing Token
            </Button>
          </div>
        </div>
        <p className="text-white/60 text-lg">
          Discover live token launches and creator campaigns. Curate, boost, clip, predict, and build in public.
        </p>
      </div>

      {/* Create Launch CTA */}
      <div className="mb-4">
        <Button
          onClick={() => setIsSubmitModalOpen(true)}
          className="w-full h-14 gap-2 bg-gradient-primary hover:scale-[1.01] transition-all neon-glow-hover text-lg font-bold"
        >
          <Rocket size={20} />
          Create a Launch
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Total Launches</div>
          <div className="text-2xl font-bold gradient-text-launchos">{filteredAndSortedProjects.length}</div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Upcoming</div>
          <div className="text-2xl font-bold text-amber-400">
            {filteredAndSortedProjects.filter(p => p.status === 'upcoming').length}
          </div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Live Now</div>
          <div className="text-2xl font-bold text-green-400">
            {filteredAndSortedProjects.filter(p => p.status === 'live').length}
          </div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Avg Conviction</div>
          <div className="text-2xl font-bold text-launchos-cyan">
            {Math.round(filteredAndSortedProjects.reduce((sum, p) => sum + (p.beliefScore || 0), 0) / filteredAndSortedProjects.length || 0)}%
          </div>
        </div>
      </div>

      {/* Top Bar: Sort */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="text-sm text-white/60">
          Showing {filteredAndSortedProjects.length} {market === 'all' ? '' : market === 'icm' ? 'ICM' : 'CCM'} {filteredAndSortedProjects.length === 1 ? 'launch' : 'launches'}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-white/60" />
          <span className="text-sm text-white/60">Sort by:</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">🔥 Trending</SelectItem>
              <SelectItem value="new">🆕 Newest</SelectItem>
              <SelectItem value="votes">📈 Most Voted</SelectItem>
              <SelectItem value="belief">💎 Top Conviction</SelectItem>
              <SelectItem value="fdv">💰 FDV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredAndSortedProjects.map((project: Project) => (
          <ProjectCard key={project.id} {...project} onUpdateProject={handleUpdateProject} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProjects.length === 0 && (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/60 mb-2">No launches yet</p>
          <p className="text-sm text-white/40">Submit a project or switch filters.</p>
        </div>
      )}

      {/* Submit Launch Drawer */}
      <SubmitLaunchDrawer
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={(data) => {
          console.log('Launch submitted:', data)
          // TODO: Convert SubmitLaunchInput to Project and add to list
          setIsSubmitModalOpen(false)
        }}
      />

      {/* TODO: Add infinite scroll / pagination */}
      {/* TODO: Add search bar for filtering by title/creator */}
      {/* TODO: Connect to Supabase real-time subscriptions */}
      {/* TODO: Add skeleton loaders for loading states */}
    </div>
  );
}
