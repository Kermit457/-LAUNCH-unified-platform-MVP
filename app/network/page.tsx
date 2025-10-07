"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { MetricPill } from '@/components/ui/metric-pill'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { mockProfiles } from '@/lib/mockProfileData'
import { NetworkFilters, FilterState } from '@/components/network/NetworkFilters'
import { ProfileCardData } from '@/types/profile'
import { getAllUsers, getUsersByIds } from '@/lib/appwrite/services/users'
import { getUserConnections, getMutualConnections, getNetworkInvites } from '@/lib/appwrite/services/network'
import { useUser } from '@/hooks/useUser'

export default function NetworkPage() {
  const router = useRouter()
  const { userId } = useUser()
  const [filters, setFilters] = useState<FilterState>({
    connectionStatus: 'all',
    roles: [],
    sortBy: 'recommended'
  })
  const [profiles, setProfiles] = useState<ProfileCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([])
  const [sentInviteUserIds, setSentInviteUserIds] = useState<string[]>([])

  // Fetch users from Appwrite
  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true)
        const [allUsers, myConnections, sentInvites] = await Promise.all([
          getAllUsers(100),
          userId ? getUserConnections(userId) : Promise.resolve([]),
          // Fetch ALL sent invites (not just pending) to track who we've invited
          userId ? getNetworkInvites({ userId, type: 'sent' }) : Promise.resolve([])
        ])

        setConnectedUserIds(myConnections)

        // Extract receiver IDs from sent invites
        const sentInviteIds = sentInvites.map(invite => invite.receiverId)
        setSentInviteUserIds(sentInviteIds)

        // Calculate mutual connections for each user
        const profilesWithMutuals = await Promise.all(
          allUsers.map(async (userProfile) => {
            const isConnected = myConnections.includes(userProfile.userId)
            // Only mark as inviteSent if NOT already connected
            const hasInvitePending = !isConnected && sentInviteIds.includes(userProfile.userId)

            // Get mutual connection IDs
            let mutualIds: string[] = []
            if (userId && userProfile.userId !== userId) {
              mutualIds = await getMutualConnections(userId, userProfile.userId)
            }

            // Fetch mutual user details
            const mutualProfiles = mutualIds.length > 0
              ? await getUsersByIds(mutualIds)
              : []

            const mutuals = mutualProfiles.map(m => ({
              id: m.$id,
              username: m.username,
              avatar: m.avatar,
            }))

            return {
              id: userProfile.$id,
              userId: userProfile.userId,
              username: userProfile.username,
              displayName: userProfile.displayName || userProfile.username,
              name: userProfile.displayName || userProfile.username,
              handle: `@${userProfile.username}`,
              avatar: userProfile.avatar,
              verified: userProfile.verified,
              roles: userProfile.roles,
              mutuals,
              bio: userProfile.bio,
              socials: {},
              connected: isConnected,
              inviteSent: hasInvitePending,
              contributions: [], // TODO: Fetch from submissions collection
            }
          })
        )

        setProfiles(profilesWithMutuals)
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
        // Fall back to mock data
        setProfiles(mockProfiles)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [userId])

  // Calculate recommendation score
  const getRecommendationScore = (profile: ProfileCardData): number => {
    let score = 0

    // Contribution level (10 points per contribution, max 100)
    score += Math.min(profile.contributions.length * 10, 100)

    // Mutual connections (5 points each, max 50)
    score += Math.min(profile.mutuals.length * 5, 50)

    // Verified users get bonus (25 points)
    if (profile.verified) score += 25

    // Multiple roles indicate active user (10 points per role, max 30)
    score += Math.min(profile.roles.length * 10, 30)

    return score
  }

  // Filter and sort profiles
  const filteredAndSortedProfiles = useMemo(() => {
    // Use real data if loaded, otherwise fall back to mock data
    let result = profiles.length > 0 ? [...profiles] : [...mockProfiles]

    // Filter by connection status
    if (filters.connectionStatus === 'connected') {
      result = result.filter(p => p.connected)
    } else if (filters.connectionStatus === 'not_connected') {
      result = result.filter(p => !p.connected)
    }

    // Filter by roles
    if (filters.roles.length > 0) {
      result = result.filter(p =>
        p.roles.some(role => filters.roles.includes(role))
      )
    }

    // Sort profiles
    switch (filters.sortBy) {
      case 'contribution':
        result.sort((a, b) => b.contributions.length - a.contributions.length)
        break
      case 'mutuals':
        result.sort((a, b) => b.mutuals.length - a.mutuals.length)
        break
      case 'recent':
        // For now, shuffle randomly (in real app, would use actual activity timestamp)
        result.sort(() => Math.random() - 0.5)
        break
      case 'recommended':
      default:
        result.sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a))
        break
    }

    return result
  }, [filters, profiles])

  const allProfiles = profiles.length > 0 ? profiles : mockProfiles
  const connectedCount = allProfiles.filter(p => p.connected).length
  const suggestionsCount = allProfiles.filter(p => !p.connected).length

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-8 h-8 text-fuchsia-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Network
          </h1>
        </div>
        <p className="text-zinc-300 text-lg">
          Connect with creators, streamers, and traders in the LaunchOS ecosystem
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white/60 text-sm">
          Showing {filteredAndSortedProfiles.length} of {mockProfiles.length} profiles
        </div>
        <NetworkFilters onFilterChange={setFilters} />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricPill label="Total Network" value={allProfiles.length.toString()} />
        <MetricPill label="Connected" value={connectedCount.toString()} variant="positive" />
        <MetricPill label="Not Connected" value={suggestionsCount.toString()} />
        <MetricPill label="Filtered Results" value={filteredAndSortedProfiles.length.toString()} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading profiles...</p>
        </div>
      )}

      {/* Profile Cards Grid */}
      {!loading && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6">
            {filters.sortBy === 'recommended' && 'Recommended for You'}
            {filters.sortBy === 'contribution' && 'Top Contributors'}
            {filters.sortBy === 'mutuals' && 'Most Mutual Connections'}
            {filters.sortBy === 'recent' && 'Recent Activity'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAndSortedProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                data={profile}
              />
            ))}
          </div>

          {/* CTA Section */}
          <Card variant="gradient" glow className="mt-16 p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want to grow your network?</h2>
            <p className="text-zinc-300 text-lg mb-8">
              Connect with top creators and unlock collaboration opportunities
            </p>
            <Button
              variant="boost"
              size="lg"
              onClick={() => router.push('/profile')}
            >
              Complete Your Profile
            </Button>
          </Card>
        </>
      )}
    </div>
  )
}
