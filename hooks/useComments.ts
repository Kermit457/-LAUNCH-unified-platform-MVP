import { useState, useEffect, useCallback } from 'react'
import {
  getComments,
  createComment,
  updateCommentUpvotes,
  deleteComment,
  subscribeToComments,
  type Comment as AppwriteComment,
} from '@/lib/appwrite/services/comments'
import { Comment } from '@/types'
import { useUser } from './useUser'

// Map Appwrite comment to UI comment type
function mapComment(appwriteComment: AppwriteComment): Comment {
  return {
    id: appwriteComment.$id,
    author: appwriteComment.username,
    avatar: appwriteComment.userAvatar,
    text: appwriteComment.content,
    timestamp: new Date(appwriteComment.createdAt),
    upvotes: appwriteComment.upvotes,
  }
}

export function useComments(launchId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, userId, name, avatar } = useUser()

  // Fetch initial comments
  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true)
        const data = await getComments(launchId)
        setComments(data.map(mapComment))
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
        const mapped = mapComment(updatedComment)
        setComments((prev) =>
          prev.map((c) => (c.id === mapped.id ? mapped : c))
        )
      },
      // On create
      (newComment) => {
        const mapped = mapComment(newComment)
        setComments((prev) => [mapped, ...prev])
      },
      // On delete
      (deletedId) => {
        setComments((prev) => prev.filter((c) => c.id !== deletedId))
      }
    )

    return () => {
      unsubscribe()
    }
  }, [launchId])

  // Add a new comment
  const addComment = useCallback(
    async (content: string) => {
      if (!user || !userId) {
        throw new Error('You must be logged in to comment')
      }

      console.log('useComments - userId:', userId)
      console.log('useComments - name:', name)
      console.log('useComments - calling createComment with:', {
        launchId,
        userId,
        username: name,
        userAvatar: avatar,
        content,
      })

      try {
        await createComment({
          launchId,
          userId,
          username: name,
          userAvatar: avatar,
          content,
        })
        console.log('useComments - createComment succeeded')
      } catch (err: any) {
        console.error('useComments - Failed to create comment:', err)
        throw new Error(err.message || 'Failed to post comment')
      }
    },
    [launchId, user, userId, name, avatar]
  )

  // Upvote a comment
  const upvoteComment = useCallback(async (commentId: string) => {
    try {
      const comment = comments.find((c) => c.id === commentId)
      if (!comment) return

      await updateCommentUpvotes(commentId, (comment.upvotes || 0) + 1)
    } catch (err: any) {
      console.error('Failed to upvote comment:', err)
      throw new Error(err.message || 'Failed to upvote comment')
    }
  }, [comments])

  // Remove a comment
  const removeComment = useCallback(
    async (commentId: string) => {
      if (!user || !userId) {
        throw new Error('You must be logged in to delete comments')
      }

      try {
        await deleteComment(commentId)
      } catch (err: any) {
        console.error('Failed to delete comment:', err)
        throw new Error(err.message || 'Failed to delete comment')
      }
    },
    [user, userId]
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
