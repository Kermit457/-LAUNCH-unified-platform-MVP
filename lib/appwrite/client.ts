import { Client, Account, Databases, Storage, Functions } from 'appwrite'

// Get environment variables (with defaults for dev)
function getEnvVar(key: string, defaultValue?: string): string {
  // Check browser environment first
  if (typeof window !== 'undefined') {
    return (window as any).ENV?.[key] || process.env[key] || defaultValue || ''
  }
  return process.env[key] || defaultValue || ''
}

const endpoint = getEnvVar('NEXT_PUBLIC_APPWRITE_ENDPOINT', 'https://fra.cloud.appwrite.io/v1')
const projectId = getEnvVar('NEXT_PUBLIC_APPWRITE_PROJECT_ID', '68e34a030010f2321359')

// Validate only when client is first used (lazy validation)
let clientInitialized = false
function validateConfig() {
  if (!clientInitialized) {
    if (!endpoint || !projectId) {
      throw new Error(
        'Missing Appwrite environment variables. Please check your .env.local file.'
      )
    }
    clientInitialized = true
  }
}

// Client-side Appwrite client
export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)

// Service instances
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const functions = new Functions(client)

// Database and Collection IDs
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
  LAUNCHES: process.env.NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID || 'launches',
  CAMPAIGNS: process.env.NEXT_PUBLIC_APPWRITE_CAMPAIGNS_COLLECTION_ID || 'campaigns',
  QUESTS: process.env.NEXT_PUBLIC_APPWRITE_QUESTS_COLLECTION_ID || 'quests',
  SUBMISSIONS: process.env.NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID || 'submissions',
  COMMENTS: process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || 'comments',
  NOTIFICATIONS: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID || 'notifications',
  NETWORK_INVITES: process.env.NEXT_PUBLIC_APPWRITE_INVITES_COLLECTION_ID || 'network_invites',
  MESSAGES: process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || 'messages',
  PAYOUTS: process.env.NEXT_PUBLIC_APPWRITE_PAYOUTS_COLLECTION_ID || 'payouts',
  ACTIVITIES: process.env.NEXT_PUBLIC_APPWRITE_ACTIVITIES_COLLECTION_ID || 'activities',
  THREADS: process.env.NEXT_PUBLIC_APPWRITE_THREADS_COLLECTION_ID || 'threads',
  VOTES: process.env.NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID || 'votes',
  PROJECT_MEMBERS: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_MEMBERS_COLLECTION_ID || 'project_members',
  REFERRALS: process.env.NEXT_PUBLIC_APPWRITE_REFERRALS_COLLECTION_ID || 'referrals',
  REFERRAL_REWARDS: process.env.NEXT_PUBLIC_APPWRITE_REFERRAL_REWARDS_COLLECTION_ID || 'referral_rewards',
  REWARDS_POOLS: process.env.NEXT_PUBLIC_APPWRITE_REWARDS_POOLS_COLLECTION_ID || 'rewards_pools',
  CURVES: process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID || 'curves',
  CURVE_EVENTS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_EVENTS_COLLECTION_ID || 'curve_events',
  CURVE_HOLDERS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID || 'curve_holders',
  SNAPSHOTS: process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID || 'snapshots',
  PRICE_HISTORY: process.env.NEXT_PUBLIC_APPWRITE_PRICE_HISTORY_COLLECTION_ID || 'price_history',
} as const

// Storage Bucket IDs
export const BUCKETS = {
  AVATARS: process.env.NEXT_PUBLIC_APPWRITE_AVATARS_BUCKET_ID || 'avatars',
  LAUNCH_LOGOS: process.env.NEXT_PUBLIC_APPWRITE_LAUNCH_LOGOS_BUCKET_ID || 'launch_logos',
  CAMPAIGN_MEDIA: process.env.NEXT_PUBLIC_APPWRITE_CAMPAIGN_MEDIA_BUCKET_ID || 'campaign_media',
  SUBMISSIONS: process.env.NEXT_PUBLIC_APPWRITE_SUBMISSIONS_BUCKET_ID || 'submissions',
} as const

// Export appwriteClient object for referral services
export const appwriteClient = {
  database: databases,
  databaseId: DB_ID,
  referralsCollectionId: COLLECTIONS.REFERRALS,
  referralRewardsCollectionId: COLLECTIONS.REFERRAL_REWARDS,
  rewardsPoolsCollectionId: COLLECTIONS.REWARDS_POOLS,
}
