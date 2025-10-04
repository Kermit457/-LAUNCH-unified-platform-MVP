'use client'

import { useState, useEffect } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Comment, Project } from '@/types'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from '@/hooks/useToast'

interface CommentsDrawerProps {
  project: Project
  open: boolean
  onClose: () => void
  onAddComment: (comment: Comment) => void
}

export function CommentsDrawer({ project, open, onClose, onAddComment }: CommentsDrawerProps) {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const { success } = useToast()

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) return
    if (!author.trim()) {
      alert('Please enter your name')
      return
    }

    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      text: text.trim(),
      timestamp: new Date(),
    }

    onAddComment(newComment)
    setText('')
    success('Comment posted!', 'Your comment is now visible to everyone')

    // Scroll to top to see new comment
    setTimeout(() => {
      const commentsList = document.getElementById('comments-list')
      if (commentsList) {
        commentsList.scrollTop = 0
      }
    }, 100)
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
          'fixed right-0 top-0 h-full w-full sm:w-[400px] bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col',
          'animate-in slide-in-from-right duration-300'
        )}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Comments
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
          <p className="text-sm text-white/60 line-clamp-1">{project.title}</p>
          <div className="mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 inline-block">
            💬 {project.comments?.length || 0} {project.comments?.length === 1 ? 'comment' : 'comments'}
          </div>
        </div>

        {/* Comments List */}
        <div id="comments-list" className="flex-1 overflow-y-auto p-4 space-y-4">
          {project.comments && project.comments.length > 0 ? (
            project.comments.map((comment) => (
              <div key={comment.id} className="glass-card p-4 space-y-2">
                {/* Author & Time */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {comment.author[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{comment.author}</p>
                    <p className="text-xs text-white/50">{formatTime(comment.timestamp)}</p>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-white/80 text-sm whitespace-pre-wrap">{comment.text}</p>
              </div>
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

        {/* Add Comment Form */}
        <div className="border-t border-white/10 p-4 bg-black/50">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="comment-author" className="text-white text-xs">
                Your Name
              </Label>
              <Input
                id="comment-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comment-text" className="text-white text-xs">
                Comment
              </Label>
              <Textarea
                id="comment-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts..."
                maxLength={500}
                rows={3}
                required
              />
              <div className="flex justify-end text-xs text-white/40">
                {text.length}/500
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={!text.trim() || !author.trim()}
            >
              <Send size={16} />
              Post Comment
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
