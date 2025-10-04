"use client"

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { sampleProjects } from '@/lib/sampleData';
import type { Project, ProjectType } from '@/types';
import { LayoutGrid, Filter } from 'lucide-react';

const TABS = ['All', 'Launch', 'Campaign', 'Raid', 'Prediction', 'Ad', 'Quest', 'Spotlight'] as const;
type Tab = typeof TABS[number];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filteredProjects = useMemo(() => {
    if (activeTab === 'All') return sampleProjects;
    return sampleProjects.filter(p => p.type === activeTab.toLowerCase() as ProjectType);
  }, [activeTab]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <LayoutGrid className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold gradient-text">Explore</h1>
        </div>
        <p className="text-white/60 text-lg">
          Discover launches, campaigns, raids, predictions, and more
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
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
                ({tab === 'All' ? sampleProjects.length : sampleProjects.filter(p => p.type === tab.toLowerCase()).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-white/60">
        Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project: Project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/60 mb-2">No {activeTab.toLowerCase()} projects found</p>
          <p className="text-sm text-white/40">Try selecting a different filter</p>
        </div>
      )}

      {/* TODO Comments */}
      {/* TODO: Add infinite scroll / pagination */}
      {/* TODO: Add search bar for filtering by title/creator */}
      {/* TODO: Add sort options (newest, most popular, ending soon) */}
      {/* TODO: Connect to Supabase real-time subscriptions */}
      {/* TODO: Add skeleton loaders for loading states */}
    </div>
  );
}
