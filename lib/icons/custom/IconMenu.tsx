import React from 'react'
import { cn } from '@/lib/utils'

interface IconMenuProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Menu/Hamburger icon - for mobile nav, menu toggle
 * Default: white stroke
 * Usage: <IconMenu className="stroke-primary" size={22} />
 */
export const IconMenu = ({ className, size = 22 }: IconMenuProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Menu"
    >
      <path
        d="M3.4375 11H18.5625"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.4375 5.5H18.5625"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.4375 16.5H18.5625"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
