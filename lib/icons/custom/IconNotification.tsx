import React from 'react'
import { IconProps } from '../types'

interface NotificationIconProps extends IconProps {
  hasAlert?: boolean
}

export const IconNotification: React.FC<NotificationIconProps> = ({
  size = 24,
  className = '',
  hasAlert = false,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 1.1}
      viewBox="0 0 20 22"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M1.9204 17.3831H18.0796C19.2438 17.3831 20 16.6766 20 15.6418C20 14.4776 19.1343 13.5622 18.1791 12.7562C17.403 12.0896 17.2637 10.6169 17.0348 8.96517C16.7463 5.66169 15.5622 3.18408 13.1244 2.31841C12.6567 0.975124 11.4726 0 10 0C8.52736 0 7.34328 0.975124 6.87562 2.31841C4.42786 3.18408 3.25373 5.66169 2.95522 8.96517C2.73632 10.6169 2.59701 12.0896 1.81095 12.7562C0.865672 13.5622 0 14.4776 0 15.6418C0 16.6766 0.746269 17.3831 1.9204 17.3831ZM10 21.6915C11.8905 21.6915 13.2836 20.3781 13.403 18.8259H6.58706C6.71642 20.3781 8.0995 21.6915 10 21.6915Z"
        fill="currentColor"
      />
      {hasAlert && (
        <ellipse cx="15.8333" cy="7.5" rx="3.33333" ry="3.33333" fill="#FF005C" />
      )}
    </svg>
  )
}
