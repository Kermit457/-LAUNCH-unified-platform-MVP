#!/bin/bash

# Add BLAST environment variables to Vercel

echo "Adding BLAST environment variables..."

# Array of variable names and values
declare -a vars=(
  "NEXT_PUBLIC_APPWRITE_BLAST_ROOMS_COLLECTION:blast_rooms"
  "NEXT_PUBLIC_APPWRITE_BLAST_APPLICANTS_COLLECTION:blast_applicants"
  "NEXT_PUBLIC_APPWRITE_BLAST_VAULT_COLLECTION:blast_vault"
  "NEXT_PUBLIC_APPWRITE_BLAST_LOCKS_COLLECTION:blast_key_locks"
  "NEXT_PUBLIC_APPWRITE_BLAST_MOTION_SCORES_COLLECTION:blast_motion_scores"
  "NEXT_PUBLIC_APPWRITE_BLAST_MOTION_EVENTS_COLLECTION:blast_motion_events"
  "NEXT_PUBLIC_APPWRITE_BLAST_DM_REQUESTS_COLLECTION:blast_dm_requests"
  "NEXT_PUBLIC_APPWRITE_BLAST_MATCHES_COLLECTION:blast_matches"
  "NEXT_PUBLIC_APPWRITE_BLAST_ANALYTICS_COLLECTION:blast_analytics"
  "NEXT_PUBLIC_APPWRITE_BLAST_NOTIFICATIONS_COLLECTION:blast_notifications"
  "NEXT_PUBLIC_APPWRITE_BLAST_NOTIFICATION_PREFERENCES_COLLECTION:blast_notification_preferences"
)

# Add each variable to production, preview, and development
for var in "${vars[@]}"; do
  IFS=':' read -r key value <<< "$var"
  echo "Adding $key..."

  # Production
  echo "$value" | vercel env add "$key" production

  # Preview
  echo "$value" | vercel env add "$key" preview

  # Development
  echo "$value" | vercel env add "$key" development
done

echo "Done! All BLAST environment variables added."
