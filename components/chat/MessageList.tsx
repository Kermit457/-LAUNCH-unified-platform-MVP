'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MessageListProps {
  messages: Message[]
  currentUserId?: string
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return new Date(timestamp).toLocaleDateString()
}

export function MessageList({ messages, currentUserId = 'current_user' }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm">No messages yet</p>
          <p className="text-white/30 text-xs mt-1">Start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwn = message.fromUserId === currentUserId
        const prevMessage = index > 0 ? messages[index - 1] : null
        const showAvatar = !prevMessage || prevMessage.fromUserId !== message.fromUserId

        return (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              isOwn ? 'flex-row-reverse' : 'flex-row',
              !showAvatar && 'ml-12'
            )}
          >
            {/* Avatar */}
            {showAvatar && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {message.fromHandle?.slice(1, 3).toUpperCase() || 'U'}
              </div>
            )}

            {/* Message bubble */}
            <div className={cn('flex-1 max-w-[70%]', isOwn && 'flex justify-end')}>
              <div>
                {/* Header (only on first message in group) */}
                {showAvatar && !isOwn && (
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-medium text-white/80">
                      {message.fromHandle || 'Unknown'}
                    </span>
                    <span className="text-xs text-white/40">
                      {timeAgo(message.sentAt)}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2.5',
                    isOwn
                      ? 'bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 border border-fuchsia-500/30'
                      : 'bg-white/5 border border-white/10'
                  )}
                >
                  <p className="text-sm text-white whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>

                {/* Timestamp for own messages */}
                {isOwn && showAvatar && (
                  <div className="text-xs text-white/40 text-right mt-1 px-1">
                    {timeAgo(message.sentAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
