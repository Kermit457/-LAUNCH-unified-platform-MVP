import React from 'react'
import { cn } from '@/lib/cn'

interface IconCollabExpandProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Collaboration Expand icon - represents network expansion, collaboration growth
 * Default: inherits currentColor (use with text-* classes)
 * Usage: <IconCollabExpand className="text-primary" size={20} />
 */
export const IconCollabExpand = ({ className, size = 20 }: IconCollabExpandProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 25"
      fill="none"
      className={cn('inline-block', className)}
      aria-label="Collaboration Expand"
    >
      <path
        d="M12.0739 22.0401L11.0797 22.2731L2.28495 24.3323L1.835 24.4383L1.75386 23.9824L0.17944 15.1215L0.000675045 14.1214L0.850355 14.6785L3.71143 16.5539L4.88391 14.7779L5.6169 15.2592L4.20179 17.4011L3.96057 17.7661L3.59611 17.5262L1.21948 15.9666L2.53535 23.3742L9.88547 21.653L7.51406 20.0973L7.14679 19.8554L7.38943 19.4895L12.0348 12.4567L10.66 11.5549L11.1439 10.8239L12.8826 11.9643L13.2497 12.2062L13.0071 12.5721L8.3618 19.6049L11.2209 21.4796L12.0739 22.0401ZM7.18192 15.2394L2.68834 12.2852L7.31148 5.27335L7.5527 4.90811L7.18612 4.66756L3.73767 2.39848L14.0092 0.000265942L15.8607 10.3709L12.4108 8.10253L12.0463 7.86248L11.805 8.22765L7.1819 15.2395L7.18192 15.2394Z"
        fill="currentColor"
      />
    </svg>
  )
}
