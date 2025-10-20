'use client'

import { useState, useEffect } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Comment, Project } from '@/types'
import { GlassCard, PremiumButton, Input, Label } from '@/components/design-system'
import { useToast } from '@/hooks/useToast'
import { usePrivy } from '@privy-io/react-auth'
import { getComments, createComment } from '@/lib/appwrite/services/comments'

interface CommentsDrawerProps {
  project: Project
  open: boolean
  onClose: () => void
  onAddComment: (comment: Comment) => void
}

export function CommentsDrawer({ project, open, onClose, onAddComment }: CommentsDrawerProps) {
  const { authenticated, user } = usePrivy()
  const [text, setText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error: showError } = useToast()

  // Load comments when drawer opens
  useEffect(() => {
    if (open && project.id) {
      setIsLoading(true)
      getComments(project.id)
        .then(loadedComments => {
          // Map Appwrite Comment format to local Comment format
          const mappedComments = loadedComments.map(c => ({
            id: c.$id,
            author: c.username,
            text: c.content,
            timestamp: new Date(c.createdAt),
          }))
          setComments(mappedComments)
        })
        .catch(err => {
          console.error('Failed to load comments:', err)
          showError('Failed to load comments', err.message)
        })
        .finally(() => setIsLoading(false))
    }
  }, [open, project.id])

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000)

    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authenticated || !user?.id) {
      alert('Please connect your wallet to comment')
      return
    }

    if (!text.trim()) return
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const username = user.twitter?.username || user.email?.address || 'Anonymous'

      const newComment = await createComment({
        launchId: project.id,
        userId: user.id,
        username,
        content: text.trim(),
      })

      // Map to local format
      const mappedComment: Comment = {
        id: newComment.$id,
        author: newComment.username,
        text: newComment.content,
        timestamp: new Date(newComment.createdAt),
      }

      // Add to local state
      setComments(prev => [mappedComment, ...prev])

      // Call parent callback
      onAddComment(mappedComment)

      setText('')
      success('Comment posted!', 'Your comment is now visible to everyone')

      // Scroll to top to see new comment
      setTimeout(() => {
        const commentsList = document.getElementById('comments-list')
        if (commentsList) {
          commentsList.scrollTop = 0
        }
      }, 100)
    } catch (err: any) {
      console.error('Failed to post comment:', err)
      showError('Failed to post comment', err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full sm:w-[400px] bg-design-zinc-950/95 backdrop-blur-xl border-l border-design-zinc-800 shadow-2xl z-50 flex flex-col',
          'animate-in slide-in-from-right duration-300'
        )}
      >
        {/* Header */}
        <div className="border-b border-design-zinc-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-design-purple-400" />
              Comments
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-design-zinc-800/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-design-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-design-zinc-400 line-clamp-1">{project.title}</p>
          <div className="mt-2 px-3 py-1 bg-design-zinc-900/50 border border-design-zinc-800 rounded-full text-xs text-design-zinc-400 inline-block">
            💬 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </div>
        </div>

        {/* Comments List */}
        <div id="comments-list" className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-design-zinc-400">Loading comments...</div>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <GlassCard key={comment.id} className="p-4 space-y-2">
                {/* Author & Time */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-design-pink-500 to-design-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {comment.author[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{comment.author}</p>
                    <p className="text-xs text-design-zinc-500">{formatTime(comment.timestamp)}</p>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-design-zinc-300 text-sm whitespace-pre-wrap">{comment.text}</p>
              </GlassCard>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-design-zinc-900/50 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-design-zinc-600" />
              </div>
              <p className="text-design-zinc-400 font-medium mb-1">No comments yet</p>
              <p className="text-sm text-design-zinc-500">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="border-t border-design-zinc-800 p-4 bg-design-zinc-950/50">
          {!authenticated ? (
            <div className="text-center py-4 text-design-zinc-400 text-sm">
              Please connect your wallet to comment
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="comment-text">
                  Comment as {user?.twitter?.username || user?.email?.address || 'Anonymous'}
                </Label>
                <textarea
                  id="comment-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts..."
                  maxLength={500}
                  rows={3}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white placeholder:text-design-zinc-500 focus:outline-none focus:ring-2 focus:ring-design-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex justify-end text-xs text-design-zinc-500">
                  {text.length}/500
                </div>
              </div>

              <PremiumButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!text.trim() || isSubmitting}
              >
                <Send size={16} />
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </PremiumButton>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
