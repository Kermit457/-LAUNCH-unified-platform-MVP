'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, ThumbsUp, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CommentsDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    name: string
    ticker: string
  }
}

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  upvotes: number
  hasUpvoted: boolean
  timestamp: number
}

export function CommentsDrawer({ isOpen, onClose, project }: CommentsDrawerProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { name: 'CryptoWhale', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=whale' },
      content: 'This project has massive potential. The team is shipping fast.',
      upvotes: 24,
      hasUpvoted: false,
      timestamp: Date.now() - 1000 * 60 * 5
    },
    {
      id: '2',
      user: { name: 'BuilderDao', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=builder' },
      content: 'Love the tokenomics and community focus. All in!',
      upvotes: 18,
      hasUpvoted: true,
      timestamp: Date.now() - 1000 * 60 * 15
    },
    {
      id: '3',
      user: { name: 'DeFiMaxi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi' },
      content: 'When mainnet launch? Looking forward to this.',
      upvotes: 12,
      hasUpvoted: false,
      timestamp: Date.now() - 1000 * 60 * 30
    }
  ])

  const [newComment, setNewComment] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus textarea on mount
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleUpvote = (commentId: string): void => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          upvotes: comment.hasUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
          hasUpvoted: !comment.hasUpvoted
        }
      }
      return comment
    }))
  }

  const handleSubmitComment = (): void => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you'
      },
      content: newComment,
      upvotes: 0,
      hasUpvoted: false,
      timestamp: Date.now()
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  const formatTimestamp = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed inset-y-0 right-0 w-full md:w-[480px] glass-premium border-l border-zinc-800 z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="comments-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-7 h-7 text-[#D1FD0A]" />
                <div>
                  <h2 id="comments-title" className="text-2xl font-bold">Comments</h2>
                  <p className="text-sm text-zinc-400">{project.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="icon-interactive p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                aria-label="Close drawer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400">No comments yet</p>
                  <p className="text-sm text-zinc-500 mt-1">Be the first to share your thoughts</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="glass-interactive p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.user.name}</span>
                          <span className="text-xs text-zinc-500">{formatTimestamp(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm text-zinc-300 mb-3">{comment.content}</p>
                        <button
                          onClick={() => handleUpvote(comment.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                            comment.hasUpvoted
                              ? 'bg-[#D1FD0A]/10 border border-[#D1FD0A]/30 text-[#D1FD0A]'
                              : 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:border-[#D1FD0A]/30 hover:text-[#D1FD0A]'
                          }`}
                          aria-label={`${comment.hasUpvoted ? 'Remove' : 'Add'} upvote`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="text-xs font-led-15">{comment.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="p-6 bg-black/95 backdrop-blur-xl border-t border-zinc-800 flex-shrink-0">
              <div className="flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500 resize-none"
                  rows={3}
                  maxLength={500}
                  aria-label="Write a comment"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-zinc-500">{newComment.length}/500</span>
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={16} />
                  Post
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
