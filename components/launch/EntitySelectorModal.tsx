'use client'

import { useState } from 'react'
import { User, Rocket, Plus, X } from 'lucide-react'

export interface EntityOption {
  type: 'user' | 'project'
  id: string
  name: string
  avatar?: string
  scope?: 'ICM' | 'CCM'
}

interface EntitySelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (entity: EntityOption) => void
  onCreateNewProject?: () => void
  userProfile: {
    id: string
    name: string
    username?: string
    avatar?: string
  }
  projects: Array<{
    id: string
    title: string
    logoUrl?: string
    scope: 'ICM' | 'CCM'
  }>
}

export function EntitySelectorModal({
  isOpen,
  onClose,
  onSelect,
  onCreateNewProject,
  userProfile,
  projects = []
}: EntitySelectorModalProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelectUser = () => {
    onSelect({
      type: 'user',
      id: userProfile.id,
      name: userProfile.name,
      avatar: userProfile.avatar
    })
  }

  const handleSelectProject = (project: typeof projects[0]) => {
    onSelect({
      type: 'project',
      id: project.id,
      name: project.title,
      avatar: project.logoUrl,
      scope: project.scope
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#0B0F1A] rounded-2xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-fuchsia-400" />
                Launch this as...
              </h2>
              <p className="text-sm text-white/60 mt-1">Choose who will own this launch</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* User Profile Option */}
            <button
              onClick={handleSelectUser}
              onMouseEnter={() => setHoveredId('user')}
              onMouseLeave={() => setHoveredId(null)}
              className="w-full p-4 rounded-xl bg-white/5 hover:bg-fuchsia-500/10 border border-white/10 hover:border-fuchsia-500/30 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-fuchsia-500/30 group-hover:border-fuchsia-400 transition-colors"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center border-2 border-fuchsia-500/30 group-hover:border-fuchsia-400 transition-colors">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{userProfile.name}</span>
                  </div>
                  {userProfile.username && (
                    <p className="text-sm text-white/60">@{userProfile.username}</p>
                  )}
                  <p className="text-xs text-fuchsia-400 mt-1">Launch as yourself</p>
                </div>

                {/* Indicator */}
                {hoveredId === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-fuchsia-500" />
                  </div>
                )}
              </div>
            </button>

            {/* Projects Section */}
            {projects.length > 0 && (
              <>
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Or launch as project
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Project Options */}
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="w-full p-4 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Project Logo */}
                      {project.logoUrl ? (
                        <img
                          src={project.logoUrl}
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
                          <Rocket className="w-6 h-6 text-white" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{project.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              project.scope === 'ICM'
                                ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            }`}
                          >
                            {project.scope}
                          </span>
                        </div>
                        <p className="text-xs text-cyan-400 mt-1">Launch under this project</p>
                      </div>

                      {/* Indicator */}
                      {hoveredId === project.id && (
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-cyan-500" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Create New Project Option */}
            {onCreateNewProject && (
              <button
                onClick={onCreateNewProject}
                className="w-full p-4 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-dashed border-white/20 hover:border-purple-500/40 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-purple-500/30 group-hover:border-purple-400 transition-colors">
                    <Plus className="w-6 h-6 text-purple-400" />
                  </div>

                  <div className="flex-1">
                    <span className="text-white font-semibold">Create New Project</span>
                    <p className="text-xs text-purple-400 mt-1">
                      Start a new project and launch under it
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <p className="text-xs text-white/50 text-center">
              You can manage project members after launch creation
            </p>
          </div>
        </div>
      </div>
    </>
  )
}