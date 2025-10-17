"use client"

import { useState, useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { EnhancedLaunchCard, LaunchCardData } from './launch/EnhancedLaunchCard'
import { useUser } from '@/hooks/useUser'
import { useUserHoldings } from '@/hooks/useUserHoldings'
import type { Project } from '@/types'

/**
 * Wrapper component that:
 * - Uses EnhancedLaunchCard for launch-type projects
 * - Fetches user holdings data
 * - Calculates ownership percentage
 * - Falls back to original ProjectCard for non-launch types
 */
export function ProjectCardWithOwnership({ project, onUpdateProject }: {
  project: Project
  onUpdateProject?: (updatedProject: Project) => void
}) {
  const { user } = useUser()
  const [totalSupply, setTotalSupply] = useState<number>(0)
  const [estTokens, setEstTokens] = useState<number | null>(null)

  // Fetch user's holdings for this curve
  const { holdings, loading, hasKeys, keyCount } = useUserHoldings(
    project.id, // Using project.id as curveId
    user?.id
  )

  // Fetch total supply to calculate share percentage
  useEffect(() => {
    if (!project.id) return

    const fetchSupply = async () => {
      try {
        const response = await fetch(`/api/curve/${project.id}`)
        if (response.ok) {
          const data = await response.json()
          setTotalSupply(data.totalSupply || 100) // Default to 100 if not available

          // Estimate launch tokens (mock calculation - adjust based on your tokenomics)
          if (data.totalSupply && holdings?.balance) {
            const userSharePct = (holdings.balance / data.totalSupply) * 100
            // Assume 1M tokens at TGE, user gets proportional share
            const estimatedTokens = Math.floor((userSharePct / 100) * 1_000_000)
            setEstTokens(estimatedTokens)
          }
        }
      } catch (error) {
        console.error('Error fetching curve supply:', error)
        setTotalSupply(100) // Fallback
      }
    }

    fetchSupply()
  }, [project.id, holdings?.balance])

  // Calculate share percentage
  const mySharePct = totalSupply > 0 && holdings?.balance
    ? (holdings.balance / totalSupply) * 100
    : 0

  // If not a launch type, use original card
  if (project.type !== 'launch') {
    return <ProjectCard {...project} onUpdateProject={onUpdateProject} />
  }

  // Transform Project to LaunchCardData
  const launchData: LaunchCardData = {
    id: project.id,
    title: project.title,
    subtitle: project.subtitle,
    logoUrl: project.logoUrl || project.tokenLogo,
    ticker: project.ticker,
    status: project.status as 'live' | 'upcoming' | 'ended',
    marketType: (project.marketType || 'icm') as 'ccm' | 'icm',
    beliefScore: project.beliefScore || 0,
    upvotes: project.upvotes || 0,
    commentsCount: project.comments?.length || 0,

    // Stats
    viewCount: project.stats?.views,
    poolSize: project.progress?.pool ? Math.round(project.progress.pool / 1000) : undefined,
    feesPercent: project.economics?.feesSharePct,
    currentPrice: holdings?.avgPrice,

    // Ownership data
    myKeys: keyCount,
    mySharePct: mySharePct,
    estLaunchTokens: estTokens,

    // Event handlers (pass through from ProjectCard logic)
    hasVoted: false, // You can wire this up to your vote state
    isVoting: false,
    onVote: async () => {
      // Implement vote logic
      console.log('Vote clicked for', project.id)
    },
    onComment: () => {
      // Implement comment logic
      console.log('Comment clicked for', project.id)
    },
    onCollaborate: () => {
      // Implement collaborate logic
      console.log('Collaborate clicked for', project.id)
    },
    onDetails: () => {
      // Navigate to details
      router.push(`/launch/${project.id}`)
    },
  }

  // Show loading state or enhanced card
  if (loading && !holdings) {
    // Show card with zero holdings while loading
    return <EnhancedLaunchCard data={{ ...launchData, myKeys: 0, mySharePct: 0 }} />
  }

  return <EnhancedLaunchCard data={launchData} />
}
