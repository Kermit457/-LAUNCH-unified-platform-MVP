import { cn } from '@/lib/utils'

interface FilterPillProps {
  label: string
  active?: boolean
  onClick?: () => void
  count?: number
  className?: string
}

export function FilterPill({ label, active, onClick, count, className }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-all active:scale-95',
        'border border-zinc-800 hover:border-zinc-700',
        active
          ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30'
          : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-300',
        className
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'ml-2 px-1.5 py-0.5 rounded-full text-xs',
            active ? 'bg-[#00FF88]/20' : 'bg-zinc-800'
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
