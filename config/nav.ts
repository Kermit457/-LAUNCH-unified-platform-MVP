/**
 * Navigation Configuration
 * Single source of truth for all navigation items
 */

import { LucideIcon, Search, Rocket, Coins, Radio, Users } from 'lucide-react'
import { FLAGS } from '@/lib/flags'

export interface NavItem {
  /** Display label */
  label: string

  /** Navigation href */
  href: string

  /** Lucide icon component */
  icon: LucideIcon

  /** ICM Motion color (from brand palette) */
  color: string

  /** Show in main navigation */
  showInNav: boolean

  /** Requires authentication */
  requiresAuth?: boolean

  /** Feature flag requirement */
  featureFlag?: keyof typeof FLAGS
}

/**
 * Main navigation items
 * Ordered by display priority
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Discover',
    href: '/discover',
    icon: Search,
    color: 'text-[#00FFFF]', // Cyan
    showInNav: true,
  },
  {
    label: 'Launch',
    href: '/launch',
    icon: Rocket,
    color: 'text-[#00FF88]', // Green
    showInNav: true,
  },
  {
    label: 'Earn',
    href: '/earn',
    icon: Coins,
    color: 'text-[#FFD700]', // Yellow
    showInNav: true,
    featureFlag: 'ENABLE_EARN',
  },
  {
    label: 'Live',
    href: '/live',
    icon: Radio,
    color: 'text-[#FF0040]', // Red
    showInNav: true,
    featureFlag: 'ENABLE_LIVE',
  },
  {
    label: 'Network',
    href: '/network',
    icon: Users,
    color: 'text-[#0088FF]', // Blue
    showInNav: true,
    requiresAuth: true,
    featureFlag: 'ENABLE_NETWORK',
  },
]

/**
 * Get navigation items with feature flag filtering
 */
export function getNavItems(options?: {
  /** Filter by authentication requirement */
  authenticated?: boolean
}): NavItem[] {
  return NAV_ITEMS.filter((item) => {
    // Check feature flag
    if (item.featureFlag && !FLAGS[item.featureFlag]) {
      return false
    }

    // Check auth requirement
    if (item.requiresAuth && !options?.authenticated) {
      return false
    }

    // Check showInNav
    if (!item.showInNav) {
      return false
    }

    return true
  })
}

/**
 * Check if a path is active
 */
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === '/') {
    return pathname === '/'
  }
  return pathname === href || pathname.startsWith(href + '/')
}
