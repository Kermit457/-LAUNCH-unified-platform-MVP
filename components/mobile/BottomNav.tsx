"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  PlusCircle,
  DollarSign,
  User,
  Users,
  MessageCircle,
  Scissors,
  type LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavTab {
  id: string
  label: string
  icon: LucideIcon
  path: string
  activePattern?: RegExp
}

const tabs: NavTab[] = [
  {
    id: 'discover',
    label: 'Discover',
    icon: Search,
    path: '/discover',
    activePattern: /^\/discover/
  },
  {
    id: 'launch',
    label: 'Launch',
    icon: PlusCircle,
    path: '/launch',
    activePattern: /^\/launch/
  },
  {
    id: 'clip',
    label: 'Clip',
    icon: Scissors,
    path: '/clip',
    activePattern: /^\/clip/
  },
  {
    id: 'network',
    label: 'Network',
    icon: Users,
    path: '/network',
    activePattern: /^\/network/
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
    activePattern: /^\/profile/
  },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (tab: NavTab): boolean => {
    if (!pathname) return false

    if (tab.activePattern) {
      return tab.activePattern.test(pathname)
    }
    return pathname === tab.path
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-zinc-800 bg-black backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.8)]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab)

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                "active:scale-95 transition-transform",
                active
                  ? "text-primary-cyan"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary-cyan to-transparent" />
              )}

              {/* Icon with glow effect when active */}
              <div className={cn(
                "relative transition-all",
                active && "drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]"
              )}>
                <Icon
                  className="w-6 h-6"
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>

              {/* Label */}
              <span className={cn(
                "text-[10px] font-medium leading-none",
                active && "font-semibold"
              )}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
