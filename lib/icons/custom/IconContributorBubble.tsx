import React from 'react'
import { cn } from '@/lib/utils'

interface IconContributorBubbleProps {
  className?: string
  size?: 16 | 20 | 24
  children?: React.ReactNode
}

/**
 * Contributor Bubble - hexagonal avatar container with lime border and blur backdrop
 * Used for contributor/user avatars, profile pictures
 * Usage:
 * <IconContributorBubble size={42}>
 *   <img src="avatar.jpg" alt="User" className="w-full h-full object-cover" />
 * </IconContributorBubble>
 */
export const IconContributorBubble = ({ className, size = 42, children }: IconContributorBubbleProps) => {
  return (
    <div
      className={cn('relative inline-block', className)}
      style={{ width: size, height: size }}
      aria-label="Contributor Avatar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 38 42"
        fill="none"
        className="absolute inset-0"
      >
        <foreignObject x="-4" y="-4" width="46" height="50">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              backdropFilter: 'blur(2px)',
              clipPath: 'url(#bgblur_clip_path)',
              height: '100%',
              width: '100%',
            }}
          />
        </foreignObject>
        <path
          d="M17.1113 0.899414C18.2797 0.234153 19.7203 0.234153 20.8887 0.899414L35.7158 9.34082C36.8836 10.0057 37.5996 11.233 37.5996 12.5576V29.4424C37.5996 30.767 36.8836 31.9943 35.7158 32.6592L20.8887 41.1006C19.7203 41.7658 18.2797 41.7658 17.1113 41.1006L2.28418 32.6592C1.1164 31.9943 0.400398 30.767 0.400391 29.4424V12.5576C0.4004 11.233 1.1164 10.0057 2.28418 9.34082L17.1113 0.899414Z"
          fill="#3B3B3B"
          stroke="#D1FD0A"
          strokeWidth="0.8"
        />
        <defs>
          <clipPath id="bgblur_clip_path" transform="translate(4 4)">
            <path d="M17.1113 0.899414C18.2797 0.234153 19.7203 0.234153 20.8887 0.899414L35.7158 9.34082C36.8836 10.0057 37.5996 11.233 37.5996 12.5576V29.4424C37.5996 30.767 36.8836 31.9943 35.7158 32.6592L20.8887 41.1006C19.7203 41.7658 18.2797 41.7658 17.1113 41.1006L2.28418 32.6592C1.1164 31.9943 0.400398 30.767 0.400391 29.4424V12.5576C0.4004 11.233 1.1164 10.0057 2.28418 9.34082L17.1113 0.899414Z" />
          </clipPath>
        </defs>
      </svg>
      {children && (
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
