import { cn } from '@/lib/cn'

type Status = 'live' | 'paused' | 'ended' | 'pending' | 'approved' | 'rejected' | 'needs_fix' | 'claimable' | 'paid'

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'live':
        return 'bg-green-500/20 text-green-300 border-green-500/40'
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
      case 'ended':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40'
      case 'pending':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40'
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/40'
      case 'needs_fix':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40'
      case 'claimable':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
      case 'paid':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      default:
        return 'bg-white/10 text-white/70 border-white/20'
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'needs_fix':
        return 'Needs Fix'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border',
        getStyles(),
        className
      )}
      role="status"
    >
      {getLabel()}
    </span>
  )
}