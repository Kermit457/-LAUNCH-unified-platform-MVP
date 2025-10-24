import React from 'react'
import { cn } from '@/lib/utils'

interface IconMotionScoreBadgeProps {
  className?: string
  size?: 28 | 30 | 32
  score?: number | string
}

/**
 * Motion Score Badge - hexagonal badge for displaying motion scores
 * Shows score with LED Dot-Matrix font
 * Default: dark gray fill (#2A2A2A) with gray border (#3B3B3B)
 *
 * Usage:
 * <IconMotionScoreBadge score={85} size={30} />
 * <IconMotionScoreBadge score="42%" size={30} />
 */
export const IconMotionScoreBadge = ({
  className,
  size = 30,
  score = 0,
}: IconMotionScoreBadgeProps) => {
  return (
    <div
      className={cn('relative inline-block flex-shrink-0', className)}
      style={{ width: size, height: size + 2 }}
      aria-label={`Motion Score: ${score}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size + 2}
        viewBox="0 0 30 32"
        fill="none"
        className="absolute inset-0"
      >
        <foreignObject x="-4" y="-4" width="37.5996" height="39.6016">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              backdropFilter: 'blur(2px)',
              clipPath: 'url(#motion_score_clip_path)',
              height: '100%',
              width: '100%',
            }}
          />
        </foreignObject>
        <path
          d="M13.0693 0.844727C14.141 0.25324 15.4586 0.253239 16.5303 0.844727L27.4561 6.875C28.5292 7.46749 29.2002 8.56864 29.2002 9.77051V21.8311C29.2002 23.0329 28.5292 24.1341 27.4561 24.7266L16.5303 30.7568C15.4586 31.3483 14.141 31.3483 13.0693 30.7568L2.14355 24.7266C1.07044 24.1341 0.399419 23.0329 0.399414 21.8311V9.77051C0.399421 8.56864 1.07044 7.46749 2.14355 6.875L13.0693 0.844727Z"
          fill="#2A2A2A"
          stroke="#3B3B3B"
          strokeWidth="0.8"
        />
        <defs>
          <clipPath id="motion_score_clip_path" transform="translate(4 4)">
            <path d="M13.0693 0.844727C14.141 0.25324 15.4586 0.253239 16.5303 0.844727L27.4561 6.875C28.5292 7.46749 29.2002 8.56864 29.2002 9.77051V21.8311C29.2002 23.0329 28.5292 24.1341 27.4561 24.7266L16.5303 30.7568C15.4586 31.3483 14.141 31.3483 13.0693 30.7568L2.14355 24.7266C1.07044 24.1341 0.399419 23.0329 0.399414 21.8311V9.77051C0.399421 8.56864 1.07044 7.46749 2.14355 6.875L13.0693 0.844727Z" />
          </clipPath>
        </defs>
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-primary"
        style={{
          fontFamily: '"LED Dot-Matrix", monospace',
          fontSize: '15px',
          fontWeight: 400,
          letterSpacing: '-0.6px',
          lineHeight: 'normal',
        }}
      >
        {score}
      </div>
    </div>
  )
}
