import React from 'react'
import { cn } from '@/lib/utils'

interface IconMessageProps {
  className?: string
  size?: 16 | 20 | 24
}

/**
 * Message icon - represents chat, messaging, communication
 * Default: inherits currentColor (use with text-* classes)
 * Usage: <IconMessage className="text-primary" size={20} />
 */
export const IconMessage = ({ className, size = 20 }: IconMessageProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 55 55"
      fill="none"
      className={cn('inline-block', className)}
      aria-label="Message"
    >
      <path
        d="M19.6348 8.60742C19.9965 10.7019 20.7743 14.2653 21.6893 17.7182C22.5623 21.0121 23.5939 24.1766 24.3817 25.7815C30.6087 25.6782 40.3029 23.9868 51.4888 20.8031C41.6322 13.2811 31.2413 10.1279 19.6348 8.60742ZM17.688 9.1311C10.639 14.6357 6.25508 22.0331 2.81006 30.2126C8.70387 26.0758 14.8031 23.7222 20.998 22.5958C20.5688 21.2384 20.1515 19.7506 19.7491 18.2318C18.8441 14.8168 18.0783 11.3439 17.6879 9.131L17.688 9.1311ZM52.308 22.6562C44.3456 24.9354 37.1153 26.489 31.2265 27.2552C33.8065 32.819 35.1418 38.7158 35.9195 44.5433C43.5072 38.2312 49.3859 31.8143 52.3081 22.6561L52.308 22.6562ZM21.649 24.5225C15.5729 25.5878 9.64134 27.8468 3.86419 31.9246C13.4761 38.5199 24.2647 42.3485 33.9288 44.7985C33.1379 38.8842 31.7692 32.9824 29.1217 27.5004C27.1462 27.7041 25.3475 27.8092 23.7572 27.8092H23.1832L22.8912 27.3124C22.4725 26.5937 22.0565 25.6368 21.6491 24.5226L21.649 24.5225Z"
        fill="currentColor"
      />
    </svg>
  )
}
