import React from 'react'
import { cn } from '@/lib/utils'

interface IconTwitterProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Twitter/X platform icon
 * Default: inherits currentColor (use with text-* classes)
 * Usage: <IconTwitter className="text-primary" size={20} />
 */
export const IconTwitter = ({ className, size = 20 }: IconTwitterProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 29"
      fill="none"
      className={cn('inline-block', className)}
      aria-label="Twitter/X"
    >
      <path
        d="M25.2019 0H30.1087L19.3887 12.2523L32 28.925H22.1254L14.3913 18.8131L5.54174 28.925H0.631901L12.0981 15.8198L0 0H10.1252L17.1162 9.24266L25.2019 0ZM23.4797 25.988H26.1987L8.64785 2.78274H5.73013L23.4797 25.988Z"
        fill="currentColor"
      />
    </svg>
  )
}
