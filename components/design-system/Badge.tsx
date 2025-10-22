import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface BadgeProps {
  variant?: 'live' | 'frozen' | 'launched' | 'hot' | 'new' | 'default'
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
}

export function Badge({ variant = 'default', children, icon: Icon, className }: BadgeProps) {
  const variantStyles = {
    live: 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30',
    frozen: 'bg-[#00FFFF]/10 text-[#00FFFF] border-[#00FFFF]/30',
    launched: 'bg-zinc-700/30 text-zinc-400 border-zinc-700/50',
    hot: 'bg-red-500/10 text-red-400 border-red-500/30',
    new: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    default: 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  )
}
