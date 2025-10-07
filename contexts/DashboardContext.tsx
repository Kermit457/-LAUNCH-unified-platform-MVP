'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { getUserProjects } from '@/lib/appwrite/services/launches'

export type DashboardMode = 'user' | 'project'

export interface DashboardScope {
  mode: DashboardMode
  scopeId: string // userId for user mode, projectId for project mode
  displayName?: string
  avatar?: string
  scope?: 'ICM' | 'CCM'
}

export interface LinkedProject {
  id: string
  title: string
  logoUrl?: string
  scope: 'ICM' | 'CCM'
}

interface DashboardContextType {
  currentScope: DashboardScope
  linkedProjects: LinkedProject[]
  switchScope: (mode: DashboardMode, projectId?: string) => void
  isLoading: boolean
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { userId } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentScope, setCurrentScope] = useState<DashboardScope>({
    mode: 'user',
    scopeId: userId || '',
  })
  const [linkedProjects, setLinkedProjects] = useState<LinkedProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user's projects on mount
  useEffect(() => {
    async function fetchProjects() {
      if (!userId) return

      try {
        setIsLoading(true)
        const projects = await getUserProjects(userId)
        const projectList: LinkedProject[] = projects.map(p => ({
          id: p.$id,
          title: p.tokenName,
          logoUrl: p.tokenImage,
          scope: 'ICM' as 'ICM' | 'CCM', // TODO: Add scope field to schema
        }))
        setLinkedProjects(projectList)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [userId])

  // Handle URL query parameters on mount
  useEffect(() => {
    if (!userId) return

    const modeParam = searchParams?.get('mode') as DashboardMode | null
    const projectIdParam = searchParams?.get('projectId')

    if (modeParam === 'project' && projectIdParam) {
      // Find project in linked projects
      const project = linkedProjects.find(p => p.id === projectIdParam)
      if (project) {
        setCurrentScope({
          mode: 'project',
          scopeId: projectIdParam,
          displayName: project.title,
          avatar: project.logoUrl,
          scope: project.scope,
        })
      }
    } else if (modeParam === 'user' || !modeParam) {
      setCurrentScope({
        mode: 'user',
        scopeId: userId,
      })
    }
  }, [userId, searchParams, linkedProjects])

  // Switch scope function
  const switchScope = (mode: DashboardMode, projectId?: string) => {
    if (mode === 'user') {
      setCurrentScope({
        mode: 'user',
        scopeId: userId || '',
      })
      router.push('/dashboard?mode=user')
    } else if (mode === 'project' && projectId) {
      const project = linkedProjects.find(p => p.id === projectId)
      if (project) {
        setCurrentScope({
          mode: 'project',
          scopeId: projectId,
          displayName: project.title,
          avatar: project.logoUrl,
          scope: project.scope,
        })
        router.push(`/dashboard?mode=project&projectId=${projectId}`)
      }
    }
  }

  return (
    <DashboardContext.Provider value={{ currentScope, linkedProjects, switchScope, isLoading }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}