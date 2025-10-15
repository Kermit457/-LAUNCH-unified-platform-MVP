"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket, Clock, LayoutGrid, Link2, MessageSquare,
  Flame, TrendingUp, Users, Zap,
  Share2, Plus, Filter,
  ChevronDown, BarChart3, Eye, Trophy,
  ChevronUp
} from 'lucide-react'
import { GlassCard, PremiumButton, CleanLaunchCard, SimpleBuySellModal } from '@/components/design-system'

// Import existing functionality
import { LiveLaunchCard } from '@/components/launch/cards/LiveLaunchCard'
import { UpcomingLaunchCard } from '@/components/launch/cards/UpcomingLaunchCard'
import { CommentsModal } from '@/components/comments/CommentsModal'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
import { CollaborateModal } from '@/components/launch/CollaborateModal'
import { EntitySelectorModal, EntityOption } from '@/components/launch/EntitySelectorModal'
import { ProjectDetailsModal } from '@/components/modals/ProjectDetailsModal'
import { LaunchCardData } from '@/types/launch'
import { getLaunches, createLaunchDocument, getUserProjects } from '@/lib/appwrite/services/launches'
import { addVote, getVoteCount, getUserVotes } from '@/lib/appwrite/services/votes'
import { getComments } from '@/lib/appwrite/services/comments'
import { addProjectMember } from '@/lib/appwrite/services/project-members'
import { getUserProfile } from '@/lib/appwrite/services/users'
import { useUser } from '@/hooks/useUser'
import { useCurvesByOwners } from '@/hooks/useCurvesByOwners'
import { useSolanaBalance } from '@/hooks/useSolanaBalance'
import { uploadLogo } from '@/lib/storage'
import type { Curve } from '@/types/curve'

type FilterType = 'ALL' | 'ICM' | 'CCM'
type StatusFilterType = 'ALL' | 'LIVE' | 'UPCOMING'
type SortType = 'trending' | 'newest' | 'conviction'

