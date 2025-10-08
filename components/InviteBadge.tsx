"use client"

import { Users } from 'lucide-react'
import { useRealtimeNetworkInvites } from '@/hooks/useRealtimeNetworkInvites'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'

export function InviteBadge() {
  const { userId } = useUser()
  const { pendingCount } = useRealtimeNetworkInvites(
    userId || '',
    'received',
    'pending'
  )

  if (!userId || pendingCount === 0) return null

  return (
    <Link href="/network" className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
      <Users className="w-5 h-5" />
      {/* Badge */}
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 rounded-full text-xs font-bold text-white flex items-center justify-center animate-pulse">
        {pendingCount > 9 ? '9+' : pendingCount}
      </span>
    </Link>
  )
}
