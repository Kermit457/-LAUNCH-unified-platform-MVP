import React from 'react'
import { cn } from '@/lib/utils'

interface IconNavArrowDownProps {
  className?: string
  size?: 14 | 16 | 20
}

/**
 * Navigation Arrow Down - for nav controls, scroll down, collapse
 * Default: white stroke
 * Usage: <IconNavArrowDown className="stroke-primary" size={14} />
 */
export const IconNavArrowDown = ({ className, size = 14 }: IconNavArrowDownProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Arrow Down"
    >
      <path
        d="M13.7363 4.68652C13.7677 4.82222 13.7425 4.96263 13.6846 5.03809L7.00879 13.7305C7.00589 13.7342 7.00241 13.7366 7 13.7393C6.99759 13.7366 6.99411 13.7342 6.99121 13.7305L0.315429 5.03809C0.257486 4.96263 0.232281 4.82222 0.263672 4.68652C0.278621 4.62209 0.302426 4.57854 0.321289 4.55664C0.326367 4.55075 0.329897 4.54754 0.332031 4.5459L2.39453 4.5459L2.39453 0.505859C2.39453 0.406797 2.42106 0.328703 2.4502 0.283203C2.46376 0.262028 2.47367 0.253346 2.47852 0.249999L10.875 0.25C10.88 0.253638 10.8903 0.26284 10.9033 0.283203C10.9324 0.328758 10.958 0.407079 10.958 0.505859L10.958 4.5459L13.668 4.5459C13.6701 4.54754 13.6736 4.55076 13.6787 4.55664C13.6976 4.57854 13.7214 4.62209 13.7363 4.68652Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  )
}
