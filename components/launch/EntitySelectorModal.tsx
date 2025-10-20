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
  userProfile?: {
    id: string
    name: string
    username?: string
    avatar?: string
  } | null
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

  // Handle missing userProfile
  if (!userProfile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-design-zinc-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-design-zinc-800">
          <p className="text-white text-center">Loading profile...</p>
        </div>
      </div>
    )
  }

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
        <div className="relative w-full max-w-md bg-design-zinc-950/95 backdrop-blur-xl rounded-2xl border border-design-zinc-800 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-design-zinc-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-design-purple-400" />
                Launch this as...
              </h2>
              <p className="text-sm text-design-zinc-400 mt-1">Choose who will own this launch</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-design-zinc-800/50 transition-colors"
            >
              <X className="w-5 h-5 text-design-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* User Profile Option */}
            <button
              onClick={handleSelectUser}
              onMouseEnter={() => setHoveredId('user')}
              onMouseLeave={() => setHoveredId(null)}
              className="w-full p-4 rounded-xl bg-design-zinc-900/50 hover:bg-design-purple-500/10 border border-design-zinc-800 hover:border-design-purple-500/30 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-design-purple-500/30 group-hover:border-design-purple-400 transition-colors"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-design-pink-500 to-design-purple-500 flex items-center justify-center border-2 border-design-purple-500/30 group-hover:border-design-purple-400 transition-colors">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{userProfile.name}</span>
                  </div>
                  {userProfile.username && (
                    <p className="text-sm text-design-zinc-400">@{userProfile.username}</p>
                  )}
                  <p className="text-xs text-design-purple-400 mt-1">Launch as yourself</p>
                </div>

                {/* Indicator */}
                {hoveredId === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-design-purple-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-design-purple-500" />
                  </div>
                )}
              </div>
            </button>

            {/* Projects Section */}
            {projects.length > 0 && (
              <>
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-design-zinc-800" />
                  <span className="text-xs font-medium text-design-zinc-500 uppercase tracking-wider">
                    Or launch as project
                  </span>
                  <div className="h-px flex-1 bg-design-zinc-800" />
                </div>

                {/* Project Options */}
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="w-full p-4 rounded-xl bg-design-zinc-900/50 hover:bg-design-purple-500/10 border border-design-zinc-800 hover:border-design-purple-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Project Logo */}
                      {project.logoUrl ? (
                        <img
                          src={project.logoUrl}
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-design-purple-500/30 group-hover:border-design-purple-400 transition-colors"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-design-purple-500 to-design-pink-500 flex items-center justify-center border-2 border-design-purple-500/30 group-hover:border-design-purple-400 transition-colors">
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
                                ? 'bg-design-purple-500/20 text-design-purple-300 border border-design-purple-500/40'
                                : 'bg-design-pink-500/20 text-design-pink-300 border border-design-pink-500/40'
                            }`}
                          >
                            {project.scope}
                          </span>
                        </div>
                        <p className="text-xs text-design-purple-400 mt-1">Launch under this project</p>
                      </div>

                      {/* Indicator */}
                      {hoveredId === project.id && (
                        <div className="w-8 h-8 rounded-full bg-design-purple-500/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-design-purple-500" />
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
                className="w-full p-4 rounded-xl bg-design-zinc-900/50 hover:bg-design-purple-500/10 border border-dashed border-design-zinc-700 hover:border-design-purple-500/40 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-design-purple-500/20 to-design-pink-500/20 flex items-center justify-center border-2 border-design-purple-500/30 group-hover:border-design-purple-400 transition-colors">
                    <Plus className="w-6 h-6 text-design-purple-400" />
                  </div>

                  <div className="flex-1">
                    <span className="text-white font-semibold">Create New Project</span>
                    <p className="text-xs text-design-purple-400 mt-1">
                      Start a new project and launch under it
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-design-zinc-800 bg-design-zinc-900/50">
            <p className="text-xs text-design-zinc-500 text-center">
              You can manage project members after launch creation
            </p>
          </div>
        </div>
      </div>
    </>
  )
}