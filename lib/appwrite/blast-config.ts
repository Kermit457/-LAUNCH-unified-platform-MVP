/**
 * BLAST Appwrite Configuration
 * Collection IDs and database references for BLAST Network Hub
 */

// Database ID
export const BLAST_DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_BLAST_DATABASE_ID || 'blast-network'

// Collection IDs
export const BLAST_COLLECTIONS = {
  ROOMS: process.env.NEXT_PUBLIC_APPWRITE_BLAST_ROOMS_COLLECTION || 'blast_rooms',
  APPLICANTS: process.env.NEXT_PUBLIC_APPWRITE_BLAST_APPLICANTS_COLLECTION || 'blast_applicants',
  VAULT: process.env.NEXT_PUBLIC_APPWRITE_BLAST_VAULT_COLLECTION || 'blast_vault',
  KEY_LOCKS: process.env.NEXT_PUBLIC_APPWRITE_BLAST_LOCKS_COLLECTION || 'blast_key_locks',
  MOTION_SCORES: process.env.NEXT_PUBLIC_APPWRITE_BLAST_MOTION_SCORES_COLLECTION || 'blast_motion_scores',
  MOTION_EVENTS: process.env.NEXT_PUBLIC_APPWRITE_BLAST_MOTION_EVENTS_COLLECTION || 'blast_motion_events',
  DM_REQUESTS: process.env.NEXT_PUBLIC_APPWRITE_BLAST_DM_REQUESTS_COLLECTION || 'blast_dm_requests',
  MATCHES: process.env.NEXT_PUBLIC_APPWRITE_BLAST_MATCHES_COLLECTION || 'blast_matches',
  ANALYTICS: process.env.NEXT_PUBLIC_APPWRITE_BLAST_ANALYTICS_COLLECTION || 'blast_analytics',
} as const

// Type-safe collection access
export type BlastCollectionKey = keyof typeof BLAST_COLLECTIONS

// Helper to get collection ID
export function getCollectionId(collection: BlastCollectionKey): string {
  return BLAST_COLLECTIONS[collection]
}

// Validate all collection IDs are set
export function validateBlastConfig(): {
  isValid: boolean
  missingCollections: string[]
} {
  const missingCollections: string[] = []

  Object.entries(BLAST_COLLECTIONS).forEach(([key, value]) => {
    if (!value || value.startsWith('blast_')) {
      // Default values starting with 'blast_' indicate env var not set
      if (!value) {
        missingCollections.push(key)
      }
    }
  })

  return {
    isValid: missingCollections.length === 0,
    missingCollections,
  }
}

// Development helper
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const validation = validateBlastConfig()
  if (!validation.isValid) {
    console.warn(
      '[BLAST Config] Some collections using default IDs:',
      validation.missingCollections,
      '\nSet environment variables in .env.local for production'
    )
  }
}
