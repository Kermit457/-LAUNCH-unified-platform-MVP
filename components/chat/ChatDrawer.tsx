'use client'

import { useEffect, useState } from 'react'
import { X, Users, Hash } from 'lucide-react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useNetworkStore } from '@/lib/stores/useNetworkStore'
import { useUser } from '@/hooks/useUser'
import { getThreadMessages, sendMessage, markThreadAsRead as markThreadRead } from '@/lib/appwrite/services/messages'
import type { Message as AppwriteMessage } from '@/lib/appwrite/services/messages'

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const { userId } = useUser()
  const activeThreadId = useNetworkStore(state => state.activeThreadId)
  const getThreadById = useNetworkStore(state => state.getThreadById)
  const connections = useNetworkStore(state => state.connections)

  const [messages, setMessages] = useState<Array<{ id: string; threadId: string; fromUserId: string; fromHandle: string; content: string; sentAt: number }>>([])
  const [loading, setLoading] = useState(false)

  const thread = activeThreadId ? getThreadById(activeThreadId) : null

  // Fetch messages from Appwrite when thread changes
  useEffect(() => {
    async function fetchMessages() {
      if (!activeThreadId) return

      try {
        setLoading(true)
        const appwriteMessages = await getThreadMessages(activeThreadId)

        // Convert to component format
        const formattedMessages = appwriteMessages.map(m => ({
          id: m.$id,
          threadId: m.threadId,
          fromUserId: m.senderId,
          fromHandle: '@user', // TODO: Fetch user details
          content: m.content,
          sentAt: new Date(m.$createdAt).getTime()
        }))

        setMessages(formattedMessages)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [activeThreadId])

  // Mark thread as read when opened
  useEffect(() => {
    async function markAsRead() {
      if (isOpen && activeThreadId && userId) {
        try {
          await markThreadRead(activeThreadId, userId)
        } catch (error) {
          console.error('Failed to mark thread as read:', error)
        }
      }
    }

    markAsRead()
  }, [isOpen, activeThreadId, userId])

  const handleSend = async (content: string) => {
    if (!activeThreadId || !userId) return

    try {
      const message = await sendMessage({
        threadId: activeThreadId,
        senderId: userId,
        content
      })

      // Add to local state optimistically
      const newMessage = {
        id: message.$id,
        threadId: message.threadId,
        fromUserId: message.senderId,
        fromHandle: '@you',
        content: message.content,
        sentAt: new Date(message.$createdAt).getTime()
      }

      setMessages(prev => [...prev, newMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
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