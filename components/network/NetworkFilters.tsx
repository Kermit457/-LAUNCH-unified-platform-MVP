"use client"

import { useState } from 'react'
import { Filter, SlidersHorizontal, TrendingUp, Users, Award, X } from 'lucide-react'

export interface FilterState {
  connectionStatus: 'all' | 'connected' | 'not_connected'
  roles: string[]
  sortBy: 'contribution' | 'mutuals' | 'recent' | 'recommended'
}

interface NetworkFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

const AVAILABLE_ROLES = [
  'Creator',
  'Trader',
  'Developer',
  'Moderator',
  'Advertiser',
  'Community Manager'
]

export function NetworkFilters({ onFilterChange }: NetworkFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    connectionStatus: 'all',
    roles: [],
    sortBy: 'recommended'
  })

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleRole = (role: string) => {
    const newRoles = filters.roles.includes(role)
      ? filters.roles.filter(r => r !== role)
      : [...filters.roles, role]
    handleFilterUpdate({ roles: newRoles })
  }

  const clearFilters = () => {
    const resetFilters: FilterState = {
      connectionStatus: 'all',
      roles: [],
      sortBy: 'recommended'
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const activeFiltersCount =
    (filters.connectionStatus !== 'all' ? 1 : 0) +
    filters.roles.length +
    (filters.sortBy !== 'recommended' ? 1 : 0)

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-500/30 transition-all text-white"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-semibold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 rounded-2xl bg-zinc-900/95 border border-white/10 backdrop-blur-xl p-6 shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-fuchsia-400" />
              Filter Network
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Sort By</label>
            <div className="space-y-2">
              {[
                { value: 'recommended', label: 'Recommended', icon: Award },
                { value: 'contribution', label: 'Highest Contribution', icon: TrendingUp },
                { value: 'mutuals', label: 'Most Mutuals', icon: Users },
                { value: 'recent', label: 'Recent Activity', icon: Filter }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleFilterUpdate({ sortBy: value as FilterState['sortBy'] })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    filters.sortBy === value
                      ? 'bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300'
                      : 'bg-white/5 border border-transparent text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Connection Status</label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'connected', label: 'Connected' },
                { value: 'not_connected', label: 'Not Connected' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFilterUpdate({ connectionStatus: value as FilterState['connectionStatus'] })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.connectionStatus === value
                      ? 'bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300'
                      : 'bg-white/5 border border-transparent text-white/70 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Roles</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.roles.includes(role)
                      ? 'bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm font-medium transition-all"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
