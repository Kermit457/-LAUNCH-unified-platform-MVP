'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { LayoutGrid, Swords, Wrench, Users, Wallet, Menu, X, Trophy, Network, Zap } from 'lucide-react'

export default function NavBar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

          {/* Desktop Connect Button */}
          <button
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white rounded-lg text-sm font-medium hover:shadow-neon-fuchsia transition-all"
            data-cta="nav-connect-wallet"
          >
            <Wallet size={16} />
            Connect
          </button>

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
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white rounded-lg text-sm font-medium transition-all mt-2"
              data-cta="nav-connect-wallet-mobile"
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
