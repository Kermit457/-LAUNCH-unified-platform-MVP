import * as React from "react"
import { cn } from "@/lib/cn"

interface Contributor {
  avatar: string
  name: string
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  contributors: Contributor[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function AvatarGroup({
  contributors,
  max = 5,
  size = 'md',
  label,
  className,
  ...props
}: AvatarGroupProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const visible = contributors.slice(0, max)
  const overflow = contributors.length - max

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {label && <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>}
      <div className="flex -space-x-2">
        {visible.map((contributor, idx) => (
          <img
            key={idx}
            src={contributor.avatar}
            alt={contributor.name}
            title={contributor.name}
            className={cn(
              'rounded-full border-2 border-[#0f0f12]',
              sizes[size]
            )}
          />
        ))}
        {overflow > 0 && (
          <div
            className={cn(
              'rounded-full bg-white/10 border-2 border-[#0f0f12] flex items-center justify-center text-xs text-white/60 font-medium',
              sizes[size]
            )}
          >
            +{overflow}
          </div>
        )}
      </div>
    </div>
  )
}
