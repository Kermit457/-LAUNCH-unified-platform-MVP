export type Role = "viewer" | "contributor" | "reviewer" | "admin"

export type Connection = {
  userId: string
  handle: string
  name: string
  roles: string[]
  verified?: boolean
  mutuals: number
  lastActive: number
  unread: number
  pinned?: boolean
  muted?: boolean
}

export type Invite = {
  id: string
  fromUserId: string
  fromHandle: string
  mutuals: number
  project?: { id: string; name: string }
  role?: Role
  offer?: string
  note?: string
  sentAt: number
  status: "pending" | "accepted" | "declined" | "expired"
  priority: number
}

export type ThreadType = "dm" | "group"

export type Thread = {
  id: string
  type: ThreadType
  name?: string
  projectId?: string
  campaignId?: string
  participantUserIds: string[]
  createdAt: number
  lastMsgAt: number
  unread: number
  pinned?: boolean
}

export type Message = {
  id: string
  threadId: string
  fromUserId: string
  fromHandle?: string
  content: string
  sentAt: number
  edited?: boolean
  reactions?: { emoji: string; userIds: string[] }[]
}