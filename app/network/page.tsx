"use client"

import { useState } from 'react'
import { Users } from 'lucide-react'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { MetricPill } from '@/components/ui/metric-pill'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { mockProfiles } from '@/lib/mockProfileData'

export default function NetworkPage() {
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set())

  const handleInvite = (id: string) => {
    setInvitedUsers(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    console.log('Invited:', id)
  }

  const handleCancelInvite = (id: string) => {
    setInvitedUsers(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    console.log('Cancelled invite:', id)
  }

  const getState = (id: string, isConnected?: boolean, isSelf?: boolean): ConnState => {
    if (isSelf) return 'self'
    if (isConnected) return 'connected'
    if (invitedUsers.has(id)) return 'pending'
    return 'none'
  }

  // Use the new mock profiles data
  const profiles = mockProfiles

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

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricPill label="Total Network" value="247" />
        <MetricPill label="Connected" value="42" variant="positive" />
        <MetricPill label="Pending" value={invitedUsers.size} />
        <MetricPill label="Suggestions" value="18" />
      </div>

      {/* Profile Cards Grid - Default Variant */}
      <h2 className="text-2xl font-bold text-white mb-6">Suggested Connections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            data={profile}
          />
        ))}
      </div>

      {/* Compact Variant Example */}
      <h2 className="text-2xl font-bold text-white mb-6">Quick View (Compact)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {profiles.slice(0, 4).map((profile) => (
          <ProfileCard
            key={`compact-${profile.id}`}
            data={profile}
            variant="compact"
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
          disabled={true}
          title="Feature coming soon"
        >
          Complete Your Profile
        </Button>
      </Card>
    </div>
  )
}
