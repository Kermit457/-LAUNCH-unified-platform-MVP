'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, DollarSign, FileText, Settings, TrendingUp, Home, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNetworkStore } from '@/lib/stores/useNetworkStore'
import { useUser } from '@/hooks/useUser'
import { getUserProfile } from '@/lib/appwrite/services/users'
import type { UserProfile } from '@/lib/appwrite/services/users'

const tabs = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
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

      {/* Header with Navigation Tabs */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href
              const showBadge = tab.badge && (pendingInvites > 0 || unreadDMs > 0)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all',
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
