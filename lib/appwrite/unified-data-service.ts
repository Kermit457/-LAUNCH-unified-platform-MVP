/**
 * Unified Data Service - Complete Appwrite integration
 * Handles all data persistence and retrieval for the platform
 */

import { Client, Databases, Storage, Query, ID } from 'appwrite'
import { getPriceService } from '@/lib/solana/price-service'

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

const databases = new Databases(client)
const storage = new Storage(client)

// Database and Collection IDs
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const COLLECTIONS = {
  PROJECTS: 'projects',
  CLIPS: 'clips',
  USERS: 'users',
  CONTRIBUTORS: 'contributors',
  VOTES: 'votes',
  HOLDERS: 'holders',
  SOCIAL_LINKS: 'social_links'
}

export interface ProjectData {
  id: string
  type: 'icm' | 'ccm' | 'meme'
  title: string
  subtitle?: string
  logoUrl?: string
  ticker?: string
  status: 'live' | 'active' | 'ended' | 'frozen' | 'launched'
  beliefScore: number
  upvotes: number

  // Blockchain data
  mintAddress?: string
  contractPrice?: number
  keyHolders?: string[]
  totalSupply?: number

  // Social links
  websiteUrl?: string
  twitterUrl?: string
  telegramUrl?: string
  githubUrl?: string

  // Creator info
  creatorId: string
  creatorName?: string
  creatorAvatar?: string
  creatorTwitter?: string

  // Metadata
  isExperimental?: boolean
  createdAt: string
  updatedAt: string
}

export interface ClipData {
  id: string
  projectId: string
  userId: string
  clipUrl: string
  title: string
  description?: string
  views: number
  platform: 'twitter' | 'tiktok' | 'youtube' | 'instagram'
  createdAt: string
}

export interface ContributorData {
  id: string
  projectId: string
  userId: string
  name: string
  avatar?: string
  twitterHandle?: string
  twitterAvatar?: string
  role?: string
  joinedAt: string
}

export class UnifiedDataService {
  /**
   * Fetch project with all related data
   */
  async getProjectWithDetails(projectId: string): Promise<any> {
    try {
      // Fetch project data
      const project = await databases.getDocument(
        DB_ID,
        COLLECTIONS.PROJECTS,
        projectId
      )

      // Fetch related data in parallel
      const [clips, contributors, holders, socialLinks] = await Promise.all([
        this.getProjectClips(projectId),
        this.getProjectContributors(projectId),
        this.getProjectHolders(projectId),
        this.getProjectSocialLinks(projectId)
      ])

      // Get blockchain price if mint address exists
      let blockchainData = null
      if (project.mintAddress) {
        const priceService = getPriceService()
        blockchainData = await priceService.getCurrentPrice(project.mintAddress)
      }

      // Calculate aggregated clip views
      const totalClipViews = clips.reduce((sum, clip) => sum + clip.views, 0)

      return {
        ...project,
        clips,
        clipViews: totalClipViews,
        contributors,
        contributorsCount: contributors.length,
        keyHolders: holders,
        socialLinks: {
          website: socialLinks?.website || project.websiteUrl,
          twitter: socialLinks?.twitter || project.twitterUrl,
          telegram: socialLinks?.telegram || project.telegramUrl,
          github: socialLinks?.github || project.githubUrl
        },
        contractPrice: blockchainData?.price,
        priceFromChain: blockchainData?.price,
        priceChange24h: blockchainData?.priceChange24h,
        volume24h: blockchainData?.volume24h
      }
    } catch (error) {
      console.error('Error fetching project details:', error)
      return null
    }
  }

