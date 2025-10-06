'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, DollarSign, FileText, Settings, TrendingUp, Home, Share2, UserPlus, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNetworkStore } from '@/lib/stores/useNetworkStore'
import { useUser } from '@/hooks/useUser'
import { getUserProfile } from '@/lib/appwrite/services/users'
import type { UserProfile } from '@/lib/appwrite/services/users'

const tabs = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/network', label: 'Network', icon: Users, badge: true },
  { href: '/dashboard/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: TrendingUp },
  { href: '/dashboard/submissions', label: 'Submissions', icon: FileText },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const pendingInvites = useNetworkStore(state => state.getPendingInvitesCount())
  const unreadDMs = useNetworkStore(state => state.getUnreadDMsCount())
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return

      try {
        const data = await getUserProfile(user.$id)
        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        // Set default profile if fetch fails
        setProfile({
          $id: user.$id,
          userId: user.$id,
          username: user.name || 'user',
          displayName: user.name,
          verified: false,
          conviction: 0,
          totalEarnings: 0,
          roles: ['Member'],
          createdAt: new Date().toISOString(),
        } as any)
      }
    }

    fetchProfile()
  }, [user])

  return (
    <div className="min-h-screen bg-[#0B0F1A] relative">
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#121830] to-transparent pointer-events-none z-0" />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {(profile?.username || user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">@{profile?.username || user?.name || 'user'}</h2>
                  {profile?.verified && (
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {profile?.roles.map((role) => (
                    <span key={role} className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                My Profile →
              </Link>
              <button className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href
              const showBadge = tab.badge && (pendingInvites > 0 || unreadDMs > 0)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all',
                    isActive
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-white/50 hover:text-white/70 hover:border-white/20'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {showBadge && (
                    <span className="text-xs text-white/60">
                      ({pendingInvites}/{unreadDMs})
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
