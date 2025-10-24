import React from 'react'
import { cn } from '@/lib/utils'

interface IconNavArrowRightProps {
  className?: string
  size?: 14 | 16 | 20
}

/**
 * Navigation Arrow Right - for nav controls, forward, next
 * Default: white stroke
 * Usage: <IconNavArrowRight className="stroke-primary" size={14} />
 */
export const IconNavArrowRight = ({ className, size = 14 }: IconNavArrowRightProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Arrow Right"
    >
      <path
        d="M4.68652 0.263672C4.82222 0.232281 4.96263 0.257486 5.03809 0.31543L13.7305 6.99121C13.7342 6.99411 13.7366 6.99759 13.7393 7C13.7366 7.00241 13.7342 7.00589 13.7305 7.00879L5.03809 13.6846C4.96263 13.7425 4.82222 13.7677 4.68652 13.7363C4.62209 13.7214 4.57854 13.6976 4.55664 13.6787C4.55076 13.6736 4.54754 13.6701 4.5459 13.668V11.6055H0.505859C0.406798 11.6055 0.328703 11.5789 0.283203 11.5498C0.262029 11.5362 0.253346 11.5263 0.25 11.5215V3.125C0.253639 3.11996 0.26284 3.10972 0.283203 3.09668C0.328758 3.06764 0.40708 3.04199 0.505859 3.04199H4.5459V0.332031C4.54754 0.329897 4.55076 0.326367 4.55664 0.321289C4.57854 0.302426 4.62209 0.278621 4.68652 0.263672Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  )
}
