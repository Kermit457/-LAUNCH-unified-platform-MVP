import React from 'react'
import { cn } from '@/lib/utils'

interface IconUpvoteProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Upvote icon - represents upvote, like, increase, positive feedback
 * Default: inherits currentColor (use with text-* classes)
 * Usage: <IconUpvote className="text-primary" size={20} />
 */
export const IconUpvote = ({ className, size = 20 }: IconUpvoteProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 8 7"
      fill="none"
      className={cn('inline-block', className)}
      aria-label="Upvote"
    >
      <path
        d="M2.73358 0.500001C3.11848 -0.166666 4.08073 -0.166667 4.46563 0.5L7.06371 5C7.44861 5.66667 6.96749 6.5 6.19769 6.5L1.00153 6.5C0.231734 6.5 -0.249393 5.66667 0.135508 5L2.73358 0.500001Z"
        fill="currentColor"
      />
    </svg>
  )
}
