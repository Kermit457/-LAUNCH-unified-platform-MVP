import { cn } from '@/lib/cn'

interface StatusBadgeProps {
  status: 'live' | 'upcoming' | 'active' | 'ended' | string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  }

  const statusStyles = {
    live: 'bg-[#D1FD0A] text-black border-2 border-[#B8E309]',
    upcoming: 'bg-zinc-800 text-zinc-400 border-2 border-zinc-700',
    active: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-2 border-[#D1FD0A]/30',
    ended: 'bg-zinc-900 text-zinc-500 border-2 border-zinc-800'
  }

  const style = statusStyles[status.toLowerCase()] || statusStyles.active

  return (
    <span
      className={cn(
        'inline-block rounded-md font-black uppercase tracking-wider',
        sizes[size],
        style,
        className
      )}
    >
      {status.toUpperCase()}
    </span>
  )
}

// Specific LIVE badge with exact BTDemo styling - box frame design
export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wide',
        className
      )}
      style={{
        background: 'rgba(209, 253, 10, 0.1)',
        color: '#D1FD0A',
        border: '1px solid rgba(209, 253, 10, 0.3)',
        boxShadow: '0 0 6px rgba(209, 253, 10, 0.1)',
      }}
    >
      LIVE
    </span>
  )
}