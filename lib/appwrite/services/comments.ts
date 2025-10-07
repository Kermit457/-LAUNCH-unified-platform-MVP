import { databases, DB_ID, COLLECTIONS, client } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface Comment {
  $id: string
  launchId: string
  userId: string
  username: string
  userAvatar?: string
  content: string // Maps to 'text' field in Appwrite
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

  // Map Appwrite 'text' field to 'content' field
  return response.documents.map((doc: any) => ({
    $id: doc.$id,
    launchId: doc.launchId,
    userId: doc.userId,
    username: doc.username,
    userAvatar: doc.avatar,
    content: doc.text,
    upvotes: doc.upvotes,
    createdAt: doc.$createdAt,
  })) as Comment[]
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
  const payload = {
    commentId: `comment_${Date.now()}_${data.userId}`,
    launchId: data.launchId,
    campaignId: '',
    userId: data.userId,
    username: data.username,
    avatar: data.userAvatar || '',
    text: data.content,
    upvotes: 0,
    parentId: '',
  }

  console.log('createComment - payload:', payload)

  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.COMMENTS,
    'unique()',
    payload
  )

  // Map Appwrite response to Comment type
  return {
    $id: response.$id,
    launchId: (response as any).launchId,
    userId: (response as any).userId,
    username: (response as any).username,
    userAvatar: (response as any).avatar,
    content: (response as any).text,
    upvotes: (response as any).upvotes,
    createdAt: response.$createdAt,
  }
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
