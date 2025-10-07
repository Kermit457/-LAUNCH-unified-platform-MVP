/**
 * Entity Model for LaunchOS
 * Both users and projects are entities that can authenticate and have dashboards
 */

export type EntityType = 'user' | 'project'

export interface Entity {
  $id: string
  type: EntityType
  displayName: string
  avatar?: string
  bio?: string
  verified: boolean
  conviction: number
  createdAt: string
}

export interface SocialLink {
  $id: string
  entityId: string // References Entity.$id
  provider: 'twitter' | 'discord' | 'telegram'
  accountId: string // Provider's unique account ID
  handle: string // @username
  avatarUrl?: string
  verified: boolean
  linkedAt: string
}

export interface ProjectMember {
  $id: string
  projectId: string // References Entity.$id where type='project'
  userId: string // References Entity.$id where type='user'
  role: 'owner' | 'manager' | 'contributor'
  joinedAt: string
}

/**
 * Dashboard scope represents the current viewing context
 * Can be a user viewing their own dashboard, or a user viewing a project's dashboard
 */
export interface DashboardScope {
  entityId: string // The entity being viewed (user or project)
  entityType: EntityType
  displayName: string
  avatar?: string
  scope?: 'ICM' | 'CCM' // Only for projects
  viewingUserId?: string // The actual logged-in user (for permissions)
  userRole?: 'owner' | 'manager' | 'contributor' // User's role in this entity (if project)
}
