import React from 'react'
import { cn } from '@/lib/utils'

interface IconMotion4Props {
  className?: string
  size?: 16 | 20 | 24 | 32
}

/**
 * Motion 4 icon - motion indicator with blur/glow effect
 * Default: lime fill with opacity 0.3 and blur
 * Usage: <IconMotion4 className="fill-primary" size={32} />
 */
export const IconMotion4 = ({ className, size = 32 }: IconMotion4Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 36"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="Motion"
      style={{ filter: 'blur(5px)' }}
    >
      <g opacity="0.3" filter="url(#filter0_f_motion4)">
        <path
          d="M15.8353 10.0001C13.7101 10.0117 11.6243 10.5347 10.2098 11.3448L10 11.415C10.6658 13.4016 11.6421 14.7796 12.7595 15.9282L12.7008 18.2286L14.8999 19.2663C14.2521 21.2773 13.7232 23.6607 13.1814 26.0051H19.6976C19.3462 24.3983 18.9981 22.7835 18.6012 21.2756C19.4118 22.2341 20.1869 23.3768 20.8877 24.8321L21.4619 24.5561C20.6925 22.9581 19.8275 21.7147 18.9283 20.6822L19.9895 19.8544L18.371 16.2957L20.015 15.1451C19.3685 13.9362 18.7384 12.714 17.5507 11.9861C16.4423 12.6677 15.7779 13.9196 15.0885 15.1397L14.0923 16.3225C13.1073 15.4473 12.2179 14.5039 11.4979 13.2359C13.9828 11.3431 18.199 10.8914 21.7379 11.757C20.1619 10.4969 17.9785 9.98854 15.8353 10.0002V10.0001Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_motion4"
          x="0"
          y="0"
          width="31.7378"
          height="36.0039"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_motion4" />
        </filter>
      </defs>
    </svg>
  )
}
