export interface ProfileCardData {
  id: string // Appwrite document ID
  userId?: string // User ID from profile (for network operations)
  username: string // without @ symbol
  displayName: string
  name?: string // Alias for displayName
  handle?: string // with @ symbol (e.g., "@username")
  avatar?: string
  verified: boolean
  roles: string[] // ["Creator", "Trader", "Degen"]
  bio?: string
  tagline?: string
  contributions: ProfileContribution[]
  mutuals: MutualConnection[]
  socials: SocialLinks
  connected: boolean
  inviteSent?: boolean // Whether current user has sent an invite to this user
  onInvite?: () => void
  onMessage?: () => void
}

export interface ProfileContribution {
  name: string
  logo: string
  role: 'Creator' | 'Advisor' | 'Contributor'
}

export interface MutualConnection {
  username: string
  avatar: string
  sharedProject?: string
}

export interface SocialLinks {
  twitter?: string
  discord?: string
  website?: string
  instagram?: string
  tiktok?: string
  youtube?: string
}

export type ProfileCardVariant = 'default' | 'compact' | 'minimal'

export const roleColors: Record<string, string> = {
  Creator: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
  Trader: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Degen: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Streamer: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
  Advisor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Builder: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Investor: 'bg-green-500/20 text-green-300 border-green-500/40',
  Alpha: 'bg-red-500/20 text-red-300 border-red-500/40',
  Influencer: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  Artist: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
  Entertainer: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  Educator: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Collector: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Designer: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  Manager: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  Organizer: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  Clipper: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  Editor: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
  Researcher: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  Developer: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Raider: 'bg-red-500/20 text-red-300 border-red-500/40',
  Marketer: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  Project: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
  Founder: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
}
