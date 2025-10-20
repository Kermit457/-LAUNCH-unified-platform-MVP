"use client"

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import {
  Bell,
  Settings,
  LogOut,
  User,
  Wallet,
  LayoutGrid,
  ChevronDown,
  Rocket,
  Coins
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/contexts/WalletContext'
import { getNavItems, isNavItemActive } from '@/config/nav'
import { BRAND } from '@/lib/brand'
import { ProfileModal } from '@/components/ProfileModal'

export function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  // 🔥 Use real Privy wallet data
  const { connected, address, userInfo, connect, disconnect } = useWallet()

  // Extract user data from Privy
  const user = {
    name: userInfo?.twitter?.username || userInfo?.email?.address?.split('@')[0] || 'User',
    avatar: userInfo?.twitter?.profilePictureUrl?.replace('_normal', '') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    walletAddress: address ? `${address.slice(0, 4)}...${address.slice(-3)}` : 'Not connected',
    verified: !!userInfo?.twitter?.username
  }

  // Get navigation items with feature flag filtering
  const navItems = getNavItems({ authenticated: connected })

  const isActive = (href: string) => isNavItemActive(href, pathname || '')

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={() => router.push('/discover')}
            className="flex items-center gap-3 group"
            aria-label={`${BRAND.name} Home`}
          >
            <img
              src={BRAND.assets.logo}
              alt={BRAND.name}
              className="h-10 w-auto group-hover:scale-105 transition-transform"
            />
          </button>

          {/* Nav Items - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    "relative px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20",
                    active
                      ? item.color
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>

                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-zinc-800/50 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">

            {/* Show connect button if not connected */}
            {!connected && (
              <button
                onClick={connect}
                className="px-6 py-2.5 rounded-xl bg-[#FFD700] text-black font-bold hover:scale-105 hover:bg-[#FFED4E] transition-all"
              >
                Connect Wallet
              </button>
            )}

            {/* Notifications - only show when connected */}
            {connected && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-all relative"
                >
                  <Bell className="w-5 h-5 text-zinc-400" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    3
                  </span>
                </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-zinc-800">
                      <h3 className="font-bold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        { icon: '🔥', text: '$DEGEN reached new ATH!', time: '2m ago', color: 'text-orange-400' },
                        { icon: '💰', text: 'You earned 50 XP from referral', time: '1h ago', color: 'text-green-400' },
                        { icon: '🎉', text: '@elonmusk launched new keys', time: '3h ago', color: 'text-purple-400' }
                      ].map((notif, i) => (
                        <button
                          key={i}
                          className="w-full p-4 hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-800/50 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{notif.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm text-white">{notif.text}</p>
                              <p className="text-xs text-zinc-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-zinc-800 text-center">
                      <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            )}

            {/* Avatar & Dropdown - only show when connected */}
            {connected && (
            <div className="relative">
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-sm font-medium text-white hidden sm:block">
                  {user.name}
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-zinc-400 transition-transform hidden sm:block",
                  avatarMenuOpen && "rotate-180"
                )} />
              </button>

              {/* Avatar Dropdown Menu */}
              <AnimatePresence>
                {avatarMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-zinc-800">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-xl"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {user.name}
                            {user.verified && (
                              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-[10px]">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono">
                            {user.walletAddress}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <MenuItem
                        icon={User}
                        label="My Profile"
                        onClick={() => {
                          setProfileModalOpen(true)
                          setAvatarMenuOpen(false)
                        }}
                      />
                      <MenuItem
                        icon={LayoutGrid}
                        label="Portfolio"
                        onClick={() => {
                          router.push('/network')
                          setAvatarMenuOpen(false)
                        }}
                      />
                      <MenuItem
                        icon={Rocket}
                        label="My Curves"
                        onClick={() => {
                          router.push('/network')
                          setAvatarMenuOpen(false)
                        }}
                      />
                      <MenuItem
                        icon={Wallet}
                        label="Wallet"
                        badge={address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Not connected'}
                        onClick={() => {
                          router.push('/network')
                          setAvatarMenuOpen(false)
                        }}
                      />
                      <MenuItem
                        icon={Coins}
                        label="Earnings"
                        onClick={() => {
                          router.push('/network')
                          setAvatarMenuOpen(false)
                        }}
                      />

                      <div className="my-2 border-t border-zinc-800" />

                      <MenuItem
                        icon={Settings}
                        label="Settings"
                        onClick={() => {
                          router.push('/dashboard/settings')
                          setAvatarMenuOpen(false)
                        }}
                      />
                      <MenuItem
                        icon={LogOut}
                        label="Sign Out"
                        danger
                        onClick={async () => {
                          setAvatarMenuOpen(false)
                          await disconnect()
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-zinc-800/50 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-white/20",
                    active ? "text-white" : "text-zinc-500"
                  )}
                >
                  <Icon className={cn("w-5 h-5", active && item.color)} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(avatarMenuOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setAvatarMenuOpen(false)
            setNotificationsOpen(false)
          }}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </nav>
  )
}

// Menu Item Component
function MenuItem({
  icon: Icon,
  label,
  badge,
  danger,
  onClick
}: {
  icon: any
  label: string
  badge?: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors text-left",
        danger ? "text-red-400 hover:text-red-300" : "text-zinc-300 hover:text-white"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge && (
        <span className="text-xs text-zinc-500 font-mono">{badge}</span>
      )}
    </button>
  )
}