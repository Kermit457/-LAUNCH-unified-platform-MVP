// ===== UNIFIED $LAUNCH PLATFORM TYPES =====

export type ProjectType = 'launch' | 'campaign' | 'raid' | 'prediction' | 'ad' | 'quest' | 'spotlight';
export type Status = 'live' | 'upcoming' | 'ended';
export type PillKind = 'rate' | 'bounty' | 'pool' | 'mcap' | 'reward';

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timestamp: Date;
  upvotes?: number;
}

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
  description?: string;

  // Engagement fields
  upvotes?: number;
  comments?: Comment[];
  boosted?: boolean;
  boostCount?: number;
  createdAt?: Date;

  // ICM-specific fields (Internet Capital Market - Token Launches)
  fdv?: number;              // Fully Diluted Valuation
  poolValue?: number;        // Liquidity pool value
  chain?: string;            // Blockchain (Base, Solana, Ethereum, etc.)
  beliefScore?: number;      // 0-100 confidence metric
  ticker?: string;           // Token symbol (e.g., $AIKIT)
  marketType?: MarketType;   // ICM or CCM

  // CCM-specific fields (Creator Capital Market - Campaigns/Raids)
  campaignType?: 'raid' | 'clip' | 'prediction' | 'quest' | 'ad';
  earnings?: number;         // Total creator earnings
  engagement?: number;       // Engagement rate/score (0-100)

  // Visual fields
  tokenLogo?: string;        // Token/project logo image URL
  isLiveStreaming?: boolean; // Is this project currently live streaming?
}

export type MarketType = 'all' | 'icm' | 'ccm';

// TODO: Add Supabase real-time types when integrating
// TODO: Add wallet connection types (Phantom/MetaMask)
// TODO: Add token balance types for $LAUNCH token
