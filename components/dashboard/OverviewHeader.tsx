'use client'

import { Share2, ChevronDown, User, Rocket } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export type DashboardMode = 'user' | 'project'

export interface LinkedProject {
  id: string
  title: string
  logoUrl?: string
  scope: 'ICM' | 'CCM'
}

interface OverviewHeaderProps {
  handle: string
  name: string
  roles: string[]
  verified?: boolean
  walletAddress: string
  avatar?: string
  mode: DashboardMode
  selectedProject?: LinkedProject | null
  linkedProjects?: LinkedProject[]
  onModeChange: (mode: DashboardMode, project?: LinkedProject) => void
}

export function OverviewHeader({
  handle,
  name,
  roles,
  verified,
  walletAddress,
  avatar,
  mode,
  selectedProject,
  linkedProjects = [],
  onModeChange
}: OverviewHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const shortAddr = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayName = mode === 'project' && selectedProject ? selectedProject.title : name
  const displayAvatar = mode === 'project' && selectedProject?.logoUrl ? selectedProject.logoUrl : avatar

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 mb-6 relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Main Avatar with Quick Switcher Bubbles */}
          <div className="relative">
            {/* Large Avatar - Current Active Entity */}
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Small Avatar Bubbles for Quick Switching - Only show OTHER entities */}
            {mode === 'project' && linkedProjects.length > 0 ? (
              // In project mode: show user bubble + other project bubbles
              <div className="absolute -bottom-1 -right-1 flex -space-x-2">
                {/* User bubble */}
                <button
                  onClick={() => onModeChange('user')}
                  className="w-7 h-7 rounded-full border-2 border-[#0B0F1A] hover:scale-110 transition-transform bg-white/10 backdrop-blur overflow-hidden shadow-lg"
                  title={`Switch to ${name}`}
                >
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>

                {/* Other project bubbles (excluding current) */}
                {linkedProjects
                  .filter(p => p.id !== selectedProject?.id)
                  .slice(0, 2)
                  .map((project) => (
                    <button
                      key={project.id}
                      onClick={() => onModeChange('project', project)}
                      className="w-7 h-7 rounded-full border-2 border-[#0B0F1A] hover:scale-110 transition-transform bg-white/10 backdrop-blur overflow-hidden shadow-lg"
                      title={`Switch to ${project.title}`}
                    >
                      {project.logoUrl ? (
                        <img src={project.logoUrl} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                          <Rocket className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}

                {linkedProjects.filter(p => p.id !== selectedProject?.id).length > 2 && (
                  <button
                    onClick={() => setDropdownOpen(true)}
                    className="w-7 h-7 rounded-full border-2 border-[#0B0F1A] bg-white/10 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    title="View all accounts"
                  >
                    <span className="text-[10px] font-bold text-white">
                      +{linkedProjects.filter(p => p.id !== selectedProject?.id).length - 2}
                    </span>
                  </button>
                )}
              </div>
            ) : mode === 'user' && linkedProjects.length > 0 ? (
              // In user mode: show project bubbles only
              <div className="absolute -bottom-1 -right-1 flex -space-x-2">
                {linkedProjects.slice(0, 3).map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onModeChange('project', project)}
                    className="w-7 h-7 rounded-full border-2 border-[#0B0F1A] hover:scale-110 transition-transform bg-white/10 backdrop-blur overflow-hidden shadow-lg"
                    title={`Switch to ${project.title}`}
                  >
                    {project.logoUrl ? (
                      <img src={project.logoUrl} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                        <Rocket className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}

                {linkedProjects.length > 3 && (
                  <button
                    onClick={() => setDropdownOpen(true)}
                    className="w-7 h-7 rounded-full border-2 border-[#0B0F1A] bg-white/10 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    title="View all projects"
                  >
                    <span className="text-[10px] font-bold text-white">+{linkedProjects.length - 3}</span>
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {/* Info - Profile Preview */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-white">{mode === 'project' ? displayName : handle}</h1>
              {verified && (
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {mode === 'project' && selectedProject && (
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedProject.scope === 'ICM'
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {selectedProject.scope}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {mode === 'user' && roles.map((role, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                >
                  {role}
                </span>
              ))}
              {mode === 'project' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Project Dashboard
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mode Selector + Actions */}
        <div className="flex items-center gap-3">
          {/* Mode Dropdown - Prominent Design */}
          <div className="relative z-[100]" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-2 w-64 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-cyan-500/10 hover:from-fuchsia-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 border border-fuchsia-500/30 hover:border-fuchsia-400/50 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400 shadow-lg shadow-fuchsia-500/20"
            >
              <div className="flex items-center gap-2">
                {mode === 'user' ? (
                  <>
                    <User className="w-5 h-5 text-fuchsia-400" />
                    <span className="text-sm font-bold text-white">User Mode</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold text-white">Project Mode</span>
                  </>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-fuchsia-400 transition-transform ml-auto ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0B0F1A] border border-fuchsia-500/20 shadow-2xl shadow-fuchsia-500/20 backdrop-blur-xl z-[100] overflow-hidden">
                {/* User Mode Option */}
                <button
                  onClick={() => {
                    onModeChange('user')
                    setDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-all flex items-center gap-3 ${
                    mode === 'user' ? 'bg-fuchsia-500/10 border-l-2 border-fuchsia-400' : ''
                  }`}
                >
                  <User className="w-5 h-5 text-fuchsia-400" />
                  <div>
                    <div className="text-sm font-medium text-white">User Dashboard</div>
                    <div className="text-xs text-white/50">Campaigns & Earnings</div>
                  </div>
                </button>

                {/* Divider */}
                {linkedProjects.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/10">
                    <div className="text-xs font-medium text-white/50">Your Projects</div>
                  </div>
                )}

                {/* Project Options */}
                {linkedProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onModeChange('project', project)
                      setDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-all flex items-center gap-3 ${
                      mode === 'project' && selectedProject?.id === project.id ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                    }`}
                  >
                    {project.logoUrl ? (
                      <img src={project.logoUrl} alt={project.title} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white truncate">{project.title}</div>
                      <div className="text-xs text-white/50">{project.scope} Project</div>
                    </div>
                  </button>
                ))}

                {linkedProjects.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-white/50 mb-2">No projects yet</p>
                    <p className="text-xs text-white/40">Create a launch to access Project Mode</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
            aria-label="Share profile"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subline */}
      <p className="text-sm text-white/60">
        {mode === 'user' ? (
          <>Manage campaigns, earnings, and reviews. Solana wallet: <span className="font-mono text-white/80">{shortAddr}</span></>
        ) : (
          <>Monitor token metrics, treasury, and community conviction for your project</>
        )}
      </p>
    </div>
  )
}
