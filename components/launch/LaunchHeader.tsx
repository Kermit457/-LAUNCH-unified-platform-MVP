"use client"

import { useState } from 'react'
import { Search, Rocket } from 'lucide-react'

interface LaunchHeaderProps {
  onSearch?: (query: string) => void
}

export function LaunchHeader({ onSearch }: LaunchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-zinc-900">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Logo + Title - Mobile Optimized */}
          <div className="flex items-center gap-2 min-w-fit flex-shrink-0">
            <div className="p-2 md:p-2 rounded-lg bg-gradient-to-br from-[#00FF88] to-[#00FFFF]">
              <Rocket className="w-5 h-5 md:w-5 md:h-5 text-black" />
            </div>
            <h1 className="text-base md:text-xl font-black text-gradient-main hidden sm:block">
              ICMX Launch
            </h1>
          </div>

          {/* Search Bar - Mobile Optimized */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 md:pl-10 pr-4 py-3 min-h-[48px] bg-zinc-900/50 border border-zinc-800 rounded-xl text-base
                placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/20
                focus:border-[#00FF88]/30 transition-all"
              aria-label="Search projects"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
