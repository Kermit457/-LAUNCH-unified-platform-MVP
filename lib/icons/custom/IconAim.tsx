import React from 'react'
import { cn } from '@/lib/utils'

interface IconAimProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Aim/Target icon - represents targeting, focus, precision, goals
 * Default: inherits currentColor (use with text-* classes)
 * Usage: <IconAim className="text-primary" size={20} />
 */
export const IconAim = ({ className, size = 20 }: IconAimProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 66 66"
      fill="none"
      className={cn('inline-block', className)}
      aria-label="Aim"
    >
      <path
        d="M31.4941 0V3.3999C16.2964 4.07227 4.07197 16.2964 3.3999 31.4941H0V34.1309H3.3999C4.07227 49.3286 16.2964 61.553 31.4941 62.2251V65.625H34.1309V62.2251C49.3286 61.5527 61.553 49.3286 62.2251 34.1309H65.625V31.4941H62.2251C61.5527 16.2964 49.3286 4.07197 34.1309 3.3999V0H31.4941ZM31.4941 6.03853V14.0625H34.1309V6.03853C47.9004 6.70312 58.9219 17.7246 59.5865 31.4941H51.5625V34.1309H59.5865C58.9219 47.9004 47.9004 58.9219 34.1309 59.5865V51.5625H31.4941V59.5865C17.7246 58.9219 6.70312 47.9004 6.03853 34.1309H14.0625V31.4941H6.03853C6.70312 17.7246 17.7246 6.70312 31.4941 6.03853ZM31.4941 28.125V31.4941H28.125V34.1309H31.4941V37.5H34.1309V34.1309H37.5V31.4941H34.1309V28.125H31.4941Z"
        fill="currentColor"
      />
    </svg>
  )
}
