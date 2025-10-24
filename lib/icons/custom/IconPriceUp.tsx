import React from 'react'
import { IconProps } from '../types'

export const IconPriceUp: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.5}
      viewBox="0 0 22 11"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M10.6218 2.4892L2.49013 8.03879L18.7141 8.0606L10.6218 2.4892Z"
        stroke="#D1FD0A"
        strokeWidth="4.97842"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
