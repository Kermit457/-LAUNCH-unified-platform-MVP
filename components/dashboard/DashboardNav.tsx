'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import {
  LayoutDashboard,
  User,
  Network,
  DollarSign,
  Megaphone,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react'

export type DashboardSection =
  | 'overview'
  | 'profile'
  | 'network'
  | 'earnings'
  | 'campaigns'
  | 'submissions'
  | 'analytics'
  | 'settings'

interface DashboardNavProps {
  activeSection: DashboardSection
  onSectionChange: (section: DashboardSection) => void
}

const navItems = [
  { id: 'overview' as DashboardSection, label: 'Overview', icon: LayoutDashboard },
  { id: 'profile' as DashboardSection, label: 'Profile', icon: User },
  { id: 'network' as DashboardSection, label: 'Network', icon: Network },
  { id: 'earnings' as DashboardSection, label: 'Earnings', icon: DollarSign },
  { id: 'campaigns' as DashboardSection, label: 'Campaigns', icon: Megaphone },
  { id: 'submissions' as DashboardSection, label: 'Submissions', icon: FileText },
  { id: 'analytics' as DashboardSection, label: 'Analytics', icon: BarChart3 },
  { id: 'settings' as DashboardSection, label: 'Settings', icon: Settings },
]

export function DashboardNav({ activeSection, onSectionChange }: DashboardNavProps) {
  return (
    <nav className="mb-6">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 text-white shadow-lg shadow-lime-500/20'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Mobile Navigation - Dropdown */}
      <div className="md:hidden">
        <select
          value={activeSection}
          onChange={(e) => onSectionChange(e.target.value as DashboardSection)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-lime-400"
        >
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  )
}
