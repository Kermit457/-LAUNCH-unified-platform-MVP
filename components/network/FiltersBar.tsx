"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
}

const skillOptions: FilterOption[] = [
  { label: 'Solana', value: 'solana' },
  { label: 'Rust', value: 'rust' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'UI/UX', value: 'uiux' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'DeFi', value: 'defi' },
  { label: 'NFTs', value: 'nfts' },
  { label: 'Smart Contracts', value: 'smart-contracts' },
  { label: 'Community', value: 'community' }
]

const chainOptions: FilterOption[] = [
  { label: 'Solana', value: 'solana' },
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Polygon', value: 'polygon' },
  { label: 'Arbitrum', value: 'arbitrum' },
  { label: 'Base', value: 'base' }
]

const categoryOptions: FilterOption[] = [
  { label: 'DeFi', value: 'defi' },
  { label: 'NFT', value: 'nft' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Social', value: 'social' },
  { label: 'Infrastructure', value: 'infra' },
  { label: 'Meme', value: 'meme' }
]

const regionOptions: FilterOption[] = [
  { label: 'North America', value: 'na' },
  { label: 'Europe', value: 'eu' },
  { label: 'Asia', value: 'asia' },
  { label: 'Latin America', value: 'latam' },
  { label: 'Remote', value: 'remote' }
]

const sortOptions: FilterOption[] = [
  { label: 'Most Active', value: 'active' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most XP', value: 'xp' },
  { label: 'Most Invites', value: 'invites' },
  { label: 'Top Earners', value: 'earnings' }
]

interface MultiSelectProps {
  label: string
  options: FilterOption[]
  selected: string[]
  onChange: (values: string[]) => void
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors flex items-center justify-between text-sm text-white"
      >
        <span className="text-zinc-400 text-xs">{label}</span>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-[#D1FD0A] text-white text-xs font-bold">
              {selected.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar"
        >
          {/* Clear All */}
          {selected.length > 0 && (
            <button
              onClick={clearAll}
              className="w-full px-2 py-1.5 rounded-md text-xs text-[#FF0040] hover:bg-zinc-800 transition-colors text-left mb-2"
            >
              Clear all
            </button>
          )}

          {/* Options */}
          {options.map((option) => {
            const isSelected = selected.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`
                  w-full px-2 py-1.5 rounded-md text-xs text-left transition-colors
                  ${isSelected
                    ? 'bg-[#D1FD0A]/20 text-white font-bold'
                    : 'text-zinc-300 hover:bg-zinc-800'
                  }
                `}
              >
                {option.label}
              </button>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

interface SingleSelectProps {
  label: string
  options: FilterOption[]
  selected: string
  onChange: (value: string) => void
}

function SingleSelect({ label, options, selected, onChange }: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedLabel = options.find(o => o.value === selected)?.label || label

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors flex items-center justify-between text-sm text-white"
      >
        <span className={selected ? 'text-white' : 'text-zinc-400 text-xs'}>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl z-50"
        >
          {options.map((option) => {
            const isSelected = selected === option.value
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`
                  w-full px-2 py-1.5 rounded-md text-xs text-left transition-colors
                  ${isSelected
                    ? 'bg-[#D1FD0A]/20 text-white font-bold'
                    : 'text-zinc-300 hover:bg-zinc-800'
                  }
                `}
              >
                {option.label}
              </button>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export function FiltersBar() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('active')

  const hasActiveFilters = selectedSkills.length > 0 || selectedChains.length > 0 || selectedCategories.length > 0 || selectedRegions.length > 0

  const clearAllFilters = () => {
    setSelectedSkills([])
    setSelectedChains([])
    setSelectedCategories([])
    setSelectedRegions([])
    setSortBy('active')
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#FF0040] hover:text-[#FF1050] font-bold transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {/* Sort By */}
          <SingleSelect
            label="Sort by"
            options={sortOptions}
            selected={sortBy}
            onChange={setSortBy}
          />

          {/* Skills */}
          <MultiSelect
            label="Skills"
            options={skillOptions}
            selected={selectedSkills}
            onChange={setSelectedSkills}
          />

          {/* Chains */}
          <MultiSelect
            label="Chains"
            options={chainOptions}
            selected={selectedChains}
            onChange={setSelectedChains}
          />

          {/* Categories */}
          <MultiSelect
            label="Categories"
            options={categoryOptions}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />

          {/* Regions */}
          <MultiSelect
            label="Region"
            options={regionOptions}
            selected={selectedRegions}
            onChange={setSelectedRegions}
          />

          {/* Additional Toggles */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-[#D1FD0A] focus:ring-[#D1FD0A]/50"
              />
              Verified only
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-[#D1FD0A] focus:ring-[#D1FD0A]/50"
              />
              Online now
            </label>
          </div>
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedSkills.map(skill => (
              <span
                key={skill}
                className="px-2 py-1 rounded-md bg-[#D1FD0A]/20 border border-[#D1FD0A]/40 text-[#D1FD0A] text-xs font-bold flex items-center gap-1"
              >
                {skillOptions.find(o => o.value === skill)?.label}
                <button onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedChains.map(chain => (
              <span
                key={chain}
                className="px-2 py-1 rounded-md bg-[#00FFFF]/20 border border-[#00FFFF]/40 text-[#00FFFF] text-xs font-bold flex items-center gap-1"
              >
                {chainOptions.find(o => o.value === chain)?.label}
                <button onClick={() => setSelectedChains(selectedChains.filter(c => c !== chain))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedCategories.map(cat => (
              <span
                key={cat}
                className="px-2 py-1 rounded-md bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFD700] text-xs font-bold flex items-center gap-1"
              >
                {categoryOptions.find(o => o.value === cat)?.label}
                <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedRegions.map(region => (
              <span
                key={region}
                className="px-2 py-1 rounded-md bg-[#00FF88]/20 border border-[#00FF88]/40 text-[#00FF88] text-xs font-bold flex items-center gap-1"
              >
                {regionOptions.find(o => o.value === region)?.label}
                <button onClick={() => setSelectedRegions(selectedRegions.filter(r => r !== region))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
