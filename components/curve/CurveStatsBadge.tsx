'use client'

import { LucideIcon } from 'lucide-react'

interface CurveStatsBadgeProps {
  icon: LucideIcon
  label: string
  value: string | number
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export const CurveStatsBadge = ({
  icon: Icon,
  label,
  value,
  variant = 'default'
}: CurveStatsBadgeProps) => {
  const variantStyles = {
    default: 'bg-white/5 border-white/10 text-gray-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400'
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm ${variantStyles[variant]}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs opacity-75">{label}:</span>
        <span className="text-sm font-bold text-white">{value}</span>
      </div>
    </div>
  )
}
