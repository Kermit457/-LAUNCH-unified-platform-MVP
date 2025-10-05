import { useState, useEffect } from 'react'
import { Comment } from '@/types'

const getStorageKey = (launchId: string) => `comments:${launchId}`

/**
 * Mock comments hook with localStorage and BroadcastChannel sync
 *
 * TODO: Replace with Appwrite Realtime
 * - Subscribe to comments collection filtered by launchId
 * - Listen for create/delete events
 * - Call API to create/delete comments
 */
export function useComments(launchId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  // Load comments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey(launchId))
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp),
        }))
        setComments(withDates)
      } catch (error) {
        console.error('Error parsing stored comments:', error)
      }
    }
    setLoading(false)
  }, [launchId])

  // Multi-tab sync via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel(`comments:${launchId}`)

    channel.onmessage = (event) => {
      if (event.data.type === 'comment-added') {
        setComments((prev) => {
          // Avoid duplicates
          if (prev.some((c) => c.id === event.data.comment.id)) {
            return prev
          }
          return [
            {
              ...event.data.comment,
              timestamp: new Date(event.data.comment.timestamp),
            },
            ...prev,
          ]
        })
      } else if (event.data.type === 'comment-deleted') {
        setComments((prev) => prev.filter((c) => c.id !== event.data.commentId))
      }
    }

    return () => channel.close()
  }, [launchId])

  const addComment = (text: string, author: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      author,
      text,
      timestamp: new Date(),
    }

    // Optimistic update - add to top
    setComments((prev) => [newComment, ...prev])

    // Save to localStorage
    const updated = [newComment, ...comments]
    localStorage.setItem(getStorageKey(launchId), JSON.stringify(updated))

    // Broadcast to other tabs
    const channel = new BroadcastChannel(`comments:${launchId}`)
    channel.postMessage({
      type: 'comment-added',
      comment: {
        ...newComment,
        timestamp: newComment.timestamp.toISOString(),
      },
    })
    channel.close()

    // TODO: Replace with Appwrite API call
    // const response = await databases.createDocument(
    //   'main',
    //   'comments',
    //   ID.unique(),
    //   {
    //     launchId,
    //     userId: user.id,
    //     text,
    //     createdAt: new Date().toISOString()
    //   }
    // )
  }

  const deleteComment = (commentId: string) => {
    // Optimistic update
    setComments((prev) => prev.filter((c) => c.id !== commentId))

    // Save to localStorage
    const updated = comments.filter((c) => c.id !== commentId)
    localStorage.setItem(getStorageKey(launchId), JSON.stringify(updated))

    // Broadcast to other tabs
    const channel = new BroadcastChannel(`comments:${launchId}`)
    channel.postMessage({
      type: 'comment-deleted',
      commentId,
    })
    channel.close()

    // TODO: Replace with Appwrite API call
    // await databases.deleteDocument('main', 'comments', commentId)
  }

  return {
    comments,
    loading,
    addComment,
    deleteComment,
  }
}
