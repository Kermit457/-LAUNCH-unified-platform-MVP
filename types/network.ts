export type ConnState = "none" | "pending" | "connected" | "self"

export type ProfileCardVariant = "default" | "compact"

export interface Contribution {
  projectId: string
  projectName: string
  role: "creator" | "clipper" | "advisor" | "supporter"
  status: "pending" | "accepted" | "completed"
  joinedAt: string
  visibility: "public" | "private"
  // Optional project metadata for avatar display
  projectAvatar?: string      // Project logo/avatar URL
  projectTwitter?: string      // Twitter handle (e.g., "pumphubxyz")
  projectSlug?: string         // For internal linking (e.g., "/project/pumphub")
}

export interface XSnapshot {
  followers?: number
  following?: number
  posts?: number
  verified?: boolean
}

export interface SocialLinks {
  x?: string
  youtube?: string
  twitch?: string
  discord?: string
  web?: string
}

export interface ProfileCardProps {
  id: string
  name: string
  handle: string // @handle
  avatarUrl?: string
  bannerUrl?: string // optional top banner strip
  verified?: boolean // platform verified
  roles: string[] // e.g., ["Streamer","Degen"]
  mutuals?: number // 0..n
  bio?: string // short one-liner
  // Twitter snapshot (mock now, real later via Auth0/X):
  x?: XSnapshot
  links?: SocialLinks
  contributions?: Contribution[] // Project contributions
  state: ConnState
  onInvite?: (id: string) => void
  onCancelInvite?: (id: string) => void
  onChat?: (id: string) => void
  onFollow?: (id: string) => void
  onShare?: (id: string) => void
  onInviteToCampaign?: (id: string) => void
  onEditProfile?: () => void
  variant?: ProfileCardVariant
}