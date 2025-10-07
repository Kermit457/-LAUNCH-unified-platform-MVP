import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface ProjectMember {
  $id: string
  projectId: string
  userId: string
  role: 'owner' | 'member'
  joinedAt: string
  userName?: string
  userAvatar?: string
}

/**
 * Get all members of a project
 */
export async function getProjectMembers(projectId: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECT_MEMBERS,
    [
      Query.equal('projectId', projectId),
      Query.orderDesc('$createdAt')
    ]
  )

  return response.documents as unknown as ProjectMember[]
}

/**
 * Get all projects a user is a member of
 */
export async function getUserProjectMemberships(userId: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECT_MEMBERS,
    [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt')
    ]
  )

  return response.documents as unknown as ProjectMember[]
}

/**
 * Check if a user is a member/owner of a project
 */
export async function isProjectMember(projectId: string, userId: string): Promise<ProjectMember | null> {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECT_MEMBERS,
    [
      Query.equal('projectId', projectId),
      Query.equal('userId', userId),
      Query.limit(1)
    ]
  )

  return response.documents.length > 0 ? response.documents[0] as unknown as ProjectMember : null
}

/**
 * Check if a user is the owner of a project
 */
export async function isProjectOwner(projectId: string, userId: string): Promise<boolean> {
  const member = await isProjectMember(projectId, userId)
  return member?.role === 'owner'
}

/**
 * Add a member to a project
 */
export async function addProjectMember(data: {
  projectId: string
  userId: string
  role: 'owner' | 'member'
  userName?: string
  userAvatar?: string
}) {
  // Check if already a member
  const existing = await isProjectMember(data.projectId, data.userId)
  if (existing) {
    throw new Error('User is already a member of this project')
  }

  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.PROJECT_MEMBERS,
    'unique()',
    {
      projectId: data.projectId,
      userId: data.userId,
      role: data.role,
      userName: data.userName || '',
      userAvatar: data.userAvatar || '',
      joinedAt: new Date().toISOString(),
    }
  )

  return response as unknown as ProjectMember
}

/**
 * Update a member's role
 */
export async function updateProjectMemberRole(
  projectId: string,
  userId: string,
  newRole: 'owner' | 'member'
) {
  const member = await isProjectMember(projectId, userId)
  if (!member) {
    throw new Error('User is not a member of this project')
  }

  const response = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.PROJECT_MEMBERS,
    member.$id,
    { role: newRole }
  )

  return response as unknown as ProjectMember
}

/**
 * Remove a member from a project
 */
export async function removeProjectMember(projectId: string, userId: string) {
  const member = await isProjectMember(projectId, userId)
  if (!member) {
    throw new Error('User is not a member of this project')
  }

  // Prevent removing the last owner
  if (member.role === 'owner') {
    const allMembers = await getProjectMembers(projectId)
    const owners = allMembers.filter(m => m.role === 'owner')
    if (owners.length === 1) {
      throw new Error('Cannot remove the last owner of a project')
    }
  }

  await databases.deleteDocument(
    DB_ID,
    COLLECTIONS.PROJECT_MEMBERS,
    member.$id
  )
}

/**
 * Get project owner(s)
 */
export async function getProjectOwners(projectId: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECT_MEMBERS,
    [
      Query.equal('projectId', projectId),
      Query.equal('role', 'owner')
    ]
  )

  return response.documents as unknown as ProjectMember[]
}