'use client'

import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle, Send, LogIn } from 'lucide-react'
import { CommentItem } from './CommentItem'
import { useComments } from '@/hooks/useComments'
import { useJoinGate } from '@/hooks/useJoinGate'

interface CommentsModalProps {
  open: boolean
  onClose: () => void
  launchId: string
  launchTitle: string
}

export function CommentsModal({ open, onClose, launchId, launchTitle }: CommentsModalProps) {
  const [text, setText] = useState('')
  const [liveMessage, setLiveMessage] = useState('') // For screen reader announcements
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { comments, loading, addComment, deleteComment } = useComments(launchId)
  const { isSignedIn, hasJoined, userName, signIn, joinLaunch } = useJoinGate(launchId)

  // Close on ESC key
  useEffect(() => {
    if (!open) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // Focus textarea when joined
  useEffect(() => {
    if (open && hasJoined && textareaRef.current) {
      // Delay to allow modal animation to complete
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [open, hasJoined])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim() || !userName) return

    addComment(text.trim(), userName)
    setText('')
    setLiveMessage('Comment posted successfully')

    // Clear live message after announcement
    setTimeout(() => setLiveMessage(''), 2000)
  }

  const handleDelete = (commentId: string) => {
    deleteComment(commentId)
    setLiveMessage('Comment deleted')
    setTimeout(() => setLiveMessage(''), 2000)
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container - Centered */}
      <div className="fixed inset-0 grid place-items-center z-50 p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="comments-title"
          className="w-full max-w-2xl md:max-w-3xl max-h-[80vh] rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Sticky */}
          <div className="sticky top-0 bg-neutral-900/95 backdrop-blur px-5 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex-1 min-w-0 mr-4">
              <h2
                id="comments-title"
                className="text-xl font-bold text-white flex items-center gap-2 mb-1"
              >
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                Comments
              </h2>
              <p className="text-sm text-white/60 truncate">{launchTitle}</p>
              <div className="mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 inline-block">
                💬 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close comments"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="overflow-y-auto p-5 space-y-3 flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDelete}
                  canDelete={userName === comment.author}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/60 font-medium mb-1">No comments yet</p>
                <p className="text-sm text-white/40">Be the first to comment!</p>
              </div>
            )}
          </div>

          {/* Footer - Sticky, Conditional */}
          <div className="sticky bottom-0 bg-neutral-900/95 backdrop-blur p-4 border-t border-white/10 flex-shrink-0">
            {!isSignedIn ? (
              // Not signed in - Show connect button
              <button
                onClick={signIn}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Connect to comment
              </button>
            ) : !hasJoined ? (
              // Signed in but not joined - Show join gate
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-white/60">Join this launch to comment.</span>
                <button
                  onClick={joinLaunch}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors whitespace-nowrap"
                >
                  Join Launch
                </button>
              </div>
            ) : (
              // Joined - Show comment input
              <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts..."
                  maxLength={400}
                  className="w-full resize-none h-24 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 outline-none transition-all"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    {text.length}/400
                  </span>
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Live region for screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>
    </>
  )
}
