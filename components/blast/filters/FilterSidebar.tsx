/**
 * FilterSidebar - BTDemo design
 */

'use client'

import { ROOM_TYPES, ROOM_TAGS } from '@/lib/constants/blast'
import type { RoomFilters } from '@/lib/types/blast'
import { cn } from '@/lib/utils'
import {
  IconMenu,
  IconCash,
  IconGem,
  IconComputer,
  IconNetwork,
  IconRocket,
  IconLab,
  IconAttention,
  IconFreeze
} from '@/lib/icons'

interface FilterSidebarProps {
  filters: RoomFilters
  onFiltersChange: (filters: RoomFilters) => void
  className?: string
}

const ROOM_TYPE_ICONS: Record<string, any> = {
  deal: IconCash,
  airdrop: IconGem,
  job: IconComputer,
  collab: IconNetwork,
  funding: IconRocket
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  className
}: FilterSidebarProps) {
  const updateFilter = (key: keyof RoomFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const activeFilterCount = [
    filters.type ? 1 : 0,
    filters.tags?.length || 0,
    filters.status ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconMenu className="icon-primary" size={24} />
          <h2 className="section-heading">Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <div className="badge-primary">
            <span className="font-led-dot">{activeFilterCount}</span>
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div>
        <label className="stat-label mb-3 block">
          TYPE
        </label>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('type', undefined)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
              !filters.type
                ? 'glass-premium border border-primary text-primary'
                : 'glass-interactive text-zinc-400 hover:text-primary'
            )}
          >
            <span>All Types</span>
          </button>

          {Object.entries(ROOM_TYPES).map(([key, config]) => {
            const IconComponent = ROOM_TYPE_ICONS[key]
            return (
              <button
                key={key}
                onClick={() => updateFilter('type', key)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                  filters.type === key
                    ? 'glass-premium border border-primary text-primary'
                    : 'glass-interactive text-zinc-400 hover:text-primary'
                )}
              >
                {IconComponent && <IconComponent size={16} />}
                <span>{config.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="stat-label mb-3 block">
          TAGS
        </label>
        <div className="flex flex-wrap gap-2">
          {ROOM_TAGS.industries.slice(0, 10).map(tag => {
            const isSelected = filters.tags?.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => {
                  const currentTags = filters.tags || []
                  const newTags = isSelected
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag]
                  updateFilter('tags', newTags.length > 0 ? newTags : undefined)
                }}
                className={cn(
                  'px-3 py-1 text-xs rounded-full transition-all',
                  isSelected
                    ? 'badge-primary'
                    : 'glass-interactive text-zinc-400 hover:text-primary border border-zinc-800'
                )}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="stat-label mb-3 block">
          STATUS
        </label>
        <div className="space-y-2">
          {[
            { key: 'open', label: 'Open', Icon: IconRocket },
            { key: 'hot', label: 'Hot', Icon: IconLab },
            { key: 'closing', label: 'Closing Soon', Icon: IconAttention }
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() =>
                updateFilter('status', filters.status === key ? undefined : key)
              }
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                filters.status === key
                  ? 'glass-premium border border-primary text-primary'
                  : 'glass-interactive text-zinc-400 hover:text-primary'
              )}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.type || filters.tags?.length || filters.status) && (
        <button
          onClick={() => onFiltersChange({})}
          className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <IconFreeze size={16} />
          <span>Clear all filters</span>
        </button>
      )}
    </div>
  )
}
