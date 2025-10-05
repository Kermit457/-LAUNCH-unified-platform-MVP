'use client'

import { useEffect } from 'react'
import { X, Users, Hash } from 'lucide-react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useNetworkStore } from '@/lib/stores/useNetworkStore'
import { generateId } from '@/lib/utils'

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const activeThreadId = useNetworkStore(state => state.activeThreadId)
  const getThreadById = useNetworkStore(state => state.getThreadById)
  const getThreadMessages = useNetworkStore(state => state.getThreadMessages)
  const connections = useNetworkStore(state => state.connections)
  const addMessage = useNetworkStore(state => state.addMessage)
  const markThreadAsRead = useNetworkStore(state => state.markThreadAsRead)

  const thread = activeThreadId ? getThreadById(activeThreadId) : null
  const messages = activeThreadId ? getThreadMessages(activeThreadId) : []

  useEffect(() => {
    if (isOpen && activeThreadId) {
      markThreadAsRead(activeThreadId)
    }
  }, [isOpen, activeThreadId, markThreadAsRead])

  const handleSend = (content: string) => {
    if (!activeThreadId) return

    const newMessage = {
      id: generateId(),
      threadId: activeThreadId,
      fromUserId: 'current_user',
      fromHandle: '@alpha_fren',
      content,
      sentAt: Date.now()
    }

    addMessage(newMessage)
  }

  if (!isOpen || !thread) return null

  // Get thread display name
  let threadName = ''
  if (thread.type === 'group') {
    threadName = thread.name || 'Unnamed Room'
  } else {
    // For DM, show the other user's name
    const otherUserId = thread.participantUserIds[0]
    const otherUser = connections.find(c => c.userId === otherUserId)
    threadName = otherUser?.handle || 'Direct Message'
  }

  // Get participant count
  const participantCount = thread.type === 'group' ? thread.participantUserIds.length + 1 : 2

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] bg-[#0B0F1A] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
              {thread.type === 'group' ? (
                <Hash className="w-5 h-5 text-fuchsia-400" />
              ) : (
                <Users className="w-5 h-5 text-fuchsia-400" />
              )}
            </div>

            {/* Thread info */}
            <div>
              <h2 className="text-lg font-bold text-white">{threadName}</h2>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Users className="w-3 h-3" />
                <span>{participantCount} participants</span>
                {thread.projectId && (
                  <>
                    <span>·</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      Project
                    </span>
                  </>
                )}
                {thread.campaignId && (
                  <>
                    <span>·</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                      Campaign
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <MessageList messages={messages} currentUserId="current_user" />

        {/* Input */}
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}