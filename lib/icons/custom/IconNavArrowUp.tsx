import React from 'react'
import { cn } from '@/lib/utils'

interface IconNavArrowUpProps {
  className?: string
  size?: 14 | 16 | 20
}

/**
 * Navigation Arrow Up - for nav controls, scroll up, expand
 * Default: white stroke
 * Usage: <IconNavArrowUp className="stroke-primary" size={14} />
 */
export const IconNavArrowUp = ({ className, size = 14 }: IconNavArrowUpProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Arrow Up"
    >
      <path
        d="M13.7363 9.31348C13.7677 9.17778 13.7425 9.03737 13.6846 8.96191L7.00879 0.269531C7.00589 0.265769 7.00241 0.263376 7 0.260742C6.99759 0.263376 6.99411 0.265769 6.99121 0.269531L0.31543 8.96191C0.257486 9.03737 0.232282 9.17778 0.263672 9.31348C0.278621 9.37791 0.302426 9.42146 0.321289 9.44336C0.326368 9.44924 0.329897 9.45246 0.332031 9.4541L2.39453 9.4541L2.39453 13.4941C2.39453 13.5932 2.42106 13.6713 2.4502 13.7168C2.46376 13.738 2.47367 13.7467 2.47852 13.75L10.875 13.75C10.88 13.7464 10.8903 13.7372 10.9033 13.7168C10.9324 13.6712 10.958 13.5929 10.958 13.4941L10.958 9.4541L13.668 9.4541C13.6701 9.45246 13.6736 9.44924 13.6787 9.44336C13.6976 9.42146 13.7214 9.37791 13.7363 9.31348Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  )
}
