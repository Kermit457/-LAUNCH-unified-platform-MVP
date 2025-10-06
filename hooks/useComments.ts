import { useState, useEffect, useCallback } from 'react'
import {
  getComments,
  createComment,
  updateCommentUpvotes,
  deleteComment,
  subscribeToComments,
  type Comment,
} from '@/lib/appwrite/services/comments'
import { useUser } from './useUser'

export function useComments(launchId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  // Fetch initial comments
  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true)
        const data = await getComments(launchId)
        setComments(data)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch comments:', err)
        setError(err.message || 'Failed to load comments')
      } finally {
        setLoading(false)
      }
    }

    if (launchId) {
      fetchComments()
    }
  }, [launchId])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!launchId) return

    const unsubscribe = subscribeToComments(
      launchId,
      // On update
      (updatedComment) => {
        setComments((prev) =>
          prev.map((c) => (c.$id === updatedComment.$id ? updatedComment : c))
        )
      },
      // On create
      (newComment) => {
        setComments((prev) => [newComment, ...prev])
      },
      // On delete
      (deletedId) => {
        setComments((prev) => prev.filter((c) => c.$id !== deletedId))
      }
    )

    return () => {
      unsubscribe()
    }
  }, [launchId])

  // Add a new comment
  const addComment = useCallback(
    async (content: string) => {
      if (!user) {
        throw new Error('You must be logged in to comment')
      }

      try {
        await createComment({
          launchId,
          userId: user.$id,
          username: user.name || user.email,
          userAvatar: undefined, // TODO: Get from user profile
          content,
        })
      } catch (err: any) {
        console.error('Failed to create comment:', err)
        throw new Error(err.message || 'Failed to post comment')
      }
    },
    [launchId, user]
  )

  // Upvote a comment
  const upvoteComment = useCallback(async (commentId: string) => {
    try {
      const comment = comments.find((c) => c.$id === commentId)
      if (!comment) return

      await updateCommentUpvotes(commentId, comment.upvotes + 1)
    } catch (err: any) {
      console.error('Failed to upvote comment:', err)
      throw new Error(err.message || 'Failed to upvote comment')
    }
  }, [comments])

  // Remove a comment
  const removeComment = useCallback(
    async (commentId: string) => {
      if (!user) {
        throw new Error('You must be logged in to delete comments')
      }

      const comment = comments.find((c) => c.$id === commentId)
      if (!comment || comment.userId !== user.$id) {
        throw new Error('You can only delete your own comments')
      }

      try {
        await deleteComment(commentId)
      } catch (err: any) {
        console.error('Failed to delete comment:', err)
        throw new Error(err.message || 'Failed to delete comment')
      }
    },
    [comments, user]
  )

  return {
    comments,
    loading,
    error,
    addComment,
    upvoteComment,
    removeComment,
  }
}
