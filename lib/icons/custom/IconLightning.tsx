import React from 'react'
import { cn } from '@/lib/utils'

interface IconLightningProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Lightning/Flash icon - represents energy, motion, trending
 * Default: inherits currentColor (use with text-* classes)
 * Usage: <IconLightning className="text-primary" size={20} />
 */
export const IconLightning = ({ className, size = 20 }: IconLightningProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 43"
      fill="none"
      className={cn('inline-block', className)}
      aria-label="Lightning"
    >
      <path
        d="M21.0938 17.1387H10.5469V0L0 25.0488H10.5469V42.1875L21.0938 17.1387Z"
        fill="currentColor"
      />
    </svg>
  )
}
