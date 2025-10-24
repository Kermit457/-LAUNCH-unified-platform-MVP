import React from 'react'
import { IconProps } from '../types'

export const IconPriceDown: React.FC<IconProps> = ({
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
        d="M10.6218 8.06059L2.49013 2.51099L18.7141 2.48919L10.6218 8.06059Z"
        stroke="#FF005C"
        strokeWidth="4.97842"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
