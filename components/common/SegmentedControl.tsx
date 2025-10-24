'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SegmentedControlProps<T extends string> {
  options: T[]
  value: T
  onChange: (value: T) => void
  icons?: LucideIcon[]
  fullWidth?: boolean
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  icons,
  fullWidth = false
}: SegmentedControlProps<T>) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10",
      fullWidth && "w-full"
    )}>
      {options.map((option, index) => {
        const Icon = icons?.[index]
        const isActive = value === option

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80",
              isActive
                ? "bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              {Icon && <Icon className="w-4 h-4" />}
              {option}
            </div>
          </button>
        )
      })}
    </div>
  )
}
