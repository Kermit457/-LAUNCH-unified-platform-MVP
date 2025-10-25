# BLAST Missing Environment Variables

## Status: API Routes Failing (500/403 errors)

**Root Cause:** Missing environment variables in Vercel production

## Test Results
- ✅ Cron job: Working (CRON_SECRET configured)
- ❌ Room creation: 403 Forbidden
- ❌ Get rooms: 500 Internal Server Error
- ❌ Motion scores: 500 Internal Server Error
- ❌ Vault: 500 Internal Server Error

## Required Environment Variables for Vercel

### Critical (Server-side API access)
```bash
APPWRITE_API_KEY=standard_55e5cb8f8869951e637cc9005d4e2f76b94fb76307905e8ee555c3c52bd2ba6c7eba85edeea800b62cc060a851727ad3b5353a2d47f6867551fea378fa74f5aa2319071ba24358610a1b745de1394c6532c29296967d3381dc7d6d62179645e3ea4a1322e4f6f4769dea0b7ac1dd7706a348116c9eb3738a9fdbfaa6f79c5ece
```

### BLAST Collection IDs
```bash
NEXT_PUBLIC_APPWRITE_BLAST_ROOMS_COLLECTION=blast_rooms
NEXT_PUBLIC_APPWRITE_BLAST_APPLICANTS_COLLECTION=blast_applicants
NEXT_PUBLIC_APPWRITE_BLAST_VAULT_COLLECTION=blast_vault
NEXT_PUBLIC_APPWRITE_BLAST_LOCKS_COLLECTION=blast_key_locks
NEXT_PUBLIC_APPWRITE_BLAST_MOTION_SCORES_COLLECTION=blast_motion_scores
NEXT_PUBLIC_APPWRITE_BLAST_MOTION_EVENTS_COLLECTION=blast_motion_events
NEXT_PUBLIC_APPWRITE_BLAST_DM_REQUESTS_COLLECTION=blast_dm_requests
NEXT_PUBLIC_APPWRITE_BLAST_MATCHES_COLLECTION=blast_matches
NEXT_PUBLIC_APPWRITE_BLAST_ANALYTICS_COLLECTION=blast_analytics
NEXT_PUBLIC_APPWRITE_BLAST_NOTIFICATIONS_COLLECTION=blast_notifications
NEXT_PUBLIC_APPWRITE_BLAST_NOTIFICATION_PREFERENCES_COLLECTION=blast_notification_preferences
```

## Already Configured ✅
```bash
CRON_SECRET=645babd8d1ae2d30300b7103c8b0e499f84259ecc265c367045d0db6d9473ba6
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68e34a030010f2321359
NEXT_PUBLIC_APPWRITE_DATABASE_ID=launchos_db
```

## How to Add to Vercel

1. Go to: https://vercel.com/widgets-for-launch/settings/environment-variables
2. Add each variable above one by one
3. Select environment: **Production**, **Preview**, **Development** (all 3)
4. Click "Save"
5. Redeploy: https://vercel.com/widgets-for-launch/deployments

## After Adding Variables

Run test again:
```bash
node scripts/test-blast.js --production
```

Expected result: **100% pass rate** (18/18 tests passing)
