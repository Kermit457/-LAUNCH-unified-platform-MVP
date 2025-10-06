import { databases, DB_ID, COLLECTIONS, client } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface Comment {
  $id: string
  launchId: string
  userId: string
  username: string
  userAvatar?: string
  content: string
  upvotes: number
  createdAt: string
}

/**
 * Get comments for a launch with real-time subscription
 */
export async function getComments(launchId: string, limit = 50) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.COMMENTS,
    [
      Query.equal('launchId', launchId),
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
    ]
  )

  return response.documents as unknown as Comment[]
}

/**
 * Create a new comment
 */
export async function createComment(data: {
  launchId: string
  userId: string
  username: string
  userAvatar?: string
  content: string
}): Promise<Comment> {
  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.COMMENTS,
    'unique()',
    {
      ...data,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    }
  )

  return response as unknown as Comment
}

/**
 * Update comment upvotes
 */
export async function updateCommentUpvotes(
  commentId: string,
  upvotes: number
): Promise<Comment> {
  const response = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.COMMENTS,
    commentId,
    { upvotes }
  )

  return response as unknown as Comment
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string) {
  await databases.deleteDocument(DB_ID, COLLECTIONS.COMMENTS, commentId)
}

/**
 * Subscribe to real-time comment updates for a launch
 */
export function subscribeToComments(
  launchId: string,
  onUpdate: (comment: Comment) => void,
  onCreate: (comment: Comment) => void,
  onDelete: (commentId: string) => void
) {
  const unsubscribe = client.subscribe(
    [
      `databases.${DB_ID}.collections.${COLLECTIONS.COMMENTS}.documents`,
    ],
    (response) => {
      const payload = response.payload as any

      // Check if the comment belongs to this launch
      if (payload.launchId !== launchId) return

      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        onCreate(payload as Comment)
      } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        onUpdate(payload as Comment)
      } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
        onDelete(payload.$id)
      }
    }
  )

  return unsubscribe
}
