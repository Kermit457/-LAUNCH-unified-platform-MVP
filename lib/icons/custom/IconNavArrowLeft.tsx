import React from 'react'
import { cn } from '@/lib/utils'

interface IconNavArrowLeftProps {
  className?: string
  size?: 14 | 16 | 20
}

/**
 * Navigation Arrow Left - for nav controls, back, previous
 * Default: white stroke
 * Usage: <IconNavArrowLeft className="stroke-primary" size={14} />
 */
export const IconNavArrowLeft = ({ className, size = 14 }: IconNavArrowLeftProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Arrow Left"
    >
      <path
        d="M9.31348 0.263672C9.17778 0.232281 9.03737 0.257486 8.96191 0.31543L0.269531 6.99121C0.265769 6.99411 0.263376 6.99759 0.260742 7C0.263376 7.00241 0.265769 7.00589 0.269531 7.00879L8.96191 13.6846C9.03737 13.7425 9.17778 13.7677 9.31348 13.7363C9.37791 13.7214 9.42146 13.6976 9.44336 13.6787C9.44924 13.6736 9.45246 13.6701 9.4541 13.668V11.6055H13.4941C13.5932 11.6055 13.6713 11.5789 13.7168 11.5498C13.738 11.5362 13.7467 11.5263 13.75 11.5215V3.125C13.7464 3.11996 13.7372 3.10972 13.7168 3.09668C13.6712 3.06764 13.5929 3.04199 13.4941 3.04199H9.4541V0.332031C9.45246 0.329897 9.44924 0.326367 9.44336 0.321289C9.42146 0.302426 9.37791 0.278621 9.31348 0.263672Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  )
}
