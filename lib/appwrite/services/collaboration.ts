import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface CollaborationInvite {
  $id: string
  inviteId: string
  launchId: string
  senderId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  $createdAt: string
}

/**
 * Send collaboration invite for a launch/project
 */
export async function sendCollaborationInvite(data: {
  launchId: string
  senderId: string
  receiverId: string
  message?: string
}) {
  // Check if invite already exists
  const existing = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES, // Reuse network invites collection
    [
      Query.equal('senderId', data.senderId),
      Query.equal('receiverId', data.receiverId),
      Query.equal('status', 'pending'),
      Query.limit(1)
    ]
  )

  if (existing.total > 0) {
    throw new Error('You already have a pending invite to this user')
  }

  const invite = await databases.createDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    ID.unique(),
    {
      inviteId: `collab_${Date.now()}_${data.senderId}`,
      projectId: data.launchId, // Store launch ID as project ID
      senderId: data.senderId,
      receiverId: data.receiverId,
      status: 'pending',
      message: data.message
    }
  )

  return invite as unknown as CollaborationInvite
}

/**
 * Get collaboration invites for a launch
 */
export async function getLaunchCollaborators(launchId: string) {
  const invites = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    [
      Query.equal('projectId', launchId),
      Query.equal('status', 'accepted'),
      Query.limit(100)
    ]
  )

  return invites.documents as unknown as CollaborationInvite[]
}

/**
 * Get pending collaboration invites received
 */
export async function getCollaborationInvites(userId: string) {
  const invites = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    [
      Query.equal('receiverId', userId),
      Query.equal('status', 'pending'),
      Query.isNotNull('projectId'), // Only get project invites
      Query.limit(100)
    ]
  )

  return invites.documents as unknown as CollaborationInvite[]
}

/**
 * Accept collaboration invite
 */
export async function acceptCollaborationInvite(inviteId: string) {
  const invite = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    inviteId,
    {
      status: 'accepted'
    }
  )

  return invite as unknown as CollaborationInvite
}

/**
 * Reject collaboration invite
 */
export async function rejectCollaborationInvite(inviteId: string) {
  const invite = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    inviteId,
    {
      status: 'rejected'
    }
  )

  return invite as unknown as CollaborationInvite
}

/**
 * Check if user is collaborator on a launch
 */
export async function isCollaborator(launchId: string, userId: string): Promise<boolean> {
  const invites = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    [
      Query.equal('projectId', launchId),
      Query.equal('receiverId', userId),
      Query.equal('status', 'accepted'),
      Query.limit(1)
    ]
  )

  return invites.total > 0
}