import React from 'react'
import { IconProps } from '../types'

interface PriceChangeIconProps extends IconProps {
  direction?: 'up' | 'down'
}

export const IconPriceChange: React.FC<PriceChangeIconProps> = ({
  size = 24,
  className = '',
  direction = 'up',
  ...props
}) => {
  const isUp = direction === 'up'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.5} // Maintain aspect ratio (22x11)
      viewBox="0 0 22 11"
      fill="none"
      className={className}
      style={{ transform: 'rotate(-90.202deg)' }}
      {...props}
    >
      <path
        d={isUp
          ? "M10.6218 2.4892L2.49013 8.03879L18.7141 8.0606L10.6218 2.4892Z"
          : "M10.6218 8.06059L2.49013 2.51099L18.7141 2.48919L10.6218 8.06059Z"
        }
        stroke={isUp ? '#D1FD0A' : '#FF005C'}
        strokeWidth="4.97842"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Export individual components for convenience
export const IconPriceUp: React.FC<IconProps> = (props) => (
  <IconPriceChange {...props} direction="up" />
)

export const IconPriceDown: React.FC<IconProps> = (props) => (
  <IconPriceChange {...props} direction="down" />
)
