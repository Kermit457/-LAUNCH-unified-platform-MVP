import React from 'react'
import { cn } from '@/lib/utils'

interface IconInfoProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Information icon - represents info, help, details
 * Default: inherits currentColor (use with text-* classes)
 * Usage: <IconInfo className="text-primary" size={20} />
 */
export const IconInfo = ({ className, size = 20 }: IconInfoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      className={cn('inline-block', className)}
      aria-label="Information"
    >
      <path
        d="M9.88667 6.79627V14H8.12V6.79627H9.88667ZM8 4.91212C8 4.65024 8.08889 4.43276 8.26667 4.25965C8.44889 4.08655 8.69333 4 9 4C9.30667 4 9.54889 4.08655 9.72667 4.25965C9.90889 4.43276 10 4.65024 10 4.91212C10 5.16955 9.90889 5.38482 9.72667 5.55792C9.54889 5.73103 9.30667 5.81758 9 5.81758C8.69333 5.81758 8.44889 5.73103 8.26667 5.55792C8.08889 5.38482 8 5.16955 8 4.91212Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 15.6522C12.6739 15.6522 15.6522 12.6739 15.6522 9C15.6522 5.32611 12.6739 2.34783 9 2.34783C5.32611 2.34783 2.34783 5.32611 2.34783 9C2.34783 12.6739 5.32611 15.6522 9 15.6522ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
        fill="currentColor"
      />
    </svg>
  )
}