  /**
   * Get clips for a project
   */
  async getProjectClips(projectId: string): Promise<ClipData[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CLIPS,
        [Query.equal('projectId', projectId)]
      )
      return response.documents as ClipData[]
    } catch (error) {
      console.error('Error fetching clips:', error)
      return []
    }
  }

  /**
   * Get contributors for a project
   */
  async getProjectContributors(projectId: string): Promise<ContributorData[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.CONTRIBUTORS,
        [Query.equal('projectId', projectId)]
      )

      // Enhance with Twitter avatars
      const contributors = response.documents.map((doc: any) => ({
        ...doc,
        twitterAvatar: doc.twitterHandle
          ? `https://unavatar.io/twitter/${doc.twitterHandle}`
          : doc.avatar
      }))

      return contributors as ContributorData[]
    } catch (error) {
      console.error('Error fetching contributors:', error)
      return []
    }
  }

  /**
   * Get token holders for a project
   */
  async getProjectHolders(projectId: string): Promise<string[]> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.HOLDERS,
        [Query.equal('projectId', projectId)]
      )
      return response.documents.map(doc => doc.walletAddress)
    } catch (error) {
      console.error('Error fetching holders:', error)
      return []
    }
  }

  /**
   * Get social links for a project
   */
  async getProjectSocialLinks(projectId: string): Promise<any> {
    try {
      const response = await databases.getDocument(
        DB_ID,
        COLLECTIONS.SOCIAL_LINKS,
        projectId
      )
      return response
    } catch (error) {
      // Social links might not exist for all projects
      return null
    }
  }

  /**
   * Submit a new clip
   */
  async submitClip(data: {
    projectId: string
    userId: string
    clipUrl: string
    title: string
    description?: string
  }): Promise<ClipData | null> {
    try {
      const clip = await databases.createDocument(
        DB_ID,
        COLLECTIONS.CLIPS,
        ID.unique(),
        {
          ...data,
          views: 0,
          platform: this.detectPlatform(data.clipUrl),
          createdAt: new Date().toISOString()
        }
      )
      return clip as ClipData
    } catch (error) {
      console.error('Error submitting clip:', error)
      return null
    }
  }

  /**
   * Vote on a project
   */
  async voteOnProject(projectId: string, userId: string): Promise<boolean> {
    try {
      // Check if user already voted
      const existingVotes = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.VOTES,
        [
          Query.equal('projectId', projectId),
          Query.equal('userId', userId)
        ]
      )

      if (existingVotes.documents.length > 0) {
        // Remove vote
        await databases.deleteDocument(
          DB_ID,
          COLLECTIONS.VOTES,
          existingVotes.documents[0].$id
        )

        // Decrement upvotes
        await this.updateProjectVotes(projectId, -1)
        return false
      } else {
        // Add vote
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.VOTES,
          ID.unique(),
          {
            projectId,
            userId,
            createdAt: new Date().toISOString()
          }
        )

        // Increment upvotes
        await this.updateProjectVotes(projectId, 1)
        return true
      }
    } catch (error) {
      console.error('Error voting:', error)
      return false
    }
  }

  /**
   * Update project vote count
   */
  private async updateProjectVotes(projectId: string, delta: number): Promise<void> {
    try {
      const project = await databases.getDocument(
        DB_ID,
        COLLECTIONS.PROJECTS,
        projectId
      )

      await databases.updateDocument(
        DB_ID,
        COLLECTIONS.PROJECTS,
        projectId,
        {
          upvotes: (project.upvotes || 0) + delta,
          updatedAt: new Date().toISOString()
        }
      )
    } catch (error) {
      console.error('Error updating votes:', error)
    }
  }

  /**
   * Get all projects with filters
   */
  async getProjects(filters?: {
    type?: 'icm' | 'ccm' | 'meme'
    status?: string
    sortBy?: string
    limit?: number
  }): Promise<ProjectData[]> {
    try {
      const queries = []

      if (filters?.type) {
        queries.push(Query.equal('type', filters.type))
      }

      if (filters?.status) {
        queries.push(Query.equal('status', filters.status))
      }

      // Add sorting
      if (filters?.sortBy === 'trending') {
        queries.push(Query.orderDesc('beliefScore'))
      } else if (filters?.sortBy === 'volume') {
        queries.push(Query.orderDesc('volume24h'))
      } else {
        queries.push(Query.orderDesc('createdAt'))
      }

      if (filters?.limit) {
        queries.push(Query.limit(filters.limit))
      }

      const response = await databases.listDocuments(
        DB_ID,
        COLLECTIONS.PROJECTS,
        queries
      )

      // Enhance with blockchain data
      const projects = await Promise.all(
        response.documents.map(async (project) => {
          const fullProject = await this.getProjectWithDetails(project.$id)
          return fullProject || project
        })
      )

      return projects as ProjectData[]
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  /**
   * Detect platform from URL
   */
  private detectPlatform(url: string): string {
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
    if (url.includes('tiktok.com')) return 'tiktok'
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('instagram.com')) return 'instagram'
    return 'twitter'
  }
}

// Singleton instance
let dataService: UnifiedDataService | null = null

export function getDataService(): UnifiedDataService {
  if (!dataService) {
    dataService = new UnifiedDataService()
  }
  return dataService
}

// React hooks for easy integration
export function useProjectData(projectId?: string) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return

    const fetchProject = async () => {
      setLoading(true)
      setError(null)

      try {
        const service = getDataService()
        const data = await service.getProjectWithDetails(projectId)
        setProject(data)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching project:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  return { project, loading, error }
}

export function useProjects(filters?: any) {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)

      try {
        const service = getDataService()
        const data = await service.getProjects(filters)
        setProjects(data)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [JSON.stringify(filters)])

  return { projects, loading, error }
}

import { useState, useEffect } from 'react'