import React from 'react'
import { cn } from '@/lib/utils'

interface IconGemProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Gem icon - represents premium, value, rewards
 * Default: black fill
 * Usage: <IconGem className="fill-primary" size={20} />
 */
export const IconGem = ({ className, size = 20 }: IconGemProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 23 17"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Gem"
    >
      <path
        d="M3.50395 4.72069e-05L6.33698 3.73833L9.99909 4.72069e-05H3.50395ZM12.375 4.72069e-05L15.9888 3.6885L18.7398 0H12.375L12.375 4.72069e-05ZM11.187 0.0395626L7.21589 4.09284H15.1582L11.187 0.0395626ZM19.5264 0.410156L16.7783 4.0928H22.3301L19.5265 0.410156H19.5264ZM2.74219 0.445312L0.03375 4.0928H5.50781L2.74219 0.445312ZM0 4.96875L9.76908 15.6754L5.86823 4.96866H4.68493e-05L0 4.96875ZM6.79983 4.96875L11.187 17.0083L15.5742 4.96875H6.79992H6.79983ZM16.5058 4.96875L12.6051 15.6754L22.3741 4.96866H16.5059L16.5058 4.96875Z"
        fill="currentColor"
      />
    </svg>
  )
}
