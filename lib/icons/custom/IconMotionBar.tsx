import React from 'react'
import { cn } from '@/lib/utils'

interface IconMotionBarProps {
  className?: string
  width?: number
  height?: 8
  progress?: number // 0-100
}

/**
 * Motion Bar - progress bar for motion/community confidence
 * Features:
 * - Dark gray background (#2A2A2A) with inner shadow
 * - Lime to dark gradient fill
 * - Rounded ends (4px radius)
 * - Dynamic width based on progress
 *
 * Usage:
 * <IconMotionBar progress={85} width={142} />
 * <IconMotionBar progress={42} width={200} />
 */
export const IconMotionBar = ({
  className,
  width = 142,
  height = 8,
  progress = 0,
}: IconMotionBarProps) => {
  // Clamp progress between 0-100
  const clampedProgress = Math.max(0, Math.min(100, progress))
  const fillWidth = (width * clampedProgress) / 100

  return (
    <div
      className={cn('relative inline-block flex-shrink-0', className)}
      style={{ width, height }}
      aria-label={`Motion: ${clampedProgress}%`}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="absolute inset-0"
      >
        <defs>
          {/* Inner shadow filter */}
          <filter
            id="motion_bar_shadow"
            x="0"
            y="0"
            width={width}
            height={height + 3}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="3" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </filter>

          {/* Lime to dark gradient */}
          <linearGradient
            id="motion_bar_gradient"
            x1={fillWidth * 0.75}
            y1="0"
            x2={fillWidth * 0.75}
            y2={height * 1.27}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D1FD0A" />
            <stop offset="1" stopColor="#2F3900" />
          </linearGradient>
        </defs>

        {/* Background bar */}
        <g filter="url(#motion_bar_shadow)">
          <rect width={width} height={height} rx="4" fill="#2A2A2A" />
        </g>

        {/* Progress fill */}
        {fillWidth > 0 && (
          <rect width={fillWidth} height={height} rx="4" fill="url(#motion_bar_gradient)" />
        )}
      </svg>
    </div>
  )
}
