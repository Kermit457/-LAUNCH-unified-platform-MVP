'use client'

import { useState, useEffect } from 'react'
import { Video, Loader2, Filter } from 'lucide-react'
import type { Clip } from '@/lib/appwrite/services/clips'
import { getClips } from '@/lib/appwrite/services/clips'
import { getUserProjects, type Launch } from '@/lib/appwrite/services/launches'
import { ClipReviewCard } from './ClipReviewCard'

interface PendingClipsSectionProps {
  userId: string
  preSelectedProjectId?: string // From URL query param
}

export function PendingClipsSection({ userId, preSelectedProjectId }: PendingClipsSectionProps) {
  const [pendingClips, setPendingClips] = useState<Clip[]>([])
  const [ownedProjects, setOwnedProjects] = useState<Launch[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Load owned projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const projects = await getUserProjects(userId)
        setOwnedProjects(projects)

        // Set pre-selected project if provided
        if (preSelectedProjectId && projects.some(p => p.launchId === preSelectedProjectId)) {
          setSelectedProjectId(preSelectedProjectId)
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
      }
    }
    loadProjects()
  }, [userId, preSelectedProjectId])

  // Load pending clips for owned projects
  useEffect(() => {
    async function loadPendingClips() {
      setIsLoading(true)
      try {
        if (ownedProjects.length === 0) {
          setPendingClips([])
          return
        }

        // Get clips for selected project or all projects
        const projectIdsToFetch = selectedProjectId === 'all'
          ? ownedProjects.map(p => p.launchId)
          : [selectedProjectId]

        // Fetch pending clips for each project
        const clipsPromises = projectIdsToFetch.map(projectId =>
          getClips({
            status: 'pending',
            // Note: Need to add projectId filter to getClips if not exists
            limit: 100
          })
        )

        const clipsArrays = await Promise.all(clipsPromises)
        const allClips = clipsArrays.flat()

        // Filter by projectId on client side (until backend supports it)
        const filtered = allClips.filter(clip => {
          if (selectedProjectId === 'all') {
            return ownedProjects.some(p => p.launchId === clip.projectId)
          }
          return clip.projectId === selectedProjectId
        })

        // Sort by most recent first
        filtered.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())

        setPendingClips(filtered)
      } catch (error) {
        console.error('Failed to load pending clips:', error)
        setPendingClips([])
      } finally {
        setIsLoading(false)
      }
    }

    if (ownedProjects.length > 0) {
      loadPendingClips()
    } else {
      setIsLoading(false)
    }
  }, [ownedProjects, selectedProjectId])

  const handleClipReviewed = (clipId: string) => {
    setPendingClips(prev => prev.filter(c => c.$id !== clipId))
  }

  if (ownedProjects.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <Video className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
        <p className="text-neutral-400 text-sm mb-6">
          Create a project to start receiving clip submissions
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Filter */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-[#D1FD0A]" />
            Pending Clip Reviews
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            {pendingClips.length} {pendingClips.length === 1 ? 'clip' : 'clips'} awaiting approval
          </p>
        </div>

        {/* Project Filter */}
        {ownedProjects.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#D1FD0A]"
            >
              <option value="all">All Projects ({ownedProjects.length})</option>
              {ownedProjects.map((project) => (
                <option key={project.launchId} value={project.launchId}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#D1FD0A] animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pendingClips.length === 0 && (
        <div className="text-center py-12 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <Video className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">All Caught Up!</h3>
          <p className="text-neutral-400 text-sm">
            No pending clips to review
            {selectedProjectId !== 'all' && ' for this project'}
          </p>
        </div>
      )}

      {/* Clips List */}
      {!isLoading && pendingClips.length > 0 && (
        <div className="space-y-3">
          {pendingClips.map((clip) => (
            <ClipReviewCard
              key={clip.$id}
              clip={clip}
              userId={userId}
              onApprove={() => handleClipReviewed(clip.$id)}
              onReject={() => handleClipReviewed(clip.$id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
