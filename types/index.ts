// ===== UNIFIED $LAUNCH PLATFORM TYPES =====

export type ProjectType = 'launch' | 'campaign' | 'raid' | 'prediction' | 'ad' | 'quest' | 'spotlight';
export type Status = 'live' | 'upcoming' | 'ended';
export type PillKind = 'rate' | 'bounty' | 'pool' | 'mcap' | 'reward';

export interface Project {
  id: string;
  type: ProjectType;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  pill?: { label: string; kind: PillKind };
  progress?: { paid: number; pool: number };
  status: Status;
  stats?: { views?: number; likes?: number; participants?: number };
  platforms?: string[];
  cta?: { label: string; href?: string };
  endTime?: string; // For countdowns
  creator?: string;
}

// TODO: Add Supabase real-time types when integrating
// TODO: Add wallet connection types (Phantom/MetaMask)
// TODO: Add token balance types for $LAUNCH token
