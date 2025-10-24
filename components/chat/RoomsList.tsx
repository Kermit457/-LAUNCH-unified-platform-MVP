'use client'

import { useState, useEffect } from 'react'
import { getUserThreads, type Thread as AppwriteThread } from '@/lib/appwrite/services/messages'
import { Hash, Users, MessageCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'

interface RoomsListProps {
  onThreadClick: (threadId: string) => void
  filterType?: 'dm' | 'group'
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

export function RoomsList({ onThreadClick, filterType }: RoomsListProps) {
  const { address } = useWallet()
  const [threads, setThreads] = useState<AppwriteThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchThreads() {
      if (!address) {
        setLoading(false)
        setError('Please connect your wallet')
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getUserThreads(address)
        setThreads(data)
      } catch (err: any) {
        console.error('Failed to fetch threads:', err)
        setError(err.message || 'Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchThreads()
  }, [address])

  // Filter by type if specified
  const filteredThreads = filterType
    ? threads.filter(t => t.type === filterType)
    : threads

  if (loading) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-[#D1FD0A] border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-4" />
        <p className="text-xs md:text-base text-zinc-400">Loading conversations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 md:w-8 md:h-8 text-red-400" />
        </div>
        <p className="text-red-400 text-xs md:text-sm font-medium mb-1 md:mb-2">{error}</p>
        <p className="text-[9px] md:text-xs text-zinc-600">Please connect your wallet and try again</p>
      </div>
    )
  }

  if (filteredThreads.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 md:w-8 md:h-8 text-zinc-600" />
        </div>
        <p className="text-zinc-400 text-xs md:text-sm">No conversations yet</p>
        <p className="text-[9px] md:text-xs text-zinc-600 mt-1 md:mt-2">Start a new chat to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
      {filteredThreads.map(thread => {
        const lastMessageTime = thread.lastMessageAt
          ? new Date(thread.lastMessageAt).getTime()
          : Date.now()

        return (
          <div
            key={thread.$id}
            onClick={() => onThreadClick(thread.$id)}
            className="p-3 md:p-4 min-h-[64px] rounded-lg md:rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D1FD0A]/50 active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 md:gap-3">
              {/* Icon - Mobile Optimized */}
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-md md:rounded-lg bg-gradient-to-br from-[#D1FD0A]/20 to-[#00FFFF]/20 border border-[#D1FD0A]/30 flex items-center justify-center flex-shrink-0">
                {thread.type === 'dm' ? (
                  <MessageCircle className="w-4 h-4 md:w-6 md:h-6 text-[#D1FD0A]" />
                ) : (
                  <Hash className="w-4 h-4 md:w-6 md:h-6 text-[#00FFFF]" />
                )}
              </div>

              {/* Info - Mobile Optimized */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-xs md:text-sm truncate mb-0.5 md:mb-1">
                  {thread.name || (thread.type === 'dm' ? 'Direct Message' : 'Group Chat')}
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-[9px] md:text-xs text-zinc-500">
                  <Users className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  {thread.participantIds.length} members
                  <span>•</span>
                  <span>{timeAgo(lastMessageTime)}</span>
                </div>
              </div>
            </div>

            {/* Tags - Mobile Optimized */}
            {(thread.projectId || thread.campaignId) && (
              <div className="mt-1.5 md:mt-3 flex gap-1 md:gap-2">
                {thread.projectId && (
                  <span className="px-1.5 py-0.5 md:px-2 rounded-full text-[9px] md:text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Project
                  </span>
                )}
                {thread.campaignId && (
                  <span className="px-1.5 py-0.5 md:px-2 rounded-full text-[9px] md:text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                    Campaign
                  </span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}