'use client'

import { Trash2 } from 'lucide-react'
import { Comment } from '@/types'

interface CommentItemProps {
  comment: Comment
  onDelete?: (commentId: string) => void
  canDelete?: boolean
}

/**
 * Format timestamp to relative time (e.g., "2m ago", "5h ago", "3d ago")
 */
function formatTime(timestamp: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function CommentItem({ comment, onDelete, canDelete = false }: CommentItemProps) {
  const { id, author, text, timestamp, avatar } = comment

  return (
    <div className="rounded-xl bg-white/5 p-3 border border-white/10 hover:border-white/15 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar - show image if available, otherwise gradient circle with initial */}
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-lime-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {author?.[0]?.toUpperCase() || '?'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Author + timestamp + delete button */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">{author}</span>
            <span className="text-xs text-white/40">{formatTime(timestamp)}</span>

            {canDelete && onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="ml-auto p-1 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs"
                aria-label="Delete comment"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>

          {/* Comment text */}
          <p className="text-sm text-white/80 whitespace-pre-wrap break-words">{text}</p>
        </div>
      </div>
    </div>
  )
}
