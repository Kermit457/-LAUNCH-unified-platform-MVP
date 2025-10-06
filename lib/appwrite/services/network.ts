import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface NetworkInvite {
  $id: string
  inviteId: string
  senderId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  respondedAt?: string
  $createdAt: string
}

/**
 * Get network invites for a user
 */
export async function getNetworkInvites(options: {
  userId: string
  status?: string
  type?: 'sent' | 'received'
}) {
  const queries = []

  if (options.type === 'sent') {
    queries.push(Query.equal('senderId', options.userId))
  } else if (options.type === 'received') {
    queries.push(Query.equal('receiverId', options.userId))
  } else {
    // Get both sent and received
    queries.push(
      Query.or([
        Query.equal('senderId', options.userId),
        Query.equal('receiverId', options.userId)
      ])
    )
  }

  if (options.status) {
    queries.push(Query.equal('status', options.status))
  }

  queries.push(Query.orderDesc('$createdAt'))
  queries.push(Query.limit(100))

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    queries
  )

  return response.documents as unknown as NetworkInvite[]
}

/**
 * Get a single invite by ID
 */
export async function getNetworkInvite(id: string) {
  const invite = await databases.getDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    id
  )

  return invite as unknown as NetworkInvite
}

/**
 * Send a network invite
 */
export async function sendNetworkInvite(data: {
  senderId: string
  receiverId: string
  message?: string
}) {
  // Check if invite already exists
  const existing = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    [
      Query.equal('senderId', data.senderId),
      Query.equal('receiverId', data.receiverId)
    ]
  )

  if (existing.total > 0) {
    throw new Error('Invite already sent to this user')
  }

  const invite = await databases.createDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    ID.unique(),
    {
      inviteId: `invite_${Date.now()}`,
      ...data,
      status: 'pending'
    }
  )

  return invite as unknown as NetworkInvite
}

/**
 * Accept a network invite
 */
export async function acceptNetworkInvite(id: string) {
  const invite = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    id,
    {
      status: 'accepted',
      respondedAt: new Date().toISOString()
    }
  )

  return invite as unknown as NetworkInvite
}

/**
 * Reject a network invite
 */
export async function rejectNetworkInvite(id: string) {
  const invite = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    id,
    {
      status: 'rejected',
      respondedAt: new Date().toISOString()
    }
  )

  return invite as unknown as NetworkInvite
}

/**
 * Cancel a sent invite
 */
export async function cancelNetworkInvite(id: string) {
  await databases.deleteDocument(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    id
  )
}

/**
 * Get user's connections (accepted invites)
 */
export async function getUserConnections(userId: string) {
  const invites = await getNetworkInvites({
    userId,
    status: 'accepted'
  })

  // Extract unique user IDs (both senders and receivers)
  const connectionIds = new Set<string>()

  invites.forEach(invite => {
    if (invite.senderId === userId) {
      connectionIds.add(invite.receiverId)
    } else {
      connectionIds.add(invite.senderId)
    }
  })

  return Array.from(connectionIds)
}

/**
 * Get pending invites count
 */
export async function getPendingInvitesCount(userId: string) {
  const invites = await getNetworkInvites({
    userId,
    type: 'received',
    status: 'pending'
  })

  return invites.length
}

/**
 * Check if users are connected
 */
export async function areUsersConnected(userId1: string, userId2: string): Promise<boolean> {
  const invites = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.NETWORK_INVITES,
    [
      Query.or([
        Query.and([
          Query.equal('senderId', userId1),
          Query.equal('receiverId', userId2)
        ]),
        Query.and([
          Query.equal('senderId', userId2),
          Query.equal('receiverId', userId1)
        ])
      ]),
      Query.equal('status', 'accepted')
    ]
  )

  return invites.total > 0
}
