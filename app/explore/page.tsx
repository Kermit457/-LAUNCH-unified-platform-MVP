"use client"

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { SubmitLaunchModal } from '@/components/SubmitLaunchModal';
import { sampleProjects, sortProjects } from '@/lib/sampleData';
import type { Project, ProjectType } from '@/types';
import { LayoutGrid, Filter, Rocket, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';

const TABS = ['All', 'Launch', 'Campaign', 'Raid', 'Prediction', 'Ad', 'Quest', 'Spotlight'] as const;
type Tab = typeof TABS[number];
type SortOption = 'trending' | 'new' | 'votes' | 'ending';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const { success } = useToast();

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;
    if (activeTab !== 'All') {
      filtered = projects.filter(p => p.type === activeTab.toLowerCase() as ProjectType);
    }
    return sortProjects(filtered, sortBy);
  }, [projects, activeTab, sortBy]);

  const handleSubmitProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    success('Project submitted! 🚀', 'Your project is now live on the Explore page');
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev =>
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold gradient-text">Explore</h1>
          </div>
          <Button
            onClick={() => setIsSubmitModalOpen(true)}
            className="gap-2"
          >
            <Rocket size={16} />
            Submit Project
          </Button>
        </div>
        <p className="text-white/60 text-lg">
          Discover launches, campaigns, raids, predictions, and more
        </p>
      </div>

      {/* Top Bar: Filter + Sort */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        {/* Filter Tabs */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-white/60" />
            <span className="text-sm text-white/60">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                {tab}
                <span className="ml-2 text-xs opacity-70">
                  ({tab === 'All' ? projects.length : projects.filter(p => p.type === tab.toLowerCase()).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-white/60" />
          <span className="text-sm text-white/60">Sort by:</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">🔥 Trending</SelectItem>
              <SelectItem value="new">🆕 Newest</SelectItem>
              <SelectItem value="votes">📈 Most Voted</SelectItem>
              <SelectItem value="ending">⏰ Ending Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-white/60">
        Showing {filteredAndSortedProjects.length} {filteredAndSortedProjects.length === 1 ? 'project' : 'projects'}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <p className="text-white/60 mb-2">No {activeTab.toLowerCase()} projects found</p>
          <p className="text-sm text-white/40">Try selecting a different filter</p>
        </div>
      )}

      {/* Submit Launch Modal */}
      <SubmitLaunchModal
        open={isSubmitModalOpen}
        onOpenChange={setIsSubmitModalOpen}
        onSubmit={handleSubmitProject}
      />

      {/* TODO: Add infinite scroll / pagination */}
      {/* TODO: Add search bar for filtering by title/creator */}
      {/* TODO: Connect to Supabase real-time subscriptions */}
      {/* TODO: Add skeleton loaders for loading states */}
    </div>
  );
}