// Enhanced Widget-Style Filter Button Component
const FilterButton = ({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  gradient
}: {
  active: boolean
  onClick: () => void
  icon: any
  label: string
  count?: number
  gradient?: string
}) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="relative group"
  >
    {/* Glow effect when active */}
    {active && gradient && (
      <div
        className="absolute inset-0 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"
        style={{ background: gradient }}
      />
    )}

    <div
      className={`
        relative px-5 py-3 rounded-2xl font-semibold
        flex items-center gap-2.5 transition-all overflow-hidden
        backdrop-blur-xl
        ${active
          ? 'bg-white/10 text-white border border-white/30 shadow-lg'
          : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700'
        }
      `}
    >
      {/* Gradient overlay when active */}
      {active && gradient && (
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ background: gradient }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}

      <Icon className={`w-4 h-4 relative z-10 ${active ? 'drop-shadow-lg' : ''}`} />
      <span className="relative z-10">{label}</span>

      {count !== undefined && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            relative z-10 px-2.5 py-0.5 rounded-full text-xs font-bold
            ${active
              ? 'bg-white/20 text-white shadow-inner'
              : 'bg-zinc-800/80 text-zinc-400 group-hover:bg-zinc-700'
            }
          `}
        >
          {count}
        </motion.span>
      )}

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
    </div>
  </motion.button>
)

// Enhanced Widget-Style Stats Card Component
const StatsCard = ({
  icon: Icon,
  label,
  value,
  trend,
  gradient
}: {
  icon: any
  label: string
  value: string | number
  trend?: number
  gradient: string
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative group"
  >
    {/* Glow effect on hover */}
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" style={{ background: gradient }} />

    <div className="relative p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-zinc-700 transition-all overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
        style={{ background: gradient }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Icon with floating animation */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="relative p-3 rounded-2xl shadow-lg"
            style={{ background: gradient }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>

          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full
                ${trend > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}
              `}
            >
              <TrendingUp className={`w-3.5 h-3.5 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(trend)}%</span>
            </motion.div>
          )}
        </div>

        {/* Animated value */}
        <motion.div
          className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.div>

        <div className="text-sm text-zinc-500 font-medium">{label}</div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </div>
  </motion.div>
)


export default function DiscoverPage() {
  const router = useRouter()
  const { userId, isAuthenticated } = useUser()
  const { balance: solBalance } = useSolanaBalance()

  // All existing state
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [selectedLaunch, setSelectedLaunch] = useState<{ id: string; title: string } | null>(null)
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL')
  const [sortBy, setSortBy] = useState<SortType>('trending')
  const [launches, setLaunches] = useState<LaunchCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitLaunchOpen, setIsSubmitLaunchOpen] = useState(false)
  const [userVotedLaunches, setUserVotedLaunches] = useState<Set<string>>(new Set())
  const [collaborateOpen, setCollaborateOpen] = useState(false)
  const [selectedCollaborateLaunch, setSelectedCollaborateLaunch] = useState<any>(null)
  const [showEntitySelector, setShowEntitySelector] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userProjects, setUserProjects] = useState<any[]>([])
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedLaunchForDetails, setSelectedLaunchForDetails] = useState<any>(null)

  // Curve/Buy Keys state
  const [buySellModalOpen, setBuySellModalOpen] = useState(false)
  const [selectedCurveData, setSelectedCurveData] = useState<{
    curve: Curve | null
    projectName: string
    projectLogo?: string
  } | null>(null)
  const [userKeyBalance, setUserKeyBalance] = useState<number>(0)

  // Fetch curves for all projects
  const projectOwners = launches.map(launch => ({
    id: launch.id,
    type: 'project' as const
  }))
  const { curves: projectCurves } = useCurvesByOwners(projectOwners)

  // Fetch user holdings when modal opens
  useEffect(() => {
    async function fetchUserHoldings() {
      if (!userId || !selectedCurveData?.curve?.id || !buySellModalOpen) {
        setUserKeyBalance(0)
        return
      }

      try {
        const response = await fetch(
          `/api/curve/${selectedCurveData.curve.id}/holdings?userId=${userId}`
        )
        if (response.ok) {
          const data = await response.json()
          setUserKeyBalance(data.balance || 0)
        }
      } catch (error) {
        console.error('Failed to fetch user holdings:', error)
        setUserKeyBalance(0)
      }
    }

    fetchUserHoldings()
  }, [userId, selectedCurveData?.curve?.id, buySellModalOpen])

  // Fetch user profile and projects
  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return

      try {
        const [profile, projects] = await Promise.all([
          getUserProfile(userId),
          getUserProjects(userId)
        ])

        setUserProfile(profile)
        setUserProjects(projects.map(p => ({
          id: p.$id,
          title: p.title || p.tokenName || 'Unnamed Project',
          logoUrl: p.logoUrl || p.tokenImage,
          scope: p.scope || 'ICM'
        })))
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    fetchUserData()
  }, [userId])

  // Fetch launches (existing logic)
  useEffect(() => {
    async function fetchLaunches() {
      try {
        setLoading(true)
        const [data, votedLaunches] = await Promise.all([
          getLaunches({ limit: 100 }),
          userId ? getUserVotes(userId) : Promise.resolve([])
        ])

        setUserVotedLaunches(new Set(votedLaunches))

        const launchesWithCounts = await Promise.all(
          data.map(async (launch) => {
            const [voteCount, comments] = await Promise.all([
              getVoteCount(launch.$id),
              getComments(launch.$id).catch(() => [])
            ])

            return {
              id: launch.$id,
              title: launch.title || launch.tokenName || 'Unnamed Launch',
              subtitle: launch.subtitle || launch.description || '',
              logoUrl: launch.logoUrl || launch.tokenImage || '',
              scope: launch.scope || ((launch.tags && launch.tags.includes('ICM')) ? 'ICM' as const : 'CCM' as const),
              status: launch.status === 'live' ? 'LIVE' as const : launch.status === 'upcoming' ? 'UPCOMING' as const : 'LIVE' as const,
              convictionPct: launch.convictionPct || 0,
              commentsCount: comments.length,
              upvotes: voteCount,
              contributionPoolPct: launch.contributionPoolPct,
              feesSharePct: launch.feesSharePct,
              mint: launch.$id,
              contributors: [],
              tgeAt: launch.status === 'upcoming' ? new Date(launch.$createdAt || Date.now()).getTime() : undefined,
              boostCount: launch.boostCount || 0,
              viewCount: launch.viewCount || 0,
            }
          })
        )

        setLaunches(launchesWithCounts)
      } catch (error) {
        console.error('Failed to fetch launches:', error)
        setLaunches([])
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [userId])

  // Handle vote
  const handleVote = async (launchId: string) => {
    if (!userId) {
      router.push('/login')
      return
    }

    try {
      await addVote(launchId, userId)
      setUserVotedLaunches(prev => new Set(prev).add(launchId))

      // Update vote count
      setLaunches(prev => prev.map(launch =>
        launch.id === launchId
          ? { ...launch, upvotes: (launch.upvotes || 0) + 1 }
          : launch
      ))
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  // Handle collaborate
  const handleCollaborate = (launch: any) => {
    setSelectedCollaborateLaunch({
      id: launch.id,
      title: launch.title,
      creatorName: launch.creatorName,
      creatorAvatar: launch.creatorAvatar,
      createdBy: launch.createdBy
    })
    setCollaborateOpen(true)
  }

  const handleDetails = (launch: any) => {
    setSelectedLaunchForDetails(launch)
    setDetailsModalOpen(true)
  }

  const handleBoost = (launch: any) => {
    // Open Buy Keys modal with curve data
    const curve = projectCurves.get(launch.id)
    setSelectedCurveData({
      curve: curve || null,
      projectName: launch.title,
      projectLogo: launch.logoUrl
    })
    setBuySellModalOpen(true)
  }

  const handleNotify = (launch: any) => {
    // TODO: Implement notification subscription
    console.log('Notify clicked for:', launch.title)
    alert('🔔 Notifications feature coming soon!')
  }

  const handleShare = (launch: any) => {
    // Copy launch URL to clipboard
    const url = `${window.location.origin}/launch/${launch.id}`
    navigator.clipboard.writeText(url).then(() => {
      alert('🔗 Link copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy link')
    })
  }

  // Filter and sort launches
  const filteredLaunches = useMemo(() => {
    let filtered = [...launches]

    // Apply scope filter
    if (filter !== 'ALL') {
      filtered = filtered.filter(l => l.scope === filter)
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(l => l.status === statusFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.tgeAt || 0) - (a.tgeAt || 0))
        break
      case 'conviction':
        filtered.sort((a, b) => (b.convictionPct || 0) - (a.convictionPct || 0))
        break
      case 'trending':
      default:
        filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        break
    }

    return filtered
  }, [launches, filter, statusFilter, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const total = launches.length
    const upcoming = launches.filter(l => l.status === 'UPCOMING').length
    const live = launches.filter(l => l.status === 'LIVE').length
    const avgConviction = Math.round(
      launches.reduce((sum, l) => sum + (l.convictionPct || 0), 0) / total || 0
    )
    return { total, upcoming, live, avgConviction }
  }, [launches])

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Dynamic Background with floating orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Main gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -80, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]"
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section: Top Launch + Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid lg:grid-cols-[1fr_380px] gap-6"
        >
          {/* Left: Today's Top Launch */}
          {filteredLaunches.length > 0 && sortBy === 'trending' && (
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 via-violet-500/10 to-fuchsia-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 group-hover:border-zinc-700 transition-all overflow-hidden cursor-pointer"
              onClick={() => router.push(`/launch/${filteredLaunches[0]?.id}`)}
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(217,70,239,0.3) 100%)'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <h2 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Today's Top Launch
                  </h2>
                  <div className="flex-1" />
                  <div className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">#1 Trending</span>
                  </div>
                </div>

                {/* Launch Content */}
                <div className="flex gap-4 mb-5">
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {filteredLaunches[0]?.logoUrl ? (
                      <img src={filteredLaunches[0].logoUrl} alt={filteredLaunches[0].title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-2xl font-bold text-zinc-500">
                        {filteredLaunches[0]?.title?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title & Scope Badge */}
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors flex-1">
                        {filteredLaunches[0]?.title}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        filteredLaunches[0]?.scope === 'ICM'
                          ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {filteredLaunches[0]?.scope}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{filteredLaunches[0]?.subtitle}</p>

                    {/* Creator Info */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] text-white font-bold">
                          C
                        </div>
                        <span className="text-zinc-400">by <span className="text-zinc-200 font-medium">Creator</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ChevronUp className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-zinc-500">Upvotes</span>
                    </div>
                    <div className="text-xl font-bold text-white">{filteredLaunches[0]?.upvotes || 0}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-zinc-500">Comments</span>
                    </div>
                    <div className="text-xl font-bold text-white">{filteredLaunches[0]?.commentsCount || 0}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Eye className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-zinc-500">Views</span>
                    </div>
                    <div className="text-xl font-bold text-white">{filteredLaunches[0]?.viewCount || 0}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-xs text-zinc-500">Conviction</span>
                    </div>
                    <div className="text-xl font-bold text-white">{filteredLaunches[0]?.convictionPct || 0}%</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVote(filteredLaunches[0]?.id)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                  >
                    <ChevronUp className="w-4 h-4" />
                    <span>Upvote</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedLaunch({ id: filteredLaunches[0]?.id, title: filteredLaunches[0]?.title })
                      setCommentsOpen(true)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">Comment</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </div>
          </div>
        )}

          {/* Right: Stats Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Launches */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter('ALL')}
              className="relative p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/15 hover:to-fuchsia-500/15 border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              <div className="text-3xl font-bold bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">
                {stats.total}
              </div>
              <div className="text-[10px] text-zinc-500 font-medium mb-1.5">Total</div>
              <div className="flex items-center justify-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>12%</span>
              </div>
            </motion.button>

            {/* Live Now */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter('LIVE')}
              className="relative p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 hover:from-red-500/15 hover:to-orange-500/15 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="text-3xl font-bold bg-gradient-to-br from-red-400 to-orange-400 bg-clip-text text-transparent mb-1">
                {stats.live}
              </div>
              <div className="text-[10px] text-zinc-500 font-medium mb-1.5">Live</div>
              <div className="flex items-center justify-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>8%</span>
              </div>
            </motion.button>

            {/* Upcoming */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter('UPCOMING')}
              className="relative p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/15 hover:to-cyan-500/15 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <div className="text-3xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                {stats.upcoming}
              </div>
              <div className="text-[10px] text-zinc-500 font-medium">Soon</div>
            </motion.button>

            {/* Avg Conviction */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSortBy('conviction')}
              className="relative p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 hover:from-emerald-500/15 hover:to-green-500/15 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500" />
              <div className="text-3xl font-bold bg-gradient-to-br from-emerald-400 to-green-400 bg-clip-text text-transparent mb-1">
                {stats.avgConviction}%
              </div>
              <div className="text-[10px] text-zinc-500 font-medium mb-1.5">Avg</div>
              <div className="flex items-center justify-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>3%</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Scope Filters */}
            <FilterButton
              active={filter === 'ALL'}
              onClick={() => setFilter('ALL')}
              icon={LayoutGrid}
              label="ALL"
              gradient="linear-gradient(135deg, #8b5cf6, #d946ef)"
            />
            <FilterButton
              active={filter === 'ICM'}
              onClick={() => setFilter('ICM')}
              icon={Link2}
              label="ICM"
              count={launches.filter(l => l.scope === 'ICM').length}
              gradient="linear-gradient(135deg, #8b5cf6, #d946ef)"
            />
            <FilterButton
              active={filter === 'CCM'}
              onClick={() => setFilter('CCM')}
              icon={MessageSquare}
              label="CCM"
              count={launches.filter(l => l.scope === 'CCM').length}
              gradient="linear-gradient(135deg, #06b6d4, #3b82f6)"
            />

            {/* Divider */}
            <div className="h-8 w-px bg-zinc-800" />

            {/* Status Filters */}
            <FilterButton
              active={statusFilter === 'LIVE'}
              onClick={() => setStatusFilter('LIVE')}
              icon={Flame}
              label="LIVE"
              gradient="linear-gradient(135deg, #ef4444, #dc2626)"
            />
            <FilterButton
              active={statusFilter === 'UPCOMING'}
              onClick={() => setStatusFilter('UPCOMING')}
              icon={Clock}
              label="UPCOMING"
              gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
            />

            {/* Sort Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="px-4 py-2.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">
                  {sortBy === 'trending' ? 'Trending' : sortBy === 'newest' ? 'Newest' : 'Conviction'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              <AnimatePresence>
                {showSortOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-48 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden z-50"
                  >
                    {[
                      { value: 'trending', label: 'Trending', icon: TrendingUp },
                      { value: 'newest', label: 'Newest', icon: Clock },
                      { value: 'conviction', label: 'Conviction', icon: BarChart3 }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as SortType)
                          setShowSortOptions(false)
                        }}
                        className={`
                          w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-800 transition-colors
                          ${sortBy === option.value ? 'bg-zinc-800 text-white' : 'text-zinc-400'}
                        `}
                      >
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <PremiumButton
              variant="ghost"
              icon={Rocket}
              onClick={() => setIsSubmitLaunchOpen(true)}
            >
              Launch Existing Token
            </PremiumButton>
            <PremiumButton
              variant="primary"
              icon={Plus}
              onClick={() => setShowEntitySelector(true)}
            >
              Create Launch
            </PremiumButton>
          </div>
        </div>

        {/* Main Content Layout - Two Columns */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Left Column: Top Launches (LIVE) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Launches</h3>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <GlassCard key={i} className="h-40 animate-pulse">
                    <div className="p-5">
                      <div className="h-4 bg-zinc-800 rounded mb-4" />
                      <div className="h-3 bg-zinc-800 rounded mb-2" />
                      <div className="h-3 bg-zinc-800 rounded w-2/3" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : filteredLaunches.filter(l => l.status === 'LIVE').length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Rocket className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-1">No live launches</h3>
                <p className="text-sm text-zinc-400">Check back soon!</p>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {filteredLaunches.filter(l => l.status === 'LIVE').slice(0, 5).map((launch) => {
                  const curve = projectCurves.get(launch.id)
                  return (
                  <CleanLaunchCard
                    key={launch.id}
                    launch={{
                      id: launch.id,
                      title: launch.title,
                      subtitle: launch.subtitle || '',
                      logoUrl: launch.logoUrl,
                      scope: launch.scope,
                      status: launch.status,
                      upvotes: launch.upvotes || 0,
                      commentsCount: launch.commentsCount || 0,
                      viewCount: launch.viewCount,
                      convictionPct: launch.convictionPct,
                      keyHolders: curve?.holders || 0,
                      keysSold: curve?.supply || 0,
                      contributionPoolPct: launch.contributionPoolPct,
                      feesSharePct: launch.feesSharePct,
                      keyPrice: curve?.price || 0.01,
                      priceChange24h: curve?.priceChange24h || null,
                      contributors: launch.contributors
                    }}
                    hasVoted={userVotedLaunches.has(launch.id)}
                    onVote={() => handleVote(launch.id)}
                    onComment={() => {
                      setSelectedLaunch({ id: launch.id, title: launch.title })
                      setCommentsOpen(true)
                    }}
                    onCollaborate={() => handleCollaborate(launch)}
                    onDetails={() => handleDetails(launch)}
                    onBuyKeys={() => handleBoost(launch)}
                    onNotify={() => handleNotify(launch)}
                    onShare={() => handleShare(launch)}
                  />
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column: New Launches */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">New Launches</h3>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <GlassCard key={i} className="h-40 animate-pulse">
                    <div className="p-5">
                      <div className="h-4 bg-zinc-800 rounded mb-4" />
                      <div className="h-3 bg-zinc-800 rounded mb-2" />
                      <div className="h-3 bg-zinc-800 rounded w-2/3" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLaunches
                  .filter(l => l.status === 'UPCOMING')
                  .slice(0, 5)
                  .map((launch) => {
                    const curve = projectCurves.get(launch.id)
                    return (
                      <CleanLaunchCard
                        key={launch.id}
                        launch={{
                          id: launch.id,
                          title: launch.title,
                          subtitle: launch.subtitle || '',
                          logoUrl: launch.logoUrl,
                          scope: launch.scope,
                          status: launch.status,
                          upvotes: launch.upvotes || 0,
                          commentsCount: launch.commentsCount || 0,
                          viewCount: launch.viewCount,
                          convictionPct: launch.convictionPct,
                          keyHolders: curve?.holders || 0,
                          keysSold: curve?.supply || 0,
                          contributionPoolPct: launch.contributionPoolPct,
                          feesSharePct: launch.feesSharePct,
                          keyPrice: curve?.price || 0.01,
                          priceChange24h: curve?.priceChange24h || null,
                          contributors: launch.contributors
                        }}
                        hasVoted={userVotedLaunches.has(launch.id)}
                        onVote={() => handleVote(launch.id)}
                        onComment={() => {
                          setSelectedLaunch({ id: launch.id, title: launch.title })
                          setCommentsOpen(true)
                        }}
                        onCollaborate={() => handleCollaborate(launch)}
                        onDetails={() => handleDetails(launch)}
                        onBuyKeys={() => handleBoost(launch)}
                        onNotify={() => handleNotify(launch)}
                        onShare={() => handleShare(launch)}
                      />
                    )
                  })}
              </div>
            )}
          </div>

        </div>

        {/* Floating Create Button (Mobile) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEntitySelector(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg md:hidden"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Modals (keep existing) */}
      {selectedLaunch && (
        <CommentsModal
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          launchId={selectedLaunch.id}
          launchTitle={selectedLaunch.title}
        />
      )}

      <SubmitLaunchDrawer
        isOpen={isSubmitLaunchOpen}
        onClose={() => setIsSubmitLaunchOpen(false)}
        onSubmit={(data: any) => {
          console.log('Launch submitted:', data)
          setIsSubmitLaunchOpen(false)
        }}
      />

      {selectedCollaborateLaunch && (
        <CollaborateModal
          open={collaborateOpen}
          onClose={() => setCollaborateOpen(false)}
          launchId={selectedCollaborateLaunch.id}
          launchTitle={selectedCollaborateLaunch.title}
          creatorName={selectedCollaborateLaunch.creatorName}
          creatorAvatar={selectedCollaborateLaunch.creatorAvatar}
          onSendInvite={async (message: string) => {
            console.log('Invite sent:', message)
            setCollaborateOpen(false)
          }}
        />
      )}

      <EntitySelectorModal
        isOpen={showEntitySelector}
        onClose={() => setShowEntitySelector(false)}
        onSelect={(entity: any) => {
          setSelectedEntity(entity)
          router.push('/launch/create')
        }}
        userProfile={userProfile}
        projects={userProjects}
      />

      {selectedLaunchForDetails && (
        <ProjectDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          project={{
            id: selectedLaunchForDetails.id,
            title: selectedLaunchForDetails.title,
            subtitle: selectedLaunchForDetails.subtitle || '',
            description: selectedLaunchForDetails.description || selectedLaunchForDetails.subtitle || '',
            logoUrl: selectedLaunchForDetails.logoUrl,
            scope: selectedLaunchForDetails.scope,
            status: selectedLaunchForDetails.status,
            upvotes: selectedLaunchForDetails.upvotes || 0,
            commentsCount: selectedLaunchForDetails.commentsCount || 0,
            viewCount: selectedLaunchForDetails.viewCount,
            convictionPct: selectedLaunchForDetails.convictionPct,
            boostCount: selectedLaunchForDetails.boostCount,
            contributionPoolPct: selectedLaunchForDetails.contributionPoolPct,
            feesSharePct: selectedLaunchForDetails.feesSharePct,
            contributors: selectedLaunchForDetails.contributors,
            creator: selectedLaunchForDetails.creatorName,
            createdAt: selectedLaunchForDetails.createdAt,
            platforms: selectedLaunchForDetails.platforms,
            budget: selectedLaunchForDetails.budget,
            endTime: selectedLaunchForDetails.endTime,
            url: selectedLaunchForDetails.url
          }}
        />
      )}

      {/* Buy/Sell Keys Modal */}
      {selectedCurveData && selectedCurveData.curve && (
        <SimpleBuySellModal
          isOpen={buySellModalOpen}
          onClose={() => {
            setBuySellModalOpen(false)
            setSelectedCurveData(null)
          }}
          curve={selectedCurveData.curve}
          ownerName={selectedCurveData.projectName}
          ownerAvatar={selectedCurveData.projectLogo}
          userBalance={solBalance}
          userKeys={userKeyBalance}
          onTrade={async (type, keys) => {
            if (!userId || !selectedCurveData.curve) return

            const endpoint = `/api/curve/${selectedCurveData.curve.id}/${type}`
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ keys, userId })
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || 'Transaction failed')
            }

            // Refresh launches to get updated curve data
            // TODO: Implement optimistic update or refetch
          }}
        />
      )}
    </div>
  )
}