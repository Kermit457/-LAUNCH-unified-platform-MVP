import { Client, Account, Databases, Storage, Functions } from 'appwrite'

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

if (!endpoint || !projectId) {
  throw new Error(
    'Missing Appwrite environment variables. Please check your .env.local file.'
  )
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
} as const

// Storage Bucket IDs
export const BUCKETS = {
  AVATARS: process.env.NEXT_PUBLIC_APPWRITE_AVATARS_BUCKET_ID || '',
  CAMPAIGN_MEDIA: process.env.NEXT_PUBLIC_APPWRITE_CAMPAIGN_MEDIA_BUCKET_ID || '',
  SUBMISSIONS: process.env.NEXT_PUBLIC_APPWRITE_SUBMISSIONS_BUCKET_ID || '',
} as const
