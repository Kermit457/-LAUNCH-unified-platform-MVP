'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import { LayoutGrid, Swords, Wrench, Users, Wallet, Menu, X, Trophy, Network, Zap, Bell, LogOut, User, Rocket } from 'lucide-react'
import { useNetwork } from '@/lib/contexts/NetworkContext'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown'
import { useWallet } from '@/contexts/WalletContext'

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  const walletDropdownRef = useRef<HTMLDivElement>(null)
  const { unreadCount } = useNotifications()
  const { connected, address, connect, disconnect } = useWallet()

  // Close wallet dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setWalletDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const links = [
    { href: '/', label: 'Home', icon: null },
    { href: '/discover', label: 'Discover', icon: LayoutGrid },
    { href: '/live', label: 'Live', icon: Zap },
    { href: '/earn', label: 'Earn', icon: Trophy },
    { href: '/tools', label: 'Tools', icon: Wrench },
    { href: '/network', label: 'Network', icon: Network },
    { href: '/community', label: 'Community', icon: Users },
  ]

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="w-8 h-8 bg-gradient-to-br from-launchos-fuchsia to-launchos-violet rounded-lg flex items-center justify-center font-bold text-white text-sm">
              LOS
            </div>
            <span className="font-bold text-xl gradient-text-launchos">LaunchOS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                    pathname === link.href
                      ? 'bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white shadow-neon-fuchsia'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {Icon && <Icon size={16} />}
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fuchsia-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={notificationDropdownOpen}
                onClose={() => setNotificationDropdownOpen(false)}
              />
            </div>

            {/* Connect Wallet Button with Dropdown */}
            {connected ? (
              <div className="relative" ref={walletDropdownRef}>
                <button
                  onMouseEnter={() => setWalletDropdownOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
                  data-cta="nav-wallet"
                >
                  <Wallet size={16} />
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>

                {/* Wallet Dropdown */}
                {walletDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-zinc-900/95 border border-fuchsia-500/20 shadow-xl shadow-fuchsia-500/10 backdrop-blur-xl z-[100]"
                    onMouseLeave={() => setWalletDropdownOpen(false)}
                  >
                    <div className="p-2">
                      {/* Account Mode Header */}
                      <div className="px-4 py-2 border-b border-white/10 mb-2">
                        <div className="text-xs font-medium text-white/50 mb-2">Dashboard Mode</div>
                      </div>

                      {/* Personal Account Option */}
                      <button
                        onClick={() => {
                          router.push('/dashboard?mode=user')
                          setWalletDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-fuchsia-500/10 hover:border-l-2 hover:border-fuchsia-400 transition-all text-left"
                      >
                        <User size={18} className="text-fuchsia-400" />
                        <div>
                          <div className="text-sm font-medium">Personal Account</div>
                          <div className="text-xs text-white/50">Campaigns & Earnings</div>
                        </div>
                      </button>

                      {/* Project Account Option */}
                      <button
                        onClick={() => {
                          router.push('/dashboard?mode=project')
                          setWalletDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-cyan-500/10 hover:border-l-2 hover:border-cyan-400 transition-all text-left"
                      >
                        <Rocket size={18} className="text-cyan-400" />
                        <div>
                          <div className="text-sm font-medium">Project Account</div>
                          <div className="text-xs text-white/50">Token & Treasury</div>
                        </div>
                      </button>

                      <div className="h-px bg-white/10 my-2" />

                      {/* Disconnect */}
                      <button
                        onClick={() => {
                          disconnect()
                          setWalletDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-left"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connect}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white rounded-lg text-sm font-medium hover:shadow-neon-fuchsia transition-all"
                data-cta="nav-connect-wallet"
              >
                <Wallet size={16} />
                Connect
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {Icon && <Icon size={16} />}
                  {link.label}
                </Link>
              )
            })}
            {connected ? (
              <button
                onClick={disconnect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium transition-all mt-2"
                data-cta="nav-disconnect-wallet-mobile"
              >
                <Wallet size={16} />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
            ) : (
              <button
                onClick={connect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white rounded-lg text-sm font-medium transition-all mt-2"
                data-cta="nav-connect-wallet-mobile"
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
