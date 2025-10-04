'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { LayoutGrid, Swords, Wrench, Users, WalletMinimal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NavBar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: null },
    { href: '/explore', label: 'Discover', icon: LayoutGrid },
    { href: '/engage', label: 'Engage', icon: Swords },
    { href: '/tools', label: 'Tools', icon: Wrench },
    { href: '/community', label: 'Community', icon: Users },
  ]

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              $L
            </div>
            <span className="font-bold text-xl gradient-text">$LAUNCH</span>
          </Link>

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
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {Icon && <Icon size={16} />}
                  {link.label}
                </Link>
              )
            })}
          </div>

          <Button className="gap-2">
            <WalletMinimal size={16} />
            Connect
          </Button>
        </div>
      </div>
    </nav>
  )
}
