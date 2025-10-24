'use client'

import { useEffect, useState } from 'react'
import { X, Users, Hash } from 'lucide-react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { sendMessage, markThreadAsRead as markThreadRead, getUserThreads, type Thread } from '@/lib/appwrite/services/messages'
import { useWallet } from '@/contexts/WalletContext'

interface ChatDrawerProps {
  threadId: string
  isOpen: boolean
  onClose: () => void
}

export function ChatDrawer({ threadId, isOpen, onClose }: ChatDrawerProps) {
  const { address } = useWallet()
  const { messages, loading, error } = useRealtimeMessages(threadId)
  const [thread, setThread] = useState<Thread | null>(null)

  // Fetch thread data
  useEffect(() => {
    async function fetchThread() {
      if (!threadId || !address) return

      try {
        const threads = await getUserThreads(address)
        const currentThread = threads.find(t => t.$id === threadId)
        if (currentThread) setThread(currentThread)
      } catch (error) {
        console.error('Failed to fetch thread:', error)
      }
    }

    fetchThread()
  }, [threadId, address])

  // Mark thread as read when opened
  useEffect(() => {
    async function markAsRead() {
      if (isOpen && threadId && address) {
        try {
          await markThreadRead(threadId, address)
        } catch (error) {
          console.error('Failed to mark thread as read:', error)
        }
      }
    }

    markAsRead()
  }, [isOpen, threadId, address])

  const handleSend = async (content: string) => {
    if (!threadId || !address || !thread) return

    try {
      // Determine receiverId from thread participants
      const receiverId = thread.participantIds.find(id => id !== address) || thread.participantIds[0]

      await sendMessage({
        threadId,
        senderId: address,
        receiverId,
        text: content
      })
      // Realtime hook will automatically update messages
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (!isOpen) return null

  // Format messages for MessageList component
  const formattedMessages = messages.map(m => ({
    id: m.id,
    threadId: m.threadId,
    fromUserId: m.fromUserId,
    fromHandle: m.fromHandle || '@user',
    content: m.content,
    sentAt: m.sentAt,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/90 md:bg-black/80 backdrop-blur-sm">
      <div className="w-full md:max-w-4xl h-[95vh] md:h-[80vh] bg-black md:bg-zinc-900 rounded-t-2xl md:rounded-2xl border-t border-zinc-800 md:border flex flex-col overflow-hidden shadow-2xl">
        {/* Header - Mobile Optimized */}
        <div className="flex items-center justify-between px-3 py-2.5 md:px-6 md:py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Icon */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#D1FD0A]/20 to-[#00FFFF]/20 border border-[#D1FD0A]/30 flex items-center justify-center">
              {thread?.type === 'dm' ? (
                <Hash className="w-4 h-4 md:w-5 md:h-5 text-[#D1FD0A]" />
              ) : (
                <Hash className="w-4 h-4 md:w-5 md:h-5 text-[#00FFFF]" />
              )}
            </div>

            {/* Thread info */}
            <div>
              <h2 className="text-sm md:text-lg font-bold text-white">
                {thread?.name || (thread?.type === 'dm' ? 'Direct Message' : 'Chat Room')}
              </h2>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-zinc-500">
                <Users className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span>{thread?.type === 'dm' ? 'Direct message' : 'Group conversation'}</span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Messages */}
        <MessageList messages={formattedMessages} currentUserId={address || 'current_user'} />

        {/* Input */}
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}