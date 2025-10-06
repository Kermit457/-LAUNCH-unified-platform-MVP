export interface ProfileCardData {
  id: string
  username: string // without @ symbol
  displayName: string
  avatar?: string
  verified: boolean
  roles: string[] // ["Creator", "Trader", "Degen"]
  bio?: string
  tagline?: string
  contributions: ProfileContribution[]
  mutuals: MutualConnection[]
  socials: SocialLinks
  connected: boolean
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
}

export type ProfileCardVariant = 'default' | 'compact' | 'minimal'

export const roleColors: Record<string, string> = {
  Creator: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
  Trader: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Degen: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Streamer: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Advisor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  Builder: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Investor: 'bg-green-500/20 text-green-300 border-green-500/40',
}
